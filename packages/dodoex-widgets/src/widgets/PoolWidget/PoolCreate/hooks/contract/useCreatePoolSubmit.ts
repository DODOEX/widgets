import { basicTokenMap, ChainId, PoolApi } from '@dodoex/api';
import { parseFixed } from '@ethersproject/bignumber';
import BigNumber from 'bignumber.js';
import { useWalletInfo } from '../../../../../hooks/ConnectWallet/useWalletInfo';
import { TokenInfo } from '../../../../../hooks/Token';
import { getEthersValue } from '../../../../../utils/bytes';
import { SubPeggedVersionE, Version as PoolVersionE } from '../../types';

export const useCreatePoolSubmit = ({
  selectedVersion,
  selectedSubPeggedVersion,
  baseToken,
  quoteToken,
  baseAmount,
  quoteAmount,
  feeRate,
  initPrice,
  slippageCoefficient,
}: {
  selectedVersion: PoolVersionE;
  selectedSubPeggedVersion?: SubPeggedVersionE;
  baseToken: TokenInfo | null;
  quoteToken: TokenInfo | null;
  baseAmount: string;
  quoteAmount: string;
  feeRate: string;
  initPrice: string;
  slippageCoefficient: string;
}) => {
  const { chainId, account } = useWalletInfo();

  const EtherToken = basicTokenMap[chainId as ChainId];

  const getCreateParams = async () => {
    if (!account || !baseToken || !quoteToken) {
      return null;
    }
    let errorMsg = '';
    const baseDecimals = Number(baseToken.decimals);
    const quoteDecimals = Number(quoteToken.decimals);
    const feeRateNumber = new BigNumber(feeRate);

    const isPrivate = selectedVersion === PoolVersionE.marketMakerPool;
    const isStandard = selectedVersion === PoolVersionE.standard;
    const isDsp = selectedVersion === PoolVersionE.pegged;
    const isGSP =
      selectedVersion === PoolVersionE.pegged &&
      selectedSubPeggedVersion === SubPeggedVersionE.GSP;
    const baseTokenParam = {
      decimals: baseDecimals,
      address: baseToken.address,
    };
    const quoteTokenParam = {
      decimals: quoteDecimals,
      address: quoteToken.address,
    };
    const baseInAmount = parseFixed(baseAmount, baseDecimals).toString();
    const quoteInAmount = parseFixed(
      quoteAmount || '0',
      quoteDecimals,
    ).toString();
    // lpFeeRate is the lp fee rate
    //The actual handling fee is 80% of the input value
    const lpFeeRate = isPrivate
      ? feeRateNumber.times(100).toNumber()
      : feeRateNumber.times(80).toNumber();
    // i = min price
    const i =
      isPrivate && isStandard
        ? new BigNumber(quoteAmount)
            .div(baseAmount)
            .dp(quoteDecimals, BigNumber.ROUND_DOWN)
            .toString()
        : new BigNumber(initPrice).toString();
    // k is the volatility
    const k = Number(slippageCoefficient || (isDsp ? '0.1' : '1'));
    // Transaction Deadline
    const deadLine = Math.ceil(Date.now() / 1000) + 60 * 60;

    let result: any;
    const createPrams: Parameters<typeof PoolApi.encode.createDVMPoolABI> = [
      chainId,
      baseTokenParam,
      quoteTokenParam,
      baseInAmount,
      quoteInAmount,
      lpFeeRate,
      // i = min price
      i,
      k,
      deadLine,
    ];

    // console.log('2.0 CreatePool createPrams', createPrams);
    try {
      if (
        selectedVersion === PoolVersionE.standard ||
        selectedVersion === PoolVersionE.singleToken
      ) {
        result = await PoolApi.encode.createDVMPoolABI(...createPrams);
      } else if (isPrivate) {
        result = await PoolApi.encode.createDPPPoolABI(...createPrams);
      } else if (isDsp) {
        result = await PoolApi.encode.createDSPPoolABI(...createPrams);
      } else if (isGSP) {
        result = await PoolApi.encode.createGSPPoolABI(
          chainId,
          account,
          baseTokenParam,
          quoteTokenParam,
          baseInAmount,
          quoteInAmount,
          lpFeeRate,
          i,
          k,
          deadLine,
        );
      }
    } catch (error) {
      console.error('2.0 CreatePool createPrams error', createPrams, error);
      errorMsg = `2.0 CreatePool createPrams error; ERROR: ${error}`;
      throw new Error(errorMsg);
    }

    if (result && result.data) {
      try {
        if (baseAmount && baseToken.symbol === EtherToken.symbol) {
          result.value = getEthersValue(baseAmount);
        } else if (quoteAmount && quoteToken.symbol === EtherToken.symbol) {
          result.value = getEthersValue(quoteAmount);
        } else {
          result.value = 0;
        }

        return result;
      } catch (error) {
        console.error('2.0 sendTransaction error', error);
        errorMsg = `2.0 sendTransaction error; ERROR: ${error}`;
        throw new Error(errorMsg);
      }
    } else {
      errorMsg = 'invalid data';
      throw new Error(errorMsg);
    }
  };

  return {
    getCreateParams,
  };
};
