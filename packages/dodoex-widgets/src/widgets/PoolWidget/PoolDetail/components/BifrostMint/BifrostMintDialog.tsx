import {
  alpha,
  Box,
  Button,
  LoadingSkeleton,
  useTheme,
} from '@dodoex/components';
import { t, Trans } from '@lingui/macro';
import { encodeTransparentUpgradeableProxyWithProsDepositWithPROS } from '@dodoex/dodo-contract-request';
import BigNumber from 'bignumber.js';
import React from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { useWeb3React } from '@web3-react/core';
import TokenLogo from '../../../../../components/TokenLogo';
import { tokenApi } from '../../../../../constants/api';
import useFetchBlockNumber from '../../../../../hooks/contract/useFetchBlockNumber';
import { useSubmission } from '../../../../../hooks/Submission';
import { OpCode } from '../../../../../hooks/Submission/spec';
import {
  ExecutionResult,
  MetadataFlag,
} from '../../../../../hooks/Submission/types';
import { BifrostMintToken } from './types';
import { useBifrostApy } from './useBifrostApy';
import Dialog from '../../../../../components/Swap/components/Dialog';
import { TokenCard } from '../../../../../components/Swap/components/TokenCard';
import NeedConnectButton from '../../../../../components/ConnectWallet/NeedConnectButton';
import { ReactComponent as BifrostLogo } from '../../../../../assets/logo/bifrost.svg';
import { Warn } from '@dodoex/icons';

interface Props {
  config: BifrostMintToken;
  open: boolean;
  onClose: () => void;
}

export function BifrostMintDialog({ config, open, onClose }: Props) {
  const { token, wrapToken, chainId } = config;

  const theme = useTheme();
  const { account } = useWeb3React();
  const submission = useSubmission();
  const queryClient = useQueryClient();
  const { updateBlockNumber } = useFetchBlockNumber();
  const { apyDisplay } = useBifrostApy(wrapToken.symbol);

  const [inputAmount, setInputAmount] = React.useState('');

  const contractAddress = wrapToken.address;

  // Same query key as TokenCard's internal fetch → React Query deduplicates
  const tokenQuery = useQuery(
    tokenApi.getFetchTokenQuery(chainId, token.address, account),
  );
  const balance = tokenQuery.data?.balance;

  const parsedAmount = React.useMemo(() => {
    if (!inputAmount) return new BigNumber(0);
    return new BigNumber(inputAmount);
  }, [inputAmount]);

  const isInsufficient =
    balance != null && parsedAmount.gt(0) && parsedAmount.gt(balance);
  const isEmpty = parsedAmount.isZero() || inputAmount === '';

  const mintMutation = useMutation({
    mutationFn: async () => {
      const valueWei = parsedAmount
        .shiftedBy(token.decimals)
        .toFixed(0, BigNumber.ROUND_DOWN);

      const result = await submission.execute(
        t`Mint ${wrapToken.symbol}`,
        {
          opcode: OpCode.TX,
          value: valueWei,
          to: contractAddress,
          data: encodeTransparentUpgradeableProxyWithProsDepositWithPROS(),
        },
        {
          metadata: { [MetadataFlag.mintToken]: true },
          successBack: async () => {
            await updateBlockNumber();
            queryClient.invalidateQueries({
              queryKey: tokenApi.getFetchTokenQuery(
                chainId,
                token.address,
                account,
              ).queryKey,
              refetchType: 'all',
            });
            queryClient.invalidateQueries({
              queryKey: tokenApi.getFetchTokenQuery(
                chainId,
                wrapToken.address,
                account,
              ).queryKey,
              refetchType: 'all',
            });
          },
        },
      );
      if (result === ExecutionResult.Success) {
        setInputAmount('');
      }
    },
  });

  const buttonLabel = React.useMemo(() => {
    if (isEmpty) return t`Enter an amount`;
    if (isInsufficient) return t`Insufficient balance`;
    if (mintMutation.isPending) return t`Minting...`;
    return t`Mint`;
  }, [isEmpty, isInsufficient, mintMutation.isPending]);

  const isButtonDisabled = isEmpty || isInsufficient || mintMutation.isPending;

  return (
    <Dialog
      modal
      open={open}
      onClose={onClose}
      title={
        <Box sx={{ fontSize: 20, fontWeight: 600 }}>
          <Trans>Mint</Trans>
        </Box>
      }
    >
      <Box
        sx={{
          width: {
            mobile: '100%',
            tablet: 420,
          },
        }}
      >
        <Box
          sx={{
            px: 20,
            pb: 12,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          {/* APY card */}
          <Box
            sx={{
              backgroundColor: alpha(theme.palette.secondary.main, 0.1),
              borderRadius: 8,
              px: 20,
              py: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <TokenLogo
              address={wrapToken.address}
              width={32}
              height={32}
              chainId={wrapToken.chainId}
              noShowChain
            />
            <Box>
              <Box
                sx={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: 'text.primary',
                  lineHeight: '18px',
                }}
              >
                {wrapToken.symbol} APY
              </Box>
              <LoadingSkeleton
                loading={!apyDisplay}
                loadingProps={{ width: 60 }}
                sx={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: '#2fba90',
                  lineHeight: '22px',
                }}
              >
                {apyDisplay ?? '-'}
              </LoadingSkeleton>
            </Box>
          </Box>

          {/* Token input */}
          <TokenCard
            amt={inputAmount}
            token={token}
            onInputChange={setInputAmount}
            showPercentage
            canClickBalance
          />

          {/* Will receive */}
          <Box
            sx={{
              backgroundColor: 'background.input',
              borderRadius: 12,
              px: 20,
              py: 12,
            }}
          >
            <Box sx={{ typography: 'body2', color: 'text.secondary', mb: 12 }}>
              <Trans>Will receive</Trans>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <TokenLogo
                address={wrapToken.address}
                width={24}
                height={24}
                chainId={wrapToken.chainId}
                noShowChain
                marginRight={0}
              />
              <Box>
                <Box
                  component="span"
                  sx={{ fontSize: 20, fontWeight: 600, color: 'primary.main' }}
                >
                  {inputAmount || '0'}
                </Box>{' '}
                <Box
                  component="span"
                  sx={{ fontSize: 18, fontWeight: 600, color: 'text.primary' }}
                >
                  {wrapToken.symbol}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Footer */}
        <Box
          sx={{
            px: 20,
            pt: 20,
            pb: 12,
            borderTopWidth: 1,
            borderTopStyle: 'solid',
            borderTopColor: 'border.main',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
          }}
        >
          {mintMutation.isError && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
                p: 12,
                borderRadius: 8,
                backgroundColor: theme.palette.background.paperDarkContrast,
                width: '100%',
              }}
            >
              <Box
                component={Warn}
                sx={{ color: '#ff6187', flexShrink: 0, fontSize: 24 }}
              />
              <Box
                sx={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: '#ff6187',
                }}
              >
                {(mintMutation.error as Error)?.message}
              </Box>
            </Box>
          )}
          <NeedConnectButton
            includeButton
            fullWidth
            chainId={chainId}
            size={Button.Size.big}
          >
            <Button
              fullWidth
              disabled={isButtonDisabled}
              isLoading={mintMutation.isPending}
              onClick={() => mintMutation.mutate()}
              size={Button.Size.big}
              sx={{ borderRadius: 12, py: 16, fontSize: 16, fontWeight: 600 }}
            >
              {buttonLabel}
            </Button>
          </NeedConnectButton>
          <Box sx={{ typography: 'h6' }}>
            <Trans>by</Trans> <BifrostLogo />
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
}
