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

// eslint-disable-next-line no-unused-vars
const btcToEvmRoutesExample: CrossChainSwapZetachainRoutesResponse = {
  data: {
    cross_chain_swap_zetachain_routes: {
      routeId: 'e19dc088-119b-415e-827f-aacd2fbca0c5',
      fromChainId: 18333,
      fromTokenAddress: 'Btc1111111111111111111111111111111111111111',
      fromAmount: '431045',
      fromAmountWithOutDecimals: '0.00431045',
      fromAmountUSD: '464.61478460',
      toChainId: 421614,
      toTokenAddress: '0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d',
      toAmount: '3935219',
      toAmountWithOutDecimals: '3.935219',
      toAmountUSD: '10822.993464',
      fromAddress: 'tb1qwtq2w8wm7mle4ker3ppdsjf7axzadaxe00qur0',
      toAddress: '0xf859fb7f8811a5016e9a5380b497957343f40476',
      slippage: 0.005,
      approveTarget: null,
      fees: [
        {
          type: 'platformFee',
          chainId: 7001,
          token: '0xdbfF6471a79E5374d771922F2194eccc42210B9F',
          amount: '4250',
          amountWithOutDecimals: '0.00004250',
          amountUSD: '4.58099000',
        },
        {
          type: 'btcDepositFee',
          chainId: 18333,
          token: 'Btc1111111111111111111111111111111111111111',
          amount: 6000,
          amountWithOutDecimals: '0.00006000',
          amountUSD: '6.46728000',
        },
        {
          type: 'destinationFee',
          chainId: 7001,
          token: '0x4bC32034caCcc9B7e02536945eDbC286bACbA073',
          amount: '987',
          amountWithOutDecimals: '0.000987',
          amountUSD: '2.714536',
        },
      ],
      omniPlan: [
        {
          type: 'Bridge',
          inChainType: 'btc',
          inChainId: 18333,
          inToken: 'Btc1111111111111111111111111111111111111111',
          inAmount: '431045',
          inAmountWithOutDecimals: 0.00431045,
          outChainType: 'zetachain',
          outChainId: 7001,
          outToken: '0xdbfF6471a79E5374d771922F2194eccc42210B9F',
          outAmount: '420795',
          outAmountWithOutDecimals: 0.00420795,
          feeChainType: 'zetachain',
          feeChainId: 7001,
          feeToken: '0xdbfF6471a79E5374d771922F2194eccc42210B9F',
          feeAmount: '4250',
          feeRateBps: 100,
          btcDepositFee: 6000,
        },
        {
          type: 'Swap',
          inChainType: 'zetachain',
          inChainId: 7001,
          inToken: '0xdbfF6471a79E5374d771922F2194eccc42210B9F',
          inAmount: '420795',
          inAmountWithOutDecimals: 0.00420795,
          outChainType: 'zetachain',
          outChainId: 7001,
          outToken: '0x4bC32034caCcc9B7e02536945eDbC286bACbA073',
          outAmount: '3936206',
          outAmountWithOutDecimals: 3.936206,
          feeChainType: '',
          feeChainId: 0,
          feeToken: '',
          feeAmount: '0',
          feeRateBps: 0,
          swapSteps: [
            {
              ammKey: '0xc8e06C7AC071D78Bc4E26700320B054971Cc7e52',
              label: 'DODOV2',
              percent: 100,
              inputToken: '0xdbfF6471a79E5374d771922F2194eccc42210B9F',
              inAmount: '420795',
              outputToken: '0xcC683A782f4B30c138787CB5576a86AF66fdc31d',
              outAmount: '3932133',
              feeToken: '',
              feeAmount: '0',
              assembleArgs: {
                baseToken: '0xdbff6471a79e5374d771922f2194eccc42210b9f',
                quoteToken: '0xcc683a782f4b30c138787cb5576a86af66fdc31d',
                pairAddress: '0xc8e06c7ac071d78bc4e26700320b054971cc7e52',
                pairName: 'DODOV2',
                pmmState: {
                  i: '9999999999999000000',
                  k: '100000000000000',
                  b: '82507',
                  q: '3932148',
                  b0: '455553',
                  q0: '200000',
                  r: 1,
                },
                lpFeeRate: '0',
                mtFeeRate: '0',
                updatedAt: '1748489238',
              },
            },
            {
              ammKey: '0x4f59b88556c1B133939b2655729Ad53226ed5FAD',
              label: 'DODOV2',
              percent: 100,
              inputToken: '0xcC683A782f4B30c138787CB5576a86AF66fdc31d',
              inAmount: '3932133',
              outputToken: '0x4bC32034caCcc9B7e02536945eDbC286bACbA073',
              outAmount: '3936206',
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
                  b: '7270965',
                  q: '2852673',
                  b0: '5057466',
                  q0: '5057650',
                  r: 2,
                },
                lpFeeRate: '0',
                mtFeeRate: '0',
                updatedAt: '1748488268',
              },
            },
          ],
        },
        {
          type: 'Bridge',
          inChainType: 'zetachain',
          inChainId: 7001,
          inToken: '0x4bC32034caCcc9B7e02536945eDbC286bACbA073',
          inAmount: '3936206',
          inAmountWithOutDecimals: 3.936206,
          outChainType: 'evm',
          outChainId: 421614,
          outToken: '0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d',
          outAmount: '3935219',
          outAmountWithOutDecimals: 3.935219,
          feeChainType: '',
          feeChainId: 0,
          feeToken: '',
          feeAmount: '0',
          feeRateBps: 0,
          withdrawGasCostZrc20: '0x4bC32034caCcc9B7e02536945eDbC286bACbA073',
          withdrawGas: '987',
        },
      ],
      encodeParams: {
        interfaceParams:
          'eyJyb3V0ZUlkIjoiZTE5ZGMwODgtMTE5Yi00MTVlLTgyN2YtYWFjZDJmYmNhMGM1IiwiZnJvbUNoYWluSWQiOjE4MzMzLCJmcm9tVG9rZW5BZGRyZXNzIjoiQnRjMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMSIsInRvQ2hhaW5JZCI6NDIxNjE0LCJ0b1Rva2VuQWRkcmVzcyI6IjB4NzVmYWYxMTRlYWZiMUJEYmUyRjAzMTZERjg5M2ZkNThDRTQ2QUE0ZCIsImZyb21BZGRyZXNzIjoidGIxcXd0cTJ3OHdtN21sZTRrZXIzcHBkc2pmN2F4emFkYXhlMDBxdXIwIiwiZnJvbUFtb3VudCI6IjQzMTA0NSIsInRvQWRkcmVzcyI6IjB4Zjg1OWZiN2Y4ODExYTUwMTZlOWE1MzgwYjQ5Nzk1NzM0M2Y0MDQ3NiIsInNsaXBwYWdlIjowLjAwNSwib21uaVBsYW4iOlt7InR5cGUiOiJCcmlkZ2UiLCJpbkNoYWluVHlwZSI6ImJ0YyIsImluQ2hhaW5JZCI6MTgzMzMsImluVG9rZW4iOiJCdGMxMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExIiwiaW5BbW91bnQiOiI0MzEwNDUiLCJpbkFtb3VudFdpdGhPdXREZWNpbWFscyI6MC4wMDQzMTA0NSwib3V0Q2hhaW5UeXBlIjoiemV0YWNoYWluIiwib3V0Q2hhaW5JZCI6NzAwMSwib3V0VG9rZW4iOiIweGRiZkY2NDcxYTc5RTUzNzRkNzcxOTIyRjIxOTRlY2NjNDIyMTBCOUYiLCJvdXRBbW91bnQiOiI0MjA3OTUiLCJvdXRBbW91bnRXaXRoT3V0RGVjaW1hbHMiOjAuMDA0MjA3OTUsImZlZUNoYWluVHlwZSI6InpldGFjaGFpbiIsImZlZUNoYWluSWQiOjcwMDEsImZlZVRva2VuIjoiMHhkYmZGNjQ3MWE3OUU1Mzc0ZDc3MTkyMkYyMTk0ZWNjYzQyMjEwQjlGIiwiZmVlQW1vdW50IjoiNDI1MCIsImZlZVJhdGVCcHMiOjEwMCwiYnRjRGVwb3NpdEZlZSI6NjAwMH0seyJ0eXBlIjoiU3dhcCIsImluQ2hhaW5UeXBlIjoiemV0YWNoYWluIiwiaW5DaGFpbklkIjo3MDAxLCJpblRva2VuIjoiMHhkYmZGNjQ3MWE3OUU1Mzc0ZDc3MTkyMkYyMTk0ZWNjYzQyMjEwQjlGIiwiaW5BbW91bnQiOiI0MjA3OTUiLCJpbkFtb3VudFdpdGhPdXREZWNpbWFscyI6MC4wMDQyMDc5NSwib3V0Q2hhaW5UeXBlIjoiemV0YWNoYWluIiwib3V0Q2hhaW5JZCI6NzAwMSwib3V0VG9rZW4iOiIweDRiQzMyMDM0Y2FDY2M5QjdlMDI1MzY5NDVlRGJDMjg2YkFDYkEwNzMiLCJvdXRBbW91bnQiOiIzOTM2MjA2Iiwib3V0QW1vdW50V2l0aE91dERlY2ltYWxzIjozLjkzNjIwNiwiZmVlQ2hhaW5UeXBlIjoiIiwiZmVlQ2hhaW5JZCI6MCwiZmVlVG9rZW4iOiIiLCJmZWVBbW91bnQiOiIwIiwiZmVlUmF0ZUJwcyI6MCwic3dhcFN0ZXBzIjpbeyJhbW1LZXkiOiIweGM4ZTA2QzdBQzA3MUQ3OEJjNEUyNjcwMDMyMEIwNTQ5NzFDYzdlNTIiLCJsYWJlbCI6IkRPRE9WMiIsInBlcmNlbnQiOjEwMCwiaW5wdXRUb2tlbiI6IjB4ZGJmRjY0NzFhNzlFNTM3NGQ3NzE5MjJGMjE5NGVjY2M0MjIxMEI5RiIsImluQW1vdW50IjoiNDIwNzk1Iiwib3V0cHV0VG9rZW4iOiIweGNDNjgzQTc4MmY0QjMwYzEzODc4N0NCNTU3NmE4NkFGNjZmZGMzMWQiLCJvdXRBbW91bnQiOiIzOTMyMTMzIiwiZmVlVG9rZW4iOiIiLCJmZWVBbW91bnQiOiIwIiwiYXNzZW1ibGVBcmdzIjp7ImJhc2VUb2tlbiI6IjB4ZGJmZjY0NzFhNzllNTM3NGQ3NzE5MjJmMjE5NGVjY2M0MjIxMGI5ZiIsInF1b3RlVG9rZW4iOiIweGNjNjgzYTc4MmY0YjMwYzEzODc4N2NiNTU3NmE4NmFmNjZmZGMzMWQiLCJwYWlyQWRkcmVzcyI6IjB4YzhlMDZjN2FjMDcxZDc4YmM0ZTI2NzAwMzIwYjA1NDk3MWNjN2U1MiIsInBhaXJOYW1lIjoiRE9ET1YyIiwicG1tU3RhdGUiOnsiaSI6Ijk5OTk5OTk5OTk5OTkwMDAwMDAiLCJrIjoiMTAwMDAwMDAwMDAwMDAwIiwiYiI6IjgyNTA3IiwicSI6IjM5MzIxNDgiLCJiMCI6IjQ1NTU1MyIsInEwIjoiMjAwMDAwIiwiciI6MX0sImxwRmVlUmF0ZSI6IjAiLCJtdEZlZVJhdGUiOiIwIiwidXBkYXRlZEF0IjoiMTc0ODQ4OTIzOCJ9fSx7ImFtbUtleSI6IjB4NGY1OWI4ODU1NmMxQjEzMzkzOWIyNjU1NzI5QWQ1MzIyNmVkNUZBRCIsImxhYmVsIjoiRE9ET1YyIiwicGVyY2VudCI6MTAwLCJpbnB1dFRva2VuIjoiMHhjQzY4M0E3ODJmNEIzMGMxMzg3ODdDQjU1NzZhODZBRjY2ZmRjMzFkIiwiaW5BbW91bnQiOiIzOTMyMTMzIiwib3V0cHV0VG9rZW4iOiIweDRiQzMyMDM0Y2FDY2M5QjdlMDI1MzY5NDVlRGJDMjg2YkFDYkEwNzMiLCJvdXRBbW91bnQiOiIzOTM2MjA2IiwiZmVlVG9rZW4iOiIiLCJmZWVBbW91bnQiOiIwIiwiYXNzZW1ibGVBcmdzIjp7ImJhc2VUb2tlbiI6IjB4NGJjMzIwMzRjYWNjYzliN2UwMjUzNjk0NWVkYmMyODZiYWNiYTA3MyIsInF1b3RlVG9rZW4iOiIweGNjNjgzYTc4MmY0YjMwYzEzODc4N2NiNTU3NmE4NmFmNjZmZGMzMWQiLCJwYWlyQWRkcmVzcyI6IjB4NGY1OWI4ODU1NmMxYjEzMzkzOWIyNjU1NzI5YWQ1MzIyNmVkNWZhZCIsInBhaXJOYW1lIjoiRE9ET1YyIiwicG1tU3RhdGUiOnsiaSI6IjEwMDAwMDAwMDAwMDAwMDAwMDAiLCJrIjoiNTAwMDAwMDAwMDAwMDAwMCIsImIiOiI3MjcwOTY1IiwicSI6IjI4NTI2NzMiLCJiMCI6IjUwNTc0NjYiLCJxMCI6IjUwNTc2NTAiLCJyIjoyfSwibHBGZWVSYXRlIjoiMCIsIm10RmVlUmF0ZSI6IjAiLCJ1cGRhdGVkQXQiOiIxNzQ4NDg4MjY4In19XX0seyJ0eXBlIjoiQnJpZGdlIiwiaW5DaGFpblR5cGUiOiJ6ZXRhY2hhaW4iLCJpbkNoYWluSWQiOjcwMDEsImluVG9rZW4iOiIweDRiQzMyMDM0Y2FDY2M5QjdlMDI1MzY5NDVlRGJDMjg2YkFDYkEwNzMiLCJpbkFtb3VudCI6IjM5MzYyMDYiLCJpbkFtb3VudFdpdGhPdXREZWNpbWFscyI6My45MzYyMDYsIm91dENoYWluVHlwZSI6ImV2bSIsIm91dENoYWluSWQiOjQyMTYxNCwib3V0VG9rZW4iOiIweDc1ZmFmMTE0ZWFmYjFCRGJlMkYwMzE2REY4OTNmZDU4Q0U0NkFBNGQiLCJvdXRBbW91bnQiOiIzOTM1MjE5Iiwib3V0QW1vdW50V2l0aE91dERlY2ltYWxzIjozLjkzNTIxOSwiZmVlQ2hhaW5UeXBlIjoiIiwiZmVlQ2hhaW5JZCI6MCwiZmVlVG9rZW4iOiIiLCJmZWVBbW91bnQiOiIwIiwiZmVlUmF0ZUJwcyI6MCwid2l0aGRyYXdHYXNDb3N0WnJjMjAiOiIweDRiQzMyMDM0Y2FDY2M5QjdlMDI1MzY5NDVlRGJDMjg2YkFDYkEwNzMiLCJ3aXRoZHJhd0dhcyI6Ijk4NyJ9XSwic2lnbiI6ImRwOTR0TUpFMG1yLzNndmZwTGhTa21XL0djVzQvQW10NWU1bW1LdEY2OTlrZzRzZ0V0c1R3Y3V4YWVTL2pxY0JIU2RmeWFOTWU3UlJUNnRRNUZLdVFrZVcyTWRmeDZPSy92UzlNQkE4UGUwaFcydDVhSXNDenB5ZTl0WjJiVlErSlJwRTRnMWNJRnhxV05FZWNrM0RPMkNSS2JBOEVUSUg1a2RQb3M3V3NPRT0ifQ==',
      },
    },
  },
};

