import { ChainId } from '@dodoex/api';
import { Contract } from '@ethersproject/contracts';
import { isEqual } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { privacySwapSupplierEndpointsMap } from '../../constants/chains';
import { useWalletInfo } from '../ConnectWallet/useWalletInfo';
import { useRefetch } from '../useRefetch';

const abis = [
  {
    inputs: [],
    name: 'isFlashRPC',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'isBlocknativeRPC',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'pure',
    type: 'function',
  },
];

export function usePrivacySwapStatus({
  chainId,
  account,
}: {
  chainId: number | undefined;
  account: string | undefined;
}) {
  const { evmProvider } = useWalletInfo();

  const privacySwapSupplierEndpoints = useMemo(() => {
    return chainId ? privacySwapSupplierEndpointsMap[chainId as ChainId] : [];
  }, [chainId]);

  // 能否启用隐私交易
  const privacySwapEnableAble =
    Boolean(account) &&
    privacySwapSupplierEndpoints !== undefined &&
    privacySwapSupplierEndpoints.length > 0;

  // 是否切换到某个隐私交易节点
  const [endpointStatusMap, setEndpointStatusMap] = useState<
    Map<string, boolean>
  >(new Map());

  const { refetch, refetchTimes } = useRefetch();

  useEffect(() => {
    async function isCurrentEndpoint({
      address,
      provider,
      method,
    }: {
      address: string;
      provider: ReturnType<typeof useWalletInfo>['evmProvider'];
      method: string;
    }): Promise<boolean> {
      if (!provider) {
        return false;
      }

      try {
        const contract = new Contract(address, abis, provider);
        const isCurrent = await contract[method]();
        return isCurrent;
      } catch (error) {
        console.error(error);
      }
      return false;
    }

    async function requestPrivacyEndpointResult() {
      const promiseList: {
        call: Promise<boolean>;
        callback: (result: boolean) => void;
      }[] = [];
      const resultMap: Map<string, boolean> = new Map();

      if (
        privacySwapSupplierEndpoints &&
        privacySwapSupplierEndpoints.length > 0
      ) {
        privacySwapSupplierEndpoints.forEach(({ key, isPrivacyEndpoint }) => {
          if (isPrivacyEndpoint && isPrivacyEndpoint.contract) {
            promiseList.push({
              call: isCurrentEndpoint({
                address: isPrivacyEndpoint.contract,
                method: isPrivacyEndpoint.rpcMethod,
                provider: evmProvider,
              }),
              callback: (result) => {
                resultMap.set(key, result);
              },
            });
          }
        });
      }
      if (!promiseList.length) {
        setEndpointStatusMap(new Map());
        return;
      }
      const resultList = await Promise.all(promiseList.map((p) => p.call));
      resultList.forEach((result, index) => {
        promiseList[index].callback(result);
      });

      setEndpointStatusMap((prev) => {
        if (isEqual(prev, resultMap)) {
          return prev;
        }
        return resultMap;
      });
    }

    requestPrivacyEndpointResult();
  }, [chainId, privacySwapSupplierEndpoints, evmProvider, refetchTimes]);

  // 是否启用隐私交易
  const privacySwapEnable = useMemo(() => {
    return Array.from(endpointStatusMap.values()).some((v) => v);
  }, [endpointStatusMap]);

  return {
    privacySwapSupplierEndpoints,
    privacySwapEnableAble,
    privacySwapEnable,
    refetchEndpointStatus: refetch,
    endpointStatusMap,
  };
}
