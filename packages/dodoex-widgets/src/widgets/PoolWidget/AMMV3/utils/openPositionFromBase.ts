import {
  ApiV3PoolInfoConcentratedItem,
  Clmm,
  ClmmInstrument,
  ClmmKeys,
  CreateConcentratedPool,
  findProgramAddress,
  mockV3CreatePoolInfo,
  OpenPositionFromBase,
  OpenPositionFromBaseExtInfo,
  SqrtPriceMath,
  TxBuilder,
  TxVersion,
  WSOLMint,
} from '@raydium-io/raydium-sdk-v2';
import { TOKEN_2022_PROGRAM_ID } from '@solana/spl-token';
import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';
import Decimal from 'decimal.js';

export const SUPPORT_MINT_SEED = Buffer.from('support_mint', 'utf8');
export function getPdaMintExAccount(
  programId: PublicKey,
  mintAddress: PublicKey,
): {
  publicKey: PublicKey;
  nonce: number;
} {
  return findProgramAddress(
    [SUPPORT_MINT_SEED, mintAddress.toBuffer()],
    programId,
  );
}

export async function createPool<T extends TxVersion>(
  props: CreateConcentratedPool<T> & {
    clmm: Clmm;
    txBuilder: TxBuilder;
  },
) {
  const {
    programId,
    mint1,
    mint2,
    ammConfig,
    initialPrice,
    computeBudgetConfig,
    forerunCreate,
    getObserveState,
    txVersion,
    txTipConfig,
    feePayer,
    clmm,
    txBuilder,
  } = props;
  const owner = clmm.scope.owner?.publicKey || PublicKey.default;

  const [mintA, mintB, initPrice] = new BN(
    new PublicKey(mint1.address).toBuffer(),
  ).gt(new BN(new PublicKey(mint2.address).toBuffer()))
    ? [mint2, mint1, new Decimal(1).div(initialPrice)]
    : [mint1, mint2, initialPrice];

  const initialPriceX64 = SqrtPriceMath.priceToSqrtPriceX64(
    initPrice,
    mintA.decimals,
    mintB.decimals,
  );

  const extendMintAccount: PublicKey[] = [];
  const fetchAccounts: PublicKey[] = [];
  if (mintA.programId === TOKEN_2022_PROGRAM_ID.toBase58())
    fetchAccounts.push(
      getPdaMintExAccount(programId, new PublicKey(mintA.address)).publicKey,
    );
  if (mintB.programId === TOKEN_2022_PROGRAM_ID.toBase58())
    fetchAccounts.push(
      getPdaMintExAccount(programId, new PublicKey(mintB.address)).publicKey,
    );
  const extMintRes =
    await clmm.scope.connection.getMultipleAccountsInfo(fetchAccounts);

  extMintRes.forEach((r, idx) => {
    if (r) extendMintAccount.push(fetchAccounts[idx]);
  });

  const insInfo = await ClmmInstrument.createPoolInstructions({
    connection: clmm.scope.connection,
    programId,
    owner,
    mintA,
    mintB,
    ammConfigId: ammConfig.id,
    initialPriceX64,
    forerunCreate: !getObserveState && forerunCreate,
    extendMintAccount,
  });

  txBuilder.addInstruction(insInfo);

  const extInfo: {
    mockPoolInfo: ApiV3PoolInfoConcentratedItem;
    address: ClmmKeys;
    forerunCreate?: boolean;
  } = {
    address: {
      ...insInfo.address,
      observationId: insInfo.address.observationId.toBase58(),
      exBitmapAccount: insInfo.address.exBitmapAccount.toBase58(),
      programId: programId.toString(),
      id: insInfo.address.poolId.toString(),
      mintA,
      mintB,
      openTime: '0',
      vault: {
        A: insInfo.address.mintAVault.toString(),
        B: insInfo.address.mintBVault.toString(),
      },
      rewardInfos: [],
      config: {
        id: ammConfig.id.toString(),
        index: ammConfig.index,
        protocolFeeRate: ammConfig.protocolFeeRate,
        tradeFeeRate: ammConfig.tradeFeeRate,
        tickSpacing: ammConfig.tickSpacing,
        fundFeeRate: ammConfig.fundFeeRate,
        description: ammConfig.description,
        defaultRange: 0,
        defaultRangePoint: [],
      },
    },
    mockPoolInfo: {
      type: 'Concentrated',
      rewardDefaultPoolInfos: 'Clmm',
      id: insInfo.address.poolId.toString(),
      mintA,
      mintB,
      feeRate: ammConfig.tradeFeeRate,
      openTime: '0',
      programId: programId.toString(),
      price: initPrice.toNumber(),
      config: {
        id: ammConfig.id.toString(),
        index: ammConfig.index,
        protocolFeeRate: ammConfig.protocolFeeRate,
        tradeFeeRate: ammConfig.tradeFeeRate,
        tickSpacing: ammConfig.tickSpacing,
        fundFeeRate: ammConfig.fundFeeRate,
        description: ammConfig.description,
        defaultRange: 0,
        defaultRangePoint: [],
      },
      burnPercent: 0,
      ...mockV3CreatePoolInfo,
    },
    forerunCreate,
  };
  return extInfo;
}

