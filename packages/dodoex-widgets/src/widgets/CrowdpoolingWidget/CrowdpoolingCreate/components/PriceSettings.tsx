import { Box, Button, ButtonBase, Input, useTheme } from '@dodoex/components';
import { t, Trans } from '@lingui/macro';
import React, { useMemo, useEffect } from 'react';
import BigNumber from 'bignumber.js';
import { StateProps, Types, StepStatus } from '../reducers';
import TokenLogo from '../../../../components/TokenLogo';
import QuestionTooltip from '../../../../components/Tooltip/QuestionTooltip';
import { TokenInfo } from '../../../../hooks/Token/type';
import { usePriceSettingsValidation } from '../hooks/usePriceSettingsValidation';
import ErrorTip from './ErrorTip';
import Title from './Title';
import { TokenCard } from '../../../../components/Swap/components/TokenCard';
import { useUserOptions } from '../../../../components/UserOptionsProvider';
import {
  formatReadableNumber,
  formatTokenAmountNumber,
} from '../../../../utils';
import NeedConnectButton from '../../../../components/ConnectWallet/NeedConnectButton';
import TokenStatusButton from '../../../../components/TokenStatusButton';
import { useTokenStatus } from '../../../../hooks/Token/useTokenStatus';

interface PriceSettingsProps {
  state: StateProps;
  dispatch: (action: { type: Types; payload: any }) => void;
  onChangeStep?: (step: StepStatus) => void;
}

