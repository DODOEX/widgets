import { Button, ButtonProps } from '@dodoex/components';
import { Trans } from '@lingui/macro';
import { useTokenStatus } from '../hooks/Token/useTokenStatus';

export default function TokenStatusButton({
  status,
  children,
  buttonProps,
}: React.PropsWithChildren<{
  status: ReturnType<typeof useTokenStatus>;
  buttonProps?: ButtonProps;
}>) {
  if (!status.needShowTokenStatusButton && children) return <>{children}</>;

  if (status.insufficientBalance) {
    return (
      <Button fullWidth disabled {...buttonProps}>
        <Trans>Insufficient balance</Trans>
      </Button>
    );
  }

  return (
    <Button
      fullWidth
      isLoading={status.isApproving}
      onClick={status.submitApprove}
      disabled={status.insufficientBalance}
      {...buttonProps}
    >
      {status.isApproving ? <Trans>Approving</Trans> : status.approveTitle}
    </Button>
  );
}
