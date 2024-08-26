import axios from 'axios';
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
import { useWalletState } from '../ConnectWallet/useWalletState';
import { ChainId } from '../../constants/chains';
import { useOrbiterRouters } from '../contract/orbiter/useOrbiterRouters';
import { useWeb3React } from '@web3-react/core';
import useTonConnectStore from '../ConnectWallet/TonConnect';
import { useOrbiterContractMap } from '../contract/orbiter/useOrbiterContractMap';
import { encodeOrbiterBridge } from '../contract/orbiter/encodeOrbiterBridge';
import { useLayerswapRouters } from '../contract/layerswap/useLayerswapRouters';
import { ExecutionCtx } from '../Submission/types';

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
  slippage?: number;
  /** in seconds */
  roundedRouteCostTime: number;

  /** approve contract address */
  spenderContractAddress?: string;

  /** USD */
  feeUSD: string | null;
  /** in seconds */
  executionDuration: number | null;

  /** one-click */
  step: BridgeStep;

  encodeParams?: any;
  encodeResultData?: {
    data: string;
    to: string;
    value: string;
    from: string;
    chainId: number;
    encodeId?: string;
  };
  sendData?: Parameters<ExecutionCtx['executeCustom']>['0']['handler'];

  productParams: any;
  sourceRoute?: {
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
  minAmt?: string;
  maxAmt?: string;
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
  includedSteps?: Array<{
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
  fromFiatPrice: string;
}
export function useFetchRoutePriceBridge({
  toToken,
  fromToken,
  fromAmount,
  fromFiatPrice,
}: FetchRoutePrice) {
  const { account, provider } = useWalletState();
  const { defaultSlippage, loading: slippageLoading } =
    useDefaultSlippage(true);
  const slippage = useSelector(getSlippage) || defaultSlippage;
  const { apikey } = useSelector(getGlobalProps);
  const web3React = useWeb3React();
  const tonConnect = useTonConnectStore();
  const [status, setStatus] = useState<RoutePriceStatus>(
    RoutePriceStatus.Initial,
  );
  const [bridgeRouteList, setBridgeRouteList] = useState<Array<BridgeRouteI>>(
    [],
  );
  const bridgeRoutePriceAPI = useGetAPIService(APIServiceKey.bridgeRoutePrice);

  const needOrbiterQuery = useMemo(
    () =>
      toToken?.chainId === ChainId.TON &&
      fromToken?.chainId !== toToken?.chainId,
    [fromToken, toToken],
  );
  const needLayerSwap = useMemo(
    () =>
      fromToken?.chainId === ChainId.TON &&
      fromToken?.chainId !== toToken?.chainId,
    [fromToken, toToken],
  );

  const orbiterQuery = useOrbiterRouters({
    skip: !needOrbiterQuery,
  });
  const orbiterContractMapQuery = useOrbiterContractMap({
    skip: !needOrbiterQuery,
  });

  const layerSwapRouter = useLayerswapRouters({
    skip: !needLayerSwap,
    data: {
      toToken,
      fromToken,
      fromAmount,
      evmAccount: web3React.account,
      tonAccount: tonConnect.connected?.account,
      slippage: Number(slippage),
    },
  });

  const refetch = useCallback(async () => {
    const fromChainId = fromToken?.chainId;
    const toChainId = toToken?.chainId;
    if (needOrbiterQuery || needLayerSwap) return;
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
        'orbiter',
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
    needOrbiterQuery,
  ]);

  usePriceTimer({ refetch });

  const [orbiterStatus, orbiterRouter] = useMemo<
    [RoutePriceStatus, BridgeRouteI | null]
  >(() => {
    let fromAddress = web3React.account;
    let toAddress = tonConnect.connected?.account;
    if (fromToken?.chainId === ChainId.TON) {
      fromAddress = tonConnect.connected?.account;
      toAddress = web3React.account;
    }
    if (
      !needOrbiterQuery ||
      !orbiterQuery.data ||
      !fromToken ||
      !toToken ||
      !fromAmount ||
      !fromAddress ||
      !toAddress
    )
      return [RoutePriceStatus.Initial, null];

    if (orbiterQuery.isLoading || orbiterContractMapQuery.isLoading) {
      return [RoutePriceStatus.Loading, null];
    }

    const contractAddress =
      orbiterContractMapQuery.data?.bridgeContractMap?.get(fromToken.chainId);

    if (
      orbiterQuery.error ||
      orbiterContractMapQuery.error ||
      !contractAddress
    ) {
      return [RoutePriceStatus.Failed, null];
    }

    const route = orbiterQuery.data.find(
      (item) =>
        item.fromTokenAddress.toLocaleLowerCase() ===
          fromToken.address.toLocaleLowerCase() &&
        item.toTokenAddress.toLocaleLowerCase() ===
          toToken.address.toLocaleLowerCase(),
    );
    if (!route) return [RoutePriceStatus.Success, null];
    const fromAmountBg = new BigNumber(fromAmount);
    const transferAmount = fromAmountBg.minus(route.withholdingFee || 0);
    const tradeFee = transferAmount.times(route.tradeFee || 0);
    const fee = tradeFee.plus(route.withholdingFee || 0);
    const receive = transferAmount.minus(tradeFee);
    const logoURI =
      'https://storage.googleapis.com/dodo-media-staging/upload_img_679714_20240809095516856.svg';
    const name = route.product.charAt(0).toUpperCase() + route.product.slice(1);

    const encodeResultData = encodeOrbiterBridge({
      route,
      fromAddress,
      toAddress,
      fromAmount: fromAmountBg,
      fromToken,
      contractAddress,
    });

    const spentTime = Number(route.spentTime);
    return [
      RoutePriceStatus.Success,
      {
        ...route,
        fromAddress,
        toAddress,
        fromAmount,
        toTokenAmount: receive,
        fromToken,
        toToken,
        feeUSD: fromFiatPrice ? fee.times(fromFiatPrice).toString() : '-',
        roundedRouteCostTime: spentTime,
        executionDuration: spentTime,
        encodeResultData,
        productParams: null,
        spenderContractAddress: contractAddress,
        step: {
          type: 'cross',
          tool: route.product,
          approvalAddress: contractAddress,
          toolDetails: {
            key: route.product,
            logoURI,
            name,
          },
        },
      } as BridgeRouteI,
    ];
  }, [
    needOrbiterQuery,
    orbiterQuery,
    toToken,
    fromToken,
    fromAmount,
    fromFiatPrice,
    web3React.account,
    tonConnect.connected?.account,
    orbiterContractMapQuery,
  ]);

  const bridgeRouteListRes = useMemo(() => {
    if (!fromAmount) return [];
    if (layerSwapRouter.router) return [layerSwapRouter.router];
    return orbiterRouter ? [orbiterRouter] : bridgeRouteList;
  }, [status, fromAmount, bridgeRouteList, orbiterRouter, layerSwapRouter]);

  const statusRes = useMemo(() => {
    if (needLayerSwap) return layerSwapRouter.status;
    if (needOrbiterQuery) return orbiterStatus;
    return status;
  }, [status, orbiterStatus, needOrbiterQuery, needLayerSwap, layerSwapRouter]);

  const limit = useMemo<null | {
    minAmt?: number;
    maxAmt?: number;
  }>(() => {
    if (layerSwapRouter.limit) {
      return layerSwapRouter.limit;
    }
    if (orbiterRouter?.minAmt || orbiterRouter?.maxAmt)
      return {
        minAmt: orbiterRouter.minAmt ? Number(orbiterRouter.minAmt) : undefined,
        maxAmt: orbiterRouter.maxAmt ? Number(orbiterRouter.maxAmt) : undefined,
      };

    return null;
  }, [status, fromAmount, bridgeRouteList, orbiterRouter, layerSwapRouter]);

  return {
    status: statusRes,
    refetch,
    bridgeRouteList: bridgeRouteListRes,
    limit,
  };
}
