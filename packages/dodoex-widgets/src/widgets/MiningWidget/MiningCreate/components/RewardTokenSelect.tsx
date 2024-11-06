import { alpha, Box, BoxProps, ButtonBase, useTheme } from '@dodoex/components';
import { t } from '@lingui/macro';
import TokenLogo from '../../../../components/TokenLogo';
import { TokenInfo } from '../../../../hooks/Token';
import { ApprovalState } from '../../../../hooks/Token/type';
import { useGetTokenStatus } from '../../../../hooks/Token/useGetTokenStatus';
import { RewardStatus } from '../types';
import { ReactComponent as LoadingIcon } from './loading.svg';
import { ReactComponent as LockIcon } from './lock_black_18dp.svg';
import { ReactComponent as RestartIcon } from './restart.svg';

function DownIcon() {
  return (
    <svg width="18" height="19" viewBox="0 0 18 19" fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.58398 12.876C6.78189 13.1728 7.21811 13.1728 7.41603 12.876L10.4818 8.27735C10.7033 7.94507 10.4651 7.5 10.0657 7.5H3.93426C3.53491 7.5 3.29672 7.94507 3.51823 8.27735L6.58398 12.876Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function RewardTokenSelect({
  token,
  onClick,
  rewardStatus,
  submitApprove,
}: {
  token: TokenInfo | undefined;
  onClick: () => void;
  rewardStatus: RewardStatus | undefined;
  submitApprove: ReturnType<typeof useGetTokenStatus>['submitApprove'];
}) {
  const theme = useTheme();

  const commonStyles: BoxProps['sx'] = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    typography: 'h5',
    color: theme.palette.text.primary,
    fontWeight: 600,

    '&:hover': {
      color: theme.palette.text.secondary,
    },
  };

  if (!token) {
    return (
      <Box
        component={ButtonBase}
        sx={{
          ...commonStyles,
          width: '100%',
        }}
        onClick={onClick}
      >
        {t`SELECT`}
        <DownIcon />
      </Box>
    );
  }

  const isInsufficient =
    rewardStatus?.state === ApprovalState.Approving ||
    rewardStatus?.state === ApprovalState.Loading ||
    rewardStatus?.state === ApprovalState.Insufficient;
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        component={ButtonBase}
        sx={{
          ...commonStyles,
        }}
        onClick={onClick}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: isInsufficient ? 0.3 : 1,
            gap: 4,
          }}
        >
          <TokenLogo
            address={token.address}
            width={24}
            height={24}
            chainId={token.chainId}
            url={token.logoURI}
            noShowChain
            marginRight={0}
          />
          {token.symbol}
        </Box>

        <DownIcon />
      </Box>

      {rewardStatus && rewardStatus.state && (
        <>
          {isInsufficient && (
            <Box
              sx={{
                mx: 8,
                width: '1px',
                height: '20px',
                backgroundColor: theme.palette.border.main,
              }}
            />
          )}

          {rewardStatus.state === ApprovalState.Insufficient && (
            <Box
              component={ButtonBase}
              sx={{
                color: theme.palette.primary.main,
                width: 24,
                height: 24,
                '&:hover': {
                  color: alpha(theme.palette.primary.main, 0.5),
                },
              }}
              onClick={() => {
                submitApprove(token, rewardStatus.pendingReset);
              }}
            >
              {rewardStatus.pendingReset ? <RestartIcon /> : <LockIcon />}
            </Box>
          )}

          {(rewardStatus.state === ApprovalState.Approving ||
            rewardStatus.state === ApprovalState.Loading) && <LoadingIcon />}
        </>
      )}
    </Box>
  );
}
