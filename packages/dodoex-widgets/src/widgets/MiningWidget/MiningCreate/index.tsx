import { Box, useTheme } from '@dodoex/components';
import { t } from '@lingui/macro';
import { useCallback, useEffect, useMemo, useState } from 'react';
import WidgetContainer from '../../../components/WidgetContainer';
import { useWidgetDevice } from '../../../hooks/style/useWidgetDevice';
import GoBack from '../MiningList/components/GoBack';
import { ReactComponent as AlertIcon } from './alarm_24dp.svg';
import { RewardDetailList } from './components/RewardDetailList';
import { SectionTitle } from './components/SectionTitle';
import { StakingRules } from './components/StakingRules';
import { StepTitle } from './components/StepTitle';
import { TokenType, Types } from './hooks/reducers';
import { useCreateMining } from './hooks/useCreateMining';
import { useCreateMiningTypeList } from './hooks/useCreateMiningTypeList';
import { useRewardsStatus } from './hooks/useRewardsStatus';
import { BottomButtonGroup } from './operate-widgets/BottomButtonGroup';
import CreateMiningTypeSelect from './operate-widgets/CreateMiningTypeSelect';
import RewardForm from './operate-widgets/RewardForm';
import { SingleTokenSelect } from './operate-widgets/SingleTokenSelect';
import { TokenPairSelect } from './operate-widgets/TokenPairSelect';
import { DexKey, dexListObj } from './utils';

