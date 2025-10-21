import { ChainId } from '@dodoex/api';
import { Box, Button, HoverOpacity, useTheme } from '@dodoex/components';
import {
  ArrowSubmit,
  ArrowTopRightBorder,
  DoneBorder,
  Error,
  ErrorWarn,
} from '@dodoex/icons';
import { t, Trans } from '@lingui/macro';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ReactComponent as Loading } from '../../assets/approveBorderRight.svg';
import { useWalletInfo } from '../../hooks/ConnectWallet/useWalletInfo';
import { useWidgetDevice } from '../../hooks/style/useWidgetDevice';
import {
  ExecutionContext,
  ExecutionProps,
  useExecution,
} from '../../hooks/Submission';
import { Showing } from '../../hooks/Submission/types';
import {
  ContractStatus,
  increaseCrossChainSubmittedCounter,
  setContractStatus,
} from '../../hooks/useGlobalState';
import { getEtherscanPage } from '../../utils/address';
import { CROSS_CHAIN_TEXT } from '../../utils/constants';
import Dialog from '../Swap/components/Dialog';
import { useUserOptions } from '../UserOptionsProvider';

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
          ? showing?.brief === CROSS_CHAIN_TEXT
            ? t`${showing?.brief} Submitted`
            : t`${showing?.brief} confirmed`
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
  currentRequestChainId,
}: {
  isStarted: boolean;
  isEnded: boolean;
  tx: string;
  currentRequestChainId: number;
}) {
  const [time, setTime] = useState(0);
  const { chainId } = useWalletInfo();

  const scanUrl = useMemo(() => {
    return getEtherscanPage(
      (currentRequestChainId as ChainId) || (chainId as ChainId) || 1,
      tx,
      'tx',
    );
  }, [currentRequestChainId, chainId, tx]);

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
  ...props
}: {
  children: React.ReactNode;
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
    requests,
  } = {
    ...execution,
    ...executionStatus,
  };
  const { isMobile } = useWidgetDevice();

  const { noSubmissionDialog, submissionDialogModal } = useUserOptions();

  const handleCloseSubmitLoadingDialog = () => {
    setShowing((prev) => {
      if (!prev) return prev;
      const newShowing = { ...prev };
      delete newShowing.submitState;
      return newShowing;
    });
  };

  const isCrossChainShowingDone =
    showingDone && showing?.brief === CROSS_CHAIN_TEXT && !errorMessage;

  const currentRequestChainId = requests?.get(transactionTx)?.[0].metadata
    ?.chainId as number;

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
                  <Button
                    variant={Button.Variant.outlined}
                    fullWidth
                    onClick={handleCloseSubmitLoadingDialog}
                    sx={{
                      mt: 4,
                    }}
                  >
                    <Trans>OK</Trans>
                  </Button>
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

      {/* widget dialog */}
      <Dialog
        open={
          !!showing && showing.submitState !== 'loading' && !noSubmissionDialog
        }
        onClose={closeShowing}
        id="submission"
        modal={isMobile ? true : submissionDialogModal}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            px: 20,
            pb: 20,
            flex: 1,
            overflowY: 'auto',
            width: isMobile
              ? undefined
              : submissionDialogModal
                ? 340
                : undefined,
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
                  currentRequestChainId={currentRequestChainId}
                />
              </>
            )}
          </Box>

          {isCrossChainShowingDone && (
            <Button
              variant={Button.Variant.outlined}
              fullWidth
              size={Button.Size.big}
              onClick={() => {
                setContractStatus(ContractStatus.Initial);
                closeShowing();
                increaseCrossChainSubmittedCounter();
              }}
              sx={{
                mt: isMobile ? 20 : 'auto',
              }}
            >
              Check in order list
            </Button>
          )}

          <Button
            fullWidth
            size={Button.Size.big}
            onClick={() => {
              setContractStatus(ContractStatus.Initial);
              closeShowing();
            }}
            sx={{
              mt: isCrossChainShowingDone ? 12 : isMobile ? 20 : 'auto',
            }}
          >
            {errorMessage ? <Trans>Dismiss</Trans> : <Trans>Close</Trans>}
          </Button>
        </Box>
      </Dialog>
    </ExecutionContext.Provider>
  );
}
