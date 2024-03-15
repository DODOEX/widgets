import BigNumber from 'bignumber.js';
import React from 'react';
import { useSubmission } from '.';
import { State } from './types';

type BalanceData = {
  [address: string]: string;
};

/**
 * Record the loading status of the balance waiting to be updated after the chain is successfully uploaded
 * Insert token data into logBalance in metadata when uploading, within 5 minutes after successful uploading. If the newly passed in balance is consistent with the previously recorded balance, loading will be returned
 * After the balance is updated, or after 5 minutes, loading will return false. And delete the recorded metadata information to avoid calculating this data next time
 * The 5-minute time limit is to avoid operations on other terminals or other tabs, which will cause the balance comparison to be invalid and keep loading.
 */
export const useBalanceUpdateLoading = () => {
  const { requests, updateText } = useSubmission();

  const balanceData = React.useMemo(() => {
    let result = {} as BalanceData;
    requests?.forEach(([request, state]) => {
      if (
        state === State.Success &&
        request.metadata?.logBalance &&
        request.doneTime &&
        Math.ceil(Date.now() / 1000) - request.doneTime < 300
      ) {
        const logBalance = request.metadata?.logBalance as BalanceData;
        result = {
          ...result,
          ...logBalance,
        };
      }
    });
    return result;
  }, [requests]);

  const isTokenLoading = React.useCallback(
    (address: string, balance: BigNumber | number | string) => {
      const oldBalance = balanceData[address];
      if (!oldBalance) return false;
      const newBalance = BigNumber.isBigNumber(balance)
        ? balance
        : new BigNumber(balance);
      if (newBalance.isEqualTo(oldBalance)) {
        return true;
      }
      updateText((request) => {
        const metadata = { ...request.metadata };
        if (metadata?.logBalance?.[address]) {
          delete metadata.logBalance[address];
          if (!Object.keys(metadata.logBalance).length) {
            delete metadata.logBalance;
          }
          return {
            brief: request.brief,
            spec: request.spec,
            metadata,
          };
        }
        return null;
      });
      return false;
    },
    [balanceData, updateText],
  );

  return {
    balanceData,

    isTokenLoading,
  };
};
