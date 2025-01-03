import { Box, Button, useTheme } from '@dodoex/components';
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
      <Button size={Button.Size.small}>
        <ShareModeSelect
          shareUrl={generateMiningDetailUrl({
            chainId,
            miningContractAddress,
            stakeTokenAddress,
          })}
          sx={{}}
        />
      </Button>
    </>
  );
}
