import { Box, Button, ButtonBase, Tooltip, useTheme } from '@dodoex/components';
import { Plus as PlusIcon } from '@dodoex/icons';
import { Trans } from '@lingui/macro';
import React from 'react';
import Dialog from '../../../../components/Dialog';
import { useUserOptions } from '../../../../components/UserOptionsProvider';
import { useWidgetDevice } from '../../../../hooks/style/useWidgetDevice';
import { useRouterStore } from '../../../../router';
import { PageType } from '../../../../router/types';
import { ReactComponent as AmmV2Icon } from '../assets/amm.svg';
import { ReactComponent as AmmV3Icon } from '../assets/amm.svg';
import { ReactComponent as PmmIcon } from '../assets/pmm.svg';

function CreateItem({
  onClick,
  title,
  desc,
  icon,
}: {
  onClick: () => void;
  title: React.ReactNode;
  desc: React.ReactNode;
  icon: React.ReactNode;
}) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        mx: 20,
        px: 0,
        py: 14,
        borderTop: `1px solid ${theme.palette.border.main}`,
        [theme.breakpoints.up('tablet')]: {
          borderTop: 'none',
          mx: 0,
          px: 16,
          py: 8,
        },
      }}
    >
      <ButtonBase
        onClick={onClick}
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          p: 0,
          borderRadius: 8,
          '&:hover': {
            backgroundColor: theme.palette.background.tag,
          },
          [theme.breakpoints.up('tablet')]: {
            p: 8,
          },
        }}
      >
        <Box
          sx={{
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 8,
            backgroundColor: '#C9EB62',
          }}
        >
          {icon}
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}
        >
          <Box
            sx={{
              typography: 'body1',
              fontWeight: 600,
              color: theme.palette.text.primary,
            }}
          >
            {title}
          </Box>
          <Box
            sx={{
              typography: 'h6',
              fontWeight: 500,
              color: theme.palette.text.secondary,
            }}
          >
            {desc}
          </Box>
        </Box>
      </ButtonBase>
    </Box>
  );
}

export interface CreatePoolBtnProps {}

export const CreatePoolBtn = (props: CreatePoolBtnProps) => {
  const theme = useTheme();
  const { isMobile } = useWidgetDevice();
  const { supportAMMV2, supportAMMV3, notSupportPMM } = useUserOptions();

  const [selectTypeModalOpen, setSelectTypeModalOpen] = React.useState(false);

  const poolTypeSupportObject = {
    [PageType.CreatePool]: !notSupportPMM,
    [PageType.createPoolAMMV2]: !!supportAMMV2,
    [PageType.createPoolAMMV3]: !!supportAMMV3,
  };
  const activePoolTypes = Object.entries(poolTypeSupportObject).filter(
    ([_, value]) => value === true,
  );
  const singleActiveCreatePoolType =
    activePoolTypes.length === 1
      ? (activePoolTypes[0][0] as PageType)
      : undefined;

  if (!singleActiveCreatePoolType) {
    const items = (
      <>
        {!notSupportPMM && (
          <CreateItem
            icon={<PmmIcon />}
            onClick={() => {
              useRouterStore.getState().push({
                type: PageType.CreatePool,
              });
            }}
            title={<Trans>PMM Pool</Trans>}
            desc={<Trans>Description of this type of pool</Trans>}
          />
        )}
        {supportAMMV2 && (
          <CreateItem
            icon={<AmmV2Icon />}
            onClick={() => {
              useRouterStore.getState().push({
                type: PageType.createPoolAMMV2,
              });
            }}
            title={<Trans>AMM V2 Position</Trans>}
            desc={<Trans>Description of this type of pool</Trans>}
          />
        )}
        {supportAMMV3 && (
          <CreateItem
            icon={<AmmV3Icon />}
            onClick={() => {
              useRouterStore.getState().push({
                type: PageType.createPoolAMMV3,
              });
            }}
            title={<Trans>AMM V3 Position</Trans>}
            desc={<Trans>Description of this type of pool</Trans>}
          />
        )}
      </>
    );
    if (isMobile) {
      return (
        <>
          <Button
            variant={Button.Variant.darken}
            fullWidth={isMobile}
            onClick={() => {
              setSelectTypeModalOpen(true);
            }}
            sx={{
              height: 40,
            }}
          >
            <Box
              component={PlusIcon}
              sx={{
                mr: 4,
              }}
            />
            <Trans>Create Pool</Trans>
          </Button>
          <Dialog
            open={selectTypeModalOpen}
            title={<Trans>Create Pool</Trans>}
            onClose={() => {
              setSelectTypeModalOpen(false);
            }}
            modal
          >
            <Box sx={{ mb: 0 }}>{items}</Box>
          </Dialog>
        </>
      );
    }
    return (
      <Tooltip
        arrow={false}
        leaveDelay={300}
        placement={isMobile ? 'bottom' : 'bottom-end'}
        sx={{
          p: 0,
          borderRadius: 16,
          backgroundColor: 'background.paper',
          boxShadow: '0px 0px 12px 0px rgba(0, 0, 0, 0.10)',
        }}
        title={<Box>{items}</Box>}
      >
        <Box
          sx={{
            width: isMobile ? '100%' : 'auto',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            pl: 8,
            pr: 16,
            py: 7,
            borderRadius: 8,
            typography: 'body1',
            fontWeight: 600,
            color: '#C9EB62',
            backgroundColor: '#123329',
            '&:hover': {
              color: '#C9EB62',
              backgroundColor: '#123329',
            },
          }}
        >
          <Box component={PlusIcon} />
          <Trans>Create Pool</Trans>
        </Box>
      </Tooltip>
    );
  }

  return (
    <Button
      variant={Button.Variant.darken}
      fullWidth={isMobile}
      onClick={() => {
        useRouterStore.getState().push({
          type: singleActiveCreatePoolType,
        });
      }}
      sx={{
        height: 40,
      }}
    >
      <Box
        component={PlusIcon}
        sx={{
          mr: 4,
        }}
      />
      <Trans>Create Pool</Trans>
    </Button>
  );
};
