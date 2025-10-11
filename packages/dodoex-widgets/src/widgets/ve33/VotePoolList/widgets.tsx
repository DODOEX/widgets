import {
  Box,
  ButtonBase,
  Input,
  LoadingSkeleton,
  Select,
  Tooltip,
  useTheme,
} from '@dodoex/components';
import SimpleItemInfo from '../../../components/SimpleItemInfo';
import { t } from '@lingui/macro';
import {
  formatApy,
  formatReadableNumber,
  formatShortNumber,
  formatTokenAmountNumber,
} from '../../../utils';
import { VotePoolInfoI } from '../types';
import TokenItem from '../../../components/Token/TokenItem';
import {
  Lock,
  useFetchUserLocks,
} from '../Ve33LockList/hooks/useFetchUserLocks';
import React from 'react';
import { ArrowRight, Plus } from '@dodoex/icons';
import TokenLogo from '../../../components/TokenLogo';
import { getUnlockTimeTextShort } from '../Ve33LockOperate/utils';

export function VAPRWidgets({ item }: { item: VotePoolInfoI }) {
  const theme = useTheme();
  const aprText = item.apr ? formatApy(item.apr.fees) : undefined;

  return (
    <Tooltip
      title={
        <Box
          sx={{
            display: 'grid',
            gap: 12,
            width: 240,
            color: 'text.primary',
          }}
        >
          <SimpleItemInfo
            label={t`Fees rewards + Incentives rewards`}
          >{`$${formatReadableNumber({ input: '10000' })}`}</SimpleItemInfo>
          <SimpleItemInfo
            label={t`Rebase APR`}
          >{`${formatApy('0.0207816')}`}</SimpleItemInfo>
          <SimpleItemInfo
            label={t`Fees + Incentives APR`}
          >{`${formatApy('1.1026')}`}</SimpleItemInfo>
        </Box>
      }
    >
      <Box
        sx={{
          width: 'max-content',
          typography: 'body2',
          color: theme.palette.success.main,
        }}
      >
        {aprText}
      </Box>
    </Tooltip>
  );
}

export function IncentivesWidgets({
  item,
  showLogo,
  singleLine,
  onAddIncentives,
}: {
  item: VotePoolInfoI;
  showLogo?: boolean;
  singleLine?: boolean;
  onAddIncentives: ((item: VotePoolInfoI) => void) | undefined;
}) {
  const incentivesLen = item.incentives?.length;
  const theme = useTheme();
  return (
    <Box
      sx={{
        typography: 'body2',
        fontWeight: 600,
        display: 'flex',
        flexDirection: singleLine ? undefined : 'column',
        alignItems: 'flex-start',
        gap: 4,
      }}
    >
      {incentivesLen ? (
        <Tooltip
          title={
            <Box
              sx={{
                display: 'grid',
                gap: 20,
                width: 256,
              }}
            >
              {item.incentives.map((incentive) => {
                if (!incentive) return null;
                return (
                  <TokenItem
                    key={incentive.token}
                    chainId={item.chainId}
                    address={incentive.token}
                    showName={showLogo ? '' : incentive.token}
                    hideLogo={!showLogo}
                    size={14}
                    offset={4}
                    rightContent={incentive.amount}
                  />
                );
              })}
            </Box>
          }
        >
          <Box>
            {formatTokenAmountNumber({
              input: item.incentives[0]?.amount,
            })}
            <Box
              component="span"
              sx={{
                ml: 4,
                color: 'text.secondary',
              }}
            >
              {item.incentives[0]?.token}
            </Box>
            {incentivesLen > 1 && (
              <Box sx={{ mt: 4 }}>
                {t`and`}
                {` ${incentivesLen} `}
                <Box
                  component="span"
                  sx={{ color: 'text.secondary' }}
                >{t`Tokens`}</Box>
              </Box>
            )}
          </Box>
        </Tooltip>
      ) : (
        <ButtonBase
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            color: theme.palette.purple.main,
            '&:hover': {
              opacity: 0.5,
            },
          }}
          onClick={() => onAddIncentives?.(item)}
        >
          <svg
            width="19"
            height="18"
            viewBox="0 0 19 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.75 12.75H10.25V9.75H13.25V8.25H10.25V5.25H8.75V8.25H5.75V9.75H8.75V12.75ZM9.5 16.5C8.4625 16.5 7.4875 16.3031 6.575 15.9094C5.6625 15.5156 4.86875 14.9813 4.19375 14.3063C3.51875 13.6313 2.98438 12.8375 2.59063 11.925C2.19688 11.0125 2 10.0375 2 9C2 7.9625 2.19688 6.9875 2.59063 6.075C2.98438 5.1625 3.51875 4.36875 4.19375 3.69375C4.86875 3.01875 5.6625 2.48438 6.575 2.09063C7.4875 1.69688 8.4625 1.5 9.5 1.5C10.5375 1.5 11.5125 1.69688 12.425 2.09063C13.3375 2.48438 14.1313 3.01875 14.8063 3.69375C15.4813 4.36875 16.0156 5.1625 16.4094 6.075C16.8031 6.9875 17 7.9625 17 9C17 10.0375 16.8031 11.0125 16.4094 11.925C16.0156 12.8375 15.4813 13.6313 14.8063 14.3063C14.1313 14.9813 13.3375 15.5156 12.425 15.9094C11.5125 16.3031 10.5375 16.5 9.5 16.5ZM9.5 15C11.175 15 12.5938 14.4188 13.7563 13.2563C14.9188 12.0938 15.5 10.675 15.5 9C15.5 7.325 14.9188 5.90625 13.7563 4.74375C12.5938 3.58125 11.175 3 9.5 3C7.825 3 6.40625 3.58125 5.24375 4.74375C4.08125 5.90625 3.5 7.325 3.5 9C3.5 10.675 4.08125 12.0938 5.24375 13.2563C6.40625 14.4188 7.825 15 9.5 15Z"
              fill="currentColor"
            />
          </svg>
          {t`Add`}
        </ButtonBase>
      )}
    </Box>
  );
}

