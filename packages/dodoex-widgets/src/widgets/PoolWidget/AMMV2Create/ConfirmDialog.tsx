import BigNumber from 'bignumber.js';
import { alpha, Box, Button, useTheme } from '@dodoex/components';
import { TokenInfo } from '../../../hooks/Token';
import Dialog from '../../../components/Dialog';
import { Trans } from '@lingui/macro';
import { TokenLogoPair } from '../../../components/TokenLogoPair';
import {
  formatPercentageNumber,
  formatTokenAmountNumber,
} from '../../../utils';
import SpaceBetweenItem from '../../../components/SpaceBetweenItem';
import TokenLogo from '../../../components/TokenLogo';
import { AddressWithLinkAndCopy } from '../../../components/AddressWithLinkAndCopy';
import { RatioPrice } from './Ratio';
import { useWidgetDevice } from '../../../hooks/style/useWidgetDevice';
import { useAMMV2AddLiquidity } from '../hooks/useAMMV2AddLiquidity';
import { PoolTypeTag } from '../PoolList/components/tags';

export default function ConfirmDialog({
  open,
  onClose,
  slippage,
  baseToken,
  quoteToken,
  baseAmount,
  quoteAmount,
  lpAmount,
  fee,
  price,
  shareOfPool,
  pairAddress,
  createMutation,
}: {
  open: boolean;
  onClose: () => void;
  slippage: number;
  baseToken?: TokenInfo;
  quoteToken?: TokenInfo;
  baseAmount: string;
  quoteAmount: string;
  lpAmount: BigNumber | undefined;
  fee: number | undefined;
  price?: BigNumber | null;
  shareOfPool?: string;
  pairAddress?: string;
  createMutation: ReturnType<typeof useAMMV2AddLiquidity>;
}) {
  const theme = useTheme();
  const { isMobile } = useWidgetDevice();
  return (
    <Dialog
      modal
      open={open}
      onClose={onClose}
      title={
        lpAmount ? (
          <Trans>You will receive</Trans>
        ) : (
          <Trans>You are creating a pool</Trans>
        )
      }
    >
      <Box
        sx={{
          px: 20,
          py: 24,
          borderTopWidth: 1,
          width: isMobile ? '100%' : 420,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              typography: 'h3',
            }}
          >
            <TokenLogoPair
              width={24}
              height={24}
              tokens={baseToken && quoteToken ? [baseToken, quoteToken] : []}
              chainId={baseToken?.chainId}
            />
            {lpAmount
              ? formatTokenAmountNumber({
                  input: lpAmount,
                  decimals: 18,
                })
              : ''}
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontWeight: 600,
            }}
          >
            <Trans>
              {baseToken?.symbol}/{quoteToken?.symbol} Pool Tokens
            </Trans>
            <PoolTypeTag poolType="AMM V2" />
          </Box>
        </Box>

        <Box
          sx={{
            mt: 16,
            typography: 'h6',
            color: 'text.secondary',
            textAlign: 'center',
          }}
        >
          <Trans>
            Output is estimated. If the price changes by more than{' '}
            {formatPercentageNumber({ input: slippage })} your transaction will
            revert.
          </Trans>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            mt: 20,
            p: 20,
            typography: 'body2',
            borderRadius: 12,
            backgroundColor: theme.palette.background.paperContrast,
          }}
        >
          <SpaceBetweenItem
            label={<Trans>{baseToken?.symbol} deposited</Trans>}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                lineHeight: 1,
              }}
            >
              <TokenLogo
                width={18}
                height={18}
                marginRight={4}
                token={baseToken}
              />
              {formatTokenAmountNumber({
                input: baseAmount,
                decimals: baseToken?.decimals,
              })}
            </Box>
          </SpaceBetweenItem>

          <SpaceBetweenItem
            label={<Trans>{quoteToken?.symbol} deposited</Trans>}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <TokenLogo
                width={18}
                height={18}
                marginRight={4}
                token={quoteToken}
              />
              {formatTokenAmountNumber({
                input: quoteAmount,
                decimals: quoteToken?.decimals,
              })}
            </Box>
          </SpaceBetweenItem>

          <SpaceBetweenItem label={<Trans>Fee tier</Trans>}>
            {formatPercentageNumber({
              input: fee,
            })}
          </SpaceBetweenItem>

          <SpaceBetweenItem label={<Trans>Rate</Trans>}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <TokenLogo
                width={18}
                height={18}
                marginRight={4}
                token={baseToken}
              />
              <RatioPrice
                baseToken={baseToken}
                quoteToken={quoteToken}
                midPrice={price}
              />
            </Box>
          </SpaceBetweenItem>

          <SpaceBetweenItem label={<Trans>Share of pool</Trans>}>
            {shareOfPool}
          </SpaceBetweenItem>

          <SpaceBetweenItem label={<Trans>Pool address</Trans>}>
            <AddressWithLinkAndCopy
              showCopy={false}
              address={pairAddress ?? ''}
              customChainId={baseToken?.chainId}
              truncate
              iconSpace={4}
              sx={{
                typography: 'body2',
              }}
            />
          </SpaceBetweenItem>
        </Box>

        <Button
          fullWidth
          size={Button.Size.big}
          sx={{
            mt: 20,
          }}
          isLoading={createMutation.isPending}
          onClick={() => {
            createMutation.mutate();
          }}
        >
          {createMutation.isPending ? (
            <Trans>Confirming...</Trans>
          ) : (
            <Trans>Confirm</Trans>
          )}
        </Button>
      </Box>
    </Dialog>
  );
}
