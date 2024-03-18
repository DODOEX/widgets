import { Button, useTheme, Box } from '@dodoex/components';
import BigNumber from 'bignumber.js';
import { Alarm } from '@dodoex/icons';
import { TokenInfo } from '../../../hooks/Token';
import { useInflights, useSubmission } from '../../../hooks/Submission';
import { OperatePool } from './types';
import { useWalletInfo } from '../../../hooks/ConnectWallet/useWalletInfo';
import { MetadataFlag } from '../../../hooks/Submission/types';
import { t, Trans } from '@lingui/macro';
import {
  formatReadableNumber,
  formatShortNumber,
} from '../../../utils/formatter';

type InputStatus = any;

function OperateBtn({
  baseInputStatus,
  quoteInputStatus,
  pool,
  children,
}: {
  pool: OperatePool;
  baseInputStatus: InputStatus;
  quoteInputStatus: InputStatus;
  children: JSX.Element;
}) {
  const { account, chainId } = useWalletInfo();
  const { needApprove: baseApprove, needReset: baseReset } = baseInputStatus;
  const { needApprove: quoteApprove, needReset: quoteReset } = quoteInputStatus;

  const updateBalanceLoading =
    baseInputStatus.updateBalanceLoading ||
    quoteInputStatus.updateBalanceLoading;

  const { runningRequests } = useInflights();
  const isPending = runningRequests.some(
    (request) =>
      request.metadata?.[MetadataFlag.addLiquidity] ||
      request.metadata?.[MetadataFlag.removeLiquidity],
  );
  const buttons: JSX.Element[] = [];
  // if (baseReset) {
  //   buttons.push(
  //     <RestOrApproveBtn
  //       contract={contract}
  //       account={account}
  //       token={pool.baseToken}
  //       isReset
  //     />,
  //   );
  // } else if (baseApprove) {
  //   buttons.push(
  //     <RestOrApproveBtn
  //       contract={contract}
  //       account={account}
  //       token={pool.baseToken}
  //     />,
  //   );
  // }
  // if (quoteReset) {
  //   buttons.push(
  //     <RestOrApproveBtn
  //       contract={contract}
  //       account={account}
  //       token={pool.quoteToken}
  //       isReset
  //     />,
  //   );
  // } else if (quoteApprove) {
  //   buttons.push(
  //     <RestOrApproveBtn
  //       contract={contract}
  //       account={account}
  //       token={pool.quoteToken}
  //     />,
  //   );
  // }

  const len = buttons.length;
  if (len === 2) {
    return (
      <Box
        sx={{
          display: 'flex',
          '& > button': {
            flex: 1,
            '&:last-child': {
              ml: 8,
            },
          },
        }}
      >
        {buttons.map((item) => item)}
      </Box>
    );
  }
  if (len === 1) {
    return buttons[0];
  }
  if (isPending) {
    return (
      <Button fullWidth disabled isLoading>
        <Trans>Pending</Trans>
      </Button>
    );
  }
  if (updateBalanceLoading) {
    return (
      <Button fullWidth disabled isLoading>
        <Trans>Loading info...</Trans>
      </Button>
    );
  }
  return children;
}

export default function Footer({
  pool,
  onSubmit,
  lqAndDodoCompare,
  midPrice,
  isShowCompare,
  isWarnCompare,
  disabled,
  baseInputStatus,
  quoteInputStatus,
  submitBtnText,
  hasFeeTokenSymbol,
}: {
  pool?: OperatePool;
  onSubmit: () => void;
  lqAndDodoCompare: number;
  midPrice?: BigNumber;
  isShowCompare: boolean;
  isWarnCompare: boolean;
  disabled: boolean;
  baseInputStatus: InputStatus;
  quoteInputStatus: InputStatus;
  submitBtnText: string;
  hasFeeTokenSymbol: string;
}) {
  const theme = useTheme();

  const lqAndDodoCompareText = `${formatShortNumber(
    new BigNumber(lqAndDodoCompare).times(100),
  )}%`;
  const midPriceText = midPrice
    ? formatReadableNumber({ input: midPrice })
    : '';

  return (
    <Box
      sx={{
        mt: 18,
        py: 16,
        px: 20,
        position: 'sticky',
        bottom: 0,
        borderStyle: 'solid',
        borderWidth: '1px 0 0',
        borderColor: 'custom.border.default',
        [theme.breakpoints.down('tablet')]: {
          backgroundColor: 'background.paper',
        },
      }}
    >
      {isShowCompare ? (
        <Box
          sx={{
            p: 10,
            mb: 12,
            backgroundColor: 'custom.background.disabled',
            borderRadius: 12,
          }}
        >
          <Box
            sx={{
              typography: 'body2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'error.main',
              fontWeight: 600,
              mb: 10,
              textAlign: 'center',
            }}
          >
            <Box
              component={Alarm}
              sx={{
                mr: 4,
              }}
            />
            {t`${lqAndDodoCompareText} Price Difference`}
          </Box>
          <Box
            sx={{
              typography: 'h6',
              color: 'text.secondary',
              textAlign: 'center',
            }}
          >
            <Trans>Current liquidity pool token price</Trans>
            {` 1 ${pool?.baseToken.symbol} = ${midPriceText} ${
              pool?.quoteToken.symbol
            } ${t`differs from the price quoted by DODO by ${lqAndDodoCompareText}`}`}
          </Box>
        </Box>
      ) : (
        ''
      )}
      {hasFeeTokenSymbol ? (
        <Box
          sx={{
            mb: 8,
            typography: 'body2',
          }}
        >
          <Box
            component="span"
            sx={{
              color: 'text.secondary',
            }}
          >
            {t`Withdrawal fees may apply when remove ${hasFeeTokenSymbol}.` +
              ' '}
          </Box>
          <Box
            component="a"
            href="https://docs.dodoex.io/product/dodo-v1-pools#withdrawal-fees"
            target="_blank"
            sx={{
              color: 'primary.main',
              textDecoration: 'underline',
            }}
          >
            <Trans>See Details</Trans>
          </Box>
        </Box>
      ) : (
        ''
      )}
      {pool ? (
        <OperateBtn
          pool={pool}
          baseInputStatus={baseInputStatus}
          quoteInputStatus={quoteInputStatus}
        >
          <Button
            fullWidth
            disabled={disabled}
            danger={isWarnCompare}
            onClick={onSubmit}
          >
            {submitBtnText}
          </Button>
        </OperateBtn>
      ) : (
        <Button fullWidth disabled>
          {submitBtnText}
        </Button>
      )}
    </Box>
  );
}