export function FeesWidgets({
  item,
  showLogo,
}: {
  item: VotePoolInfoI;
  showLogo?: boolean;
}) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 4,
      }}
    >
      <Tooltip title={formatReadableNumber({ input: item.feesToken0 })}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {showLogo && (
            <TokenLogo
              chainId={item.chainId}
              address={item.baseToken.address}
              width={16}
              height={16}
              marginRight={0}
            />
          )}
          {formatShortNumber(item.feesToken0)}
          {!showLogo && (
            <Box
              component="span"
              sx={{
                ml: 4,
                color: theme.palette.text.secondary,
              }}
            >
              {item.baseToken.symbol}
            </Box>
          )}
        </Box>
      </Tooltip>
      <Tooltip title={formatReadableNumber({ input: item.feesToken1 })}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {showLogo && (
            <TokenLogo
              chainId={item.chainId}
              address={item.quoteToken.address}
              width={16}
              height={16}
              marginRight={0}
            />
          )}
          {formatShortNumber(item.feesToken1)}
          {!showLogo && (
            <Box
              component="span"
              sx={{
                color: theme.palette.text.secondary,
              }}
            >
              {item.quoteToken.symbol}
            </Box>
          )}
        </Box>
      </Tooltip>
    </Box>
  );
}

export function TotalVoteWidgets({
  item,
  showLogo,
  singleLine,
}: {
  item: VotePoolInfoI;
  showLogo?: boolean;
  singleLine?: boolean;
}) {
  return (
    <Box
      sx={{
        typography: 'body2',
        fontWeight: 600,
        display: 'flex',
        flexDirection: singleLine ? undefined : 'column',
        alignItems: 'flex-start',
        gap: 4,
      }}
    >
      {item.votes?.map((vote) => {
        if (!vote) return null;
        return (
          <>
            {`~${vote.weight}`}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              {showLogo && <TokenLogo width={16} height={16} marginRight={0} />}
              {`${vote.token}`}
              {!showLogo && (
                <Box component="span" sx={{ color: 'text.secondary' }}>
                  veMOMO
                </Box>
              )}
            </Box>
          </>
        );
      })}
    </Box>
  );
}

