import { Box, useTheme } from '@dodoex/components';
import { t, Trans } from '@lingui/macro';
import React, { useRef, useState } from 'react';
import { useRouterStore } from '../../../router';
import { PageType } from '../../../router/types';
import WidgetContainer from '../../../components/WidgetContainer';
import { useWidgetDevice } from '../../../hooks/style/useWidgetDevice';
import PriceSettings from './components/PriceSettings';
import TimeSettings from './components/TimeSettings';
import OptionalSettings from './components/OptionalSettings';
import IntroSettings from './components/IntroSettings';
import { StepStatus, Types } from './reducers';
import { useCreateCrowdpoolingState } from './hooks/useCreateCrowdpoolingState';
import { useCreateCrodpooling } from './hooks/useCreateCrowdpooling';
import ConfirmDialog from './components/ConfirmDialog';
import GoBack from '../../../components/GoBack';
import { Done } from '@dodoex/icons';

export default function CrowdpoolingCreate() {
  const { isMobile } = useWidgetDevice();
  const theme = useTheme();
  const router = useRouterStore();
  const { state, dispatch } = useCreateCrowdpoolingState();
  const { curStep } = state;
  const stepsScrollRef = useRef<HTMLDivElement>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const mutationCreate = useCreateCrodpooling({
    state,
    submittedBack: () => {
      setShowConfirmDialog(false);
    },
  });

  const handleConfirmSubmit = () => {
    setShowConfirmDialog(true);
  };

  const handleCreate = () => {
    mutationCreate.mutate();
  };

  const handleCloseDialog = () => {
    setShowConfirmDialog(false);
  };

  const handleGoBack = () => {
    router.push({
      type: PageType.CrowdpoolingList,
    });
  };

  const handleStepClick = (step: StepStatus) => {
    if (curStep === StepStatus.OptionalSettings) return;
    dispatch({ type: Types.UpdateCurStep, payload: step });
    if (isMobile) {
      stepsScrollRef.current
        ?.querySelector(`.cp-step-${step}`)
        ?.scrollIntoView({
          behavior: 'smooth',
          inline: 'start',
        });
    }
  };

  const stepItems: {
    step: StepStatus;
    name: string;
  }[] = [
    { step: StepStatus.PriceSettings, name: t`Set Price` },
    { step: StepStatus.TimeSettings, name: t`Set Time` },
    { step: StepStatus.OptionalSettings, name: t`Optional` },
  ];

  const getStepStatus = (step: StepStatus) => {
    if (step === curStep) return 'active';
    if (step < curStep) return 'completed';
    return 'pending';
  };

  return (
    <WidgetContainer
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
        }}
      >
        {/* Header with Go Back */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            [theme.breakpoints.down('tablet')]: {
              pt: 28,
              px: 16,
            },
          }}
        >
          <GoBack onClick={() => handleGoBack()} />
          <Box
            sx={{
              typography: isMobile ? 'h3' : 'h2',
              fontWeight: 600,
            }}
          >
            <Trans>Launch Campaign</Trans>
          </Box>
        </Box>

        {/* Steps Navigation */}
        <Box
          sx={{
            backgroundColor: theme.palette.background.paperDarkContrast,
            mt: 28,
            pt: 28,
            pb: isMobile ? 20 : 28,
            px: isMobile ? 20 : 0,
            overflowX: 'auto',
            [theme.breakpoints.up('tablet')]: {
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
            },
          }}
          ref={stepsScrollRef}
        >
          <Box
            sx={{
              display: 'flex',
              gap: isMobile ? 0 : 200,
              alignItems: 'center',
              justifyContent: 'center',
              width: 'max-content',
              mx: 'auto',
            }}
          >
            {stepItems.map((item, index) => {
              const status = getStepStatus(item.step);
              const isActive = status === 'active';
              let isCompleted = status === 'completed';
              if (item.step === StepStatus.OptionalSettings && isCompleted && !mutationCreate.isSuccess) {
                isCompleted = false;
              }
              const isNotFirst = index !== 0;
              const canBack = isCompleted && curStep < StepStatus.IntroSettings;

              return (
                <Box
                  key={item.step}
                  className={`cp-step-${item.step}`}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    pb: 30,
                    position: 'relative',
                    cursor: canBack ? 'pointer' : undefined,
                    [theme.breakpoints.down('tablet')]: {
                      px: 40,
                    },
                  }}
                  onClick={() => {
                    if (canBack) {
                      handleStepClick(item.step);
                    }
                  }}
                >
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      backgroundColor: isActive
                        ? theme.palette.secondary.main
                        : isCompleted
                          ? 'transparent'
                          : 'background.paperDarkContrast',
                      border: isCompleted
                        ? `solid 2px ${theme.palette.primary.main}`
                        : undefined,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      ...(isNotFirst && {
                        ['&::before']: {
                          content: '""',
                          display: 'block',
                          width: isMobile ? 80 : 200,
                          height: '1px',
                          backgroundColor: theme.palette.border.main,
                          position: 'absolute',
                          left: 0,
                          transform: 'translateX(-100%)',
                        },
                      }),
                    }}
                  >
                    {isCompleted ? (
                      <Box
                        component={Done}
                        sx={{
                          width: 16,
                          height: 16,
                          color: theme.palette.primary.main,
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          fontWeight: 600,
                          color: isActive
                            ? theme.palette.secondary.contrastText
                            : 'text.primary',
                        }}
                      >
                        {index + 1}
                      </Box>
                    )}
                  </Box>
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      color:
                        isActive || isCompleted
                          ? 'primary.main'
                          : 'text.primary',
                      textAlign: 'center',
                      minWidth: 80,
                    }}
                  >
                    {item.name}
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>

        {/* Step Content */}
        <Box
          sx={{
            flex: isMobile ? 1 : undefined,
            backgroundColor: 'background.paper',
            px: isMobile ? 16 : 0,
            pb: isMobile ? 0 : 40,
            display: 'flex',
            justifyContent: isMobile ? undefined : 'center',
            flexDirection: 'column',
            borderRadius: theme.spacing(0, 0, 24, 24),
          }}
        >
          <Box
            sx={{
              flex: isMobile ? 1 : undefined,
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {curStep === StepStatus.PriceSettings && (
              <PriceSettings
                state={state}
                dispatch={dispatch}
                onChangeStep={handleStepClick}
              />
            )}
            {curStep === StepStatus.TimeSettings && (
              <TimeSettings
                state={state}
                dispatch={dispatch}
                onChangeStep={handleStepClick}
              />
            )}
            {curStep === StepStatus.OptionalSettings && (
              <OptionalSettings
                state={state}
                dispatch={dispatch}
                onChangeStep={handleStepClick}
                onConfirmSubmit={handleConfirmSubmit}
              />
            )}
            {curStep === StepStatus.IntroSettings && (
              <IntroSettings
                state={state}
                dispatch={dispatch}
                onChangeStep={handleStepClick}
                mutationCreate={mutationCreate}
              />
            )}
          </Box>
        </Box>

        {/* Confirm Dialog */}
        <ConfirmDialog
          open={showConfirmDialog}
          onClose={handleCloseDialog}
          onConfirm={handleCreate}
          state={state}
          isSubmitting={mutationCreate.isPending}
          showProjectInfo={false}
        />
      </Box>
    </WidgetContainer>
  );
}
