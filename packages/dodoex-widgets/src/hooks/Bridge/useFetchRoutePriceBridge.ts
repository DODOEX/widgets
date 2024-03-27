import axios from 'axios';
import { useWeb3React } from '@web3-react/core';
import { parseFixed } from '@ethersproject/bignumber';
import { useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { getGlobalProps } from '../../store/selectors/globals';
import { getSlippage } from '../../store/selectors/settings';
import { EmptyAddress } from '../../constants/address';
import { usePriceTimer } from '../Swap/usePriceTimer';
import { TokenInfo } from '../Token';
import BigNumber from 'bignumber.js';
import { useDefaultSlippage } from '../setting/useDefaultSlippage';
import { useGetAPIService } from '../setting/useGetAPIService';
import { APIServiceKey } from '../../constants/api';

export interface BridgeRouteI {
  /** update */
  key: string;
  /** only one */
  id: string;
  fromToken: TokenInfo;
  toToken: TokenInfo;
  fromChainId: number;
  toChainId: number;
  /** from parameter  */
  fromAmount: string;
  toTokenAmount: BigNumber;
  /** from parameter  */
  fromAddress: string;
  toAddress: string;
  /** from parameter  */
  product: string | null;
  slippage: number;
  /** in seconds */
  roundedRouteCostTime: number;

  /** approve contract address */
  spenderContractAddress: string;

  /** USD */
  feeUSD: string | null;
  /** in seconds */
  executionDuration: number | null;

  /** one-click */
  step: BridgeStep;

  encodeParams: any;
  productParams: any;
  sourceRoute: {
    toAmount: string;
    feeUSD: string | null;
    executionDuration: number | null;
    step: {
      tool: string;
      toolDetails: {
        logoURI: string | null;
        name: string | null;
        key: string | null;
      };
      type: string | null;
      approvalAddress: string;
      includedSteps: any;
    };
    fee: any;
  };
}

interface FetchRouteData {
  routes: Array<{
    toAmount: string;
    feeUSD: string;
    executionDuration: number;
    product: string;
    fee: any;
    step: {
      type: string;
      tool: string;
      approvalAddress: string;
      includedSteps: any;
      toolDetails: {
        key: string;
        logoURI: string;
        name: string;
      };
    };
    encodeParams: any;
    productParams?: any;
  }>;
}

export interface BridgeTokenI {
  id: number;
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  logoUrl: string;
  chainId: number;
  stableCurrencyToken: boolean;
  mainCurrencyToken: boolean;
}

export interface BridgeStepTool {
  name: string;
  logoURI: string;
}

export interface BridgeStepEstimate {
  fromToken: Pick<BridgeTokenI, 'address' | 'symbol' | 'chainId' | 'decimals'>;
  toToken: Pick<BridgeTokenI, 'address' | 'symbol' | 'chainId' | 'decimals'>;
  fromTokenAmount: BigNumber;
  toTokenAmount: BigNumber;
}

export interface BridgeStep {
  tool: string;
  toolDetails: BridgeStepTool;
  type: string | null;
  // transactionRequest: BridgeTXRequest;
  includedSteps: Array<{
    id: string;
    /**
     *  bridge or swap
     */
    tool: string;
    toolDetails: BridgeStepTool;
    type: string;
    estimate: BridgeStepEstimate;
  }>;
}

export enum RoutePriceStatus {
  Initial = 'Initial',
  Loading = 'Loading',
  Failed = 'Failed',
  Success = 'Success',
}
export interface FetchRoutePrice {
  fromToken: TokenInfo | null;
  toToken: TokenInfo | null;
  fromAmount: string;
}
export function useFetchRoutePriceBridge({
  toToken,
  fromToken,
  fromAmount,
}: FetchRoutePrice) {
  const { account, provider } = useWeb3React();
  const { defaultSlippage, loading: slippageLoading } =
    useDefaultSlippage(true);
  const slippage = useSelector(getSlippage) || defaultSlippage;
  const { apikey } = useSelector(getGlobalProps);
  const [status, setStatus] = useState<RoutePriceStatus>(
    RoutePriceStatus.Initial,
  );
  const [bridgeRouteList, setBridgeRouteList] = useState<Array<BridgeRouteI>>(
    [],
  );
  const bridgeRoutePriceAPI = useGetAPIService(APIServiceKey.bridgeRoutePrice);

  const refetch = useCallback(async () => {
    const fromChainId = fromToken?.chainId;
    const toChainId = toToken?.chainId;
    if (
      !fromChainId ||
      !toChainId ||
      fromChainId === toChainId ||
      !fromToken ||
      !toToken ||
      !fromAmount
    ) {
      setStatus(RoutePriceStatus.Initial);
      return;
    }
    setStatus(RoutePriceStatus.Loading);
    if (slippageLoading) return;

    const fromTokenAddress = fromToken.address;
    const toTokenAddress = toToken.address;
    const fromAddress = account || EmptyAddress;
    const toAddress = account || EmptyAddress;
    const slippageNum = Number(slippage) / 100;

    const data: any = {
      fromAddress,
      fromAmount: parseFixed(
        String(fromAmount || 1),
        fromToken.decimals,
      ).toString(),
      fromChainId,
      fromTokenAddress,
      toAddress,
      toChainId,
      toTokenAddress,
      options: {
        slippage: slippageNum,
      },
      products: [
        'lifi',
        'hyphen',
        'nabox',
        'bungee',
        'swft',
        'stargate',
        'connext',
        'squid',
        'across',
        'layerswap',
        'okx',
        'symbiosis',
        'scroll',
        'manta',
        // Sync with src/components/Bridge/SelectBridgeDialog/productList.ts
      ],
    };

    try {
      const startTime = Date.now();
      const resRoutePrice = await axios.post(
        `${bridgeRoutePriceAPI}${apikey ? `?apikey=${apikey}` : ''}`,
        { data },
      );
      const routeInfo = resRoutePrice.data.data as FetchRouteData;
      const newBridgeRouteList: BridgeRouteI[] = [];
      if (routeInfo?.routes?.length) {
        routeInfo.routes.forEach((route, index: number) => {
          if (route) {
            const {
              toAmount,
              feeUSD,
              executionDuration,
              product,
              step,
              fee,
              encodeParams,
              productParams,
            } = route;
            if (step && toAmount !== null) {
              const toTokenAmount = new BigNumber(toAmount);
              if (!toTokenAmount.isNaN() && toTokenAmount.gt(0)) {
                const {
                  tool,
                  toolDetails,
                  type,
                  includedSteps,
                  approvalAddress,
                } = step;

                if (
                  includedSteps &&
                  includedSteps.length > 0 &&
                  tool &&
                  toolDetails &&
                  toolDetails.name &&
                  toolDetails.logoURI &&
                  type &&
                  approvalAddress
                ) {
                  const newIncludedSteps: BridgeStep['includedSteps'] = [];
                  includedSteps.forEach((i: any) => {
                    if (
                      i &&
                      i.id &&
                      i.type &&
                      i.tool &&
                      i.toolDetails &&
                      i.toolDetails.name &&
                      i.toolDetails.logoURI &&
                      i.estimate &&
                      i.estimate.fromAmount &&
                      i.estimate.fromToken &&
                      i.estimate.fromToken.decimals &&
                      i.estimate.toAmount &&
                      i.estimate.toToken &&
                      i.estimate.toToken.decimals
                    ) {
                      newIncludedSteps.push({
                        id: i.id,
                        tool: i.tool,
                        toolDetails: {
                          name: i.toolDetails.name,
                          logoURI: i.toolDetails.logoURI,
                        },
                        type: i.type,
                        estimate: {
                          fromToken: i.estimate
                            .fromToken as BridgeStepEstimate['fromToken'],
                          toToken: i.estimate
                            .toToken as BridgeStepEstimate['toToken'],
                          fromTokenAmount: new BigNumber(
                            i.estimate.fromAmount,
                          ).div(`1e${i.estimate.fromToken.decimals}`),
                          toTokenAmount: new BigNumber(i.estimate.toAmount).div(
                            `1e${i.estimate.toToken.decimals}`,
                          ),
                        },
                      });
                    }
                  });
                  if (newIncludedSteps.length > 0) {
                    const newBridgeRoute: BridgeRouteI = {
                      key: `${product}-${toAmount}-${feeUSD}-${index}`,
                      id: product,
                      fromChainId,
                      toChainId,
                      fromToken,
                      toToken,
                      fromAmount,
                      toTokenAmount: toTokenAmount.div(`1e${toToken.decimals}`),
                      fromAddress,
                      toAddress,
                      product,
                      slippage: slippageNum,
                      roundedRouteCostTime: (Date.now() - startTime) / 1000,
                      spenderContractAddress: approvalAddress ?? '0x',
                      feeUSD,
                      executionDuration,
                      step: {
                        tool,
                        toolDetails: {
                          name: toolDetails.name,
                          logoURI: toolDetails.logoURI,
                        },
                        type,
                        includedSteps: newIncludedSteps,
                      },
                      encodeParams,
                      productParams,
                      sourceRoute: {
                        toAmount,
                        feeUSD,
                        executionDuration,
                        step: {
                          tool,
                          toolDetails,
                          type,
                          approvalAddress,
                          includedSteps,
                        },
                        fee,
                      },
                    };
                    newBridgeRouteList.push(newBridgeRoute);
                  }
                }
              }
            }
          }
        });
      }
      setBridgeRouteList(newBridgeRouteList);
      if (newBridgeRouteList.length) {
        setStatus(RoutePriceStatus.Success);
      } else {
        setStatus(RoutePriceStatus.Failed);
      }

      if (!account || !provider) return;
    } catch (error) {
      setStatus(RoutePriceStatus.Failed);
      console.error(error);
    }
  }, [
    account,
    toToken,
    slippage,
    fromToken,
    provider,
    fromAmount,
    apikey,
    bridgeRoutePriceAPI,
    slippageLoading,
  ]);

  usePriceTimer({ refetch });

  const bridgeRouteListRes = useMemo(() => {
    return fromAmount ? bridgeRouteList : [];
  }, [status, fromAmount, bridgeRouteList]);

  return {
    status,
    refetch,
    bridgeRouteList: bridgeRouteListRes,
  };
}