export function MyVoteWidgets({
  label,
  value,
  onChange,
  onBlur,
  loading,
  veNFTAmount,
  veNFTSymbol,
}: {
  label?: string;
  value: number | undefined;
  onChange: (v: number | undefined) => void;
  onBlur?: () => void;
  loading?: boolean;
  veNFTAmount: number | string;
  veNFTSymbol: string;
}) {
  const theme = useTheme();
  const parts = [25, 50, 75, 100];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: label ? 'column-reverse' : 'column',
        gap: 4,
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            borderRadius: theme.spacing(8, 8, 0, 0),
            borderWidth: theme.spacing(1, 1, 0, 1),
          }}
        >
          {parts.map((part) => {
            return (
              <ButtonBase
                key={part}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 20,
                  typography: 'h6',
                  color: 'text.secondary',
                  '&:not(:first-child)': {
                    borderWidth: theme.spacing(0, 0, 0, 1),
                    borderStyle: 'solid',
                    borderColor: 'border.main',
                  },
                  '&:hover': {
                    color: 'text.primary',
                  },
                }}
                onClick={() => {
                  onChange(part);
                  onBlur?.();
                }}
              >
                {part}%
              </ButtonBase>
            );
          })}
        </Box>
        <Input
          height={38}
          suffix={<Box>%</Box>}
          suffixGap={12}
          placeholder="0"
          value={value ?? ''}
          type="number"
          min="0"
          max="100"
          onChange={(evt) => {
            const v = Number(evt.target.value);
            if (!v || v < 0 || v > 100) return;
            onChange(Math.floor(v));
          }}
          sx={{
            borderRadius: theme.spacing(0, 0, 8, 8),
          }}
          onBlur={onBlur}
        />
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          typography: 'h6',
          color: 'text.secondary',
        }}
      >
        <Box>{label}</Box>
        <LoadingSkeleton
          loading={loading}
          loadingProps={{
            width: 100,
          }}
          sx={{ fontWeight: 600 }}
        >{`${veNFTAmount} ${veNFTSymbol}`}</LoadingSkeleton>
      </Box>
    </Box>
  );
}

export function SelectLock({
  fullWidth,
  chainId,
  account,
  selectedLock,
  setSelectedLock,
}: {
  fullWidth?: boolean;
  chainId: number | undefined;
  account: string | undefined;
  selectedLock: Lock | null;
  setSelectedLock: (lock: Lock | null) => void;
}) {
  const theme = useTheme();
  const fetchUserLocks = useFetchUserLocks({
    account,
    chainId,
  });

  return (
    <Box
      sx={{
        width: fullWidth ? '100%' : undefined,
      }}
    >
      <Box sx={{ typography: 'h6' }}>{t`selected Lock to vote`}</Box>
      <Select
        placeholder={t`Select A Lock`}
        value={selectedLock?.tokenId ?? null}
        onChange={(_, v) =>
          setSelectedLock(
            fetchUserLocks.userLocks?.find((item) => item.tokenId === v) ||
              null,
          )
        }
        fullWidth={fullWidth}
        sx={{
          mt: 8,
          p: theme.spacing(8, 0, 8, 8),
          minHeight: 55,
          width: fullWidth ? '100%' : 289,
          backgroundColor: theme.palette.background.paperDarkContrast,
          borderRadius: 8,
          textAlign: 'left',
          '& .icon': {
            display: 'none',
          },
        }}
        listBoxSx={{
          '& li': {
            padding: theme.spacing(8),
          },
        }}
        options={fetchUserLocks.userLocks?.map((item) => ({
          key: item.tokenId,
          value: <SelectLockOption item={item} />,
        }))}
        disabled={!fetchUserLocks.userLocks?.length}
        renderValue={(option) => {
          const item = fetchUserLocks.userLocks?.find(
            (lock) => lock.tokenId === option?.value,
          );
          if (!item)
            return (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  flex: 1,
                  gap: 8,
                  width: '100%',
                }}
              >
                <Box
                  component={Plus}
                  sx={{
                    width: 28,
                    height: 28,
                  }}
                />
                <Box
                  sx={{ flex: 1, textAlign: 'left' }}
                >{t`Select A Lock`}</Box>
                <Box
                  sx={{
                    px: 12,
                    borderLeft: `solid 1px ${theme.palette.border.main}`,
                  }}
                >
                  <Box
                    component={ArrowRight}
                    sx={{
                      transform: 'rotate(90deg)',
                    }}
                  />
                </Box>
              </Box>
            );

          return (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                width: '100%',
              }}
            >
              <SelectLockOption item={item} />
              <Box
                sx={{
                  px: 12,
                  borderLeft: `solid 1px ${theme.palette.border.main}`,
                }}
              >
                <Box
                  component={ArrowRight}
                  sx={{
                    transform: 'rotate(90deg)',
                  }}
                />
              </Box>
            </Box>
          );
        }}
      />
    </Box>
  );
}

