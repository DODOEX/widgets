import axios from 'axios';
import { useWeb3React } from '@web3-react/core';
import { parseFixed } from '@ethersproject/bignumber';
import { useCallback, useMemo, useState } from 'react';
import { BridgeRoutePriceAPI } from '../../constants/api';
import { useSelector } from 'react-redux';
import { getGlobalProps } from '../../store/selectors/globals';
import { DEFAULT_BRIDGE_SLIPPAGE } from '../../constants/swap';
import { getSlippage } from '../../store/selectors/settings';
import { EmptyAddress } from '../../constants/address';
import { usePriceTimer } from '../Swap/usePriceTimer';
import { TokenInfo } from '../Token';
import BigNumber from 'bignumber.js';

export interface BridgeRouteI {
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
  };
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
  toAmount: string;
}
export function useFetchRoutePriceBridge({
  toToken,
  fromToken,
  fromAmount,
  toAmount,
}: FetchRoutePrice) {
  const { account, provider } = useWeb3React();
  const slippage = useSelector(getSlippage) || DEFAULT_BRIDGE_SLIPPAGE;
  const { apikey } = useSelector(getGlobalProps);
  const [status, setStatus] = useState<RoutePriceStatus>(
    RoutePriceStatus.Initial,
  );
  const [bridgeRouteList, setBridgeRouteList] = useState<Array<BridgeRouteI>>(
    [],
  );

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
    )
      return;
    setStatus(RoutePriceStatus.Loading);

    const fromTokenAddress = fromToken.address;
    const toTokenAddress = toToken.address;
    const fromAddress = account || EmptyAddress;
    const toAddress = account || EmptyAddress;
    const slippageNum = Number(slippage);

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
      // 与 cross_chain_token_list 接口返回的 products 字段保持一致
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
      ],
    };

    try {
      const startTime = Date.now();
      const resRoutePrice = await axios.post(
        `${BridgeRoutePriceAPI}?apikey=${'f056714b87a8ea6432'}`,
        { data },
      );
      const routeInfo = resRoutePrice.data.data;
      const newBridgeRouteList: BridgeRouteI[] = [];
      if (routeInfo?.routes?.length) {
        routeInfo.routes.forEach((route, index) => {
          if (route) {
            const {
              toAmount,
              feeUSD,
              executionDuration,
              product,
              step,
              encodeParams,
              productParams,
            } = route;
            // 只做 one-click 式的，steps.length=1
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
                  includedSteps.forEach((i) => {
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
                      id: `${product}-${toAmount}-${feeUSD}-${index}`,
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
    toAmount,
    apikey,
  ]);

  usePriceTimer({ refetch });

  const bridgeRouteListRes = useMemo(() => {
    return fromAmount ? bridgeRouteList : [];
  }, [status, toAmount, fromAmount, bridgeRouteList]);

  return {
    status,
    refetch,
    bridgeRouteList: bridgeRouteListRes,
  };
}
