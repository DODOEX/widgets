import { Box, Button, Checkbox, useTheme } from '@dodoex/components';
import { t, Trans } from '@lingui/macro';
import dayjs from 'dayjs';
import { Dispatch, useMemo, useState } from 'react';
import WidgetDialog from '../../../../components/WidgetDialog';
import { useWalletInfo } from '../../../../hooks/ConnectWallet/useWalletInfo';
import { useWidgetDevice } from '../../../../hooks/style/useWidgetDevice';
import { ApprovalState } from '../../../../hooks/Token/type';
import { useGetTokenStatus } from '../../../../hooks/Token/useGetTokenStatus';
import { Actions, StateProps, TokenType, Types } from '../hooks/reducers';
import { RewardStatus } from '../types';
import { isValidRewardInfo } from '../utils';
import { ReactComponent as AlertIcon } from './alarm_24dp.svg';

export function BottomButtonGroup({
  state,
  dispatch,
  rewardsStatus,
  submitApprove,
  handleCreate,
  handleGoBack,
}: {
  state: StateProps;
  dispatch: Dispatch<Actions>;
  rewardsStatus: RewardStatus[];
  submitApprove: ReturnType<typeof useGetTokenStatus>['submitApprove'];
  handleCreate: () => void;
  handleGoBack: () => void;
}) {
  const { currentStep, tokenType, saveAToken, pool, rewards } = state;

  const theme = useTheme();
  const { isMobile } = useWidgetDevice();
  const { account, chainId } = useWalletInfo();

  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [confirmChecked, setConfirmChecked] = useState(false);

  const nextButton = useMemo(() => {
    const isLpToken = tokenType === TokenType.LP;
    const isSingle = tokenType === TokenType.SINGLE;

    const disabledButton = (
      <Button variant={Button.Variant.contained} fullWidth disabled>
        {t`Next`}
      </Button>
    );

    if (!account) {
      return (
        <Button variant={Button.Variant.contained} fullWidth disabled>
          <Trans>Connect to a wallet</Trans>
        </Button>
      );
    }

    if (currentStep === 0) {
      return (
        <Button
          variant={Button.Variant.contained}
          fullWidth
          onClick={() => {
            dispatch({
              type: Types.SetCurrentStep,
              payload: 1,
            });
          }}
        >
          {t`Next`}
        </Button>
      );
    }

    if (currentStep === 1) {
      if (isSingle && !saveAToken) {
        return disabledButton;
      }

      if (isLpToken && !pool) {
        return disabledButton;
      }

      return (
        <Button
          variant={Button.Variant.contained}
          fullWidth
          onClick={() => {
            dispatch({
              type: Types.SetCurrentStep,
              payload: 2,
            });
          }}
        >
          {t`Next`}
        </Button>
      );
    }

    if (currentStep === 2) {
      const now = dayjs().valueOf();

      const rewardDisabled = rewards.some((reward) => {
        const { isInvalid } = isValidRewardInfo({
          reward,
          now,
        });
        return isInvalid;
      });

      if (rewardDisabled) {
        return disabledButton;
      }

      const insufficientRewardTokenIndex = rewardsStatus.findIndex(
        (item) => item.state !== ApprovalState.Sufficient,
      );

      if (insufficientRewardTokenIndex >= 0) {
        const { state: rewardState, pendingReset } =
          rewardsStatus[insufficientRewardTokenIndex];
        const insufficientRewardToken = rewards[insufficientRewardTokenIndex];
        if (
          rewardState === ApprovalState.Unchecked ||
          !insufficientRewardToken?.total
        ) {
          // 余额不足
          return disabledButton;
        }

        if (rewardState === ApprovalState.Approving) {
          return (
            <Button variant={Button.Variant.contained} fullWidth disabled>
              {t`${insufficientRewardToken?.token?.symbol}  Approval Pending`}
            </Button>
          );
        }

        if (rewardState === ApprovalState.Insufficient) {
          return (
            <Button
              variant={Button.Variant.contained}
              fullWidth
              onClick={() => {
                submitApprove(
                  insufficientRewardToken?.token ?? null,
                  pendingReset,
                );
              }}
            >
              {t`Approve ${insufficientRewardToken?.token?.symbol}`}
            </Button>
          );
        }

        return disabledButton;
      }

      return (
        <Button
          variant={Button.Variant.contained}
          fullWidth
          onClick={() => {
            if (isMobile) {
              dispatch({
                type: Types.SetCurrentStep,
                payload: 3,
              });
              return;
            }
            setConfirmModalVisible(true);
          }}
        >
          {isMobile ? t`Next` : t`Create`}
        </Button>
      );
    }

    return (
      <Button
        variant={Button.Variant.contained}
        fullWidth
        onClick={handleCreate}
      >
        {t`Create`}
      </Button>
    );
  }, [
    account,
    currentStep,
    dispatch,
    handleCreate,
    isMobile,
    pool,
    rewards,
    rewardsStatus,
    saveAToken,
    submitApprove,
    tokenType,
  ]);

  return (
    <>
      <Box
        sx={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: theme.palette.background.paperContrast,
          px: 20,
          py: 20,
          [theme.breakpoints.up('tablet')]: {
            position: 'static',
            backgroundColor: 'transparent',
            pt: 20,
            pb: 0,
          },
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        {currentStep === 0 && isMobile && (
          <Button
            variant={Button.Variant.second}
            fullWidth
            onClick={() => {
              handleGoBack();
            }}
          >
            {t`Cancel`}
          </Button>
        )}

        {(currentStep === 1 || currentStep === 2 || currentStep === 3) && (
          <Button
            variant={Button.Variant.second}
            fullWidth
            onClick={() => {
              dispatch({
                type: Types.SetCurrentStep,
                payload: (currentStep - 1) as 0 | 1 | 2,
              });
            }}
          >
            {t`Back`}
          </Button>
        )}

        {nextButton}
      </Box>

      <WidgetDialog
        open={confirmModalVisible}
        onClose={() => {
          setConfirmModalVisible(false);
        }}
      >
        <>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Box
              component={AlertIcon}
              sx={{
                width: 40,
                height: 40,
                color: theme.palette.error.main,
              }}
            />
          </Box>

          <Box
            sx={{
              typography: 'caption',
              mt: 20,
              color: theme.palette.text.primary,
              textAlign: 'center',
            }}
          >
            {t`WARNING`}
          </Box>
          <Box
            component="ul"
            sx={{
              mt: 12,
              mx: 0,
              mb: 0,
              p: 0,
              pl: 20,
              color: theme.palette.text.secondary,
              textAlign: 'left',
            }}
          >
            <li>{t`Once Mining has started, it cannot be stopped.`}</li>
            <li>{t`If there are no participants before the end, the rewards cannot be taken out anymore.`}</li>
            <li>{t`To avoid loss of rewards, please ensure that at least 1 or more participating users exist.`}</li>
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mt: 20,
              mx: 0,
              mb: 0,
              '> span': {
                top: 0,
                width: 18,
                height: 18,
                '> span': {
                  width: 18,
                  height: 18,
                },
              },
              '>div.MuiTypography-h6': {
                ml: 8,
              },
            }}
          >
            <Checkbox
              checked={confirmChecked}
              onChange={(evt) => {
                setConfirmChecked(evt.target.checked);
              }}
            />
            <Box
              sx={{
                typography: 'h6',
                userSelect: 'none',
                color: theme.palette.text.primary,
              }}
            >
              {t`Yes, I am sure`}
            </Box>
          </Box>

          <Button
            fullWidth
            disabled={!confirmChecked}
            sx={{
              mt: 30,
            }}
            onClick={() => {
              setConfirmModalVisible(false);
              handleCreate();
            }}
          >
            {t`Create`}
          </Button>
        </>
      </WidgetDialog>
    </>
  );
}
