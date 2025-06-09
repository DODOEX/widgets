import {
  Cross_Chain_Swap_Zetachain_RoutesQuery,
  Cross_Chain_Swap_ZetachainrouteParams,
  SwapApi,
} from '@dodoex/api';
import { useQuery } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import { useMemo } from 'react';
import { getFallbackAddress } from '../../constants/address';
import { chainListMap } from '../../constants/chainList';
import { useWalletInfo } from '../ConnectWallet/useWalletInfo';
import { useDefaultSlippage } from '../setting/useDefaultSlippage';
import { TokenInfo } from '../Token';
import { useGlobalState } from '../useGlobalState';
import { useGraphQLRequests } from '../useGraphQLRequests';
import { useTokenState } from '../useTokenState';
import { generateBridgeStep } from './utils';

type Fee = {
  /**
platformFee = zetachain fee
destinationFee = destination chain Fee
btcDepositFee = source chain Fee
11:58
btcDepositFee 只有btc 链为起始链才有
     */
  type: 'platformFee' | 'btcDepositFee' | 'destinationFee' | 'protocolFees';
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
}
export function useFetchRoutePriceBridge({
  fromAccount,
  toAccount,
  fromToken,
  toToken,
  fromAmount,
}: FetchRoutePrice) {
  const graphQLRequests = useGraphQLRequests();
  const { tokenList } = useTokenState();

  const { defaultSlippage, loading: slippageLoading } =
    useDefaultSlippage(true);
  const slippage = useGlobalState((state) => state.slippage || defaultSlippage);

  const fromAmountBN = useMemo(() => {
    if (!fromToken || !fromAmount) {
      return null;
    }

    return new BigNumber(fromAmount)
      .multipliedBy(new BigNumber(10).pow(fromToken.decimals))
      .dp(0, BigNumber.ROUND_DOWN);
  }, [fromAmount, fromToken]);

  const query = graphQLRequests.getQuery<
    Cross_Chain_Swap_Zetachain_RoutesQuery,
    {
      where: Cross_Chain_Swap_ZetachainrouteParams;
    }
  >(SwapApi.graphql.cross_chain_swap_zetachain_routes, {
    /**
     {
      "fromAddress": "0xF859Fb7F8811a5016e9A5380b497957343f40476",
      "fromAmount": "1000000",
      "fromChainId": 11155111,
      "fromTokenAddress": "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
      "slippage": 0.005,
      "toAddress": "0xF859Fb7F8811a5016e9A5380b497957343f40476",
      "toChainId": 421614,
      "toTokenAddress": "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d"
    }
     */
    where: {
      fromChainId: fromToken?.chainId ?? null,
      fromTokenAddress: fromToken?.address ?? null,
      toChainId: toToken?.chainId ?? null,
      toTokenAddress: toToken?.address ?? null,
      fromAddress:
        fromAccount?.appKitAccount?.address ??
        getFallbackAddress(fromToken?.chainId),
      toAddress:
        toAccount?.appKitAccount?.address ??
        getFallbackAddress(toToken?.chainId),
      fromAmount: fromAmountBN ? fromAmountBN.toString() : null,
      slippage: slippage ? Number(slippage) / 100 : null,
    },
  });

  const { data, error, isPending, refetch } = useQuery({
    ...query,
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
      fromToken.chainId !== toToken.chainId,
    // enabled: false,
    // initialData: routesExample.data,
  });

  const { status, bridgeRouteList } = useMemo(() => {
    if (isPending) {
      return {
        status: RoutePriceStatus.Loading,
        bridgeRouteList: [],
      };
    }
    if (error) {
      return {
        status: RoutePriceStatus.Failed,
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
        fees.length > 0 &&
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
  }, [isPending, error, data, tokenList]);

  return {
    status,
    refetch,
    bridgeRouteList,
  };
}
