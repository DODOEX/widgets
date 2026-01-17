import {
  alpha,
  Box,
  BoxProps,
  Button,
  ButtonBase,
  useTheme,
} from '@dodoex/components';
import { Trans } from '@lingui/macro';
import React, { useState } from 'react';
import { StateProps } from '../reducers';
import TokenLogo from '../../../../components/TokenLogo';
import {
  formatReadableNumber,
  formatTokenAmountNumber,
} from '../../../../utils';
import Dialog from '../../../../components/Dialog';
import { QuestionTooltip } from '../../../../components/Tooltip';
import TokenItem from '../../../../components/Token/TokenItem';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  state: StateProps;
  isSubmitting?: boolean;
  showProjectInfo?: boolean;
}

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  state,
  isSubmitting = false,
  showProjectInfo = true,
}: ConfirmDialogProps) {
  const theme = useTheme();
  const [showProjectDetails, setShowProjectDetails] = useState(false);

  const { priceSettings, timeSettings, optionalSettings, introSettings } =
    state;

  const {
    baseToken,
    quoteToken,
    baseTokenAmount,
    salesRatio,
    price,
    baseTokenSalesAmount,
    hardcapPrice,
  } = priceSettings;

  const { bidStartTime, bidEndTime, freezeDuration } = timeSettings;

  const { delayClaim, overflowLimit, poolFeeRate } = optionalSettings;

  const {
    projectName,
    coverImageUrl,
    description,
    websiteUrl,
    twitterUrl,
    telegramUrl,
    discordUrl,
    enabledSocialLinks,
  } = introSettings;

  // Format timestamp to date string
  const formatDateTime = (timestamp: number | null) => {
    if (!timestamp) return '-';
    const date = new Date(timestamp);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;
  };

  // Social icons
  const SocialIcon = ({
    enabled,
    url,
    children,
  }: {
    enabled: boolean;
    url: string;
    children: React.ReactNode;
  }) => {
    if (!enabled || !url) return null;
    return (
      <Box
        component="a"
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '36px',
          height: '36px',
          borderRadius: '8px',
          backgroundColor: alpha(theme.palette.text.primary, 0.1),
          color: 'text.primary',
        }}
      >
        {children}
      </Box>
    );
  };

  return (
    <Dialog
      modal
      open={open}
      onClose={onClose}
      title={<Trans>Confirm Crowdpooling Campaign</Trans>}
    >
      <Box
        sx={{
          px: 20,
          width: {
            mobile: '100%',
            tablet: 420,
          },
        }}
      >
        {/* Token Info Section */}
        <Box
          sx={{
            mt: 8,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Total Supplied by Creator */}
          <Box
            sx={{
              typography: 'body2',
              color: 'text.secondary',
            }}
          >
            <Trans>Total Supplied by Creator</Trans>
          </Box>
          <Box
            sx={{
              mt: 2,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <TokenLogo
              token={baseToken ?? undefined}
              width={24}
              height={24}
              marginRight={8}
            />
            <Box
              sx={{
                typography: 'caption',
              }}
            >
              {formatTokenAmountNumber({
                input: baseTokenAmount,
                decimals: baseToken?.decimals,
              })}
            </Box>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gridTemplateRows: 'repeat(2, 1fr)',
              columnGap: 8,
              rowGap: 20,
              mt: 28,
            }}
          >
            <InfoItem
              label={<Trans>Price</Trans>}
              value={
                price && quoteToken
                  ? `1 ${baseToken?.symbol || ''} = ${formatReadableNumber({ input: price })} ${quoteToken.symbol}`
                  : '-'
              }
            />
            <InfoItem
              label={<Trans>Sales Ratio(%)</Trans>}
              value={salesRatio !== null ? `${salesRatio.toFixed(2)}%` : '-'}
            />
            <InfoItem
              label={<Trans>Hard Cap</Trans>}
              value={
                quoteToken ? (
                  <TokenItem
                    chainId={quoteToken?.chainId}
                    address={quoteToken.address}
                    size={16}
                    offset={8}
                    showName={
                      hardcapPrice && hardcapPrice.gt(0)
                        ? formatTokenAmountNumber({
                            input: hardcapPrice,
                            decimals: quoteToken.decimals,
                          })
                        : '-'
                    }
                  />
                ) : (
                  '-'
                )
              }
            />
            <InfoItem
              label={<Trans>Tokens for Participants</Trans>}
              value={
                baseToken ? (
                  <TokenItem
                    chainId={baseToken?.chainId}
                    address={baseToken.address}
                    size={16}
                    offset={8}
                    showName={
                      baseTokenSalesAmount && baseTokenSalesAmount.gt(0)
                        ? formatTokenAmountNumber({
                            input: baseTokenSalesAmount,
                            decimals: baseToken.decimals,
                          })
                        : '-'
                    }
                  />
                ) : (
                  '-'
                )
              }
            />
          </Box>

          <Box
            sx={{
              my: 28,
              height: '1px',
              borderBottom: 'solid 1px',
              borderColor: 'border.main',
            }}
          />

          {/* Time Settings */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            <InfoItem
              label={<Trans>Start Time</Trans>}
              value={formatDateTime(bidStartTime)}
            />
            <InfoItem
              label={<Trans>End Time</Trans>}
              value={formatDateTime(bidEndTime)}
            />
            <InfoItem
              label={<Trans>Liquidity Protection Period</Trans>}
              value={`${freezeDuration} Days`}
            />
            <InfoItem
              label={<Trans>Delayed Distribution</Trans>}
              value={delayClaim ? 'Yes' : 'No'}
            />
            <InfoItem
              label={<Trans>Allow Over-raising</Trans>}
              value={overflowLimit ? 'Yes' : 'No'}
            />
            <InfoItem
              label={<Trans>Pool Building Fee (%)</Trans>}
              value={`${poolFeeRate.toFixed(2)}%`}
            />
          </Box>

          <Box
            sx={{
              my: 28,
              height: '1px',
              borderBottom: 'solid 1px',
              borderColor: 'border.main',
            }}
          />

          {/* Project Info Section */}
          {showProjectInfo && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Box
                  sx={{
                    typography: 'body2',
                    fontWeight: 600,
                    color: 'text.primary',
                  }}
                >
                  <Trans>Project Info</Trans>
                </Box>
                <ButtonBase
                  onClick={() => setShowProjectDetails(!showProjectDetails)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    px: '8px',
                    py: '4px',
                    borderRadius: '8px',
                    backgroundColor: alpha(theme.palette.text.primary, 0.1),
                    color: 'text.secondary',
                    '&:hover': {
                      color: 'text.primary',
                    },
                  }}
                >
                  <Box
                    sx={{
                      typography: 'body2',
                    }}
                  >
                    <Trans>more details</Trans>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      transition: 'transform 0.2s',
                      transform: showProjectDetails
                        ? 'rotate(180deg)'
                        : 'rotate(0deg)',
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path
                        d="M5 7.5L9 11.5L13 7.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Box>
                </ButtonBase>
              </Box>

              {/* Collapsible Project Details */}
              {showProjectDetails && (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                  }}
                >
                  {/* Project Name */}
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                    }}
                  >
                    <Box
                      sx={{
                        typography: 'body2',
                        color: 'text.secondary',
                      }}
                    >
                      <Trans>Project name</Trans>
                    </Box>
                    <Box
                      sx={{
                        typography: 'h5',
                        fontWeight: 600,
                      }}
                    >
                      {projectName || '-'}
                    </Box>
                  </Box>

                  {/* Cover Image */}
                  {coverImageUrl && (
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                      }}
                    >
                      <Box
                        sx={{
                          typography: 'body2',
                          color: 'text.secondary',
                        }}
                      >
                        <Trans>Cover image</Trans>
                      </Box>
                      <Box
                        component="img"
                        src={coverImageUrl}
                        alt="Cover"
                        sx={{
                          width: '100%',
                          height: '95px',
                          objectFit: 'cover',
                          borderRadius: '8px',
                          border: 'solid 1px',
                          borderColor: 'border.main',
                        }}
                      />
                    </Box>
                  )}

                  {/* Social Links */}
                  {(enabledSocialLinks.website ||
                    enabledSocialLinks.twitter ||
                    enabledSocialLinks.discord ||
                    enabledSocialLinks.telegram) && (
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                      }}
                    >
                      <Box
                        sx={{
                          typography: 'body2',
                          color: 'text.secondary',
                        }}
                      >
                        <Trans>Social Links</Trans>
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          gap: '12px',
                        }}
                      >
                        {enabledSocialLinks.website && websiteUrl && (
                          <SocialIcon
                            enabled={enabledSocialLinks.website}
                            url={websiteUrl}
                          >
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 18 18"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M9 16.5C7.975 16.5 7.00625 16.3031 6.09375 15.9094C5.18125 15.5156 4.38438 14.9781 3.70312 14.2969C3.02188 13.6156 2.48438 12.8188 2.09063 11.9062C1.69688 10.9938 1.5 10.025 1.5 9C1.5 7.9625 1.69688 6.99063 2.09063 6.08438C2.48438 5.17813 3.02188 4.38438 3.70312 3.70312C4.38438 3.02188 5.18125 2.48438 6.09375 2.09063C7.00625 1.69688 7.975 1.5 9 1.5C10.0375 1.5 11.0094 1.69688 11.9156 2.09063C12.8219 2.48438 13.6156 3.02188 14.2969 3.70312C14.9781 4.38438 15.5156 5.17813 15.9094 6.08438C16.3031 6.99063 16.5 7.9625 16.5 9C16.5 10.025 16.3031 10.9938 15.9094 11.9062C15.5156 12.8188 14.9781 13.6156 14.2969 14.2969C13.6156 14.9781 12.8219 15.5156 11.9156 15.9094C11.0094 16.3031 10.0375 16.5 9 16.5ZM9 14.9625C9.325 14.5125 9.60625 14.0438 9.84375 13.5563C10.0813 13.0688 10.275 12.55 10.425 12H7.575C7.725 12.55 7.91875 13.0688 8.15625 13.5563C8.39375 14.0438 8.675 14.5125 9 14.9625ZM7.05 14.6625C6.825 14.25 6.62813 13.8219 6.45938 13.3781C6.29063 12.9344 6.15 12.475 6.0375 12H3.825C4.1875 12.625 4.64063 13.1688 5.18438 13.6313C5.72813 14.0938 6.35 14.4375 7.05 14.6625ZM10.95 14.6625C11.65 14.4375 12.2719 14.0938 12.8156 13.6313C13.3594 13.1688 13.8125 12.625 14.175 12H11.9625C11.85 12.475 11.7094 12.9344 11.5406 13.3781C11.3719 13.8219 11.175 14.25 10.95 14.6625ZM3.1875 10.5H5.7375C5.7 10.25 5.67188 10.0031 5.65313 9.75938C5.63438 9.51562 5.625 9.2625 5.625 9C5.625 8.7375 5.63438 8.48438 5.65313 8.24063C5.67188 7.99688 5.7 7.75 5.7375 7.5H3.1875C3.125 7.75 3.07813 7.99688 3.04688 8.24063C3.01563 8.48438 3 8.7375 3 9C3 9.2625 3.01563 9.51562 3.04688 9.75938C3.07813 10.0031 3.125 10.25 3.1875 10.5ZM7.2375 10.5H10.7625C10.8 10.25 10.8281 10.0031 10.8469 9.75938C10.8656 9.51562 10.875 9.2625 10.875 9C10.875 8.7375 10.8656 8.48438 10.8469 8.24063C10.8281 7.99688 10.8 7.75 10.7625 7.5H7.2375C7.2 7.75 7.17188 7.99688 7.15313 8.24063C7.13438 8.48438 7.125 8.7375 7.125 9C7.125 9.2625 7.13438 9.51562 7.15313 9.75938C7.17188 10.0031 7.2 10.25 7.2375 10.5ZM12.2625 10.5H14.8125C14.875 10.25 14.9219 10.0031 14.9531 9.75938C14.9844 9.51562 15 9.2625 15 9C15 8.7375 14.9844 8.48438 14.9531 8.24063C14.9219 7.99688 14.875 7.75 14.8125 7.5H12.2625C12.3 7.75 12.3281 7.99688 12.3469 8.24063C12.3656 8.48438 12.375 8.7375 12.375 9C12.375 9.2625 12.3656 9.51562 12.3469 9.75938C12.3281 10.0031 12.3 10.25 12.2625 10.5ZM11.9625 6H14.175C13.8125 5.375 13.3594 4.83125 12.8156 4.36875C12.2719 3.90625 11.65 3.5625 10.95 3.3375C11.175 3.75 11.3719 4.17813 11.5406 4.62188C11.7094 5.06563 11.85 5.525 11.9625 6ZM7.575 6H10.425C10.275 5.45 10.0813 4.93125 9.84375 4.44375C9.60625 3.95625 9.325 3.4875 9 3.0375C8.675 3.4875 8.39375 3.95625 8.15625 4.44375C7.91875 4.93125 7.725 5.45 7.575 6ZM3.825 6H6.0375C6.15 5.525 6.29063 5.06563 6.45938 4.62188C6.62813 4.17813 6.825 3.75 7.05 3.3375C6.35 3.5625 5.72813 3.90625 5.18438 4.36875C4.64063 4.83125 4.1875 5.375 3.825 6Z"
                                fill="currentColor"
                              />
                            </svg>
                          </SocialIcon>
                        )}
                        {enabledSocialLinks.twitter && twitterUrl && (
                          <SocialIcon
                            enabled={enabledSocialLinks.twitter}
                            url={twitterUrl}
                          >
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 14 14"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M8.15246 5.92451L13.2496 -0.000488281H12.0417L7.6159 5.14411L4.081 -0.000488281H0.00390625L5.34937 7.77905L0.00390625 13.9923H1.21183L5.88563 8.55946L9.61874 13.9923H13.6958L8.15217 5.92451H8.15246ZM6.49804 7.84759L5.95644 7.07292L1.64706 0.90882H3.50237L6.98008 5.88345L7.52169 6.65811L12.0423 13.1244H10.187L6.49804 7.84789V7.84759Z"
                                fill="currentColor"
                              />
                            </svg>
                          </SocialIcon>
                        )}
                        {enabledSocialLinks.discord && discordUrl && (
                          <SocialIcon
                            enabled={enabledSocialLinks.discord}
                            url={discordUrl}
                          >
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 18 18"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M11.4336 10.8372C11.0062 10.8827 10.6593 10.7156 10.3929 10.4042C10.0417 9.99344 9.95732 9.52532 10.1401 9.02662C10.3068 8.57198 10.6333 8.27141 11.1418 8.18169C11.7187 8.07984 12.3176 8.45042 12.522 9.03277C12.5766 9.18811 12.6008 9.34917 12.607 9.46955C12.6026 10.1984 12.1068 10.7656 11.4336 10.8372ZM7.48128 10.5343C6.97846 10.9735 6.27005 10.9442 5.79476 10.476C5.2491 9.93843 5.25974 9.02569 5.81772 8.50374C6.40579 7.95365 7.35171 8.09838 7.75425 8.80195C7.87899 9.02005 7.94259 9.25499 7.94136 9.55169C7.93247 9.90735 7.79401 10.2611 7.48128 10.5343ZM15.9499 10.2594C15.7791 8.31681 15.0783 6.55704 13.9424 4.94847C13.8905 4.8751 13.834 4.8088 13.7464 4.77165C12.9026 4.41448 12.0266 4.15965 11.1181 4.00507C10.9989 3.98477 10.9355 4.02579 10.8877 4.12199C10.817 4.26394 10.7358 4.40117 10.6689 4.54454C10.6179 4.65389 10.5394 4.68404 10.4213 4.66829C9.46426 4.54092 8.50681 4.53848 7.54981 4.66753C7.43818 4.68261 7.3642 4.65448 7.31758 4.55035C7.26506 4.43276 7.19292 4.32308 7.14287 4.20463C7.06968 4.0316 6.95937 3.9787 6.76047 4.01787C5.92953 4.1813 5.12339 4.41667 4.34074 4.72936C4.18732 4.79069 4.07859 4.88234 3.98816 5.01485C2.89419 6.61803 2.20338 8.35742 2.03782 10.2757C1.9846 10.8921 1.98971 11.5086 2.03958 12.1248C2.04891 12.2403 2.06562 12.3508 2.18227 12.43C3.18246 13.1091 4.26623 13.6261 5.43321 13.9851C5.5437 14.019 5.61469 13.9962 5.68084 13.9055C5.88651 13.6235 6.07714 13.3332 6.24991 13.0315C6.31263 12.9219 6.28888 12.8661 6.16854 12.8213C5.89082 12.7178 5.61742 12.6035 5.36011 12.4583C5.29765 12.4231 5.17283 12.4076 5.2103 12.3157C5.25103 12.2158 5.35105 12.1374 5.47984 12.1411C5.53139 12.1425 5.58276 12.1733 5.63308 12.1934C7.71818 13.0225 9.82282 13.0879 11.9476 12.3405C12.1073 12.2844 12.2621 12.2154 12.421 12.1571C12.5272 12.1181 12.7282 12.1984 12.7557 12.2981C12.7893 12.4201 12.6646 12.4327 12.5934 12.4702C12.3429 12.6021 12.0857 12.7224 11.8169 12.8165C11.6906 12.8607 11.6571 12.9215 11.7283 13.0391C11.8989 13.3214 12.0738 13.6006 12.2685 13.8688C12.352 13.9839 12.4437 14.0073 12.58 13.965C13.7222 13.6106 14.7861 13.107 15.7713 12.4496C15.8755 12.38 15.9317 12.297 15.9387 12.1775C15.9586 11.8406 15.9804 11.5038 16 11.1904C15.983 10.8638 15.9764 10.5608 15.9499 10.2594Z"
                                fill="currentColor"
                              />
                            </svg>
                          </SocialIcon>
                        )}
                        {enabledSocialLinks.telegram && telegramUrl && (
                          <SocialIcon
                            enabled={enabledSocialLinks.telegram}
                            url={telegramUrl}
                          >
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 18 18"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M15.4985 2.78786L2.20096 7.91561C1.29345 8.28011 1.2987 8.78636 2.03446 9.01211L5.44846 10.0771L13.3475 5.09336C13.721 4.86611 14.0622 4.98836 13.7817 5.23736L7.38196 11.0131H7.38046L7.38196 11.0139L7.14646 14.5329C7.49146 14.5329 7.64371 14.3746 7.83721 14.1879L9.49546 12.5754L12.9447 15.1231C13.5807 15.4734 14.0375 15.2934 14.1957 14.5344L16.46 3.86336C16.6917 2.93411 16.1052 2.51336 15.4985 2.78786Z"
                                fill="currentColor"
                              />
                            </svg>
                          </SocialIcon>
                        )}
                      </Box>
                    </Box>
                  )}

                  {/* Project Intro */}
                  {description && (
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                      }}
                    >
                      <Box
                        sx={{
                          typography: 'body2',
                          color: 'text.secondary',
                        }}
                      >
                        <Trans>Project Intro</Trans>
                      </Box>
                      <Box
                        sx={{
                          typography: 'body2',
                          color: 'text.primary',
                          '& img': {
                            maxWidth: '100%',
                            borderRadius: '8px',
                            my: 1,
                          },
                        }}
                        dangerouslySetInnerHTML={{ __html: description }}
                      />
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          )}
        </Box>

        {/* Footer Button */}
        <Box
          sx={{
            py: 20,
            position: 'sticky',
            bottom: 0,
            backgroundColor: 'background.paper',
          }}
        >
          <Button
            fullWidth
            size={Button.Size.big}
            onClick={onConfirm}
            disabled={isSubmitting}
            isLoading={isSubmitting}
          >
            {isSubmitting ? <Trans>Creating...</Trans> : <Trans>Create</Trans>}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}

interface InfoItemProps {
  label: React.ReactNode;
  value: React.ReactNode;
  question?: React.ReactNode;
  sx?: BoxProps['sx'];
}

function InfoItem({ label, value, question, sx }: InfoItemProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        ...sx,
      }}
    >
      <Box
        sx={{
          typography: 'body2',
          color: 'text.secondary',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}
      >
        {label}
        {!!question && <QuestionTooltip title={question} />}
      </Box>
      <Box
        sx={{
          typography: 'body2',
          fontWeight: 600,
          color: 'text.primary',
        }}
      >
        {value}
      </Box>
    </Box>
  );
}
