import {
  encodeNonfungiblePositionManagerAlgebraCollect,
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
import { BigNumber as BigNumberE } from '@ethersproject/bignumber';
import { EmptyAddress } from '../../../../constants/address';
import { toHex } from '../utils/calldata';

export function useClaimAlgebraFees() {
  const submission = useSubmission();

  return useMutation({
    mutationFn: async ({
      chainId,
      tokenId: tokenIdProps,
      collectOptions,
      involvesETH,
      successBack,
    }: {
      chainId?: number;
      tokenId?: number | string;
      collectOptions: {
        expectedCurrencyOwed0: BigNumber;
        expectedCurrencyOwed1: BigNumber;
        recipient: string;
      };
      involvesETH?: boolean;
      successBack?: () => void;
    }) => {
      if (!tokenIdProps || !chainId) return;
      const calldatas: string[] = [];
      const tokenId = toHex(tokenIdProps);

      const title = t`Claim Rewards`;

      try {
        const MAX_UINT128 = BigNumberE.from(2).pow(128).sub(1).toString();
        calldatas.push(
          encodeNonfungiblePositionManagerAlgebraCollect({
            tokenId,
            recipient: involvesETH ? EmptyAddress : collectOptions.recipient,
            amount0Max: MAX_UINT128,
            amount1Max: MAX_UINT128,
          }),
        );

        // TODO: involvesETH

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
              [MetadataFlag.claimAlgebraPool]: '1',
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
