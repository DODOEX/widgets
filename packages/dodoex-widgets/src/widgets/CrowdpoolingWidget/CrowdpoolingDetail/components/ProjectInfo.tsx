import {
  alpha,
  Box,
  ButtonBase,
  LoadingSkeleton,
  Skeleton,
  Tooltip,
  useTheme,
} from '@dodoex/components';
import { useState } from 'react';
import { CP_STATUS, CPDetail } from '../../types';
import { useGetCPIntro } from '../../CrowdpoolingCreate/hooks/useGetCPIntro';
import TokenLogo from '../../../../components/TokenLogo';
import { AddressWithLinkAndCopy } from '../../../../components/AddressWithLinkAndCopy';
import { Trans } from '@lingui/macro';
import { ReactComponent as WebsiteIcon } from '../../../../assets/soical/website.svg';
import { ReactComponent as TwitterIcon } from '../../../../assets/soical/twitter.svg';
import { ReactComponent as DiscordIcon } from '../../../../assets/soical/website.svg';
import { ReactComponent as TelegramIcon } from '../../../../assets/soical/telegram.svg';
import { PageType, useRouterStore } from '../../../../router';
import { ArrowRight } from '@dodoex/icons';
import { useWalletInfo } from '../../../../hooks/ConnectWallet/useWalletInfo';

