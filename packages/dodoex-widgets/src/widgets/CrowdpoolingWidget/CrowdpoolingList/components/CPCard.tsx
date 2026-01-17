import { alpha, Box, ButtonBase, useTheme } from '@dodoex/components';
import { t, Trans } from '@lingui/macro';
import { useMemo, useState } from 'react';
import BigNumber from 'bignumber.js';
import TokenLogo from '../../../../components/TokenLogo';
import { formatReadableNumber, truncatePoolAddress } from '../../../../utils';
import { Crowdpooling } from '../../types';

export interface CPCardProps {
  data: Crowdpooling;
  canFold?: boolean;
  onJoin?: (data: Crowdpooling) => void;
  onFavorite?: (data: Crowdpooling) => void;
}

export default function CPCard({
  data,
  canFold,
  onJoin,
  onFavorite,
}: CPCardProps) {
  const {
    baseToken,
    quoteToken,
    salesBase,
    price,
    hardcapPrice,
    progress,
    status,
  } = data;
  const theme = useTheme();

  // Calculate poolQuoteCap and poolQuote from existing data
  const poolQuoteCap = useMemo(() => {
    if (hardcapPrice && salesBase) {
      return hardcapPrice.multipliedBy(salesBase);
    }
    return new BigNumber(0);
  }, [hardcapPrice, salesBase]);

  const poolQuote = useMemo(() => {
    return poolQuoteCap.multipliedBy(progress).dividedBy(100);
  }, [poolQuoteCap, progress]);

  const formattedTotalBase = formatReadableNumber({
    input: salesBase || '0',
    showDecimals: 0,
  });

  const formattedPrice = formatReadableNumber({
    input: price.toFixed(),
    showDecimals: 2,
  });

  const isProcessing = status === 'processing';
  const isEnded = status === 'ended';
  const isSettling = status === 'settling';
  const isWaiting = status === 'waiting';

  const getStatusColor = () => {
    if (isProcessing || isSettling) return 'success.main';
    if (isWaiting) return 'secondary.main';
    return 'text.secondary';
  };

  const getStatusLabel = () => {
    if (isProcessing) return t`Processing`;
    if (isSettling) return t`Settling`;
    if (isEnded) return t`Ended`;
    if (isWaiting) return t`Waiting`;
    return status;
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFavorite?.(data);
  };

  const handleJoinClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onJoin?.(data);
  };

  const [fold, setFold] = useState(canFold);

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: fold ? 0 : 12,
        borderRadius: 24,
        backgroundColor: 'background.paper',
        width: '100%',
        height: 'max-content',
        cursor: 'pointer',
      }}
      onClick={handleJoinClick}
    >
      {/* Top Section - Background with Total Supply and Votes */}
      <Box
        sx={{
          position: 'relative',
          height: 173,
          display: 'flex',
          flexDirection: 'column',
          backgroundImage: `linear-gradient(102deg, rgba(254,233,79,0.2) 0%, ${alpha(theme.palette.primary.main, 0.2)} 100%)`,
          px: 20,
          py: 24,
          borderRadius: fold ? 24 : theme.spacing(24, 24, 0, 0),
        }}
      >
        {/* Token Info */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            mt: 2,
          }}
        >
          <TokenLogo token={baseToken} width={48} height={48} marginRight={0} />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            }}
          >
            <Box sx={{ typography: 'h5' }}>{baseToken?.symbol || '-'}</Box>
            <Box sx={{ typography: 'body2' }}>
              {baseToken?.address
                ? truncatePoolAddress(baseToken.address)
                : '-'}
            </Box>
          </Box>
        </Box>

        {/* Total Supply */}
        <Box
          sx={{
            mt: 16,
            typography: 'h2',
            fontWeight: 600,
            color: 'primary.main',
          }}
        >
          {formattedTotalBase}
        </Box>
        <Box
          sx={{
            mt: -4,
            typography: 'body2',
            color: 'text.secondary',
          }}
        >
          <Trans>Total Supply</Trans>
        </Box>
      </Box>

      <Box
        sx={{
          maxHeight: fold ? 0 : '600px',
          opacity: fold ? 0 : 1,
          overflow: 'hidden',
          transition: 'max-height 0.3s ease-in-out, opacity 0.3s ease-in-out',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            p: 20,
          }}
        >
          {/* Status Section */}
          <Box>
            <Box
              sx={{
                typography: 'body2',
                fontWeight: 600,
                color: 'text.secondary',
              }}
            >
              <Trans>Status</Trans>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                mt: 2,
              }}
            >
              <Box
                sx={{
                  px: 8,
                  py: 4,
                  borderRadius: 4,
                  backgroundColor: alpha(theme.palette.success.main, 0.1),
                  typography: 'h6',
                  fontWeight: 600,
                  color: 'success.main',
                }}
              >
                {getStatusLabel()}
              </Box>
              <Box
                sx={{
                  typography: 'body2',
                  fontWeight: 600,
                  color: 'text.secondary',
                }}
              >
                <Trans>Sales Ends In</Trans> 1d:23h:23min
              </Box>
            </Box>
          </Box>

          {/* Price Section */}
          <Box>
            <Box
              sx={{
                typography: 'body2',
                fontWeight: 600,
                color: 'text.secondary',
              }}
            >
              <Trans>Price</Trans>
            </Box>
            <Box
              sx={{
                mt: 2,
                typography: 'h5',
              }}
            >
              1 {baseToken?.symbol || '-'} = {formattedPrice}{' '}
              {quoteToken?.symbol || '-'}
            </Box>
          </Box>

          {/* Progress Section */}

          <ProgressBar
            progress={progress}
            poolQuote={poolQuote}
            poolQuoteCap={poolQuoteCap}
            quoteSymbol={quoteToken?.symbol || '--'}
          />
        </Box>

        {/* Action Buttons Section */}
        <Box
          sx={{
            px: 20,
            pt: 24,
            pb: 20,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            {/* Star/Favorite Button */}
            <ButtonBase
              onClick={handleFavoriteClick}
              sx={{
                width: 36,
                height: 36,
                minWidth: 36,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                '&:hover': {
                  opacity: 0.7,
                },
              }}
            >
              <StarIcon filled />
            </ButtonBase>

            {/* Join Button */}
            <ButtonBase
              onClick={handleJoinClick}
              sx={{
                height: 48,
                minWidth: '44%',
                maxWidth: 160,
                borderRadius: 8,
                fontWeight: 600,
                backgroundColor: theme.palette.secondary.main,
                color: theme.palette.secondary.contrastText,
                '&:hover': {
                  opacity: 0.7,
                },
              }}
            >
              <Trans>Join</Trans>
            </ButtonBase>
          </Box>
        </Box>
      </Box>

      {/* fold btn */}
      {canFold && (
        <ButtonBase
          sx={{
            position: 'absolute',
            bottom: '0',
            left: '50%',
            transform: !fold
              ? 'translate(-50%, 50%) rotate(180deg)'
              : 'translate(-50%, 50%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 32,
            height: 32,
            border: `solid 2px ${theme.palette.background.paper}`,
            borderRadius: '50%',
            backgroundColor: theme.palette.background.paperContrast,
            transition: 'rotate 0.3s ease-in-out',
          }}
          onClick={() => setFold((prev) => !prev)}
        >
          <svg
            width="13"
            height="8"
            viewBox="0 0 13 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 1.51071L1.51071 0L6.42857 4.90714L11.3464 0L12.8571 1.51071L6.42857 7.93929L0 1.51071Z"
              fill="currentColor"
            />
          </svg>
        </ButtonBase>
      )}
    </Box>
  );
}

