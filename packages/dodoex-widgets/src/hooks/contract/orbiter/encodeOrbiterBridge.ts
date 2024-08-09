import { getAddress } from '@ethersproject/address';
import { Interface } from '@ethersproject/abi';
import { hexlify } from '@ethersproject/bytes';
import { toUtf8Bytes } from '@ethersproject/strings';
import BigNumber from 'bignumber.js';
import { isETHAddress } from '../../../utils';
import { BridgeRouteI } from '../../Bridge';
import { TokenInfo } from '../../Token';
import { useOrbiterRouters } from './useOrbiterRouters';
import erc20ABI from '../abis/erc20ABI';
import { Orbiter_V3_ABI_EVM } from '../abis/OrbiterV3ABI';

export function encodeOrbiterBridge({
  route,
  fromAddress,
  toAddress,
  fromAmount,
  fromToken,
  contractAddress,
}: {
  route: Exclude<ReturnType<typeof useOrbiterRouters>['data'], undefined>[0];
  fromAddress: string;
  toAddress: string;
  fromAmount: BigNumber;
  fromToken: TokenInfo;
  contractAddress: string;
}): Exclude<BridgeRouteI['encodeResultData'], undefined> {
  const str = `c=${route.vc}&t=${toAddress}`;
  // const sendAmount = new BigNumber(route.vc).div(10**18).plus(fromAmount)
  const sendAmount = fromAmount;
  const sendAmountWei = sendAmount.times(10 ** fromToken.decimals).toString();
  const endpoint = getAddress(route.endpoint);

  let data = '';
  let value = '0x0';
  if (isETHAddress(fromToken.address)) {
    data = new Interface(Orbiter_V3_ABI_EVM).encodeFunctionData('transfer', [
      endpoint,
      hexlify(toUtf8Bytes(str)),
    ]);
    value = sendAmountWei;
  } else {
    data = new Interface(Orbiter_V3_ABI_EVM).encodeFunctionData(
      'transferToken',
      [fromToken.address, endpoint, sendAmountWei, hexlify(toUtf8Bytes(str))],
    );
  }

  // if (isETHAddress(fromToken.address)) {
  //   return {
  //     data: '',
  //     to: endpoint,
  //     value: sendAmountWei,
  //     from: fromAddress,
  //     chainId: fromToken.chainId,
  //   };
  // }
  // const data = new Interface(erc20ABI).encodeFunctionData('transfer', [
  //   endpoint,
  //   sendAmountWei,
  // ]);

  return {
    data,
    to: getAddress(contractAddress),
    value,
    from: fromAddress,
    chainId: fromToken.chainId,
  };
}
