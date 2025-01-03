import { basicTokenMap } from '@dodoex/api';
import { alpha, Box, Button, ButtonBase, useTheme } from '@dodoex/components';
import { t } from '@lingui/macro';
import BigNumber from 'bignumber.js';
import dayjs from 'dayjs';
import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import { DateTimePickerInput } from '../../../../components/DateTimePickerInput';
import { LoadingRotation } from '../../../../components/LoadingRotation';
import { NumberInput } from '../../../../components/Swap/components/TokenCard/NumberInput';
import { TokenPickerDialog } from '../../../../components/Swap/components/TokenCard/TokenPickerDialog';
import { useWalletInfo } from '../../../../hooks/ConnectWallet/useWalletInfo';
import { useSubmission } from '../../../../hooks/Submission';
import { ApprovalState } from '../../../../hooks/Token/type';
import { useGetTokenStatus } from '../../../../hooks/Token/useGetTokenStatus';
import { formatTokenAmountNumber } from '../../../../utils/formatter';
import { getPreBlock } from '../../hooks/utils';
import { RewardTokenSelect } from '../components/RewardTokenSelect';
import { Actions, RewardI, StateProps, Types } from '../hooks/reducers';
import { RewardStatus } from '../types';
import { computeDailyAmount, isValidRewardInfo } from '../utils';

