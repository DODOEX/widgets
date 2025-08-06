import { Cross_Chain_Swap_Zetachain_RoutesQuery } from '@dodoex/api';
import { useQuery } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import { useMemo } from 'react';
import { useUserOptions } from '../../components/UserOptionsProvider';
import { getFallbackAddress } from '../../constants/address';
import { chainListMap } from '../../constants/chainList';
import { useWalletInfo } from '../ConnectWallet/useWalletInfo';
import { TokenInfo } from '../Token';
import { useTokenState } from '../useTokenState';
import { generateBridgeStep } from './utils';

type Fee = {
  /**
platformFee = zetachain fee
destinationFee = destination chain Fee
btcDepositFee = source chain Fee
11:58
btcDepositFee 只有btc 链为起始链才有

// https://www.notion.so/dodotopia/V2-8-solana-USDC-A-Z-swap-246080d974e780439da0cbcca8284a2d?source=copy_link
svmRentFee
     */
  type:
    | 'platformFee'
    | 'btcDepositFee'
    | 'destinationFee'
    | 'protocolFees'
    | 'svmRentFee';
  chainId: number;
  token: string;
  amount: string | number;
  amountWithOutDecimals: string;
  amountUSD: string;
};

export type CrossChainSwapZetachainRoute = {
  routeId: string;
  fromChainId: number;
  fromTokenAddress: string;
  fromAmount: string;
  fromAmountWithOutDecimals: string;
  fromAmountUSD: string;
  toChainId: number;
  toTokenAddress: string;
  toAmount: string;
  toAmountWithOutDecimals: string;
  toAmountUSD: string;
  fromAddress: string;
  toAddress: string;
  slippage: number;
  approveTarget: string | null;
  fees: Array<Fee>;
  omniPlan: Array<{
    hash?: string | undefined;
    type: string;
    inChainType: string;
    inChainId: number;
    inToken: string;
    inAmount: string;
    inAmountWithOutDecimals: number;
    outChainType: string;
    outChainId: number;
    hashChainId: string | undefined;
    outToken: string;
    outAmount: string;
    outAmountWithOutDecimals: number;
    feeChainType: string;
    feeChainId: number;
    feeToken: string;
    feeAmount: string;
    feeRateBps: number;
    btcDepositFee?: number;
    withdrawGasCostZrc20?: string;
    withdrawGas?: string;
    swapSteps?: Array<{
      ammKey: string;
      label: string;
      percent: number;
      inputToken: string;
      inAmount: string;
      outputToken: string;
      outAmount: string;
      feeToken: string;
      feeAmount: string;
      assembleArgs: any;
    }>;
  }>;
  encodeParams: {
    interfaceParams: string;
  };
};

type CrossChainSwapZetachainRoutesResponse = {
  data: {
    cross_chain_swap_zetachain_routes: CrossChainSwapZetachainRoute;
  };
};

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
  fromToken: TokenInfo;
  toToken: TokenInfo;
  fromTokenAmount: BigNumber;
  toTokenAmount: BigNumber;
}

export interface BridgeStepSwapStep {
  ammKey: string;
  label: string;
  percent: number;
  inputToken: TokenInfo;
  inAmount: string;
  outputToken: TokenInfo;
  outAmount: string;
  assembleArgs?: {
    baseToken: string;
    quoteToken: string;
    pairAddress: string;
    pairName: string;
    id: string;
  };
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
    swapSteps?: Array<BridgeStepSwapStep>;
    hash?: string;
    hashChainId?: number;
  }>;
}

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
  spenderContractAddress: string | null;

  /** USD */
  feeUSD: string | null;
  fees: Array<Fee>;
  /** in seconds */
  executionDuration: number | null;

  /** one-click */
  step: BridgeStep;

  encodeParams: CrossChainSwapZetachainRoute['encodeParams'];
  productParams: any;
  sourceRoute: Cross_Chain_Swap_Zetachain_RoutesQuery['cross_chain_swap_zetachain_routes'];
}

