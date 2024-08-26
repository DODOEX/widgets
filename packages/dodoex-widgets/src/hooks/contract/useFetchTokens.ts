import BigNumber from 'bignumber.js';
import { useEffect, useMemo, useState } from 'react';
import { Interface } from '@ethersproject/abi';
import { useDispatch } from 'react-redux';
import { TokenList } from '../Token';
import erc20Helper from './abis/erc20Helper';
import useMultiContract from './useMultiContract';
import { AccountBalances } from '../../store/reducers/token';
import {
  setBalanceLoadings,
  setTokenBalances,
} from '../../store/actions/token';
import { AppThunkDispatch } from '../../store/actions';
import { isETHAddress } from '../../utils';
import { useWalletState } from '../ConnectWallet/useWalletState';
import { ChainId } from '../../constants/chains';
import useTonConnectStore from '../ConnectWallet/TonConnect';
import { BIG_ALLOWANCE } from '../../constants/token';
import { useWeb3React } from '@web3-react/core';

type TokenResult = {
  address: string;
  balance: BigNumber;
  allowance: BigNumber;
  decimals?: number;
  symbol?: string;
  name?: string;
};

const maxMultiCallAddrLen = 30;
export default function useFetchTokens({
  tokenList,
  blockNumber,
  chainId,
  skip,
}: {
  tokenList?: TokenList;
  blockNumber?: number;
  chainId?: number;
  skip?: boolean;
}) {
  const { account } = useWeb3React();
  const tonConnect = useTonConnectStore();
  const dispatch = useDispatch<AppThunkDispatch>();
  const [addresses, tonTokenList] = useMemo(() => {
    const evmList = [] as TokenList;
    const tonList = [] as TokenList;
    tokenList?.forEach(async (token) => {
      if (token.chainId === ChainId.TON) {
        if (!isETHAddress(token.address)) {
          tonList.push(token);
        }
      } else {
        evmList.push(token);
      }
    });
    return [evmList.map((token) => token.address.toLocaleLowerCase()), tonList];
  }, [tokenList]);

  const { getContract, contractConfig, call } = useMultiContract(chainId);
  const [data, setData] = useState<TokenResult[]>();

  const thunk = useMemo(() => {
    if (!account || !addresses.length || !contractConfig) return undefined;
    const { DODO_APPROVE: proxyAddress, ERC20_HELPER: erc20HelperAddress } =
      contractConfig;
    const contract = getContract(erc20HelperAddress, erc20Helper);
    if (!contract) return;
    const res = addresses.map((tokenAddress) => {
      const encoded = contract.interface.encodeFunctionData('isERC20', [
        tokenAddress,
        account,
        proxyAddress,
      ]);
      const callData = {
        data: encoded,
        to: erc20HelperAddress,
      };

      return {
        callData,
        processor: (raw: any) => {
          const decodeIface = new Interface(erc20Helper);
          const detail = decodeIface.decodeFunctionResult('isERC20', raw);
          const { balance, isOk } = detail;
          // eslint-disable-next-line radix
          const decimals = parseInt(detail.decimals);
          const divisor = new BigNumber(10).pow(decimals);
          const allowance = new BigNumber(detail.allownance.toString()).div(
            divisor,
          );
          if (isOk) {
            return {
              address: tokenAddress,
              decimals,
              symbol: detail.symbol,
              name: detail.name,
              balance: new BigNumber(balance.toString()).div(divisor),
              allowance,
            };
          }

          return {
            address: tokenAddress,
            balance: new BigNumber(0),
            allowance: new BigNumber(0),
          };
        },
      };
    });
    return res;
  }, [account, getContract, JSON.stringify(addresses)]);

  // query addresses
  useEffect(() => {
    const computed = async () => {
      if (!thunk || skip) return;
      let balanceLoadings = {} as { [key in string]: boolean };
      addresses.forEach((address) => {
        balanceLoadings[address] = true;
      });
      dispatch(setBalanceLoadings(balanceLoadings));
      const res = (await call<TokenResult>(thunk)) as TokenResult[];
      const accountBalances = {} as AccountBalances;
      if (res) {
        res.forEach((token) => {
          if (isETHAddress(token.address)) return;
          accountBalances[token.address.toLocaleLowerCase()] = {
            tokenBalances: token.balance,
            tokenAllowances: token.allowance,
          };
        });
        dispatch(setTokenBalances(accountBalances));
      }
      setData(res);
      addresses.forEach((address) => {
        balanceLoadings[address] = false;
      });
      dispatch(setBalanceLoadings(balanceLoadings));
    };
    computed();
  }, [thunk, blockNumber, skip]);

  // query ton addresses
  useEffect(() => {
    const computed = async () => {
      if (skip) return;
      let balanceLoadings = {} as { [key in string]: boolean };

      const { getTokenBalance } = useTonConnectStore.getState();
      const accountBalances = {} as AccountBalances;
      const result: TokenResult[] = [];
      const promiseList = tonTokenList?.map(async (token) => {
        const lowAddress = token.address.toLocaleLowerCase();
        balanceLoadings[lowAddress] = true;
        const balance = await getTokenBalance(token.address, token.decimals);
        result.push({
          address: lowAddress,
          decimals: token.decimals,
          symbol: token.symbol,
          name: token.name,
          balance,
          allowance: BIG_ALLOWANCE,
        } as TokenResult);
        accountBalances[lowAddress] = {
          tokenBalances: balance,
          tokenAllowances: BIG_ALLOWANCE,
        };
        return Promise.resolve(true);
      });
      if (promiseList) {
        dispatch(setBalanceLoadings(balanceLoadings));
        await Promise.all(promiseList);
        tonTokenList.forEach((token) => {
          const lowAddress = token.address.toLocaleLowerCase();
          balanceLoadings[lowAddress] = false;
        });
        dispatch(setBalanceLoadings(balanceLoadings));
        dispatch(setTokenBalances(accountBalances));
        setData(result);
      }
    };

    if (tonTokenList.length && !!tonConnect.connected?.account) {
      computed();
    }
  }, [
    JSON.stringify(tonTokenList),
    blockNumber,
    skip,
    tonConnect.connected?.account,
  ]);

  return {
    data,
  };
}