export default function ProjectInfo({
  detail,
}: {
  detail: CPDetail | undefined;
}) {
  const { account } = useWalletInfo();
  const theme = useTheme();
  const fetchIntro = useGetCPIntro(detail?.chainId, detail?.id || '');
  const router = useRouterStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const isCreator = !!(
    account && account.toLowerCase() === detail?.creator?.toLowerCase()
  );

  return (
    <Box
      sx={{
        position: 'relative',
        p: theme.spacing(0, 0, 24),
        borderRadius: {
          mobile: 0,
          tablet: 24,
        },
        backgroundColor: 'background.paper',
      }}
    >
      {!!fetchIntro.data?.coverImg && (
        <Box
          component="img"
          src={fetchIntro.data?.coverImg}
          sx={{
            width: '100%',
            maxHeight: {
              mobile: 100,
              tablet: 201,
            },
            objectFit: 'cover',
            objectPosition: 'center',
            borderRadius: {
              mobile: 0,
              tablet: theme.spacing(24, 24, 0, 0),
            },
          }}
        />
      )}
      {isCreator && (
        <Tooltip
          title={<Trans>Please contact our team to edit project intro</Trans>}
          maxWidth={240}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 14,
              left: 20,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              px: 8,
              py: 4,
              borderRadius: 8,
              backgroundColor: alpha(theme.palette.primary.contrastText, 0.3),
              typography: 'body2',
              color: alpha(theme.palette.primary.contrastText, 0.5),
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.8 4L18.5 9.7L10.8 17.4H5.1V11.7L12.8 4ZM7 12.4V15.4H10L15.5 9.7L12.8 6.9L7 12.4ZM5 18.4H8V20.4H5V18.4ZM9 18.4H13V20.4H9V18.4ZM14 18.4H19V20.4H14V18.4Z"
                fill="currentColor"
              />
            </svg>
            <Trans>Request Edit Access</Trans>
          </Box>
        </Tooltip>
      )}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          ...(fetchIntro.data?.coverImg
            ? {
                mt: -36,
              }
            : {
                mt: 48,
              }),
        }}
      >
        <TokenLogo
          address={detail?.baseToken.address}
          chainId={detail?.chainId}
          width={72}
          height={72}
          noShowChain
        />
        {fetchIntro.isLoading || !detail ? (
          <Skeleton
            height="fit-content"
            sx={{
              mt: 8,
              height: 38,
              width: 180,
              borderRadius: 4,
            }}
          />
        ) : (
          <>
            {!!fetchIntro.data?.name && (
              <Box
                sx={{
                  mt: 8,
                  typography: 'h3',
                }}
              >
                {fetchIntro.data.name}
              </Box>
            )}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                ...(fetchIntro.data?.name
                  ? {
                      mt: 2,
                      typography: 'h5',
                      color: 'text.secondary',
                    }
                  : {
                      mt: 8,
                      typography: 'h3',
                    }),
              }}
            >
              {detail?.baseToken.symbol}
              <Tooltip
                leaveDelay={150}
                title={
                  <AddressWithLinkAndCopy
                    truncate
                    showCopy
                    address={detail.baseToken.address}
                    customChainId={detail.chainId}
                    iconSize={16}
                    iconSpace={8}
                    sx={{
                      typography: 'h6',
                      color: 'text.secondary',
                    }}
                  />
                }
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 1.5C13.14 1.5 16.5 4.86 16.5 9C16.5 13.14 13.14 16.5 9 16.5C4.86 16.5 1.5 13.14 1.5 9C1.5 4.86 4.86 1.5 9 1.5ZM9 3C5.6925 3 3 5.6925 3 9C3 12.3075 5.6925 15 9 15C12.3075 15 15 12.3075 15 9C15 5.6925 12.3075 3 9 3ZM9.75 8.25V12.75H8.25V8.25H9.75ZM9.75 5.25V6.75H8.25V5.25H9.75Z"
                    fill="currentColor"
                  />
                </svg>
              </Tooltip>
            </Box>
          </>
        )}
        {!!detail && <StatusChip status={detail?.status} />}
        <LoadingSkeleton
          loading={fetchIntro.isLoading}
          loadingProps={{ width: 200 }}
          sx={{
            mt: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <SocialIconWrapper href={fetchIntro.data?.website}>
            <WebsiteIcon />
          </SocialIconWrapper>
          <SocialIconWrapper href={fetchIntro.data?.twitter}>
            <TwitterIcon />
          </SocialIconWrapper>
          <SocialIconWrapper href={fetchIntro.data?.discord}>
            <DiscordIcon />
          </SocialIconWrapper>
          <SocialIconWrapper href={fetchIntro.data?.telegram}>
            <TelegramIcon />
          </SocialIconWrapper>
          {fetchIntro.data?.website ||
          fetchIntro.data?.twitter ||
          fetchIntro.data?.discord ||
          fetchIntro.data?.telegram ? (
            <Box
              sx={{
                width: '1px',
                height: 24,
                backgroundColor: theme.palette.border.main,
              }}
            />
          ) : null}

          <Box
            component={ButtonBase}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 34,
              height: 34,
              borderRadius: '8px',
              backgroundColor: theme.palette.background.paperDarkContrast,
              color: 'text.primary',
              '&:hover': {
                opacity: 0.5,
              },
            }}
            onClick={() => {
              router.push({
                type: PageType.CrowdpoolingDetail,
                params: {
                  address: detail!.id,
                  chainId: detail!.chainId,
                },
              });
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.25 12.75H6.75V7.5H5.25V12.75ZM8.25 12.75H9.75V5.25H8.25V12.75ZM11.25 12.75H12.75V9.75H11.25V12.75ZM3.75 15.75C3.3375 15.75 2.98438 15.6031 2.69063 15.3094C2.39687 15.0156 2.25 14.6625 2.25 14.25V3.75C2.25 3.3375 2.39687 2.98438 2.69063 2.69063C2.98438 2.39687 3.3375 2.25 3.75 2.25H14.25C14.6625 2.25 15.0156 2.39687 15.3094 2.69063C15.6031 2.98438 15.75 3.3375 15.75 3.75V14.25C15.75 14.6625 15.6031 15.0156 15.3094 15.3094C15.0156 15.6031 14.6625 15.75 14.25 15.75H3.75Z"
                fill="currentColor"
              />
            </svg>
          </Box>
        </LoadingSkeleton>

        {!!fetchIntro.data?.description && (
          <Box
            sx={{
              mt: 20,
              px: 20,
              position: 'relative',
              width: '100%',
            }}
          >
            <Box
              sx={{
                typography: 'body2',
                color: 'text.primary',
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: isExpanded ? 'unset' : 3,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                '& h2': {
                  typography: 'body1',
                  fontWeight: 600,
                },
                '& img': {
                  width: '100%',
                },
                '& p': {
                  margin: 0,
                },
                '& blockquote': {
                  borderLeft: `4px solid ${theme.palette.border.main}`,
                  my: 5,
                  ml: 0,
                  pl: 16,
                },
              }}
              dangerouslySetInnerHTML={{
                __html: fetchIntro.data?.description ?? '',
              }}
            />
            {isExpanded ? (
              <Box
                component={ButtonBase}
                onClick={() => setIsExpanded((prev) => !prev)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  width: 'max-content',
                  mt: 12,
                  ml: 'auto',
                  color: 'primary.main',
                  typography: 'body2',
                  fontWeight: 600,
                  '&:hover': {
                    opacity: 0.5,
                  },
                }}
              >
                <Trans>Fold Up</Trans>
                <Box
                  component={ArrowRight}
                  sx={{
                    transform: 'rotate(-90deg)',
                  }}
                />
              </Box>
            ) : (
              <Box
                component={ButtonBase}
                onClick={() => setIsExpanded((prev) => !prev)}
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  backgroundColor: theme.palette.background.paper,
                  px: 2,
                  color: 'primary.main',
                  typography: 'body2',
                  fontWeight: 600,
                  '&:hover': {
                    opacity: 0.5,
                  },
                }}
              >
                <Trans>View More</Trans>
                <Box
                  component={ArrowRight}
                  sx={{
                    transform: 'rotate(90deg)',
                  }}
                />
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}

function StatusChip({ status }: { status: string }) {
  const theme = useTheme();
  const statusConfig = {
    [CP_STATUS.WAITING]: {
      label: <Trans>Waiting</Trans>,
      color: theme.palette.purple.main,
    },
    [CP_STATUS.PROCESSING]: {
      label: <Trans>Processing</Trans>,
      color: theme.palette.success.main,
    },
    [CP_STATUS.SETTLING]: {
      label: <Trans>Settling</Trans>,
      color: theme.palette.purple.main,
    },
    [CP_STATUS.CALMING]: {
      label: <Trans>Cooling-off</Trans>,
      color: theme.palette.purple.main,
    },
    [CP_STATUS.ENDED]: {
      label: <Trans>Ended</Trans>,
      color: theme.palette.text.disabled,
      backgroundColor: theme.palette.background.paperDarkContrast,
    },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || {
    label: status,
    color: '#8C8C8C',
  };

  return (
    <Box
      sx={{
        mt: 2,
        px: 8,
        py: 4,
        borderRadius: 4,
        typography: 'h6',
        fontWeight: 600,
        color: config.color,
        backgroundColor: config.backgroundColor || alpha(config.color, 0.1),
      }}
    >
      {config.label}
    </Box>
  );
}

// Social icon wrapper component
const SocialIconWrapper = ({
  href,
  children,
}: {
  href: string | undefined;
  children: React.ReactNode;
}) => {
  const theme = useTheme();
  if (!href) return null;
  return (
    <Box
      component="a"
      target="_blank"
      rel="noopener noreferrer"
      href={href}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 34,
        height: 34,
        borderRadius: '8px',
        backgroundColor: theme.palette.background.paperDarkContrast,
        color: 'text.primary',
        '&:hover': {
          opacity: 0.5,
        },
      }}
    >
      {children}
    </Box>
  );
};
