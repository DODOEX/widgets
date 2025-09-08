import {
  ChainId,
  Cross_Chain_Swap_Zetachain_OrderRefundClaimedQuery,
  Cross_Chain_Swap_ZetachainorderRefundClaimedData,
  SwapApi,
} from '@dodoex/api';
import { Box, Button, useTheme } from '@dodoex/components';
import { Interface } from '@ethersproject/abi';
import { useMutation, useQuery } from '@tanstack/react-query';
import React, { useMemo } from 'react';
import { swapApi } from '../../../constants/api';
import { chainListMap } from '../../../constants/chainList';
import { useWalletInfo } from '../../../hooks/ConnectWallet/useWalletInfo';
import { useSubmission } from '../../../hooks/Submission';
import { OpCode } from '../../../hooks/Submission/spec';
import { useCrossSwapOrderList } from '../../../hooks/Swap/useCrossSwapOrderList';
import { useTokenStatus } from '../../../hooks/Token/useTokenStatus';
import { useGraphQLRequests } from '../../../hooks/useGraphQLRequests';
import { getEtherscanPage } from '../../../utils';
import { CLAIM_REFUND_TEXT } from '../../../utils/constants';
import { AddressWithLinkAndCopy } from '../../AddressWithLinkAndCopy';
import Dialog from '../components/Dialog';

const StepNumIcon = ({
  step,
  completed,
}: {
  step: number;
  completed: boolean;
}) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        width: 28,
        height: 28,
        borderRadius: '50%',
        backgroundColor: theme.palette.background.paper,
        position: 'absolute',
        left: 20,
        top: 16,
        typography: 'body2',
        fontWeight: 600,
        color: theme.palette.primary.main,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {completed ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
        >
          <path
            d="M11.165 3.11108L5.18517 9.0909L2.83499 6.74979L1.55554 8.02923L5.18517 11.6589L12.4444 4.3996L11.165 3.11108Z"
            fill="currentColor"
          />
        </svg>
      ) : (
        step
      )}
    </Box>
  );
};

