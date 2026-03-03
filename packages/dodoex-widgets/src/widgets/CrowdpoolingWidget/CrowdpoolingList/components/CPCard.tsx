import { alpha, Box, ButtonBase, useTheme } from '@dodoex/components';
import { t, Trans } from '@lingui/macro';
import { useMemo, useState } from 'react';
import BigNumber from 'bignumber.js';
import TokenLogo from '../../../../components/TokenLogo';
import {
  formatReadableNumber,
  formatTokenAmountNumber,
  truncatePoolAddress,
} from '../../../../utils';
import { CP_STATUS, Crowdpooling } from '../../types';
import { getExpectedReceiveFromCP } from '../../helper';
import {
  isFavorite,
  toggleFavorite,
  useCPFavorites,
} from '../../../../hooks/useCPFavorites';
import { useCpCountdownTime } from '../../hooks/useCpCountdownTime';
import CountdownTime from '../../../../components/CountdownTime';
import { StatusTag, Tag } from '../../MyCrowdpoolingList/components/StatusTag';
import { useWidgetDevice } from '../../../../hooks/style/useWidgetDevice';

export interface CPCardProps {
  data: Crowdpooling;
  canFold?: boolean;
  onJoin?: (data: Crowdpooling) => void;
}

export default function CPCard({ data, canFold, onJoin }: CPCardProps) {
  const {
    baseToken,
    quoteToken,
    salesBase,
    price,
    hardcapPrice,
    poolQuote,
    poolQuoteCap,
    progress,
    status,
  } = data;
  const theme = useTheme();
  const { isMobile } = useWidgetDevice();

  const isParticipated = !!data.bidPosition;

  // Subscribe to favorites state to trigger re-render
  const { favorites } = useCPFavorites();
  const isFavorited = isFavorite(favorites, data.id, data.chainId);

  const formattedTotalBase = formatTokenAmountNumber({
    input: salesBase || '0',
    decimals: baseToken.decimals,
  });

  const formattedPrice = formatTokenAmountNumber({
    input: price,
    decimals: quoteToken.decimals,
  });
  const [baseTokenAmount, quoteTokenAmount] = getExpectedReceiveFromCP({
    investedQuote: data.bidPosition?.investedQuote,
    price,
    poolQuote,
    poolQuoteCap,
  });
  const countdownTime = useCpCountdownTime({
    status,
    bidEndTime: data?.bidEndTime,
    bidStartTime: data?.bidStartTime,
    calmEndTime: data?.calmEndTime,
    settledTime: data?.bidEndTime,
    isSettled: data?.settled,
    duration: data?.freezeDuration,
  });

  const isProcessing = status === 'processing';
  const isEnded = status === 'ended';
  const isSettling = status === 'settling';

  const getStatusLabel = () => {
    if (data.settled || isEnded) return t`Ended`;
    const bidEndTime = data.bidEndTime * 1000;
    const bidStartTime = data.bidStartTime * 1000;
    const clamEndTime = data.calmEndTime * 1000;
    const now = Date.now();
    if (now > bidEndTime && now < clamEndTime) {
      return t`Calming`;
    }
    if (now >= bidEndTime || isSettling) {
      return t`Settling`;
    }
    if ((now >= bidStartTime && now < bidEndTime) || isProcessing)
      return t`Processing`;
    return t`Waiting`;
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(data.id, data.chainId);
  };

  const handleJoinClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onJoin?.(data);
  };

  const [fold, setFold] = useState(canFold);

  let btnText = t`Join`;
  let btnDisabled = false;
  switch (data.status) {
    case CP_STATUS.SETTLING:
      btnText = t`Settle`;
      break;
    case CP_STATUS.ENDED:
      if (data.calmEndTime) {
        btnText = t`Claimed`;
        btnDisabled = true;
      } else {
        btnText = t`Claim`;
      }
      break;
    case CP_STATUS.WAITING:
      btnDisabled = true;
      break;

    default:
      if (isParticipated) {
        if (data.status === CP_STATUS.CALMING) {
          btnText = t`Remove`;
        } else if (data.status === CP_STATUS.PROCESSING) {
          btnText = t`Manage`;
        }
      }
      break;
  }

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
              <Tag status={data.status}>{getStatusLabel()}</Tag>
              {!!countdownTime.label && (
                <Box
                  sx={{
                    typography: 'body2',
                    fontWeight: 600,
                    color: 'text.secondary',
                  }}
                >
                  {countdownTime.label}{' '}
                  <CountdownTime endTime={countdownTime.time} />
                </Box>
              )}
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

          {/* Rate Section */}
          {data.isEscalation && (
            <Box>
              <Box
                sx={{
                  typography: 'body2',
                  fontWeight: 600,
                  color: 'text.secondary',
                }}
              >
                <Trans>Price Change</Trans>
              </Box>
              <Box
                sx={{
                  mt: 2,
                  typography: 'h5',
                }}
              >
                {formatReadableNumber({
                  input: data.price
                    .minus(data.initPrice)
                    .div(data.initPrice)
                    .times(100),
                  showDecimals: 2,
                })}
                %
              </Box>
            </Box>
          )}

          {data.isEscalation ? (
            <Box>
              <Box
                sx={{
                  typography: 'body2',
                  fontWeight: 600,
                  color: 'text.secondary',
                }}
              >
                <Trans>Price Hard Cap</Trans>
              </Box>
              <Box
                sx={{
                  mt: 2,
                  typography: 'h5',
                }}
              >
                {`${formatTokenAmountNumber({ input: hardcapPrice || 0, decimals: quoteToken.decimals })} ${quoteToken.symbol}`}
              </Box>
            </Box>
          ) : (
            <ProgressBar
              progress={progress}
              poolQuote={poolQuote}
              poolQuoteCap={poolQuoteCap}
              quoteSymbol={quoteToken?.symbol || '--'}
              quoteDecimals={quoteToken.decimals}
            />
          )}
        </Box>

        {/* My share */}
        {!!(
          data.bidPosition?.investedQuote > 0 ||
          baseTokenAmount.gt(0) ||
          quoteTokenAmount.gt(0)
        ) && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Box>
              <Box
                sx={{
                  typography: 'body2',
                  fontWeight: 600,
                  color: 'text.secondary',
                }}
              >
                <Trans>My Share</Trans>
              </Box>
              <Box
                sx={{
                  mt: 2,
                  typography: 'h5',
                }}
              >
                {`${formatTokenAmountNumber({ input: data.bidPosition?.investedQuote, decimals: quoteToken.decimals })} ${quoteToken.symbol}`}
              </Box>
            </Box>

            <Box>
              <Box
                sx={{
                  typography: 'body2',
                  fontWeight: 600,
                  color: 'text.secondary',
                }}
              >
                <Trans>Expected to Receive</Trans>
              </Box>
              {baseTokenAmount.gt(0) && (
                <Box
                  sx={{
                    mt: 2,
                    typography: 'h5',
                  }}
                >
                  {`+ ${formatTokenAmountNumber({ input: baseTokenAmount, decimals: baseToken.decimals })} ${baseToken.symbol}`}
                </Box>
              )}
              {quoteTokenAmount.gt(0) && (
                <Box
                  sx={{
                    mt: 2,
                    typography: 'h5',
                  }}
                >
                  {`+ ${formatTokenAmountNumber({ input: quoteTokenAmount, decimals: quoteToken.decimals })} ${quoteToken.symbol}`}
                </Box>
              )}
            </Box>
          </Box>
        )}

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
            <StarIcon filled={isFavorited} onClick={handleFavoriteClick} />

            {/* Join Button */}
            <ButtonBase
              onClick={handleJoinClick}
              disabled={btnDisabled}
              sx={{
                height: 48,
                flex: 1,
                ml: 12,
                borderRadius: isMobile ? 16 : 8,
                fontWeight: 600,
                backgroundColor: theme.palette.secondary.main,
                color: theme.palette.secondary.contrastText,
                '&:hover': {
                  opacity: 0.7,
                },
                ...(isMobile
                  ? {}
                  : {
                      minWidth: '44%',
                      maxWidth: 160,
                      flex: 'unset',
                      ml: 0,
                    }),
              }}
            >
              {btnText}
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
  onClick: (e: React.MouseEvent) => void;
}