function RewardItem({
  index,
  reward,
  blockNumber,
  blockTime,
  dispatch,
  dataTestIdPrefix,
  rewardStatus,
  submitApprove,
  getMaxBalance,
  setShowRewardPicker,
  setRewardPickerIndex,
}: {
  index: number;
  reward: RewardI;
  blockNumber: BigNumber;
  blockTime: number;
  dispatch: React.Dispatch<Actions>;
  dataTestIdPrefix: string;
  rewardStatus: RewardStatus;
  submitApprove: ReturnType<typeof useGetTokenStatus>['submitApprove'];
  getMaxBalance: ReturnType<typeof useGetTokenStatus>['getMaxBalance'];
  setShowRewardPicker: Dispatch<SetStateAction<boolean>>;
  setRewardPickerIndex: Dispatch<SetStateAction<number | undefined>>;
}) {
  const theme = useTheme();
  const submission = useSubmission();

  const [active, setActive] = useState(true);

  const now = dayjs().valueOf();
  const {
    startTimeIsError,
    endTimeIsError,
    totalIsError,
    isInvalid: addButtonDisabled,
  } = isValidRewardInfo({
    reward,
    now,
  });

  const [startBlock, endBlock] = useMemo(() => {
    if (!reward.startTime || !reward.endTime) {
      return [undefined, undefined];
    }
    const start = getPreBlock(blockTime, blockNumber, reward.startTime)
      .plus(10)
      .toNumber();
    const end = getPreBlock(blockTime, blockNumber, reward.endTime)
      .plus(10)
      .toNumber();
    return [start, end];
  }, [reward.startTime, reward.endTime, blockNumber, blockTime]);

  const isStartBlockError = useMemo(() => {
    return (
      submission.errorMessage?.startsWith(
        'Unexpected issue with estimating the gas',
      ) ?? false
    );
  }, [submission.errorMessage]);

  return (
    <Box
      key={index}
      sx={{
        mt: index === 0 ? 0 : 12,
        borderRadius: 12,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: theme.palette.border.main,
        p: 20,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            alignItems: 'flex-start',
          }}
        >
          <Box
            sx={{
              typography: 'body2',
              textAlign: 'center',
              color: theme.palette.text.secondary,
            }}
          >
            {t`Rewards`}&nbsp;{index + 1}
          </Box>
          <RewardTokenSelect
            token={reward.token}
            onClick={() => {
              setRewardPickerIndex(index);
              setShowRewardPicker(true);
            }}
            rewardStatus={rewardStatus}
            submitApprove={submitApprove}
          />
        </Box>
        <Box
          component={ButtonBase}
          onClick={() => {
            setActive(!active);
          }}
          sx={{
            color: theme.palette.text.primary,
            '&:hover': {
              color: theme.palette.text.secondary,
            },
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              width="20"
              height="20"
              rx="10"
              fill={alpha(theme.palette.text.primary, 0.06)}
            />
            {active ? (
              <path
                d="M5.33337 11.3335L6.43004 12.4302L10 8.86795L13.57 12.4302L14.6667 11.3335L10 6.66684L5.33337 11.3335Z"
                fill="currentColor"
              />
            ) : (
              <path
                d="M5.33325 8.42992L6.42992 7.33325L9.99992 10.8955L13.5699 7.33325L14.6666 8.42992L9.99992 13.0966L5.33325 8.42992Z"
                fill="currentColor"
              />
            )}
          </svg>
        </Box>
      </Box>

      {active && (
        <>
          <Box
            sx={{
              mt: 16,
              height: '1px',
              width: '100%',
              backgroundColor: theme.palette.border.main,
            }}
          />

          <Box
            sx={{
              mt: 16,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'stretch',
              gap: 12,
            }}
          >
            <Box
              data-testid={`${dataTestIdPrefix}_mining-token-reward_total-input`}
            >
              <Box
                sx={{
                  mb: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  ...(reward.token &&
                  reward.total &&
                  rewardStatus &&
                  rewardStatus.state === ApprovalState.Unchecked
                    ? {
                        '& > div': {
                          color: 'error.main',
                        },
                      }
                    : {}),
                }}
              >
                <Box
                  sx={{
                    typography: 'body2',
                    fontWeight: 600,
                  }}
                >
                  {t`Total Rewards`}
                </Box>

                <Box
                  sx={{
                    typography: 'body2',
                    display: 'flex',
                    alignItems: 'center',
                    color: 'text.secondary',
                    cursor: !reward.token ? 'default' : 'pointer',
                    '&:hover': {
                      color: 'text.primary',
                    },
                  }}
                  onClick={() => {
                    if (!reward.token) {
                      return;
                    }
                    const maxBalance = getMaxBalance(
                      reward.token,
                      rewardStatus.balance,
                    );
                    dispatch({
                      type: Types.updateReward,
                      payload: {
                        index,
                        total: maxBalance.toString(),
                      },
                    });
                  }}
                >
                  {t`Balance:`}&nbsp;
                  {!rewardStatus.balance ? (
                    <LoadingRotation />
                  ) : (
                    formatTokenAmountNumber({
                      input: rewardStatus.balance,
                      decimals: reward.token?.decimals,
                    })
                  )}
                </Box>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'stretch',
                  borderRadius: 8,
                  backgroundColor: theme.palette.background.input,
                  height: 48,
                  pl: 12,
                }}
              >
                <NumberInput
                  value={reward.total || ''}
                  onChange={(val) => {
                    dispatch({
                      type: Types.updateReward,
                      payload: {
                        index,
                        total: val,
                      },
                    });
                  }}
                  sx={{
                    pl: 0,
                    pr: 0,
                    mt: 0,
                    flex: '1 1 auto',
                  }}
                  typography="body1"
                />
              </Box>
            </Box>

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch',
                gap: 8,
              }}
            >
              <Box
                sx={{
                  typography: 'body2',
                  fontWeight: 600,
                }}
              >
                {t`Start Time`}
              </Box>
              <DateTimePickerInput
                placeholder="YYYY/MM/DD HH:MM:SS"
                valueFormat="YYYY/MM/DD HH:mm:ss"
                value={reward.startTime}
                minDate={now}
                onChange={(time: number | null) => {
                  dispatch({
                    type: Types.updateReward,
                    payload: {
                      index,
                      startTime: time,
                    },
                  });
                }}
              />
              {startTimeIsError && (
                <Box
                  className="input_error-text"
                  sx={{
                    typography: 'h6',
                    color: 'error.main',
                    mt: -4,
                  }}
                >
                  *{t`The start time cannot be in the past`}
                </Box>
              )}
              {isStartBlockError && (
                <Box
                  className="input_error-text"
                  sx={{
                    typography: 'h6',
                    color: 'error.main',
                    mt: -4,
                  }}
                >
                  *{t`The start time is too soon, please set a later time`}
                </Box>
              )}
            </Box>

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch',
                gap: 8,
              }}
            >
              <Box
                sx={{
                  typography: 'body2',
                  fontWeight: 600,
                }}
              >
                {t`End Time`}
              </Box>
              <DateTimePickerInput
                placeholder="YYYY/MM/DD HH:MM:SS"
                valueFormat="YYYY/MM/DD HH:mm:ss"
                value={reward.endTime}
                minDate={reward.startTime ? reward.startTime + 1 : now}
                onChange={(time: number | null) => {
                  dispatch({
                    type: Types.updateReward,
                    payload: {
                      index,
                      endTime: time,
                    },
                  });
                }}
              />
              {endTimeIsError && (
                <Box
                  className="input_error-text"
                  sx={{
                    typography: 'h6',
                    color: 'error.main',
                    mt: -4,
                  }}
                >
                  *{t`The end time must be later than the start time.`}
                </Box>
              )}
            </Box>

            <Box
              sx={{
                height: '1px',
                width: '100%',
                backgroundColor: theme.palette.border.main,
              }}
            />

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                typography: 'body2',
              }}
            >
              <Box
                sx={{
                  color: theme.palette.text.secondary,
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {t`Daily Rewards`}
              </Box>
              <Box
                sx={{
                  color: theme.palette.text.primary,
                  fontWeight: 600,
                }}
              >
                {formatTokenAmountNumber({
                  input: computeDailyAmount({
                    total: reward.total,
                    endTime: reward.endTime,
                    startTime: reward.startTime,
                  }),
                  decimals: reward.token?.decimals,
                })}
              </Box>
            </Box>

            <Box
              sx={{
                typography: 'h6',
                color: theme.palette.text.secondary,
                fontWeight: 500,
              }}
            >
              *&nbsp;
              {t`Expected to start at block ${
                startBlock ?? '-'
              } and end at block ${
                endBlock ?? '-'
              }. There may be slight differences between actual and expected block numbers.`}
            </Box>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              {index !== 0 && (
                <Button
                  variant={Button.Variant.second}
                  fullWidth
                  onClick={() => {
                    dispatch({
                      type: Types.removeReward,
                      payload: index,
                    });
                  }}
                >
                  {t`Delete`}
                </Button>
              )}
              <Button
                variant={Button.Variant.contained}
                fullWidth
                onClick={() => setActive(!active)}
              >
                {t`Add`}
              </Button>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
}

export default function RewardForm({
  state,
  dispatch,
  dataTestIdPrefix,
  rewardsStatus,
  blockTime,
  blockNumber,
  submitApprove,
  getMaxBalance,
}: {
  state: StateProps;
  dispatch: React.Dispatch<Actions>;
  dataTestIdPrefix: string;
  rewardsStatus: RewardStatus[];
  blockNumber: BigNumber;
  blockTime: number;
  submitApprove: ReturnType<typeof useGetTokenStatus>['submitApprove'];
  getMaxBalance: ReturnType<typeof useGetTokenStatus>['getMaxBalance'];
}) {
  const theme = useTheme();

  const { chainId } = useWalletInfo();

  const [rewardPickerIndex, setRewardPickerIndex] = useState<
    number | undefined
  >();
  const [showRewardPicker, setShowRewardPicker] = useState(false);

  const EtherToken = useMemo(() => basicTokenMap[chainId], [chainId]);
  return (
    <>
      <Box
        sx={{
          px: 20,
        }}
      >
        {state.rewards.map((reward, index) => {
          const rewardStatus = rewardsStatus[index];
          return (
            <RewardItem
              key={index}
              index={index}
              reward={reward}
              blockNumber={blockNumber}
              blockTime={blockTime}
              dispatch={dispatch}
              dataTestIdPrefix={dataTestIdPrefix}
              rewardStatus={rewardStatus}
              submitApprove={submitApprove}
              getMaxBalance={getMaxBalance}
              setShowRewardPicker={setShowRewardPicker}
              setRewardPickerIndex={setRewardPickerIndex}
            />
          );
        })}

        <Box
          sx={{
            mt: 12,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 12,
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: theme.palette.border.main,
            p: 20,
          }}
          component={ButtonBase}
          onClick={() => {
            dispatch({
              type: Types.addReward,
            });
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z"
              fill={theme.palette.text.primary}
            />
          </svg>

          <Box
            sx={{
              ml: 8,
              color: theme.palette.text.primary,
              typography: 'body2',
              fontWeight: 600,
            }}
          >
            {t`Add Token`}
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          typography: 'body2',
          mt: 12,
          mx: 20,
          pb: 8,
          color: 'text.secondary',
        }}
      >
        <Box>{t`*Deflationary tokens are not supported`}</Box>
        <Box>{t`*Depending on the block time, the real amount of Daily Rewards may deviate slightly.`}</Box>
      </Box>

      <TokenPickerDialog
        value={
          rewardPickerIndex === undefined || !state.rewards[rewardPickerIndex]
            ? undefined
            : state.rewards[rewardPickerIndex].token
        }
        open={showRewardPicker}
        chainId={chainId}
        onClose={() => setShowRewardPicker(false)}
        hiddenAddrs={[EtherToken.address]}
        onTokenChange={(token) => {
          if (Array.isArray(token)) {
            return;
          }
          if (rewardPickerIndex == null) {
            return;
          }
          dispatch({
            type: Types.updateReward,
            payload: {
              index: rewardPickerIndex,
              token,
              total: '',
            },
          });
          setShowRewardPicker(false);
        }}
        modal
      />
    </>
  );
}
