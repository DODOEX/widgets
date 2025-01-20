import {
  encodeNonfungiblePositionManagerAlgebraCollect,
  encodeNonfungiblePositionManagerAlgebraDecreaseLiquidity,
  encodeNonfungiblePositionManagerAlgebraMulticall,
  getNonfungiblePositionManagerAlgebraContractAddressByChainId,
} from '@dodoex/dodo-contract-request';
import { useMutation } from '@tanstack/react-query';
import { useSubmission } from '../../../../hooks/Submission';
import { OpCode } from '../../../../hooks/Submission/spec';
import { t } from '@lingui/macro';
import { MetadataFlag } from '../../../../hooks/Submission/types';
import { useMessageState } from '../../../../hooks/useMessageState';
import BigNumber from 'bignumber.js';
import { toHex } from '../utils/calldata';

export function useRemoveAlgebraLiquidity() {
  const submission = useSubmission();

  return useMutation({
    mutationFn: async ({
      chainId,
      tokenId: tokenIdProps,
      amount0Min,
      amount1Min,
      newLiquidity,
      collectOptions,
      successBack,
    }: {
      chainId?: number;
      tokenId?: number | string;
      amount0Min: string;
      amount1Min: string;
      newLiquidity: string;
      collectOptions: {
        expectedCurrencyOwed0: BigNumber;
        expectedCurrencyOwed1: BigNumber;
        recipient: string;
      };
      successBack?: () => void;
    }) => {
      if (!tokenIdProps || !chainId) return;
      const calldatas: string[] = [];
      const tokenId = toHex(tokenIdProps);
      const deadline = Math.ceil(Date.now() / 1000) + 10 * 60;

      const title = t`Remove Liquidity`;

      try {
        // if (permit) {
        // }

        // remove liquidity
        calldatas.push(
          encodeNonfungiblePositionManagerAlgebraDecreaseLiquidity({
            tokenId,
            liquidity: toHex(newLiquidity),
            amount0Min: toHex(amount0Min),
            amount1Min: toHex(amount1Min),
            deadline,
          }),
        );

        calldatas.push(
          encodeNonfungiblePositionManagerAlgebraCollect({
            tokenId,
            recipient: collectOptions.recipient,
            amount0Max: collectOptions.expectedCurrencyOwed0
              .plus(amount0Min)
              .toString(),
            amount1Max: collectOptions.expectedCurrencyOwed1
              .plus(amount1Min)
              .toString(),
          }),
        );

        // if (options.liquidityPercentage.equalTo(ONE)) {
        // }

        const value: string = toHex(0);

        return submission.execute(
          title,
          {
            opcode: OpCode.TX,
            to: getNonfungiblePositionManagerAlgebraContractAddressByChainId(
              chainId,
            ),
            value,
            data: encodeNonfungiblePositionManagerAlgebraMulticall(calldatas),
          },
          {
            early: false,
            metadata: {
              [MetadataFlag.removeAlgebraPool]: '1',
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