function SelectLockOption({ item }: { item: Lock }) {
  const theme = useTheme();
  const isVoted = !!item.isVoted;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        width: '100%',
      }}
      onClick={isVoted ? (evt) => evt.stopPropagation() : undefined}
    >
      <TokenLogo
        chainId={item.chainId}
        address={item.token?.address}
        sx={{
          opacity: isVoted ? 0.3 : 1,
        }}
      />
      <Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            typography: 'body2',
            fontWeight: 600,
            color: 'text.primary',
          }}
        >
          <Box sx={{ opacity: isVoted ? 0.3 : 1 }}>
            {t`Lock`}
            {` #${item.tokenId}`}
          </Box>
          {isVoted && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                p: theme.spacing(2, 6, 2, 2),
                borderRadius: 20,
                backgroundColor: theme.palette.background.paperDarkContrast,
                typography: 'h6',
                fontWeight: 600,
                color: 'text.secondary',
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.00008 12.8337C6.19314 12.8337 5.4348 12.6805 4.72508 12.3743C4.01536 12.068 3.398 11.6524 2.873 11.1274C2.348 10.6024 1.93237 9.98505 1.62612 9.27532C1.31987 8.5656 1.16675 7.80727 1.16675 7.00033C1.16675 6.19338 1.31987 5.43505 1.62612 4.72533C1.93237 4.0156 2.348 3.39824 2.873 2.87324C3.398 2.34824 4.01536 1.93262 4.72508 1.62637C5.4348 1.32012 6.19314 1.16699 7.00008 1.16699C7.63203 1.16699 8.22994 1.25935 8.79383 1.44408C9.35772 1.6288 9.87786 1.88644 10.3542 2.21699L9.50841 3.07741C9.13897 2.84408 8.74522 2.66178 8.32716 2.53053C7.90911 2.39928 7.46675 2.33366 7.00008 2.33366C5.70703 2.33366 4.60598 2.78817 3.69696 3.6972C2.78793 4.60623 2.33341 5.70727 2.33341 7.00033C2.33341 8.29338 2.78793 9.39442 3.69696 10.3034C4.60598 11.2125 5.70703 11.667 7.00008 11.667C8.29314 11.667 9.39418 11.2125 10.3032 10.3034C11.2122 9.39442 11.6667 8.29338 11.6667 7.00033C11.6667 6.82533 11.657 6.65033 11.6376 6.47533C11.6181 6.30033 11.589 6.13019 11.5501 5.96491L12.498 5.01699C12.6049 5.3281 12.6876 5.64894 12.7459 5.97949C12.8042 6.31005 12.8334 6.65033 12.8334 7.00033C12.8334 7.80727 12.6803 8.5656 12.374 9.27532C12.0678 9.98505 11.6522 10.6024 11.1272 11.1274C10.6022 11.6524 9.9848 12.068 9.27508 12.3743C8.56536 12.6805 7.80703 12.8337 7.00008 12.8337ZM6.18341 9.68366L3.70425 7.20449L4.52091 6.38783L6.18341 8.05032L12.0167 2.20241L12.8334 3.01908L6.18341 9.68366Z"
                  fill="currentColor"
                />
              </svg>
              {t`Voted`}
            </Box>
          )}
        </Box>
        <Box
          sx={{
            mt: 4,
            typography: 'h6',
            color: 'text.secondary',
            opacity: isVoted ? 0.3 : 1,
          }}
        >{`${item.value} ${item.token?.symbol} ${t`Locked Until`} ${getUnlockTimeTextShort(item.lockedEnd)}`}</Box>
      </Box>
    </Box>
  );
}
