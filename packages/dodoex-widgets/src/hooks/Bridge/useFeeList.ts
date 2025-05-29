import { useMemo } from 'react';
import { BridgeRouteI } from './useFetchRoutePriceBridge';
import { BigNumber } from 'bignumber.js';

export function useFeeList({ fees }: { fees: BridgeRouteI['fees'] }) {
  return useMemo(() => {
    const feeList = fees.map((fee) => {
      const feeBN = new BigNumber(fee.amountUSD);
      return {
        key: fee.type,
        title:
          fee.type === 'platformFee'
            ? 'ZetaChain Fees'
            : fee.type === 'btcDepositFee'
              ? 'Source Chain Fees'
              : fee.type === 'destinationFee'
                ? 'Destination Chain Fees'
                : fee.type,
        value: feeBN.isFinite()
          ? feeBN.dp(4, BigNumber.ROUND_DOWN).toString()
          : null,
        isFree: false,
      };
    });

    feeList.push({
      key: 'protocolFees',
      title: 'Protocol Fees',
      value: '0',
      isFree: true,
    });

    return feeList;
  }, [fees]);
}