function StarIcon({ filled = false, onClick }: StarIconProps) {
  const theme = useTheme();
  return (
    <ButtonBase
      onClick={onClick}
      sx={{
        width: 36,
        height: 36,
        minWidth: 36,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: filled
          ? theme.palette.secondary.main
          : theme.palette.text.secondary,
        '&:hover': {
          color: filled
            ? alpha(theme.palette.secondary.main, 0.5)
            : theme.palette.text.primary,
        },
      }}
    >
      <svg
        width="36"
        height="36"
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {filled ? (
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M18.0001 28.1716L9.64044 31.2838L10.0171 22.3716L4.47392 15.3829L13.0663 12.987L18.0001 5.55554L22.9338 12.987L31.5262 15.3829L25.983 22.3716L26.3597 31.2838L18.0001 28.1716Z"
            fill="currentColor"
          />
        ) : (
          <Box
            component="path"
            d="M22.3091 13.4022L22.4634 13.6346L22.7319 13.7098L30.2358 15.8016L25.395 21.9052L25.2222 22.1239L25.2339 22.4032L25.562 30.1864L18.2622 27.4686L18.0005 27.371L17.7388 27.4686L10.437 30.1864L10.7661 22.4032L10.7778 22.1239L10.605 21.9052L5.76318 15.8016L13.2681 13.7098L13.5366 13.6346L13.6909 13.4022L17.9995 6.91101L22.3091 13.4022Z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        )}
      </svg>
    </ButtonBase>
  );
}

function ProgressBar({
  progress,
  poolQuote,
  poolQuoteCap,
  quoteSymbol,
  quoteDecimals,
}: {
  progress: number;
  poolQuote: BigNumber;
  poolQuoteCap: BigNumber;
  quoteSymbol: string;
  quoteDecimals: number;
}) {
  const formattedRaised = formatTokenAmountNumber({
    input: poolQuote,
    decimals: quoteDecimals,
  });
  const formattedCap = formatTokenAmountNumber({
    input: poolQuoteCap,
    decimals: quoteDecimals,
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
