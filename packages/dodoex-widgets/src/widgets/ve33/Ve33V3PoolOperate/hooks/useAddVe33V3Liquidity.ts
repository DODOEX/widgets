import { useMutation } from '@tanstack/react-query';
import { useSubmission } from '../../../../hooks/Submission';
import { OpCode } from '../../../../hooks/Submission/spec';
import { t } from '@lingui/macro';
import { MetadataFlag } from '../../../../hooks/Submission/types';
import { useMessageState } from '../../../../hooks/useMessageState';
import { toHex } from '../utils/calldata';
import { useVe33V3Pair } from './useVe33V3Pair';
import {
  encodeVE33NonfungiblePositionManagerIncreaseLiquidity,
  encodeVE33NonfungiblePositionManagerMint,
  encodeVE33NonfungiblePositionManagerMulticall,
  encodeVE33NonfungiblePositionManagerRefundETH,
  getVE33NonfungiblePositionManagerContractAddressByChainId,
} from '@dodoex/dodo-contract-request';
import { useUserOptions } from '../../../../components/UserOptionsProvider';

export function useAddVe33V3Liquidity() {
  const submission = useSubmission();
  const { deadLine: ddl } = useUserOptions();

  return useMutation({
    mutationFn: async ({
      recipient,
      pool,
      tokenId,
      amount0: amount0Desired,
      amount1: amount1Desired,
      sqrtPriceX96,
      tickSpacing,
      tickLower,
      tickUpper,
      amount0Min,
      amount1Min,
      successBack,
    }: {
      recipient?: string;
      pool?: ReturnType<typeof useVe33V3Pair>;
      tokenId?: number | string;
      amount0: string;
      amount1: string;
      sqrtPriceX96: string;
      tickSpacing: number;
      tickLower: number;
      tickUpper: number;
      amount0Min: string;
      amount1Min: string;
      successBack?: () => void;
    }) => {
      if (!pool?.token0Wrapped || !pool.token1Wrapped) return;
      const calldatas: string[] = [];
      const deadline = Math.ceil(Date.now() / 1000) + (ddl ?? 10 * 60);

      const title = t`Add Liquidity`;

      try {
        // mint
        if (recipient) {
          console.log({
            token0: pool.token0Wrapped.address,
            token1: pool.token1Wrapped.address,
            tickSpacing,
            tickLower,
            tickUpper,
            amount0Desired: amount0Desired,
            amount1Desired: amount1Desired,
            amount0Min,
            amount1Min,
            recipient,
            deadline,
            sqrtPriceX96,
          });
          calldatas.push(
            encodeVE33NonfungiblePositionManagerMint({
              token0: pool.token0Wrapped.address,
              token1: pool.token1Wrapped.address,
              tickSpacing,
              tickLower,
              tickUpper,
              amount0Desired: toHex(amount0Desired),
              amount1Desired: toHex(amount1Desired),
              amount0Min,
              amount1Min,
              recipient,
              deadline,
              sqrtPriceX96,
            }),
          );
        } else {
          // increase
          if (!tokenId) {
            throw new Error('tokenId is undefined');
          }
          calldatas.push(
            encodeVE33NonfungiblePositionManagerIncreaseLiquidity({
              tokenId: toHex(tokenId),
              amount0Desired: toHex(amount0Desired),
              amount1Desired: toHex(amount1Desired),
              amount0Min,
              amount1Min,
              deadline,
            }),
          );
        }

        let value: string = toHex(0);

        if (pool.isBaseTokenNative || pool.isQuoteTokenNative) {
          let wrappedValue = amount0Desired;
          if (
            pool.isRearTokenA ? pool.isBaseTokenNative : pool.isQuoteTokenNative
          ) {
            wrappedValue = amount1Desired;
          }

          // we only need to refund if we're actually sending ETH
          if (Number(wrappedValue) > 0) {
            calldatas.push(encodeVE33NonfungiblePositionManagerRefundETH());
          }

          value = toHex(wrappedValue);
        }

        return submission.execute(
          title,
          {
            opcode: OpCode.TX,
            to: getVE33NonfungiblePositionManagerContractAddressByChainId(
              pool.chainId,
            ),
            value,
            data: encodeVE33NonfungiblePositionManagerMulticall(calldatas),
          },
          {
            early: false,
            metadata: {
              [MetadataFlag.addLiquidityVe33V3Position]: '1',
            },
            successBack,
          },
        );
      } catch (e) {
        console.error(e);
        useMessageState.getState().toast({
          message: `${title} error: ${e}`,
          type: 'error',
        });
      }
    },
  });
}
