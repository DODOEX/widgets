import { Box, useTheme } from '@dodoex/components';
import BigNumber from 'bignumber.js';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { chainListMap } from '../../../../constants/chainList';
import { ChainId } from '../../../../constants/chains';
import { BridgeStepTool } from '../../../../hooks/Bridge';
import { formatTokenAmountNumber } from '../../../../utils/formatter';
import { EtherscanLinkButton } from './EtherscanLinkButton';

export function SwapStep({
  chainId,
  fromTokenAmount,
  toTokenAmount,
  fromTokenDecimals,
  fromTokenSymbol,
  toTokenDecimals,
  toTokenSymbol,
  hash,
  toolDetails,
}: {
  chainId: number;
  fromTokenAmount: BigNumber;
  toTokenAmount: BigNumber;
  fromTokenSymbol: string;
  fromTokenDecimals: number;
  toTokenSymbol: string;
  toTokenDecimals: number;
  hash: string | null;
  toolDetails: BridgeStepTool;
  // isFailedStatus: boolean;
}) {
  const { t } = useTranslation();
  const theme = useTheme();

  const chain = useMemo(() => {
    return chainListMap[chainId as ChainId];
  }, [chainId]);

  return (
    <Box
      sx={{
        borderLeft: `1px dashed ${theme.palette.text.primary}`,
        // opacity: hash || isFailedStatus ? 1 : 0.5,
        opacity: hash ? 1 : 0.5,
        pb: 24,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          flexWrap: {
            mobile: 'wrap',
            tablet: 'nowrap',
          },
        }}
      >
        <Box
          component="img"
          src={toolDetails.logoURI}
          alt={toolDetails.name}
          sx={{
            width: '20px',
            marginLeft: -10.5,
            pt: 1,
            backgroundColor: theme.palette.background.paper,
            alignSelf: 'flex-start',
          }}
        />
        <Box
          sx={{
            ml: 8,
            typography: 'body1',
            // color: isFailedStatus
            //   ? theme.palette.custom.status.red.default
            //   : theme.palette.text.primary,
          }}
        >
          {toolDetails.name}
        </Box>

        <Box
          sx={{
            typography: 'body2',
            marginLeft: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            width: {
              mobile: '100%',
              tablet: 'auto',
            },
            mt: {
              mobile: 8,
              tablet: 0,
            },
          }}
        >
          {formatTokenAmountNumber({
            input: fromTokenAmount,
            decimals: fromTokenDecimals,
          })}
          &nbsp;{fromTokenSymbol}
          <span
            style={{
              marginLeft: 4,
              marginRight: 4,
              color: theme.palette.text.secondary,
            }}
          >
            {t('bridge.swap.for-what-token')}
          </span>
          {formatTokenAmountNumber({
            input: toTokenAmount,
            decimals: toTokenDecimals,
          })}
          &nbsp;
          {toTokenSymbol}
          <Box
            sx={{
              alignItems: 'center',
              display: {
                mobile: 'none',
                tablet: 'flex',
              },
            }}
          >
            <span
              style={{
                marginLeft: 4,
                color: theme.palette.text.secondary,
              }}
            >
              {t('bridge.swap.on-what-bridge')}
            </span>
            <Box
              component={chain?.logo}
              sx={{
                marginLeft: 4,
                width: '18px',
              }}
            />
            <Box
              component="span"
              sx={{
                ml: 4,
              }}
            >
              {chain.name}
            </Box>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          typography: 'body2',
          mt: {
            mobile: 8,
            tablet: 5,
          },
        }}
      >
        <Box
          sx={{
            alignItems: 'center',
            display: {
              mobile: 'flex',
              tablet: 'none',
            },
          }}
        >
          <span
            style={{
              color: theme.palette.text.secondary,
            }}
          >
            {t('bridge.swap.on-what-bridge')}
          </span>
          <Box
            component={chain?.logo}
            sx={{
              marginLeft: 4,
              width: '18px',
            }}
          />
          <Box
            component="span"
            sx={{
              ml: 4,
              mr: 8,
            }}
          >
            {chain.name}
          </Box>
        </Box>

        <EtherscanLinkButton chainId={chainId} address={hash}>
          {t('bridge.order.tx')}
        </EtherscanLinkButton>
      </Box>
    </Box>
  );
}
