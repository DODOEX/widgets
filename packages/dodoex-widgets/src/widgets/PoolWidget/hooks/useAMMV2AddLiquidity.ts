import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  ApiV3PoolInfoStandardItemCpmm,
  CpmmKeys,
  CREATE_CPMM_POOL_FEE_ACC,
  CREATE_CPMM_POOL_PROGRAM,
  Percent,
  TxVersion,
} from '@raydium-io/raydium-sdk-v2';
import { useConnection } from '@solana/wallet-adapter-react';
import { useMutation } from '@tanstack/react-query';
import BN from 'bn.js';
import Decimal from 'decimal.js-light';
import { useWalletInfo } from '../../../hooks/ConnectWallet/useWalletInfo';
import { CREATE_CPMM_CONFIG } from '../../../hooks/raydium-sdk-V2/common/programId';
import { initSdk, txVersion } from '../../../hooks/raydium-sdk-V2/config';
import { useSolanaWallet } from '../../../hooks/solana/useSolanaWallet';
import { useSubmission } from '../../../hooks/Submission';
import { MetadataFlag } from '../../../hooks/Submission/types';
import { TokenInfo } from '../../../hooks/Token';

export function useAMMV2AddLiquidity({
  baseToken,
  quoteToken,
  pairMintAAmount,
  pairMintBAmount,
  slippage,
  isExists,
  poolInfo,
  poolKeys,
  successBack,
  submittedBack,
}: {
  baseToken: TokenInfo | undefined;
  quoteToken: TokenInfo | undefined;
  pairMintAAmount: string | undefined;
  pairMintBAmount: string | undefined;
  slippage: number;
  isExists?: boolean;
  poolInfo?: ApiV3PoolInfoStandardItemCpmm;
  poolKeys?: CpmmKeys;
  successBack?: () => void;
  submittedBack?: () => void;
}) {
  const submission = useSubmission();
  const { connection } = useConnection();
  const wallet = useSolanaWallet();
  const { account } = useWalletInfo();

  useLingui();

  return useMutation({
    mutationFn: async () => {
      if (!baseToken || !quoteToken) {
        throw new Error('token is undefined');
      }
      if (!account) {
        throw new Error('account is undefined');
      }

      if (!poolInfo || !pairMintAAmount || !pairMintBAmount) {
        throw new Error('poolInfo is undefined');
      }

      const raydium = await initSdk({
        connection,
        wallet,
      });

      const mintAAmount = new BN(
        new Decimal(pairMintAAmount)
          .mul(10 ** poolInfo.mintA.decimals)
          .toFixed(0, Decimal.ROUND_DOWN),
      );

      const slippagePercent = new Percent(slippage * 100 * 100, 100 * 100);
      const { execute } = isExists
        ? await raydium.cpmm.addLiquidity({
            poolInfo,
            poolKeys,
            inputAmount: mintAAmount,
            // slippage: new Percent(1, 100), // 1%
            slippage: slippagePercent,
            baseIn: true,
            txVersion: TxVersion.LEGACY,
            // optional: set up priority fee here
            // computeBudgetConfig: {
            //   units: 600000,
            //   microLamports: 46591500,
            // },
          })
        : await raydium.cpmm.createPool({
            // poolId: // your custom publicKey, default sdk will automatically calculate pda pool id
            programId: CREATE_CPMM_POOL_PROGRAM, // devnet: DEVNET_PROGRAM_ID.CREATE_CPMM_POOL_PROGRAM
            poolFeeAccount: CREATE_CPMM_POOL_FEE_ACC, // devnet:  DEVNET_PROGRAM_ID.CREATE_CPMM_POOL_FEE_ACC
            mintA: poolInfo.mintA,
            mintB: poolInfo.mintB,
            mintAAmount,
            mintBAmount: new BN(
              new Decimal(pairMintBAmount)
                .mul(10 ** poolInfo.mintB.decimals)
                .toFixed(0, Decimal.ROUND_DOWN),
            ),
            startTime: new BN(0),
            feeConfig: CREATE_CPMM_CONFIG[0],
            associatedOnly: false,
            ownerInfo: {
              useSOLBalance: true,
            },
            txVersion,
            // optional: set up priority fee here
            // computeBudgetConfig: {
            //   units: 600000,
            //   microLamports: 46591500,
            // },
          });

      const txResult = await submission.executeCustom({
        brief: isExists ? t`Add liquidity` : t`Create AMM V2 Position`,
        metadata: {
          [isExists
            ? MetadataFlag.addLiquidityAMMV2Position
            : MetadataFlag.createAMMV2Position]: true,
        },
        handler: async (params) => {
          const { txId } = await execute({ sendAndConfirm: true });
          params.onSuccess(txId);
        },
        successBack,
        submittedBack,
      });

      return txResult;
    },
    onError: (error) => {
      console.error(error);
    },
  });
}
