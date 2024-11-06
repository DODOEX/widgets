import { MiningStatusE } from '@dodoex/api';
import { Box, useTheme } from '@dodoex/components';
import { useLingui } from '@lingui/react';
import { LiquidityMigrationInfo, OperateType } from '../../types';
import { OperateButton } from './widgets';

export function OperateButtonList({
  operateType,
  onClick,
  status,
  migrationItem,
}: {
  operateType: OperateType;
  onClick: (type: OperateType) => void;
  status: MiningStatusE;
  migrationItem: LiquidityMigrationInfo | undefined;
}) {
  const { i18n } = useLingui();
  const theme = useTheme();

  const stakeOperating = operateType === 'stake';
  const unstakeOperating = operateType === 'unstake';
  const claimOperating = operateType === 'claim';
  return (
    <>
      <OperateButton
        operating={stakeOperating}
        sx={{
          [theme.breakpoints.down('tablet')]: {
            color:
              theme.palette.mode === 'light'
                ? theme.palette.text.primary
                : theme.palette.primary.contrastText,
            backgroundColor: theme.palette.secondary.main,
          },
        }}
        onClick={() => onClick('stake')}
        disabled={status === MiningStatusE.ended}
      >
        {i18n._(stakeOperating ? 'Staking' : 'Stake')}
        {stakeOperating ? '...' : null}
      </OperateButton>
      <Box
        sx={{
          width: 4,
          flexGrow: 0,
          flexShrink: 0,
        }}
      />
      <OperateButton
        operating={unstakeOperating}
        onClick={() => onClick('unstake')}
      >
        {i18n._(unstakeOperating ? 'Unstaking' : 'Unstake')}
        {unstakeOperating ? '...' : null}

        {migrationItem && null}
      </OperateButton>
      <Box
        sx={{
          width: 4,
          flexShrink: 0,
        }}
      />
      <OperateButton
        operating={claimOperating}
        onClick={() => onClick('claim')}
      >
        {i18n._(claimOperating ? 'Claiming' : 'Claim')}
        {claimOperating ? '...' : null}
      </OperateButton>
    </>
  );
}
