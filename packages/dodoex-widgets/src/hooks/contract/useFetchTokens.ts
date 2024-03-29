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
import { isETHAddress } from '../../utils';

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
  addresses: addressesProps,
  blockNumber,
  chainId,
  skip,
}: {
  tokenList?: TokenList;
  addresses?: string[];
  blockNumber?: number;
  chainId?: number;
  skip?: boolean;
}) {
  const { account } = useWeb3React();
  const dispatch = useDispatch<AppThunkDispatch>();
  const addresses = useMemo(() => {
    return [
      ...(tokenList?.map((token) => token.address) || []),
      ...(addressesProps || []),
    ].map((address) => address.toLocaleLowerCase());
  }, [tokenList, JSON.stringify(addressesProps)]);

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

  return {
    data,
  };
}
