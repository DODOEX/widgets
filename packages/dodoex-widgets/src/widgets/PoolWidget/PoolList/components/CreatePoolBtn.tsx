import {
  alpha,
  Box,
  Button,
  ButtonBase,
  Tooltip,
  useTheme,
} from '@dodoex/components';
import { Plus as PlusIcon } from '@dodoex/icons';
import { t, Trans } from '@lingui/macro';
import React from 'react';
import { useUserOptions } from '../../../../components/UserOptionsProvider';
import { useWidgetDevice } from '../../../../hooks/style/useWidgetDevice';
import { useRouterStore } from '../../../../router';
import { PageType } from '../../../../router/types';
import Dialog from '../../../../components/Dialog';
import { useWalletInfo } from '../../../../hooks/ConnectWallet/useWalletInfo';

function CreateItem({
  onClick,
  title,
  desc,
}: {
  onClick: () => void;
  title: React.ReactNode;
  desc: React.ReactNode;
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
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 0,
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
      </ButtonBase>
    </Box>
  );
}

export interface CreatePoolBtnProps {}

export const CreatePoolBtn = (props: CreatePoolBtnProps) => {
  const theme = useTheme();
  const { isMobile } = useWidgetDevice();
  const { account } = useWalletInfo();
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
            onClick={() => {
              useRouterStore.getState().push({
                type: PageType.CreatePool,
              });
            }}
            title={<Trans>PMM Pool</Trans>}
            desc={
              <Trans>
                Fexible customization, take full control of liquidity
              </Trans>
            }
          />
        )}
        {supportAMMV2 && (
          <CreateItem
            onClick={() => {
              useRouterStore.getState().push({
                type: PageType.createPoolAMMV2,
              });
            }}
            title={<Trans>AMM V2 Position</Trans>}
            desc={<Trans>Simple, full-range liquidity</Trans>}
          />
        )}
        {supportAMMV3 && (
          <CreateItem
            onClick={() => {
              useRouterStore.getState().push({
                type: PageType.createPoolAMMV3,
              });
            }}
            title={<Trans>AMM V3 Position</Trans>}
            desc={<Trans>Concentrated liquidity, higher efficiency</Trans>}
          />
        )}
      </>
    );
    if (isMobile) {
      return (
        <>
          <Button
            variant={Button.Variant.outlined}
            fullWidth={isMobile && !!account}
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
          backgroundColor: 'background.paper',
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
            borderWidth: 1,
            borderColor: theme.palette.primary.main,
            typography: 'body1',
            fontWeight: 600,
            color: theme.palette.primary.main,
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
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
      variant={Button.Variant.outlined}
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
