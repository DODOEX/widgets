import { Box, Button, ButtonProps } from '@dodoex/components';
import { Trans } from '@lingui/macro';
import { useTokenStatus } from '../hooks/Token/useTokenStatus';

export default function TokenPairStatusButton({
  statuses,
  children,
  buttonProps,
}: React.PropsWithChildren<{
  statuses: Array<ReturnType<typeof useTokenStatus>>;
  buttonProps?: ButtonProps;
}>) {
  const needShowTokenStatusButtonStatus = statuses.find(
    (status) => status.needShowTokenStatusButton,
  );
  if (!needShowTokenStatusButtonStatus && children) return <>{children}</>;

  const insufficientBalanceStatus = statuses.find(
    (status) => status.insufficientBalance,
  );

  if (insufficientBalanceStatus) {
    return (
      <Button fullWidth disabled {...buttonProps}>
        <Trans>
          Insufficient {insufficientBalanceStatus.token?.symbol} balance
        </Trans>
      </Button>
    );
  }

  const hasApproving = statuses.some((status) => status.isApproving);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 4,
      }}
    >
      {statuses.map((status, i) => {
        let content = '' as React.ReactNode;
        if (status.isApproving) {
          content = <Trans>Approving</Trans>;
        } else if (status.needReset || status.needApprove) {
          content = status.approveTitle;
        }
        if (!content) return null;
        return (
          <Button
            key={status.token?.symbol ?? i}
            fullWidth
            isLoading={status.isApproving}
            onClick={status.submitApprove}
            disabled={status.insufficientBalance || hasApproving}
            {...buttonProps}
          >
            {content}
          </Button>
        );
      })}
    </Box>
  );
}
