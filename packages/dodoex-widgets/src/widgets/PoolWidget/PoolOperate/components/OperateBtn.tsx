import { Button, Box } from '@dodoex/components';
import { Trans } from '@lingui/macro';
import TokenStatusButton from '../../../../components/TokenStatusButton';
import { useInflights } from '../../../../hooks/Submission';
import { MetadataFlag } from '../../../../hooks/Submission/types';
import { useTokenStatus } from '../../../../hooks/Token/useTokenStatus';

export default function OperateBtn({
  baseTokenStatus,
  quoteTokenStatus,
  children,
}: React.PropsWithChildren<{
  baseTokenStatus: ReturnType<typeof useTokenStatus>;
  quoteTokenStatus: ReturnType<typeof useTokenStatus>;
}>) {
  const updateBalanceLoading = false;

  const { runningRequests } = useInflights();
  const isPending = runningRequests.some(
    (request) =>
      request.metadata?.[MetadataFlag.addLiquidity] ||
      request.metadata?.[MetadataFlag.removeLiquidity],
  );
  const buttons: JSX.Element[] = [];
  if (baseTokenStatus.needShowTokenStatusButton) {
    buttons.push(<TokenStatusButton status={baseTokenStatus} />);
  }
  if (quoteTokenStatus.needShowTokenStatusButton) {
    buttons.push(<TokenStatusButton status={quoteTokenStatus} />);
  }

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
  return <>{children}</>;
}
