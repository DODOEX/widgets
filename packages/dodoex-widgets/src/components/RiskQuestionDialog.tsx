import { Box, Button, Checkbox, useTheme } from '@dodoex/components';
import { t, Trans } from '@lingui/macro';
import React from 'react';
import WidgetDialog from './WidgetDialog';
import { useUserOptions } from './UserOptionsProvider';
import { RiskOncePageLocalStorageKey } from '../constants/localstorage';
import { useRiskDialogState } from '../hooks/useRiskDialogState';

export interface Question {
  desc: string;
  answers: string[];
  rightAnswerIndex: number;
}
export default function RiskQuestionDialog({
  state,
  alertContent,
  questionList,
  onConfirm: onConfirmProps,
}: {
  state: ReturnType<typeof useRiskDialogState>;
  alertContent?: React.ReactNode;
  questionList: Array<Question>;
  onConfirm?: () => void;
}) {
  const theme = useTheme();
  const [userReadAndChecked, setUserReadAndChecked] = React.useState(false);
  const title = t`Disclaimer`;
  const { documentUrls } = useUserOptions();
  const { open, onClose, onConfirm } = state;
  const [qa, setQa] = React.useState(
    Array.from({ length: questionList.length }),
  );
  const textBlockHeight = 120;

  const qaDisabled = questionList.some(
    (question, index) => qa[index] !== question.rightAnswerIndex,
  );

  return (
    <WidgetDialog open={open} onClose={onClose} title={title}>
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <Box
          sx={{
            mx: 20,
            maxHeight: textBlockHeight,
            overflowY: 'auto',
            borderWidth: 1,
            borderRadius: 10,
            borderStyle: 'solid',
            borderColor: 'border.main',
            p: theme.spacing(20),
            typography: 'body2',
            backgroundColor: theme.palette.background.input,
            color: theme.palette.text.primary,
            textAlign: 'left',
          }}
        >
          {alertContent}
        </Box>

        <Box
          sx={{
            mt: 16,
            mx: 20,
            mb: 16,
            color: theme.palette.text.secondary,
            typography: 'body2',
          }}
        >
          <Trans>
            You have to answer the following question correctly to continue
            using this feature.
          </Trans>
        </Box>

        <Box
          sx={{
            flex: 1,
            color: theme.palette.text.primary,
            typography: 'body2',
            overflow: 'auto',
            maxHeight: 200,
            pb: 10,
            mb: 10,
            px: 20,
          }}
        >
          {questionList.map((q, index) => {
            return (
              <Box
                sx={{
                  mt: 20,
                  '&:first-of-type': {
                    mt: 0,
                  },
                }}
                key={index}
              >
                <Box>
                  {index + 1}、{q.desc}
                </Box>
                {q.answers.map((a, subIndex) => {
                  const id = `risk-question-${index}${subIndex}`;
                  const answerWrong =
                    qa[index] !== undefined &&
                    qa[index] !== q.rightAnswerIndex &&
                    qa[index] === subIndex;
                  return (
                    <QuestionAnswer key={subIndex} wrong={answerWrong}>
                      <input
                        type="radio"
                        name={String(index)}
                        value={id}
                        checked={qa[index] === subIndex}
                        onChange={(evt) => {
                          setQa((prev) => {
                            const newQa = [...prev];
                            newQa.splice(
                              index,
                              1,
                              evt.target.checked ? subIndex : undefined,
                            );
                            return newQa;
                          });
                        }}
                      />
                      {a}
                    </QuestionAnswer>
                  );
                })}
              </Box>
            );
          })}
        </Box>

        <Box
          sx={{
            padding: 20,
            pt: 12,
            backgroundColor: theme.palette.background.paperContrast,
          }}
        >
          <Box
            component="label"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              typography: 'body2',
              cursor: 'pointer',
              color: 'text.secondary',
              textAlign: 'left',
              '& a': {
                fontWeight: 600,
                color: 'primary.main',
                '&:hover': {
                  textDecoration: 'underline',
                },
              },
            }}
          >
            <Checkbox
              sx={{
                top: -1,
              }}
              checked={userReadAndChecked}
              onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
                const { checked } = evt.target;
                setUserReadAndChecked(checked);
              }}
            />
            <Box>
              <Trans>
                I have read, understand, and agree to the{' '}
                <a
                  href={
                    documentUrls?.termsOfService ??
                    'https://docs.dodoex.io/home/terms-of-service'
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Terms of Service
                </a>
                .
              </Trans>
            </Box>
          </Box>

          <Box
            sx={{
              mt: 12,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Button
              sx={{}}
              disabled={!userReadAndChecked || qaDisabled}
              fullWidth
              onClick={() => {
                setUserReadAndChecked(false);
                onConfirm?.();
                onConfirmProps?.();
              }}
            >
              <Trans>Confirm</Trans>
            </Button>
          </Box>
        </Box>
      </Box>
    </WidgetDialog>
  );
}

function QuestionAnswer({
  wrong,
  children,
}: React.PropsWithChildren<{
  wrong: boolean;
}>) {
  const theme = useTheme();
  return (
    <Box
      component="label"
      sx={{
        mt: 16,
        display: 'flex',
        alignItems: 'flex-start',
        color: wrong ? theme.palette.error.main : undefined,
        cursor: 'pointer',
        '& > input': {
          display: 'inline-block',
          cursor: 'pointer',
          margin: 0,
          mt: 1,
          mr: 12,
          appearance: 'none',
          borderRadius: '50%',
          width: 20,
          heigth: 20,
          minWidth: 20,
          minHeight: 20,
          borderWidth: 1,
          borderColor: theme.palette.text.primary,
          transition: '0.2s all linear',
          verticalAlign: 'middle',

          position: 'relative',
          '&:checked': {
            borderColor: wrong
              ? theme.palette.error.main
              : theme.palette.primary.main,
            '&::after': {
              content: '""',
              width: 10,
              height: 10,
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: wrong
                ? theme.palette.error.main
                : theme.palette.primary.main,
              borderRadius: '50%',
            },
          },
          '&:focus': {
            outline: 'none',
          },
        },
      }}
    >
      {children}
    </Box>
  );
}
