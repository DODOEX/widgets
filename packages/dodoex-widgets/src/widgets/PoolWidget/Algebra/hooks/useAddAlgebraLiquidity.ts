import {
  encodeNonfungiblePositionManagerAlgebraCreateAndInitializePoolIfNecessary,
  encodeNonfungiblePositionManagerAlgebraIncreaseLiquidity,
  encodeNonfungiblePositionManagerAlgebraMint,
  encodeNonfungiblePositionManagerAlgebraMulticall,
  encodeNonfungiblePositionManagerAlgebraRefundNativeToken,
  getNonfungiblePositionManagerAlgebraContractAddressByChainId,
} from '@dodoex/dodo-contract-request';
import { ADDRESS_ZERO } from '../../../../constants/address';
import { useAlgebraPair } from './useAlgebraPair';
import { useMutation } from '@tanstack/react-query';
import { useSubmission } from '../../../../hooks/Submission';
import { OpCode } from '../../../../hooks/Submission/spec';
import { t } from '@lingui/macro';
import { MetadataFlag } from '../../../../hooks/Submission/types';
import { useMessageState } from '../../../../hooks/useMessageState';
import { toHex } from '../utils/calldata';

export function useAddAlgebraLiquidity() {
  const submission = useSubmission();

  return useMutation({
    mutationFn: async ({
      createPool,
      recipient,
      deployer: deployerProps,
      pool,
      tokenId,
      amount0: amount0Desired,
      amount1: amount1Desired,
      tickLower,
      tickUpper,
      amount0Min,
      amount1Min,
      successBack,
    }: {
      createPool?: boolean;
      recipient?: string;
      deployer?: string;
      pool?: ReturnType<typeof useAlgebraPair>;
      tokenId?: number | string;
      amount0: string;
      amount1: string;
      tickLower: number;
      tickUpper: number;
      amount0Min: string;
      amount1Min: string;
      successBack?: () => void;
    }) => {
      if (!pool?.token0Wrapped || !pool.token1Wrapped) return;
      const calldatas: string[] = [];
      const deployer = deployerProps ?? ADDRESS_ZERO;
      const deadline = Math.ceil(Date.now() / 1000) + 10 * 60;

      const title = createPool ? t`Pool Creation` : t`Add Liquidity`;

      try {
        // create pool if needed
        if (recipient && createPool) {
          if (!pool.currentSqrt) {
            throw new Error('currentSqrt is undefined');
          }
          calldatas.push(
            encodeNonfungiblePositionManagerAlgebraCreateAndInitializePoolIfNecessary(
              pool.token0Wrapped.address,
              pool.token1Wrapped.address,
              deployer,
              pool.currentSqrt,
              '0x',
            ),
          );
        }

        // mint
        if (recipient) {
          calldatas.push(
            encodeNonfungiblePositionManagerAlgebraMint({
              token0: pool.token0Wrapped.address,
              token1: pool.token1Wrapped.address,
              deployer: deployer,
              tickLower,
              tickUpper,
              amount0Desired: toHex(amount0Desired),
              amount1Desired: toHex(amount1Desired),
              amount0Min,
              amount1Min,
              recipient,
              deadline,
            }),
          );
        } else {
          // increase
          if (!tokenId) {
            throw new Error('tokenId is undefined');
          }
          calldatas.push(
            encodeNonfungiblePositionManagerAlgebraIncreaseLiquidity({
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
            calldatas.push(
              encodeNonfungiblePositionManagerAlgebraRefundNativeToken(),
            );
          }

          value = toHex(wrappedValue);
        }

        return submission.execute(
          title,
          {
            opcode: OpCode.TX,
            to: getNonfungiblePositionManagerAlgebraContractAddressByChainId(
              pool.chainId,
            ),
            value,
            data: encodeNonfungiblePositionManagerAlgebraMulticall(calldatas),
          },
          {
            early: false,
            metadata: {
              [createPool
                ? MetadataFlag.createAlgebraPool
                : MetadataFlag.addAlgebraPool]: '1',
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
