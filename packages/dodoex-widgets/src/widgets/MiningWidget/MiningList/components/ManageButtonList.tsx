import { Box, useTheme } from '@dodoex/components';
import { useLingui } from '@lingui/react';
import { generateMiningDetailUrl } from '../utils';
import { ShareModeSelect } from './ShareModeSelect';
import { OperateButton } from './widgets';

export function ManageButtonList({
  chainId,
  operating,
  stakeTokenAddress,
  miningContractAddress,
  onClick,
}: {
  chainId: number;
  operating: boolean;
  stakeTokenAddress: string | undefined;
  miningContractAddress: string | undefined;
  onClick: () => void;
}) {
  const theme = useTheme();
  const { i18n } = useLingui();

  return (
    <>
      <OperateButton operating={operating} onClick={onClick}>
        {i18n._(operating ? 'Managing' : 'Manage')}
        {operating ? '...' : null}
      </OperateButton>
      <Box
        sx={{
          width: 4,
          flexGrow: 0,
          flexShrink: 0,
        }}
      />
      <ShareModeSelect
        shareUrl={generateMiningDetailUrl({
          chainId,
          miningContractAddress,
          stakeTokenAddress,
        })}
        sx={{
          width: 40,
          minWidth: 40,
          textTransform: 'none',
          fontSize: 12,
          lineHeight: '17px',
          fontWeight: 600,
          paddingTop: 7,
          paddingRight: 0,
          paddingBottom: 8,
          paddingLeft: 0,
          flex: '1 1 auto',
          borderRadius: 8,
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.background.tag,
          '&:hover': {
            color:
              theme.palette.mode === 'light'
                ? theme.palette.text.primary
                : theme.palette.primary.contrastText,
            backgroundColor: theme.palette.secondary.main,
          },
          '&[disabled]': {
            backgroundColor: theme.palette.background.tag,
            color: theme.palette.text.disabled,
          },
        }}
      />
    </>
  );
}