// eslint-disable-next-line no-unused-vars
const routesExample: CrossChainSwapZetachainRoutesResponse = {
  data: {
    cross_chain_swap_zetachain_routes: {
      routeId: 'ff01bc1d-2300-4352-b779-5ce9b4e6ea59',
      fromChainId: 11155111,
      fromTokenAddress: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
      fromAmount: '75151597',
      fromAmountWithOutDecimals: '75.151597',
      fromAmountUSD: '207396.613757',
      toChainId: 421614,
      toTokenAddress: '0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d',
      toAmount: '7268074',
      toAmountWithOutDecimals: '7.268074',
      toAmountUSD: '0.000000',
      fromAddress: '0xf859fb7f8811a5016e9a5380b497957343f40476',
      toAddress: '0xf859fb7f8811a5016e9a5380b497957343f40476',
      slippage: 0.005,
      approveTarget: '0x2405965a3CB8748D7065752AdC702Bb907AA2297',
      fees: [
        {
          type: 'platformFee',
          chainId: 7001,
          token: '0xcC683A782f4B30c138787CB5576a86AF66fdc31d',
          amount: '751515',
          amountWithOutDecimals: '0.751515',
          amountUSD: '2073.963461',
        },
        {
          type: 'destinationFee',
          chainId: 7001,
          token: '0x4bC32034caCcc9B7e02536945eDbC286bACbA073',
          amount: '987',
          amountWithOutDecimals: '0.000987',
          amountUSD: '0.000000',
        },
      ],
      omniPlan: [
        {
          type: 'Bridge',
          inChainType: 'evm',
          inChainId: 11155111,
          inToken: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
          inAmount: '75151597',
          inAmountWithOutDecimals: 75.151597,
          outChainType: 'zetachain',
          outChainId: 7001,
          outToken: '0xcC683A782f4B30c138787CB5576a86AF66fdc31d',
          outAmount: '74400082',
          outAmountWithOutDecimals: 74.400082,
          feeChainType: 'zetachain',
          feeChainId: 7001,
          feeToken: '0xcC683A782f4B30c138787CB5576a86AF66fdc31d',
          feeAmount: '751515',
          feeRateBps: 100,
        },
        {
          type: 'Swap',
          inChainType: 'zetachain',
          inChainId: 7001,
          inToken: '0xcC683A782f4B30c138787CB5576a86AF66fdc31d',
          inAmount: '74400082',
          inAmountWithOutDecimals: 74.400082,
          outChainType: 'zetachain',
          outChainId: 7001,
          outToken: '0x4bC32034caCcc9B7e02536945eDbC286bACbA073',
          outAmount: '7269061',
          outAmountWithOutDecimals: 7.269061,
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
              inAmount: '74400082',
              outputToken: '0x4bC32034caCcc9B7e02536945eDbC286bACbA073',
              outAmount: '7269061',
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
                  b: '7270965',
                  q: '2852673',
                  b0: '5057466',
                  q0: '5057650',
                  r: 2,
                },
                lpFeeRate: '0',
                mtFeeRate: '0',
                updatedAt: '1748488268',
              },
            },
          ],
        },
        {
          type: 'Bridge',
          inChainType: 'zetachain',
          inChainId: 7001,
          inToken: '0x4bC32034caCcc9B7e02536945eDbC286bACbA073',
          inAmount: '7269061',
          inAmountWithOutDecimals: 7.269061,
          outChainType: 'evm',
          outChainId: 421614,
          outToken: '0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d',
          outAmount: '7268074',
          outAmountWithOutDecimals: 7.268074,
          feeChainType: '',
          feeChainId: 0,
          feeToken: '',
          feeAmount: '0',
          feeRateBps: 0,
          withdrawGasCostZrc20: '0x4bC32034caCcc9B7e02536945eDbC286bACbA073',
          withdrawGas: '987',
        },
      ],
      encodeParams: {
        interfaceParams:
          'eyJyb3V0ZUlkIjoiZmYwMWJjMWQtMjMwMC00MzUyLWI3NzktNWNlOWI0ZTZlYTU5IiwiZnJvbUNoYWluSWQiOjExMTU1MTExLCJmcm9tVG9rZW5BZGRyZXNzIjoiMHgxYzdENEIxOTZDYjBDN0IwMWQ3NDNGYmM2MTE2YTkwMjM3OUM3MjM4IiwidG9DaGFpbklkIjo0MjE2MTQsInRvVG9rZW5BZGRyZXNzIjoiMHg3NWZhZjExNGVhZmIxQkRiZTJGMDMxNkRGODkzZmQ1OENFNDZBQTRkIiwiZnJvbUFkZHJlc3MiOiIweGY4NTlmYjdmODgxMWE1MDE2ZTlhNTM4MGI0OTc5NTczNDNmNDA0NzYiLCJmcm9tQW1vdW50IjoiNzUxNTE1OTciLCJ0b0FkZHJlc3MiOiIweGY4NTlmYjdmODgxMWE1MDE2ZTlhNTM4MGI0OTc5NTczNDNmNDA0NzYiLCJzbGlwcGFnZSI6MC4wMDUsIm9tbmlQbGFuIjpbeyJ0eXBlIjoiQnJpZGdlIiwiaW5DaGFpblR5cGUiOiJldm0iLCJpbkNoYWluSWQiOjExMTU1MTExLCJpblRva2VuIjoiMHgxYzdENEIxOTZDYjBDN0IwMWQ3NDNGYmM2MTE2YTkwMjM3OUM3MjM4IiwiaW5BbW91bnQiOiI3NTE1MTU5NyIsImluQW1vdW50V2l0aE91dERlY2ltYWxzIjo3NS4xNTE1OTcsIm91dENoYWluVHlwZSI6InpldGFjaGFpbiIsIm91dENoYWluSWQiOjcwMDEsIm91dFRva2VuIjoiMHhjQzY4M0E3ODJmNEIzMGMxMzg3ODdDQjU1NzZhODZBRjY2ZmRjMzFkIiwib3V0QW1vdW50IjoiNzQ0MDAwODIiLCJvdXRBbW91bnRXaXRoT3V0RGVjaW1hbHMiOjc0LjQwMDA4MiwiZmVlQ2hhaW5UeXBlIjoiemV0YWNoYWluIiwiZmVlQ2hhaW5JZCI6NzAwMSwiZmVlVG9rZW4iOiIweGNDNjgzQTc4MmY0QjMwYzEzODc4N0NCNTU3NmE4NkFGNjZmZGMzMWQiLCJmZWVBbW91bnQiOiI3NTE1MTUiLCJmZWVSYXRlQnBzIjoxMDB9LHsidHlwZSI6IlN3YXAiLCJpbkNoYWluVHlwZSI6InpldGFjaGFpbiIsImluQ2hhaW5JZCI6NzAwMSwiaW5Ub2tlbiI6IjB4Y0M2ODNBNzgyZjRCMzBjMTM4Nzg3Q0I1NTc2YTg2QUY2NmZkYzMxZCIsImluQW1vdW50IjoiNzQ0MDAwODIiLCJpbkFtb3VudFdpdGhPdXREZWNpbWFscyI6NzQuNDAwMDgyLCJvdXRDaGFpblR5cGUiOiJ6ZXRhY2hhaW4iLCJvdXRDaGFpbklkIjo3MDAxLCJvdXRUb2tlbiI6IjB4NGJDMzIwMzRjYUNjYzlCN2UwMjUzNjk0NWVEYkMyODZiQUNiQTA3MyIsIm91dEFtb3VudCI6IjcyNjkwNjEiLCJvdXRBbW91bnRXaXRoT3V0RGVjaW1hbHMiOjcuMjY5MDYxLCJmZWVDaGFpblR5cGUiOiIiLCJmZWVDaGFpbklkIjowLCJmZWVUb2tlbiI6IiIsImZlZUFtb3VudCI6IjAiLCJmZWVSYXRlQnBzIjowLCJzd2FwU3RlcHMiOlt7ImFtbUtleSI6IjB4NGY1OWI4ODU1NmMxQjEzMzkzOWIyNjU1NzI5QWQ1MzIyNmVkNUZBRCIsImxhYmVsIjoiRE9ET1YyIiwicGVyY2VudCI6MTAwLCJpbnB1dFRva2VuIjoiMHhjQzY4M0E3ODJmNEIzMGMxMzg3ODdDQjU1NzZhODZBRjY2ZmRjMzFkIiwiaW5BbW91bnQiOiI3NDQwMDA4MiIsIm91dHB1dFRva2VuIjoiMHg0YkMzMjAzNGNhQ2NjOUI3ZTAyNTM2OTQ1ZURiQzI4NmJBQ2JBMDczIiwib3V0QW1vdW50IjoiNzI2OTA2MSIsImZlZVRva2VuIjoiIiwiZmVlQW1vdW50IjoiMCIsImFzc2VtYmxlQXJncyI6eyJiYXNlVG9rZW4iOiIweDRiYzMyMDM0Y2FjY2M5YjdlMDI1MzY5NDVlZGJjMjg2YmFjYmEwNzMiLCJxdW90ZVRva2VuIjoiMHhjYzY4M2E3ODJmNGIzMGMxMzg3ODdjYjU1NzZhODZhZjY2ZmRjMzFkIiwicGFpckFkZHJlc3MiOiIweDRmNTliODg1NTZjMWIxMzM5MzliMjY1NTcyOWFkNTMyMjZlZDVmYWQiLCJwYWlyTmFtZSI6IkRPRE9WMiIsInBtbVN0YXRlIjp7ImkiOiIxMDAwMDAwMDAwMDAwMDAwMDAwIiwiayI6IjUwMDAwMDAwMDAwMDAwMDAiLCJiIjoiNzI3MDk2NSIsInEiOiIyODUyNjczIiwiYjAiOiI1MDU3NDY2IiwicTAiOiI1MDU3NjUwIiwiciI6Mn0sImxwRmVlUmF0ZSI6IjAiLCJtdEZlZVJhdGUiOiIwIiwidXBkYXRlZEF0IjoiMTc0ODQ4ODI2OCJ9fV19LHsidHlwZSI6IkJyaWRnZSIsImluQ2hhaW5UeXBlIjoiemV0YWNoYWluIiwiaW5DaGFpbklkIjo3MDAxLCJpblRva2VuIjoiMHg0YkMzMjAzNGNhQ2NjOUI3ZTAyNTM2OTQ1ZURiQzI4NmJBQ2JBMDczIiwiaW5BbW91bnQiOiI3MjY5MDYxIiwiaW5BbW91bnRXaXRoT3V0RGVjaW1hbHMiOjcuMjY5MDYxLCJvdXRDaGFpblR5cGUiOiJldm0iLCJvdXRDaGFpbklkIjo0MjE2MTQsIm91dFRva2VuIjoiMHg3NWZhZjExNGVhZmIxQkRiZTJGMDMxNkRGODkzZmQ1OENFNDZBQTRkIiwib3V0QW1vdW50IjoiNzI2ODA3NCIsIm91dEFtb3VudFdpdGhPdXREZWNpbWFscyI6Ny4yNjgwNzQsImZlZUNoYWluVHlwZSI6IiIsImZlZUNoYWluSWQiOjAsImZlZVRva2VuIjoiIiwiZmVlQW1vdW50IjoiMCIsImZlZVJhdGVCcHMiOjAsIndpdGhkcmF3R2FzQ29zdFpyYzIwIjoiMHg0YkMzMjAzNGNhQ2NjOUI3ZTAyNTM2OTQ1ZURiQzI4NmJBQ2JBMDczIiwid2l0aGRyYXdHYXMiOiI5ODcifV0sInNpZ24iOiJpU3J1TFBSL3FhYmtucmc1OG1jclhBcGVKMWFzdzBtbURSNVJsa3BvN0ZXdU5COUVXUmUzOHk3dktqUmNRNE1FN24vMnZuN3lIZVNrbmNabEwrdjRod1pCZ25CTEc3SVhjOVJad1UyWXNLc1lnOWprUXExdGhrdHZRSUdvRnRCWmFOdDFQWUkrTDBEUmc1cWNXVUhYVytQVkRadktDbUx0Vi9VTXo5akhzeVE9In0=',
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
