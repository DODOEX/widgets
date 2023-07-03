import contractConfig from './contractConfig';
import { ChainId } from '../../constants/chains';
import { JsonRpcProvider } from '@ethersproject/providers';
import erc20ABI from './abis/erc20ABI';
import { Contract } from '@ethersproject/contracts';
import BigNumber from 'bignumber.js';

export async function fetchTokenAllowance({
  account,
  tokenAddress,
  tokenDecimals,
  chainId,
  approveAddress,
  provider,
}: {
  account?: string;
  tokenAddress: string;
  tokenDecimals: number;
  chainId: number;
  approveAddress?: string;
  provider: JsonRpcProvider;
}) {
  if (!account || !tokenAddress) return undefined;
  const currentContractConfig = contractConfig[chainId as ChainId];
  const { DODO_APPROVE: dodoApproveAddress } = currentContractConfig;
  const proxyAddress = approveAddress ?? dodoApproveAddress;
  const contract = new Contract(tokenAddress, erc20ABI, provider);
  const res = await contract.allowance(account, proxyAddress);
  const divisor = new BigNumber(10).pow(tokenDecimals);
  const allowance = new BigNumber(res.toString()).div(divisor);
  return allowance;
}
