import { Box, Button, HoverOpacity, useTheme } from '@dodoex/components';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ExecutionContext,
  useExecution,
  ExecutionProps,
} from '../../hooks/Submission';
import Dialog from '../Swap/components/Dialog';
import { ReactComponent as Loading } from '../../assets/approveBorderRight.svg';
import { t, Trans } from '@lingui/macro';
import {
  ArrowTopRightBorder,
  DoneBorder,
  ErrorWarn,
  Error,
  ArrowSubmit,
} from '@dodoex/icons';
import { Showing } from '../../hooks/Submission/types';
import { useWeb3React } from '@web3-react/core';
import { scanUrlDomainMap } from '../../constants/chains';
import { ChainId } from '@dodoex/api';
import { useUserOptions } from '../UserOptionsProvider';
import { useWidgetDevice } from '../../hooks/style/useWidgetDevice';
import { ContractStatus, setContractStatus } from '../../hooks/useGlobalState';
import SubmittedDialog from '../SubmittedDialog';

const strokeWidth = 6;

function LoadingIcon() {
  const theme = useTheme();
  return (
    <Box
      sx={{
        mx: 'auto',
        border: `${strokeWidth}px solid ${theme.palette?.background.input}`,
        borderRadius: '50%',
        width: '64px',
        height: '64px',
        position: 'relative',
        animation: 'loadingRotate 1.1s infinite linear',
        '@keyframes loadingRotate': {
          '0%': {
            transform: 'rotate(0deg)',
          },
          '100%': {
            transform: 'rotate(359deg)',
          },
        },
      }}
    >
      <Box
        component={Loading}
        sx={{
          position: 'absolute',
          top: `-${strokeWidth}px`,
          right: `-${strokeWidth}px`,
          color: 'primary.main',
        }}
      />
    </Box>
  );
}

function ExecuteIcon({
  showingDone,
  errorMessage,
}: {
  showingDone: boolean;
  errorMessage?: string | null;
}) {
  const theme = useTheme();
  if (errorMessage) {
    return (
      <Box
        component={ErrorWarn}
        sx={{
          width: 64,
          height: 64,
          color: 'error.main',
        }}
      />
    );
  }
  if (showingDone) {
    return (
      <Box
        component={DoneBorder}
        sx={{
          width: 64,
          height: 64,
          color: 'success.main',
        }}
      />
    );
  }

  return <LoadingIcon />;
}

function ExecutionInfo({
  showingDone,
  showing,
}: {
  showingDone: boolean;
  showing?: Showing | null;
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          mt: 60,
        }}
      >
        {showingDone
          ? t`${showing?.brief} confirmed`
          : t`${showing?.brief} pending`}
      </Box>
      {showing?.subtitle ? (
        <Box
          sx={{
            mt: 20,
            typography: 'body2',
          }}
        >
          {showing?.subtitle}
        </Box>
      ) : (
        ''
      )}
    </Box>
  );
}