export function MiningCreate({
  handleGotoMiningList,
  handleGotoCreatePool,
  handleGoBack,
}: {
  handleGotoMiningList?: () => void;
  handleGotoCreatePool?: () => void;
  handleGoBack: () => void;
}) {
  const theme = useTheme();
  const { isMobile } = useWidgetDevice();

  const [platform, setPlatform] = useState<DexKey>('dodo');

  const { state, dispatch, createMutation, blockNumber, blockTime } =
    useCreateMining({
      submittedBack: undefined,
      handleGotoMiningList,
    });

  const { createMiningTypeMap } = useCreateMiningTypeList();
  const createMiningType = createMiningTypeMap[state.tokenType];

  useEffect(() => {
    if (state.currentStep === 3 && !isMobile) {
      dispatch({
        type: Types.SetCurrentStep,
        payload: 2,
      });
    }
  }, [dispatch, isMobile, state.currentStep]);

  const { rewardsStatus, submitApprove, getMaxBalance } = useRewardsStatus({
    rewards: state.rewards,
  });

  const activePlatform = useMemo(() => {
    if (!platform) return null;
    return dexListObj[platform];
  }, [platform]);

  const confirmCreate = useCallback(() => {
    if (state.tokenType === TokenType.LP) {
      createMutation.mutate(activePlatform?.platformID);
      return;
    }
    createMutation.mutate(undefined);
  }, [activePlatform?.platformID, createMutation, state.tokenType]);

  const settingsResultList = useMemo(() => {
    return (
      <>
        <SectionTitle
          title={t`Mining Type`}
          index={1}
          status={state.currentStep === 0 ? 'running' : 'completed'}
        />
        <Box
          sx={{
            backgroundColor: theme.palette.background.paper,
            borderRadius: 16,
            width: '50%',
            padding: 16,
            [theme.breakpoints.down('tablet')]: {
              backgroundColor: theme.palette.background.tag,
              width: '100%',
            },
          }}
        >
          <Box
            sx={{
              typography: 'h5',
              fontWeight: 600,
              color: theme.palette.text.primary,
            }}
          >
            {createMiningType.title}
          </Box>
          <Box
            sx={{
              typography: 'h6',
              fontWeight: 500,
              mt: 8,
              color: theme.palette.text.secondary,
            }}
          >
            {createMiningType.description}
          </Box>
        </Box>

        <SectionTitle
          title={t`Staking Rules`}
          index={2}
          status={
            state.currentStep === 0
              ? 'waiting'
              : state.currentStep === 1
                ? 'running'
                : 'completed'
          }
        />
        <StakingRules
          status={
            state.currentStep === 0
              ? 'waiting'
              : state.currentStep === 1
                ? 'running'
                : 'completed'
          }
          tokenType={state.tokenType}
          saveAToken={state.saveAToken}
          pool={state.pool}
        />

        <SectionTitle
          title={t`Reward Rules`}
          index={3}
          status={
            state.currentStep === 2
              ? 'running'
              : state.currentStep === 3
                ? 'completed'
                : 'waiting'
          }
        />
        <RewardDetailList
          dispatch={dispatch}
          rewards={state.rewards}
          status={
            state.currentStep === 2
              ? 'running'
              : state.currentStep === 3
                ? 'completed'
                : 'waiting'
          }
        />
      </>
    );
  }, [
    createMiningType.description,
    createMiningType.title,
    dispatch,
    state.currentStep,
    state.pool,
    state.rewards,
    state.saveAToken,
    state.tokenType,
    theme.breakpoints,
    theme.palette.background.paper,
    theme.palette.background.tag,
    theme.palette.text.primary,
    theme.palette.text.secondary,
  ]);

  const isLpToken = state.tokenType === TokenType.LP;
  const isSingle = state.tokenType === TokenType.SINGLE;

  return (
    <WidgetContainer
      sx={{
        ...(isMobile
          ? {
              p: 20,
            }
          : {
              display: 'flex',
              gap: 0,
              flex: 1,
              overflowY: 'unset',
            }),
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
          padding: 0,
          height: '100%',
          [theme.breakpoints.up('tablet')]: {
            // padding: theme.spacing(28, 40, 40),
            height: 'auto',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            height: '100%',
            [theme.breakpoints.up('tablet')]: {
              height: 'auto',
            },
          }}
        >
          {isMobile ? null : (
            <Box
              sx={{
                mr: 12,
                flexGrow: 1,
                display: 'block',
              }}
            >
              <GoBack onClick={handleGotoMiningList} />

              <Box
                sx={{
                  mt: 28,
                  typography: 'h4',
                  fontWeight: 600,
                  color: 'text.primary',
                }}
              >
                {t`Mining Pool Setup`}
              </Box>

              {settingsResultList}
            </Box>
          )}

          <Box
            sx={{
              flexGrow: 1,
              flexShrink: 0,
              flexBasis: 375,
              borderRadius: 0,
              backgroundColor: 'background.paper',
              minHeight: '100%',
              [theme.breakpoints.up('tablet')]: {
                pb: 20,
                borderRadius: 16,
                flexGrow: 0,
                minHeight: 'auto',
                height: '100%',
                position: 'sticky',
                top: '28px',
                overflowY: 'hidden',
              },
            }}
          >
            <StepTitle currentStep={state.currentStep} />

            {state.currentStep === 0 && (
              <CreateMiningTypeSelect
                tokenType={state.tokenType}
                dispatch={dispatch}
              />
            )}

            {state.currentStep === 1 && (
              <>
                {isSingle && (
                  <SingleTokenSelect state={state} dispatch={dispatch} />
                )}

                {isLpToken && (
                  <TokenPairSelect
                    state={state}
                    dispatch={dispatch}
                    platform={platform}
                    setPlatform={setPlatform}
                    activePlatform={activePlatform}
                    handleGotoCreatePool={handleGotoCreatePool}
                  />
                )}
              </>
            )}

            {state.currentStep === 2 && (
              <RewardForm
                state={state}
                dispatch={dispatch}
                dataTestIdPrefix="token_pair"
                rewardsStatus={rewardsStatus}
                submitApprove={submitApprove}
                getMaxBalance={getMaxBalance}
                blockNumber={blockNumber}
                blockTime={blockTime}
              />
            )}

            {state.currentStep === 3 && isMobile && (
              <Box
                sx={{
                  mx: 20,
                }}
              >
                {settingsResultList}

                <Box
                  sx={{
                    mt: 20,
                    pt: 8,
                    backgroundColor: theme.palette.background.tag,
                    borderRadius: 12,
                    px: 16,
                    pb: 12,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: theme.palette.error.main,
                    }}
                  >
                    <Box
                      component={AlertIcon}
                      sx={{
                        width: 24,
                        height: 24,
                      }}
                    />
                    <Box
                      sx={{
                        ml: 8,
                        typography: 'body2',
                      }}
                    >
                      {t`WARNING`}
                    </Box>
                  </Box>

                  <Box
                    component="ul"
                    sx={{
                      mt: 8,
                      mx: 0,
                      mb: 0,
                      p: 0,
                      pl: 20,
                      color: theme.palette.text.secondary,
                      textAlign: 'left',
                      typography: 'h6',
                    }}
                  >
                    <li>{t`Once Mining has started, it cannot be stopped.`}</li>
                    <li>{t`If there are no participants before the end, the rewards cannot be taken out anymore.`}</li>
                    <li>{t`To avoid loss of rewards, please ensure that at least 1 or more participating users exist.`}</li>
                  </Box>
                </Box>
              </Box>
            )}

            <Box
              sx={{
                pb: 160,
                [theme.breakpoints.up('tablet')]: {
                  pb: 0,
                },
              }}
            />
            <BottomButtonGroup
              state={state}
              dispatch={dispatch}
              rewardsStatus={rewardsStatus}
              submitApprove={submitApprove}
              createLoading={createMutation.isPending}
              handleCreate={confirmCreate}
              handleGoBack={handleGoBack}
            />
          </Box>
        </Box>
      </Box>
    </WidgetContainer>
  );
}