export enum RoutePriceStatus {
  Initial = 'Initial',
  Loading = 'Loading',
  Failed = 'Failed',
  Success = 'Success',
}
export interface FetchRoutePrice {
  fromAccount: ReturnType<
    ReturnType<typeof useWalletInfo>['getAppKitAccountByChainId']
  >;
  toAccount: ReturnType<
    ReturnType<typeof useWalletInfo>['getAppKitAccountByChainId']
  >;
  fromToken: TokenInfo | null;
  toToken: TokenInfo | null;
  fromAmount: string;
  enabled: boolean;
  slippage: string | number;
}
export function useFetchRoutePriceBridge({
  fromAccount,
  toAccount,
  fromToken,
  toToken,
  fromAmount,
  enabled,
  slippage,
}: FetchRoutePrice) {
  const { tokenList } = useTokenState();
  const { GRAPHQL_URL } = useUserOptions();

  const fromAmountBN = useMemo(() => {
    if (!fromToken || !fromAmount) {
      return null;
    }

    return new BigNumber(fromAmount)
      .multipliedBy(new BigNumber(10).pow(fromToken.decimals))
      .dp(0, BigNumber.ROUND_DOWN);
  }, [fromAmount, fromToken]);

  const fromAddress =
    fromAccount?.appKitAccount?.address ??
    getFallbackAddress(fromToken?.chainId);
  const toAddress =
    toAccount?.appKitAccount?.address ?? getFallbackAddress(toToken?.chainId);
  const { data, error, isLoading, refetch } = useQuery({
    // ...query,
    retry: false,
    queryKey: [
      'graphql',
      'cross_chain_swap_zetachain_routes',
      fromToken?.chainId,
      fromToken?.address,
      toToken?.chainId,
      toToken?.address,
      fromAddress,
      toAddress,
      fromAmountBN?.toString(),
      slippage,
    ],
    queryFn: async () => {
      const res = await fetch(
        `${GRAPHQL_URL}?opname=Cross_chain_swap_zetachain_routes`,
        {
          headers: {
            'content-type': 'application/json',
            // accept: '*/*',
            // 'accept-language': 'zh,en;q=0.9,zh-CN;q=0.8',
            // priority: 'u=1, i',
            // 'sec-ch-ua':
            //   '"Google Chrome";v="137", "Chromium";v="137", "Not/A)Brand";v="24"',
            // 'sec-ch-ua-mobile': '?0',
            // 'sec-ch-ua-platform': '"macOS"',
            // 'sec-fetch-dest': 'empty',
            // 'sec-fetch-mode': 'cors',
            // 'sec-fetch-site': 'cross-site',
          },
          // referrer: 'http://localhost:6006/',
          // referrerPolicy: 'strict-origin-when-cross-origin',
          body: `{"query":"\\n    query Cross_chain_swap_zetachain_routes($where: Cross_chain_swap_zetachainrouteParams) {\\n  cross_chain_swap_zetachain_routes(where: $where) {\\n    routeId\\n    fromChainId\\n    fromTokenAddress\\n    fromAmount\\n    fromAmountWithOutDecimals\\n    fromAmountUSD\\n    toChainId\\n    toTokenAddress\\n    toAmount\\n    toAmountWithOutDecimals\\n    toAmountUSD\\n    fromAddress\\n    toAddress\\n    slippage\\n    approveTarget\\n    fees\\n    omniPlan\\n    encodeParams\\n  }\\n}\\n    ","variables":{"where":{"fromChainId":${
            fromToken?.chainId
          },"fromTokenAddress":"${fromToken?.address}","toChainId":${
            toToken?.chainId
          },"toTokenAddress":"${toToken?.address}","fromAddress":"${
            fromAddress
          }","toAddress":"${
            toAddress
          }","fromAmount":"${fromAmountBN?.toString()}","slippage":${slippage ? Number(slippage) / 100 : null}}},"operationName":"Cross_chain_swap_zetachain_routes"}`,
          method: 'POST',
          // mode: 'cors',
          // credentials: 'omit',
        },
      );
      /**
       {
    "errors": [
        {
            "message": "NOT_ROUTE_MIN_AMOUNT:min-0.074524",
            "path": [
                "cross_chain_swap_zetachain_routes"
            ],
            "extensions": {
                "code": "INTERNAL_SERVER_ERROR"
            }
        }
    ],
    "data": {
        "cross_chain_swap_zetachain_routes": null
    }
}
       */
      const data = await res.json();
      if (data.errors) {
        throw new Error(data.errors[0].message);
      }
      return data.data;
    },
    // enabled:
    //   !!fromToken &&
    //   !!toToken &&
    //   !!fromAmount &&
    //   fromToken.chainId !== toToken.chainId &&
    //   fromAccount?.appKitAccount?.isConnected &&
    //   toAccount?.appKitAccount?.isConnected &&
    //   !!fromAccount?.appKitAccount?.address &&
    //   !!toAccount?.appKitAccount?.address,
    refetchInterval: 15 * 1000,
    enabled:
      !!fromToken &&
      !!toToken &&
      !!fromAmountBN &&
      fromAmountBN.isFinite() &&
      fromAmountBN.gt(0) &&
      fromToken.chainId !== toToken.chainId &&
      enabled,
    // enabled: false,
    // initialData: routesExample.data,
  });

  const { status, failedReason, bridgeRouteList } = useMemo(() => {
    if (isLoading) {
      return {
        status: RoutePriceStatus.Loading,
        bridgeRouteList: [],
      };
    }
    if (error) {
      console.error('error:', error);
      let failedReason: string | undefined;
      if (error.message.includes('NOT_ROUTE_MIN_AMOUNT:min-')) {
        const minAmount = error.message.split('min-')[1];
        if (minAmount) {
          failedReason = `(Enter min amount: ${minAmount})`;
        }
      }
      return {
        status: RoutePriceStatus.Failed,
        failedReason,
        bridgeRouteList: [],
      };
    }

    if (data && data.cross_chain_swap_zetachain_routes) {
      const newBridgeRouteList: BridgeRouteI[] = [];

      const {
        routeId,
        fromChainId,
        fromTokenAddress,
        fromAmount,
        fromAmountWithOutDecimals,
        fromAmountUSD,
        toChainId,
        toTokenAddress,
        toAmount,
        fromAddress,
        toAddress,
        slippage,
        approveTarget,
        fees,
        omniPlan,
        encodeParams,
      } =
        data.cross_chain_swap_zetachain_routes as CrossChainSwapZetachainRoutesResponse['data']['cross_chain_swap_zetachain_routes'];

      const fromChain = chainListMap.get(fromChainId);

      if (
        routeId &&
        fromChainId &&
        fromTokenAddress &&
        fromAmountWithOutDecimals &&
        toChainId &&
        toTokenAddress &&
        toAmount &&
        fromAddress &&
        toAddress &&
        slippage &&
        (fromChain?.isEVMChain ? approveTarget : true) &&
        fees &&
        omniPlan &&
        omniPlan.length > 0 &&
        encodeParams
      ) {
        const fromToken = tokenList.find(
          (token) =>
            token.address.toLowerCase() === fromTokenAddress.toLowerCase() &&
            token.chainId === fromChainId,
        );
        const toToken = tokenList.find(
          (token) =>
            token.address.toLowerCase() === toTokenAddress.toLowerCase() &&
            token.chainId === toChainId,
        );

        const toAmountBN = new BigNumber(toAmount);
        if (fromToken && toToken && toAmountBN.isFinite() && toAmountBN.gt(0)) {
          const step = generateBridgeStep({
            omniPlan,
            tokenList,
          });
          if (step.includedSteps.length > 0) {
            const feeUSD = fees
              .reduce((acc, fee) => {
                return acc.plus(fee.amountUSD ?? 0);
              }, new BigNumber(0))
              .dp(4, BigNumber.ROUND_DOWN)
              .toString();
            const newBridgeRoute: BridgeRouteI = {
              key: routeId,
              id: routeId,
              fromChainId,
              toChainId,
              fromToken,
              toToken,
              fromAmount: fromAmountWithOutDecimals,
              toTokenAmount: toAmountBN.div(`1e${toToken.decimals}`),
              fromAddress,
              toAddress,
              product: 'zetachain',
              slippage,
              roundedRouteCostTime: 0,
              spenderContractAddress: approveTarget ?? null,
              feeUSD,
              fees,
              executionDuration: null,
              step,
              encodeParams,
              productParams: null,
              sourceRoute: data.cross_chain_swap_zetachain_routes,
            };
            newBridgeRouteList.push(newBridgeRoute);
          }
        }
      }

      if (newBridgeRouteList.length > 0) {
        return {
          status: RoutePriceStatus.Success,
          bridgeRouteList: newBridgeRouteList,
        };
      }

      return {
        status: RoutePriceStatus.Failed,
        bridgeRouteList: [],
      };
    }
    return {
      status: RoutePriceStatus.Initial,
      bridgeRouteList: [],
    };
  }, [isLoading, error, data, tokenList]);

  return {
    status,
    failedReason,
    refetch,
    bridgeRouteList,
  };
}