interface StarIconProps {
  filled?: boolean;
  color?: string;
}

function StarIcon({ filled = false, color = '#326AFD' }: StarIconProps) {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18.0001 28.1716L9.64044 31.2838L10.0171 22.3716L4.47392 15.3829L13.0663 12.987L18.0001 5.55554L22.9338 12.987L31.5262 15.3829L25.983 22.3716L26.3597 31.2838L18.0001 28.1716Z"
        fill={filled ? color : 'currentColor'}
      />
    </svg>
  );
}

function ProgressBar({
  progress,
  poolQuote,
  poolQuoteCap,
  quoteSymbol,
}: {
  progress: number;
  poolQuote: BigNumber;
  poolQuoteCap: BigNumber;
  quoteSymbol: string;
}) {
  const formattedRaised = formatReadableNumber({
    input: poolQuote.toFixed(),
    showDecimals: 0,
  });
  const formattedCap = formatReadableNumber({
    input: poolQuoteCap.toFixed(),
    showDecimals: 0,
  });

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
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
          sx={{ typography: 'body2', fontWeight: 600, color: 'text.secondary' }}
        >
          <Trans>Progress</Trans>
        </Box>
        <Box
          sx={{ typography: 'body2', fontWeight: 600, color: 'text.secondary' }}
        >
          {formattedRaised} / {formattedCap} {quoteSymbol}
        </Box>
      </Box>
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: 8,
          backgroundColor: 'background.paperDarkContrast',
          borderRadius: 4,
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            left: 0,
            top: 1,
            height: 6,
            width: `${Math.min(progress, 100)}%`,
            backgroundColor: 'primary.main',
            borderRadius: 3,
          }}
        />
      </Box>
    </Box>
  );
}