export async function openPositionFromBase<T extends TxVersion>({
  poolInfo,
  poolKeys: propPoolKeys,
  ownerInfo,
  tickLower,
  tickUpper,
  base,
  baseAmount,
  otherAmountMax,
  nft2022,
  associatedOnly = true,
  checkCreateATAOwner = false,
  withMetadata = 'create',
  getEphemeralSigners,
  computeBudgetConfig,
  txTipConfig,
  txVersion,
  feePayer,
  clmm,
  txBuilder,
}: OpenPositionFromBase<T> & {
  clmm: Clmm;
  txBuilder: TxBuilder;
}) {
  if (clmm.scope.availability.addConcentratedPosition === false)
    clmm.logAndCreateError('add position feature disabled in your region');

  let ownerTokenAccountA: PublicKey | null = null;
  let ownerTokenAccountB: PublicKey | null = null;
  const mintAUseSOLBalance =
    ownerInfo.useSOLBalance && poolInfo.mintA.address === WSOLMint.toString();
  const mintBUseSOLBalance =
    ownerInfo.useSOLBalance && poolInfo.mintB.address === WSOLMint.toString();
  const [amountA, amountB] =
    base === 'MintA'
      ? [baseAmount, otherAmountMax]
      : [otherAmountMax, baseAmount];

  const {
    account: _ownerTokenAccountA,
    instructionParams: _tokenAccountAInstruction,
  } = await clmm.scope.account.getOrCreateTokenAccount({
    tokenProgram: poolInfo.mintA.programId,
    mint: new PublicKey(poolInfo.mintA.address),
    owner: clmm.scope.ownerPubKey,

    createInfo:
      mintAUseSOLBalance || amountA.isZero()
        ? {
            payer: clmm.scope.ownerPubKey,
            amount: amountA,
          }
        : undefined,
    skipCloseAccount: !mintAUseSOLBalance,
    notUseTokenAccount: mintAUseSOLBalance,
    associatedOnly: mintAUseSOLBalance ? false : associatedOnly,
    checkCreateATAOwner,
  });
  if (_ownerTokenAccountA) ownerTokenAccountA = _ownerTokenAccountA;
  txBuilder.addInstruction(_tokenAccountAInstruction || {});

  const {
    account: _ownerTokenAccountB,
    instructionParams: _tokenAccountBInstruction,
  } = await clmm.scope.account.getOrCreateTokenAccount({
    tokenProgram: poolInfo.mintB.programId,
    mint: new PublicKey(poolInfo.mintB.address),
    owner: clmm.scope.ownerPubKey,

    createInfo:
      mintBUseSOLBalance || amountB.isZero()
        ? {
            payer: clmm.scope.ownerPubKey!,
            amount: amountB,
          }
        : undefined,
    skipCloseAccount: !mintBUseSOLBalance,
    notUseTokenAccount: mintBUseSOLBalance,
    associatedOnly: mintBUseSOLBalance ? false : associatedOnly,
    checkCreateATAOwner,
  });
  if (_ownerTokenAccountB) ownerTokenAccountB = _ownerTokenAccountB;
  txBuilder.addInstruction(_tokenAccountBInstruction || {});

  if (!ownerTokenAccountA || !ownerTokenAccountB)
    clmm.logAndCreateError(
      'cannot found target token accounts',
      'tokenAccounts',
      {
        ownerTokenAccountA: ownerTokenAccountA?.toBase58(),
        ownerTokenAccountB: ownerTokenAccountB?.toBase58(),
      },
    );

  const poolKeys = propPoolKeys || (await clmm.getClmmPoolKeys(poolInfo.id));
  const insInfo = await ClmmInstrument.openPositionFromBaseInstructions({
    poolInfo,
    poolKeys,
    ownerInfo: {
      ...ownerInfo,
      feePayer: clmm.scope.ownerPubKey,
      wallet: clmm.scope.ownerPubKey,
      tokenAccountA: ownerTokenAccountA!,
      tokenAccountB: ownerTokenAccountB!,
    },
    tickLower,
    tickUpper,
    base,
    baseAmount,
    otherAmountMax,
    withMetadata,
    getEphemeralSigners,
    nft2022,
  });

  txBuilder.addInstruction(insInfo);

  const extInfo: OpenPositionFromBaseExtInfo = { ...insInfo.address };
  return extInfo;
}