export interface RefundModalProps {
  data: NonNullable<ReturnType<typeof useCrossSwapOrderList>['orderList'][0]>;
  refetch: () => void;
  claimConfirmOpen: boolean;
  setClaimConfirmOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const RefundModal = ({
  data,
  refetch,
  claimConfirmOpen,
  setClaimConfirmOpen,
}: RefundModalProps) => {
  const theme = useTheme();
  const submission = useSubmission();
  const graphQLRequests = useGraphQLRequests();

  const { chainId, appKitActiveNetwork, getAppKitAccountByChainId, account } =
    useWalletInfo();
  const refundInfoZRC20Result = useQuery(
    swapApi.getRefundInfoZRC20(
      data.bridgeChainId ?? undefined,
      data.bridgeRefundVault ?? undefined,
      data.externalId ?? undefined,
    ),
  );

  const {
    isApproving,
    isGetApproveLoading,
    needApprove,
    insufficientBalance,
    submitApprove,
    getMaxBalance,
    tokenQuery: zrc20TokenQuery,
    approveTitle,
  } = useTokenStatus(
    refundInfoZRC20Result.data?.gasZRC20 && data.bridgeChainId
      ? {
          address: refundInfoZRC20Result.data.gasZRC20,
          chainId: data.bridgeChainId,
        }
      : undefined,
    {
      amount: refundInfoZRC20Result.data?.gasFee,
      contractAddress: data.bridgeRefundVault ?? undefined,
      account,
    },
  );

  const claimMutation = useMutation({
    mutationFn: async () => {
      if (!data.externalId || !data.bridgeRefundVault) {
        return;
      }

      const iface = new Interface([
        {
          inputs: [
            {
              internalType: 'bytes32',
              name: 'externalId',
              type: 'bytes32',
            },
          ],
          name: 'claimRefund',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
      ]);
      const encodedData = iface.encodeFunctionData('claimRefund', [
        data.externalId,
      ]);
      const result = await submission.execute(
        CLAIM_REFUND_TEXT,
        {
          opcode: OpCode.TX,
          data: encodedData,
          to: data.bridgeRefundVault,
          value: '0x0',
        },
        {
          metadata: {
            crossChainSwapClaimRefund: true,
          },
          submittedBack: () => {
            refetch();
          },
          successBack: async (tx: string) => {
            function submitRefundClaimed() {
              return graphQLRequests.getData<
                Cross_Chain_Swap_Zetachain_OrderRefundClaimedQuery,
                {
                  data?: Cross_Chain_Swap_ZetachainorderRefundClaimedData;
                }
              >(
                SwapApi.graphql.cross_chain_swap_zetachain_orderRefundClaimed.toString(),
                {
                  data: {
                    externalId: data.externalId,
                    hash: tx,
                  },
                },
              );
            }

            const result = await submitRefundClaimed();
            if (
              !result.cross_chain_swap_zetachain_orderRefundClaimed?.success
            ) {
              console.log('submitRefundClaimed failed', result);

              const result2 = await submitRefundClaimed();
              if (
                !result2.cross_chain_swap_zetachain_orderRefundClaimed?.success
              ) {
                console.log('submitRefundClaimed retry failed', result2);
              }
            }

            refetch();
            setClaimConfirmOpen(false);
          },
        },
      );
      return result;
    },
  });

  const bridgeChain = data.bridgeChainId
    ? chainListMap.get(data.bridgeChainId)
    : undefined;
  const refundChain = data.refundChainId
    ? chainListMap.get(data.refundChainId)
    : undefined;
  const bridgeChainName = bridgeChain ? bridgeChain.name : '-';

  const isInCurrentChain = chainId === data.bridgeChainId;

  const isStep1 =
    refundInfoZRC20Result.isLoading ||
    insufficientBalance ||
    needApprove ||
    isApproving ||
    isGetApproveLoading;
  // const isStep1 = true;

  const button1 = useMemo(() => {
    if (!isInCurrentChain) {
      return (
        <Button
          variant={Button.Variant.contained}
          size={Button.Size.big}
          fullWidth
          color="error"
          onClick={() => {
            if (!data.bridgeChainId) {
              return;
            }
            const chain = getAppKitAccountByChainId(data.bridgeChainId);
            if (!chain) {
              return;
            }
            appKitActiveNetwork.switchNetwork(chain.chain.caipNetwork);
          }}
          sx={{
            position: 'relative',
          }}
        >
          <StepNumIcon step={1} completed={false} />
          Switch to {bridgeChainName}
        </Button>
      );
    }

    if (isStep1) {
      if (
        refundInfoZRC20Result.isLoading ||
        isApproving ||
        isGetApproveLoading
      ) {
        return (
          <Button
            variant={Button.Variant.contained}
            size={Button.Size.big}
            fullWidth
            color="error"
            disabled
            isLoading
            sx={{
              position: 'relative',
            }}
          >
            <StepNumIcon step={1} completed={false} />
            Approve
          </Button>
        );
      }

      if (insufficientBalance) {
        return (
          <Button
            variant={Button.Variant.contained}
            size={Button.Size.big}
            fullWidth
            color="error"
            disabled
            sx={{
              position: 'relative',
            }}
          >
            <StepNumIcon step={1} completed={false} />
            {zrc20TokenQuery.data?.symbol ?? 'Gas fee'} insufficient balance
          </Button>
        );
      }

      return (
        <Button
          variant={Button.Variant.contained}
          size={Button.Size.big}
          fullWidth
          color="error"
          disabled={false}
          onClick={() => {
            submitApprove();
          }}
          sx={{
            position: 'relative',
          }}
        >
          <StepNumIcon step={1} completed={false} />
          {approveTitle}
        </Button>
      );
    }

    return (
      <Button
        variant={Button.Variant.contained}
        size={Button.Size.big}
        fullWidth
        color="error"
        disabled
        sx={{
          position: 'relative',
        }}
      >
        <StepNumIcon step={1} completed />
        Approved
      </Button>
    );
  }, [
    isInCurrentChain,
    isStep1,
    bridgeChainName,
    data.bridgeChainId,
    getAppKitAccountByChainId,
    appKitActiveNetwork,
    refundInfoZRC20Result.isLoading,
    isApproving,
    isGetApproveLoading,
    insufficientBalance,
    approveTitle,
    zrc20TokenQuery.data?.symbol,
    submitApprove,
  ]);

  const button2 = useMemo(() => {
    return (
      <Button
        variant={Button.Variant.contained}
        size={Button.Size.big}
        fullWidth
        color="error"
        isLoading={claimMutation.isPending}
        disabled={isStep1 || claimMutation.isPending || !isInCurrentChain}
        onClick={() => {
          claimMutation.mutate();
        }}
        sx={{
          position: 'relative',
        }}
      >
        <StepNumIcon step={2} completed={false} />
        Start refund
      </Button>
    );
  }, [claimMutation, isStep1, isInCurrentChain]);

  return (
    <Dialog
      open={claimConfirmOpen}
      onClose={() => setClaimConfirmOpen(false)}
      title="Claim"
      modal
    >
      <Box
        sx={{
          borderTop: `1px solid ${theme.palette.border.main}`,
          mx: 20,
          py: 24,
          [theme.breakpoints.up('tablet')]: {
            width: 380,
          },
        }}
      >
        <Box
          sx={{
            typography: 'h5',
            fontWeight: 600,
            textAlign: 'center',
          }}
        >
          {isStep1 ? (
            <>
              Approve gas on {bridgeChainName} <br />
              for refund
            </>
          ) : (
            `Start refund on ${bridgeChainName}`
          )}
        </Box>

        {isStep1 ? (
          <Box
            sx={{
              my: 20,
              typography: 'body2',
              color: 'text.secondary',
              textAlign: 'center',
            }}
          >
            Gas fee for issuing refunds
          </Box>
        ) : (
          <>
            <Box
              sx={{
                mt: 20,
                typography: 'body2',
                color: 'text.secondary',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
              }}
            >
              <Box>Refund will be sent to</Box>
              <AddressWithLinkAndCopy
                address={data.refundUser ?? ''}
                customChainId={data.refundChainId}
                showCopy={false}
                truncate
                iconSpace={2}
                sx={{
                  typography: 'body2',
                  color: theme.palette.primary.main,
                }}
                handleOpen={(evt) => {
                  evt.stopPropagation();
                  window.open(
                    getEtherscanPage(
                      data.refundChainId as ChainId,
                      data.refundUser,
                      'address',
                    ),
                  );
                }}
              />
            </Box>
            <Box
              sx={{
                mt: 4,
                mb: 20,
                typography: 'body2',
                color: 'text.secondary',
                textAlign: 'center',
              }}
            >
              on {refundChain?.name ?? '-'}
            </Box>
          </>
        )}

        {button1}

        <Box
          sx={{
            width: 4,
            height: 20,
            ml: 32,
            backgroundColor: theme.palette.border.main,
          }}
        />

        {button2}
      </Box>
    </Dialog>
  );
};