function TransactionTime({
  isStarted,
  isEnded,
  tx,
}: {
  isStarted: boolean;
  isEnded: boolean;
  tx: string;
}) {
  const [time, setTime] = useState(0);
  const { chainId } = useWeb3React();

  const scanUrl = useMemo(() => {
    const domain = scanUrlDomainMap[(chainId as ChainId) || 1];
    return `https://${domain}/tx/${tx}`;
  }, [tx, chainId]);

  const timeText = useMemo(() => {
    const min = Math.floor(time / 60);
    const sec = time % 60;
    if (min) {
      return `${min}m ${sec}s`;
    }
    return `${sec}s`;
  }, [time]);
  const t = useRef<number>();
  useEffect(() => {
    if (isStarted) {
      setTime(0);
      window.clearInterval(t.current);
      t.current = window.setInterval(() => {
        setTime((i) => i + 1);
      }, 1000);
    }
    return () => {
      window.clearInterval(t.current);
    };
  }, [isStarted]);

  useEffect(() => {
    if (isEnded) {
      window.clearInterval(t.current);
    }
  }, [isEnded]);

  return (
    <Box
      sx={{
        mt: 20,
        pt: 20,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        typography: 'body2',
        color: 'text.secondary',
        border: 'solid 1px transparent',
        borderTopColor: 'border.main',
      }}
    >
      <Box>
        <Trans>Transaction Time:</Trans>
        {timeText}
      </Box>
      <HoverOpacity
        sx={{
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
        }}
        component="a"
        // @ts-ignore
        href={scanUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Trans>Tx</Trans>
        <Box
          component={ArrowTopRightBorder}
          sx={{
            width: 16,
            height: 16,
            ml: 6,
          }}
        />
      </HoverOpacity>
    </Box>
  );
}

export default function WithExecutionDialog({
  children,
  executionStatus,
  showSubmitLoadingDialog,
  executionDialogExtra,
  ...props
}: {
  children: React.ReactNode;
  executionDialogExtra?: React.FunctionComponent;
} & ExecutionProps) {
  const execution = useExecution(props);
  const {
    ctxVal,
    showing,
    closeShowing,
    setShowing,
    showingDone,
    errorMessage,
    transactionTx,
  } = {
    ...execution,
    ...executionStatus,
  };
  const { isMobile } = useWidgetDevice();

  const { noSubmissionDialog, showSubmissionSubmittedDialog } =
    useUserOptions();

  const handleCloseSubmitLoadingDialog = () => {
    setShowing((prev) => {
      if (!prev) return prev;
      const newShowing = { ...prev };
      delete newShowing.submitState;
      return newShowing;
    });
  };

  return (
    <ExecutionContext.Provider value={ctxVal}>
      {children}
      {showSubmitLoadingDialog && (
        <Dialog
          modal
          open={!!showing?.submitState}
          onClose={handleCloseSubmitLoadingDialog}
        >
          {!!showing && (
            <Box
              sx={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 20,
                p: 20,
                minHeight: 208,
                width: isMobile ? '100%' : 340,
                textAlign: 'center',
              }}
            >
              <Box
                sx={{
                  textAlign: 'center',
                  color: 'text.secondary',
                }}
              >
                {showing.brief}
                <Box
                  component={Error}
                  sx={{
                    position: 'absolute',
                    top: 20,
                    right: 20,
                    color: 'text.secondary',
                    cursor: 'pointer',
                  }}
                  onClick={handleCloseSubmitLoadingDialog}
                />
              </Box>
              {showing.submitState === 'submitted' ? (
                <>
                  <Box
                    component={ArrowSubmit}
                    sx={{
                      width: 64,
                      height: 64,
                    }}
                  />
                  <div>
                    <div>{t`${showing.brief} Submitted`}</div>
                    {showing.subtitle && (
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          mt: 8,
                          color: 'text.secondary',
                          typography: 'body2',
                        }}
                      >
                        {showing.subtitle}
                      </Box>
                    )}
                  </div>
                  
                  {!!executionDialogExtra ? executionDialogExtra : <Button
                    variant={Button.Variant.outlined}
                    fullWidth
                    onClick={handleCloseSubmitLoadingDialog}
                    sx={{
                      mt: 4,
                    }}
                  >
                    <Trans>OK</Trans>
                  </Button>}
                  
                </>
              ) : (
                <>
                  <LoadingIcon />
                  <div>
                    <Box>
                      <Trans>Please confirm in wallet</Trans>
                    </Box>
                    {showing.subtitle && (
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          mt: 8,
                          color: 'text.secondary',
                          typography: 'body2',
                        }}
                      >
                        {showing.subtitle}
                      </Box>
                    )}
                  </div>
                </>
              )}
            </Box>
          )}
        </Dialog>
      )}

      <SubmittedDialog
        brief={showing?.brief}
        open={
          !!showSubmissionSubmittedDialog &&
          showing?.submitState === 'submitted'
        }
        onClose={closeShowing}
      />

      {/* widget dialog */}
      <Dialog
        open={
          !!showing && showing.submitState !== 'loading' && !noSubmissionDialog
        }
        onClose={closeShowing}
        id="submission"
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            px: 20,
            pb: 20,
            flex: 1,
            overflowY: 'auto',
          }}
        >
          <Box>
            <Box
              sx={{
                textAlign: 'center',
                pt: 60,
              }}
            >
              <ExecuteIcon
                showingDone={showingDone}
                errorMessage={errorMessage}
              />
            </Box>
            {errorMessage ? (
              <Box
                sx={{
                  textAlign: 'center',
                  mt: 60,
                }}
              >
                <Box>
                  <Trans>Something went wrong.</Trans>
                </Box>
                <Box
                  sx={{
                    color: 'text.secondary',
                    mt: 12,
                    typography: 'body2',
                    wordBreak: 'break-all',
                  }}
                >
                  {errorMessage}
                </Box>
              </Box>
            ) : (
              <>
                <ExecutionInfo showingDone={showingDone} showing={showing} />
                <TransactionTime
                  isStarted={!!showing}
                  isEnded={showingDone}
                  tx={transactionTx}
                />
              </>
            )}
          </Box>
          <Button
            fullWidth
            size={Button.Size.big}
            onClick={() => {
              setContractStatus(ContractStatus.Initial);
              closeShowing();
            }}
            sx={{
              mt: 20,
            }}
          >
            {errorMessage ? <Trans>Dismiss</Trans> : <Trans>Close</Trans>}
          </Button>
        </Box>
      </Dialog>
    </ExecutionContext.Provider>
  );
}
