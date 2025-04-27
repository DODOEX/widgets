import { useCallback } from 'react';
import { PrivacySwapSupplierEndpointI } from '../../constants/chains';

/**
 * chainId 不变，切换至当前链的供应商链，供应商链提供隐私交易
 * @param param0
 * @returns
 */
export function useSwitchToSupplierChain({
  chainId,
  successCallback,
  selectedSupplier,
}: {
  chainId?: number;
  successCallback: () => void;
  selectedSupplier?: PrivacySwapSupplierEndpointI;
}) {
  // const switchBack = useCallback(async () => {
  //   if (!chainId) {
  //     return;
  //   }
  //   const { addChainParameters } = getChain(chainId);
  //   if (!addChainParameters) {
  //     return;
  //   }
  //   // const switchChain = await getSwitchChain();
  //   // console.log('switchChain result', switchChain);
  //   // if (!switchChain) {
  //   //   return;
  //   // }
  //   // const { result } = await switchChain({
  //   //   addChainParameters,
  //   // });
  //   await window.ethereum.request({
  //     method: 'wallet_addEthereumChain',
  //     params: [addChainParameters],
  //   });
  //   successCallback();
  //   // if (result) {
  //   //   successCallback();
  //   // }
  // }, [chainId, successCallback]);

  // const wallet = useWalletStore((state) => state.connected?.wallet);

  // const [switchChain, setSwitchChain] =
  //   useState<Awaited<ReturnType<typeof getSwitchChain>>>();
  // useEffect(() => {
  //   const createSwitchChain = async () => {
  //     setSwitchChain(wallet?.switchChain);
  //   };
  //   createSwitchChain();
  // }, [wallet?.switchChain]);

  const switchTo = useCallback(async () => {
    if (!selectedSupplier) {
      return;
    }
    try {
      // const switchChain = await getSwitchChain();
      // if (!wallet?.switchChain) {
      //   return;
      // }
      // // wallet 在钱包切换同一网络的不同 rpc 节点后会变为 null
      // const { result } = await wallet?.switchChain({
      //   addChainDirectly: true,
      //   addChainParameters: selectedSupplier.addChainParameters,
      // });
      // if (result) {
      //   successCallback();
      // }

      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [selectedSupplier.addChainParameters],
      });
      successCallback();
    } catch (addError) {
      console.error(addError);
    }
  }, [selectedSupplier, successCallback]);

  return {
    // switchBack,
    switchTo,
  };
}
