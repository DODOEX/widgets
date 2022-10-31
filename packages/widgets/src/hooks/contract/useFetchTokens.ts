import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js';
import { useCallback, useEffect, useMemo, useState } from 'react';
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

type TokenResult = {
  address: string;
  balance: BigNumber;
  allowance: BigNumber;
  decimals?: number;
  symbol?: string;
  name?: string;
};

export default function useFetchTokens({
  tokenList,
  addresses: addressesProps,
  blockNumber,
}: {
  tokenList?: TokenList;
  addresses?: string[];
  blockNumber?: number;
}) {
  const { account } = useWeb3React();
  const dispatch = useDispatch<AppThunkDispatch>();
  const addresses = useMemo(() => {
    return [
      ...(tokenList?.map((token) => token.address) || []),
      ...(addressesProps || []),
    ].map((address) => address.toLocaleLowerCase());
  }, [tokenList, addressesProps]);
  const { getContract, contractConfig, call } = useMultiContract();
  const [data, setData] = useState<TokenResult[]>();

  const thunk = useMemo(() => {
    if (!account || !addresses.length || !contractConfig) return undefined;
    const { DODO_APPROVE: proxyAddress, ERC20_HELPER: erc20HelperAddress } =
      contractConfig;
    const contract = getContract(erc20HelperAddress, erc20Helper);
    if (!contract) return;
    let balanceLoadings = {} as { [key in string]: boolean };

    const res = addresses.map((tokenAddress) => {
      balanceLoadings[tokenAddress] = true;
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
    dispatch(setBalanceLoadings(balanceLoadings));
    return res;
  }, [account, getContract, addresses]);

  useEffect(() => {
    const computed = async () => {
      if (!thunk) return;
      const res = (await call<TokenResult>(thunk)) as TokenResult[];
      const accountBalances = {} as AccountBalances;
      if (res) {
        res.forEach((token) => {
          accountBalances[token.address.toLocaleLowerCase()] = {
            tokenBalances: token.balance,
            tokenAllowances: token.allowance,
          };
        });
        dispatch(setTokenBalances(accountBalances));
      }
      setData(res);
      let balanceLoadings = {} as { [key in string]: boolean };
      addresses.forEach((address) => {
        balanceLoadings[address] = false;
      });
      dispatch(setBalanceLoadings(balanceLoadings));
    };
    computed();
  }, [thunk, blockNumber]);

  return {
    data,
  };
}