export default function PriceSettings({
  state,
  dispatch,
  onChangeStep,
}: PriceSettingsProps) {
  const { documentUrls, onlyChainId } = useUserOptions();
  const theme = useTheme();
  const { errorKey, isValid } = usePriceSettingsValidation(state);
  const { baseToken, quoteToken, baseTokenAmount, salesRatio, price } =
    state.priceSettings;
  const hiddenAddrs = useMemo(
    () => (quoteToken ? [quoteToken.address] : undefined),
    [quoteToken],
  );

  const baseStatus = useTokenStatus(baseToken, {
    amount: baseTokenAmount,
  });

  // Calculate tokens for participants based on total supply and sales ratio
  const tokensForParticipants = useMemo(() => {
    if (baseTokenAmount && salesRatio !== null) {
      const totalSupply = new BigNumber(baseTokenAmount);
      const ratio = new BigNumber(salesRatio).div(100);
      const tokens = totalSupply.multipliedBy(ratio);
      return tokens;
    }
    return new BigNumber(0);
  }, [baseTokenAmount, salesRatio]);

  // Calculate hard cap based on tokens for sale and price
  const hardCap = useMemo(() => {
    if (tokensForParticipants.gt(0) && price !== null) {
      const priceValue = new BigNumber(price);
      const cap = tokensForParticipants.multipliedBy(priceValue);
      return cap;
    }
    return new BigNumber(0);
  }, [tokensForParticipants, price]);

  // Update derived values when inputs change
  useEffect(() => {
    if (tokensForParticipants.gt(0)) {
      dispatch({
        type: Types.UpdatePriceSettings,
        payload: {
          baseTokenSalesAmount: tokensForParticipants,
        },
      });
    }
  }, [tokensForParticipants]);

  useEffect(() => {
    if (hardCap.gt(0)) {
      dispatch({
        type: Types.UpdatePriceSettings,
        payload: {
          hardcapPrice: hardCap,
          targetTakerTokenDisplayAmount: hardCap,
        },
      });
    }
  }, [hardCap]);

  const canProceed = isValid;

  const handleNext = () => {
    if (canProceed) {
      if (onChangeStep) {
        onChangeStep(StepStatus.TimeSettings);
      } else {
        dispatch({
          type: Types.UpdateCurStep,
          payload: StepStatus.TimeSettings,
        });
      }
    }
  };

  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 28,
        pt: {
          mobile: 20,
          tablet: 40,
        },
        pb: {
          tablet: 20,
        },
        maxWidth: {
          mobile: '100%',
          tablet: 458,
        },
        mx: 'auto',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <Title>
          <Trans>Select token</Trans>
        </Title>
        <TokenCard
          token={baseToken}
          hiddenAddrs={hiddenAddrs}
          onTokenChange={(token) =>
            dispatch({
              type: Types.UpdatePriceSettings,
              payload: {
                baseToken: token,
                baseTokenAmount: '',
              },
            })
          }
          amt={baseTokenAmount}
          onInputChange={(v) => {
            dispatch({
              type: Types.UpdatePriceSettings,
              payload: {
                baseTokenAmount: v,
              },
            });
          }}
          showPercentage
        />
        {/* Deflation Token Warning */}
        <Box
          sx={{
            typography: 'body2',
            color: 'text.secondary',
          }}
        >
          <Trans>
            For tokens with deflationary features enabled,
            <Box
              component="a"
              target="_blank"
              rel="noopener noreferrer"
              href={documentUrls?.crowdpoolingCreate}
              onClick={(e) => e.preventDefault()}
              sx={{
                color: 'primary.main',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              <Trans>please check here first</Trans>
              {'>'}
            </Box>
          </Trans>
        </Box>
      </Box>

      {/* Sales Ratio Input */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <Title
          question={t`The portion of the Crowdpooling tokens that will be used to raise funds. The leftover tokens that are not sold and the sale proceeds will together create a liquidity pool after the Crowdpooling period ends.`}
        >
          <Trans>% of Tokens for Sale</Trans>
        </Title>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          <Input
            height={48}
            sx={{
              backgroundColor: theme.palette.background.paperContrast,
            }}
            value={salesRatio == null ? '' : salesRatio}
            onChange={(e) => {
              const value = e.target.value;
              const num = parseFloat(value);
              if (value === '' || (!isNaN(num) && num >= 0 && num <= 100)) {
                dispatch({
                  type: Types.UpdatePriceSettings,
                  payload: {
                    salesRatio: value === '' ? null : num,
                  },
                });
              }
            }}
            suffix={
              <Box sx={{ color: 'text.secondary', typography: 'body2' }}>%</Box>
            }
          />

          {/* Tokens for Participants Display */}
          <Box
            sx={{
              backgroundColor: theme.palette.background.paperContrast,
              borderRadius: 8,
              border: 'solid 1px',
              borderColor: 'border.main',
              height: 48,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              px: 16,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <Box
                sx={{
                  typography: 'body2',
                  color: 'text.secondary',
                }}
              >
                <Trans>Tokens for Participants</Trans>
              </Box>
              <QuestionTooltip
                title={t`The number of Crowdpooling tokens that will be distributed to participants, calculated by the number of tokens supplied * sales ratio`}
                sx={{
                  width: 16,
                  height: 16,
                }}
              />
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <Box
                sx={{
                  typography: 'body2',
                  fontWeight: 500,
                }}
              >
                {tokensForParticipants.gt(0)
                  ? formatTokenAmountNumber({
                      input: tokensForParticipants,
                      decimals: baseToken?.decimals,
                    })
                  : '-'}
              </Box>
              <Box
                sx={{
                  typography: 'body2',
                  color: 'text.secondary',
                }}
              >
                {baseToken?.symbol}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Price Settings */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <Title question={t`Token price during the Crowdpooling campaign`}>
          <Trans>Price</Trans>
        </Title>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          {/* Quote Token Selector + Price Input */}
          <Box
            sx={{
              display: 'flex',
              gap: 8,
            }}
          >
            {/* Quote Token Selector */}
            <ButtonBase
              sx={{
                width: 107,
                height: 48,
                backgroundColor: 'background.paper',
                borderRadius: 8,
                border: 'solid 1px',
                borderColor: 'border.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                px: 16,
              }}
            >
              {quoteToken ? (
                <>
                  <TokenLogo
                    token={quoteToken as TokenInfo}
                    width={18}
                    height={18}
                    marginRight={0}
                  />
                  <Box
                    sx={{
                      typography: 'button',
                      fontWeight: 600,
                      color: 'text.primary',
                    }}
                  >
                    {quoteToken.symbol}
                  </Box>
                </>
              ) : (
                <Box
                  sx={{
                    typography: 'button',
                    fontWeight: 600,
                    color: 'text.primary',
                  }}
                >
                  <Trans>Select</Trans>
                </Box>
              )}
              <Box
                sx={{
                  width: 14,
                  height: 14,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M3 5.5L7 9.5L11 5.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Box>
            </ButtonBase>

            {/* Price Input */}
            <Input
              height={48}
              sx={{
                backgroundColor: theme.palette.background.paperContrast,
              }}
              value={price ?? ''}
              onChange={(e) => {
                const value = e.target.value;
                dispatch({
                  type: Types.UpdatePriceSettings,
                  payload: {
                    price: value === '' ? null : value,
                  },
                });
              }}
              placeholder="0.0000000000000000000001-10000000000000000"
              suffix={
                <Box sx={{ color: 'text.secondary', typography: 'body2' }}>
                  {quoteToken?.symbol}
                </Box>
              }
            />
          </Box>

          {/* Hard Cap Display */}
          <Box
            sx={{
              backgroundColor: theme.palette.background.paperContrast,
              borderRadius: 8,
              border: 'solid 1px',
              borderColor: 'border.main',
              height: 48,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              px: 16,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <Box
                sx={{
                  typography: 'body2',
                  color: 'text.secondary',
                }}
              >
                <Trans>Hard Cap</Trans>
              </Box>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <Box
                sx={{
                  typography: 'body2',
                  fontWeight: 500,
                }}
              >
                {hardCap.gt(0) ? formatReadableNumber({ input: hardCap }) : '-'}
              </Box>
              <Box
                sx={{
                  typography: 'body2',
                  color: 'text.secondary',
                }}
              >
                {quoteToken?.symbol || '-'}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Error Display */}
      <ErrorTip errorKey={errorKey} />

      {/* Next Button */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          position: {
            mobile: 'sticky',
            tablet: 'relative',
          },
          bottom: 0,
          backgroundColor: 'background.paper',
          pt: 28,
          pb: 20,
          px: {
            mobile: 0,
            tablet: 57,
          },
        }}
      >
        <NeedConnectButton
          includeButton
          chainId={onlyChainId}
          fullWidth
          size={Button.Size.big}
        >
          <TokenStatusButton
            status={baseStatus}
            buttonProps={{
              fullWidth: true,
              size: Button.Size.big,
            }}
          >
            <Button
              fullWidth
              size={Button.Size.big}
              disabled={!!errorKey}
              onClick={() => handleNext()}
            >
              <Trans>Next</Trans>
            </Button>
          </TokenStatusButton>
        </NeedConnectButton>
      </Box>
    </Box>
  );
}
