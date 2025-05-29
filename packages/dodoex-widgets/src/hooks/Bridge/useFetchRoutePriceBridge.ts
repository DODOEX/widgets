import {
  Cross_Chain_Swap_Zetachain_RoutesQuery,
  Cross_Chain_Swap_ZetachainrouteParams,
  SwapApi,
} from '@dodoex/api';
import { parseFixed } from '@ethersproject/bignumber';
import { useQuery } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import { useMemo } from 'react';
import { EmptyAddress } from '../../constants/address';
import { useWalletInfo } from '../ConnectWallet/useWalletInfo';
import { useDefaultSlippage } from '../setting/useDefaultSlippage';
import { TokenInfo } from '../Token';
import { useGlobalState } from '../useGlobalState';
import { useGraphQLRequests } from '../useGraphQLRequests';
import { useTokenState } from '../useTokenState';
import { generateBridgeStep } from './utils';

export const routesExample = {
  data: {
    cross_chain_swap_zetachain_routes: {
      routeId: '87086529-d740-4847-bcb1-405dc998f936',
      fromChainId: 11155111,
      fromTokenAddress: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
      fromAmount: '44409254',
      fromAmountWithOutDecimals: '44.409254',
      fromAmountUSD: '114747.295040',
      toChainId: 421614,
      toTokenAddress: '0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d',
      toAmount: '3233223',
      toAmountWithOutDecimals: '3.233223',
      toAmountUSD: '8354.195581',
      fromAddress: '0xf859fb7f8811a5016e9a5380b497957343f40476',
      toAddress: '0xf859fb7f8811a5016e9a5380b497957343f40476',
      slippage: 0.005,
      approveTarget: '0x2405965a3CB8748D7065752AdC702Bb907AA2297',
      fees: [
        {
          type: 'zetachain',
          chainId: 7001,
          token: '0xcC683A782f4B30c138787CB5576a86AF66fdc31d',
          amount: '444092',
          AmountWithOutDecimals: '0.444092',
          amountUSD: '1147.471555',
        },
      ],
      omniPlan: [
        {
          hash: '0x123',
          type: 'Bridge',
          inChainType: 'evm',
          inChainId: 11155111,
          inToken: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
          inAmount: '44409254',
          inAmountWithOutDecimals: 44.409254,
          outChainType: 'zetachain',
          outChainId: 7001,
          outToken: '0xcC683A782f4B30c138787CB5576a86AF66fdc31d',
          outAmount: '43965162',
          outAmountWithOutDecimals: 43.965162,
          feeChainType: 'zetachain',
          feeChainId: 7001,
          feeToken: '0xcC683A782f4B30c138787CB5576a86AF66fdc31d',
          feeAmount: '444092',
          feeRateBps: 100,
        },
        {
          hash: '0x123',
          type: 'Swap',
          inChainType: 'zetachain',
          inChainId: 7001,
          inToken: '0xcC683A782f4B30c138787CB5576a86AF66fdc31d',
          inAmount: '43965162',
          inAmountWithOutDecimals: 43.965162,
          outChainType: 'zetachain',
          outChainId: 7001,
          outToken: '0x4bC32034caCcc9B7e02536945eDbC286bACbA073',
          outAmount: '3234362',
          outAmountWithOutDecimals: 3.234362,
          feeChainType: '',
          feeChainId: 0,
          feeToken: '',
          feeAmount: '0',
          feeRateBps: 0,
          swapSteps: [
            {
              ammKey: '0x4f59b88556c1B133939b2655729Ad53226ed5FAD',
              label: 'DODOV2',
              percent: 100,
              inputToken: '0xcC683A782f4B30c138787CB5576a86AF66fdc31d',
              inAmount: '43965162',
              outputToken: '0x4bC32034caCcc9B7e02536945eDbC286bACbA073',
              outAmount: '3234362',
              feeToken: '',
              feeAmount: '0',
              assembleArgs: {
                baseToken: '0x4bc32034caccc9b7e02536945edbc286bacba073',
                quoteToken: '0xcc683a782f4b30c138787cb5576a86af66fdc31d',
                pairAddress: '0x4f59b88556c1b133939b2655729ad53226ed5fad',
                pairName: 'DODOV2',
                pmmState: {
                  i: '1000000000000000000',
                  k: '5000000000000000',
                  b: '3237427',
                  q: '6767185',
                  b0: '4999814',
                  q0: '5000000',
                  r: 1,
                },
                lpFeeRate: '0',
                mtFeeRate: '0',
                updatedAt: '1747988104',
              },
            },
          ],
        },
        {
          hash: '0x123',
          type: 'Bridge',
          inChainType: 'zetachain',
          inChainId: 7001,
          inToken: '0x4bC32034caCcc9B7e02536945eDbC286bACbA073',
          inAmount: '3234362',
          inAmountWithOutDecimals: 3.234362,
          outChainType: 'evm',
          outChainId: 421614,
          outToken: '0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d',
          outAmount: '3233223',
          outAmountWithOutDecimals: 3.233223,
          feeChainType: '',
          feeChainId: 0,
          feeToken: '',
          feeAmount: '0',
          feeRateBps: 0,
          withdrawGasCostZrc20: '0x4bC32034caCcc9B7e02536945eDbC286bACbA073',
          withdrawGas: '1139',
        },
      ],
      encodeParams: {
        interfaceParams:
          'eyJyb3V0ZUlkIjoiODcwODY1MjktZDc0MC00ODQ3LWJjYjEtNDA1ZGM5OThmOTM2IiwiZnJvbUNoYWluSWQiOjExMTU1MTExLCJmcm9tVG9rZW5BZGRyZXNzIjoiMHgxYzdENEIxOTZDYjBDN0IwMWQ3NDNGYmM2MTE2YTkwMjM3OUM3MjM4IiwidG9DaGFpbklkIjo0MjE2MTQsInRvVG9rZW5BZGRyZXNzIjoiMHg3NWZhZjExNGVhZmIxQkRiZTJGMDMxNkRGODkzZmQ1OENFNDZBQTRkIiwiZnJvbUFkZHJlc3MiOiIweGY4NTlmYjdmODgxMWE1MDE2ZTlhNTM4MGI0OTc5NTczNDNmNDA0NzYiLCJmcm9tQW1vdW50IjoiNDQ0MDkyNTQiLCJ0b0FkZHJlc3MiOiIweGY4NTlmYjdmODgxMWE1MDE2ZTlhNTM4MGI0OTc5NTczNDNmNDA0NzYiLCJzbGlwcGFnZSI6MC4wMDUsIm9tbmlQbGFuIjpbeyJ0eXBlIjoiQnJpZGdlIiwiaW5DaGFpblR5cGUiOiJldm0iLCJpbkNoYWluSWQiOjExMTU1MTExLCJpblRva2VuIjoiMHgxYzdENEIxOTZDYjBDN0IwMWQ3NDNGYmM2MTE2YTkwMjM3OUM3MjM4IiwiaW5BbW91bnQiOiI0NDQwOTI1NCIsImluQW1vdW50V2l0aE91dERlY2ltYWxzIjo0NC40MDkyNTQsIm91dENoYWluVHlwZSI6InpldGFjaGFpbiIsIm91dENoYWluSWQiOjcwMDEsIm91dFRva2VuIjoiMHhjQzY4M0E3ODJmNEIzMGMxMzg3ODdDQjU1NzZhODZBRjY2ZmRjMzFkIiwib3V0QW1vdW50IjoiNDM5NjUxNjIiLCJvdXRBbW91bnRXaXRoT3V0RGVjaW1hbHMiOjQzLjk2NTE2MiwiZmVlQ2hhaW5UeXBlIjoiemV0YWNoYWluIiwiZmVlQ2hhaW5JZCI6NzAwMSwiZmVlVG9rZW4iOiIweGNDNjgzQTc4MmY0QjMwYzEzODc4N0NCNTU3NmE4NkFGNjZmZGMzMWQiLCJmZWVBbW91bnQiOiI0NDQwOTIiLCJmZWVSYXRlQnBzIjoxMDB9LHsidHlwZSI6IlN3YXAiLCJpbkNoYWluVHlwZSI6InpldGFjaGFpbiIsImluQ2hhaW5JZCI6NzAwMSwiaW5Ub2tlbiI6IjB4Y0M2ODNBNzgyZjRCMzBjMTM4Nzg3Q0I1NTc2YTg2QUY2NmZkYzMxZCIsImluQW1vdW50IjoiNDM5NjUxNjIiLCJpbkFtb3VudFdpdGhPdXREZWNpbWFscyI6NDMuOTY1MTYyLCJvdXRDaGFpblR5cGUiOiJ6ZXRhY2hhaW4iLCJvdXRDaGFpbklkIjo3MDAxLCJvdXRUb2tlbiI6IjB4NGJDMzIwMzRjYUNjYzlCN2UwMjUzNjk0NWVEYkMyODZiQUNiQTA3MyIsIm91dEFtb3VudCI6IjMyMzQzNjIiLCJvdXRBbW91bnRXaXRoT3V0RGVjaW1hbHMiOjMuMjM0MzYyLCJmZWVDaGFpblR5cGUiOiIiLCJmZWVDaGFpbklkIjowLCJmZWVUb2tlbiI6IiIsImZlZUFtb3VudCI6IjAiLCJmZWVSYXRlQnBzIjowLCJzd2FwU3RlcHMiOlt7ImFtbUtleSI6IjB4NGY1OWI4ODU1NmMxQjEzMzkzOWIyNjU1NzI5QWQ1MzIyNmVkNUZBRCIsImxhYmVsIjoiRE9ET1YyIiwicGVyY2VudCI6MTAwLCJpbnB1dFRva2VuIjoiMHhjQzY4M0E3ODJmNEIzMGMxMzg3ODdDQjU1NzZhODZBRjY2ZmRjMzFkIiwiaW5BbW91bnQiOiI0Mzk2NTE2MiIsIm91dHB1dFRva2VuIjoiMHg0YkMzMjAzNGNhQ2NjOUI3ZTAyNTM2OTQ1ZURiQzI4NmJBQ2JBMDczIiwib3V0QW1vdW50IjoiMzIzNDM2MiIsImZlZVRva2VuIjoiIiwiZmVlQW1vdW50IjoiMCIsImFzc2VtYmxlQXJncyI6eyJiYXNlVG9rZW4iOiIweDRiYzMyMDM0Y2FjY2M5YjdlMDI1MzY5NDVlZGJjMjg2YmFjYmEwNzMiLCJxdW90ZVRva2VuIjoiMHhjYzY4M2E3ODJmNGIzMGMxMzg3ODdjYjU1NzZhODZhZjY2ZmRjMzFkIiwicGFpckFkZHJlc3MiOiIweDRmNTliODg1NTZjMWIxMzM5MzliMjY1NTcyOWFkNTMyMjZlZDVmYWQiLCJwYWlyTmFtZSI6IkRPRE9WMiIsInBtbVN0YXRlIjp7ImkiOiIxMDAwMDAwMDAwMDAwMDAwMDAwIiwiayI6IjUwMDAwMDAwMDAwMDAwMDAiLCJiIjoiMzIzNzQyNyIsInEiOiI2NzY3MTg1IiwiYjAiOiI0OTk5ODE0IiwicTAiOiI1MDAwMDAwIiwiciI6MX0sImxwRmVlUmF0ZSI6IjAiLCJtdEZlZVJhdGUiOiIwIiwidXBkYXRlZEF0IjoiMTc0Nzk4ODEwNCJ9fV19LHsidHlwZSI6IkJyaWRnZSIsImluQ2hhaW5UeXBlIjoiemV0YWNoYWluIiwiaW5DaGFpbklkIjo3MDAxLCJpblRva2VuIjoiMHg0YkMzMjAzNGNhQ2NjOUI3ZTAyNTM2OTQ1ZURiQzI4NmJBQ2JBMDczIiwiaW5BbW91bnQiOiIzMjM0MzYyIiwiaW5BbW91bnRXaXRoT3V0RGVjaW1hbHMiOjMuMjM0MzYyLCJvdXRDaGFpblR5cGUiOiJldm0iLCJvdXRDaGFpbklkIjo0MjE2MTQsIm91dFRva2VuIjoiMHg3NWZhZjExNGVhZmIxQkRiZTJGMDMxNkRGODkzZmQ1OENFNDZBQTRkIiwib3V0QW1vdW50IjoiMzIzMzIyMyIsIm91dEFtb3VudFdpdGhPdXREZWNpbWFscyI6My4yMzMyMjMsImZlZUNoYWluVHlwZSI6IiIsImZlZUNoYWluSWQiOjAsImZlZVRva2VuIjoiIiwiZmVlQW1vdW50IjoiMCIsImZlZVJhdGVCcHMiOjAsIndpdGhkcmF3R2FzQ29zdFpyYzIwIjoiMHg0YkMzMjAzNGNhQ2NjOUI3ZTAyNTM2OTQ1ZURiQzI4NmJBQ2JBMDczIiwid2l0aGRyYXdHYXMiOiIxMTM5In1dLCJzaWduIjoiaEN5bDZQMkg4bklzdkZINDdGekxRYjFORWttb2V3Vml2dTRFSTZCdG1SdGovVGJJc2hWQnlJMTlCbmFpSWhCcTZZSVNtQUx5dlZmSmVheFoyUTY1RTlRTWxSOEdVTEoydnZNaUNSUll2bklsQnBFWnhOdjRRWkFUSGc3QTZUK241RXhrOVp0U2RkT0RsNnk0ODRjcDlaMC8zekR1ajRDVUZqeEFTSWZsRHZ3PSJ9',
      },
    },
  },
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
  spenderContractAddress: string;

  /** USD */
  feeUSD: string | null;
  /** in seconds */
  executionDuration: number | null;

  /** one-click */
  step: BridgeStep;

  encodeParams: any;
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
      fromAddress: fromAccount?.appKitAccount?.address ?? EmptyAddress,
      toAddress: toAccount?.appKitAccount?.address ?? EmptyAddress,
      fromAmount:
        fromToken && fromAmount
          ? parseFixed(String(fromAmount), fromToken.decimals).toString()
          : null,
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
    enabled:
      !!fromToken &&
      !!toToken &&
      !!fromAmount &&
      fromToken.chainId !== toToken.chainId,
    refetchInterval: 15 * 1000,
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
        data.cross_chain_swap_zetachain_routes as (typeof routesExample)['data']['cross_chain_swap_zetachain_routes'];
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
        approveTarget &&
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
            const feeUSD = fees[0]?.amountUSD;
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
              spenderContractAddress: approveTarget ?? '0x',
              feeUSD,
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
