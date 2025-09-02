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
import {
  getUniswapV2FactoryContractAddressByChainId,
  getUniswapV2FactoryFixedFeeContractAddressByChainId,
  getUniswapV3FactoryContractAddressByChainId,
} from '@dodoex/dodo-contract-request';

function CreateItemTooltip({
  disabled,
  children,
}: {
  disabled?: boolean;
  children: any;
}) {
  if (disabled) {
    return (
      <Tooltip
        sx={{
          maxWidth: 240,
        }}
        title={
          <Trans>
            This pool type isn't supported on your current network. You can
            switch networks in your wallet to create it
          </Trans>
        }
      >
        {children}
      </Tooltip>
    );
  }
  return children;
}

function CreateItem({
  onClick,
  title,
  desc,
  disabled,
}: {
  onClick: () => void;
  title: React.ReactNode;
  desc: React.ReactNode;
  disabled?: boolean;
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
          maxWidth: 236,
          borderTop: 'none',
          mx: 0,
          px: 16,
          py: 8,
        },
      }}
    >
      <CreateItemTooltip disabled={disabled}>
        <ButtonBase
          onClick={onClick}
          disabled={disabled}
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: 0,
            p: 0,
            borderRadius: 8,
            textAlign: 'left',
            '&:not(:disabled):hover': {
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
              color: disabled
                ? theme.palette.text.disabled
                : theme.palette.text.primary,
            }}
          >
            {title}
          </Box>
          <Box
            sx={{
              typography: 'h6',
              fontWeight: 500,
              color: disabled
                ? theme.palette.text.disabled
                : theme.palette.text.secondary,
            }}
          >
            {desc}
          </Box>
        </ButtonBase>
      </CreateItemTooltip>
    </Box>
  );
}

export interface CreatePoolBtnProps {}

export const CreatePoolBtn = (props: CreatePoolBtnProps) => {
  const theme = useTheme();
  const { isMobile } = useWidgetDevice();
  const { account, chainId } = useWalletInfo();
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
                Flexible customization, take full control of liquidity
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
            disabled={
              !getUniswapV2FactoryContractAddressByChainId(chainId) &&
              !getUniswapV2FactoryFixedFeeContractAddressByChainId(chainId)
            }
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
            disabled={!getUniswapV3FactoryContractAddressByChainId(chainId)}
          />
        )}
      </>
    );
    if (isMobile) {
      return (
        <Box
          sx={{
            pt: 16,
            px: 20,
            backgroundColor: '#F4E8D0',
            '&::after': {
              content: '""',
              display: 'block',
              mt: 20,
              height: '1px',
              width: 1,
              backgroundColor: 'border.main',
            },
          }}
        >
          <Button
            variant={Button.Variant.outlined}
            fullWidth={isMobile && !!account}
            onClick={() => {
              setSelectTypeModalOpen(true);
            }}
            sx={{
              width: '100%',
              height: 40,
              backgroundColor: '#833F2D',
              color: '#FFF',
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
        </Box>
      );
    }
    return (
      <>
        <Tooltip
          arrow={false}
          leaveDelay={300}
          placement={isMobile ? 'bottom' : 'bottom-end'}
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
          title={<Box>{items}</Box>}
        >
          <Box
            sx={{
              position: 'relative',
              width: isMobile ? '100%' : 'auto',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              pl: 29,
              pr: 54,
              height: 40,
              borderRadius: theme.spacing(0, 24, 0, 0),
              typography: 'body1',
              fontWeight: 600,
              color: '#FFF',
              cursor: 'pointer',
              backgroundColor: '#833F2D',
              '&:hover': {
                color: alpha('#FFF', 0.5),
              },
            }}
          >
            <Box
              component={PoolTabRadiusIcon}
              sx={{
                position: 'absolute',
                left: 0,
                transform: 'rotateY(180deg) translateX(100%)',
                color: '#833F2D',
              }}
            />
            <Box component={PlusIcon} />
            <Trans>Create</Trans>
          </Box>
        </Tooltip>
      </>
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
