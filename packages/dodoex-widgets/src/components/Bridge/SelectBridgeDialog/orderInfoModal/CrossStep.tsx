import { Box, useTheme } from '@dodoex/components';
import BigNumber from 'bignumber.js';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { chainListMap } from '../../../../constants/chainList';
import { ChainId } from '../../../../constants/chains';
import { BridgeStepTool } from '../../../../hooks/Bridge/useFetchRoutePriceBridge';
import { formatTokenAmountNumber } from '../../../../utils';
import { EtherscanLinkButton } from './EtherscanLinkButton';

export function CrossStep({
  fromChainId,
  toChainId,
  fromTokenAmount,
  toTokenAmount,
  fromTokenDecimals,
  fromTokenSymbol,
  toTokenDecimals,
  toTokenSymbol,
  fromHash,
  toHash,
  toolDetails,
}: {
  fromChainId: number;
  toChainId: number;
  fromTokenAmount: BigNumber;
  toTokenAmount: BigNumber;
  fromTokenSymbol: string;
  fromTokenDecimals: number;
  toTokenSymbol: string;
  toTokenDecimals: number;
  fromHash: string | null;
  toHash: string | null;
  toolDetails: BridgeStepTool;
  // isFailedStatus: boolean;
}) {
  const { t } = useTranslation();
  const theme = useTheme();

  const [fromChain, toChain] = useMemo(() => {
    return [
      chainListMap[fromChainId as ChainId],
      chainListMap[toChainId as ChainId],
    ];
  }, [fromChainId, toChainId]);

  return (
    <Box
      sx={{
        borderLeft: `1px dashed ${theme.palette.text.primary}`,
        // opacity: toHash || isFailedStatus ? 1 : 0.5,
        opacity: toHash ? 1 : 0.5,
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
            width: 20,
            height: 20,
            marginLeft: -10.5,
            pt: 1,
            backgroundColor: {
              mobile: theme.palette.background.paper,
              tablet: theme.palette.background.paper,
            },
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
              color: theme.palette.text.secondary,
            }}
          >
            {t('bridge.swap.on-what-bridge')}
          </span>
          <Box
            component={fromChain?.logo}
            sx={{
              marginLeft: 4,
              width: '18px',
            }}
          />
          <span
            style={{
              marginLeft: 4,
              marginRight: 4,
              color: theme.palette.text.secondary,
            }}
          >
            {t('bridge.swap.to-what-bridge')}
          </span>
          {formatTokenAmountNumber({
            input: toTokenAmount,
            decimals: toTokenDecimals,
          })}
          &nbsp;
          {toTokenSymbol}
          <span
            style={{
              marginLeft: 4,
              color: theme.palette.text.secondary,
            }}
          >
            {t('bridge.swap.on-what-bridge')}
          </span>
          <Box
            component={toChain?.logo}
            sx={{
              marginLeft: 4,
              width: '18px',
            }}
          />
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          mt: {
            mobile: 8,
            tablet: 5,
          },
        }}
      >
        <EtherscanLinkButton chainId={fromChainId} address={fromHash}>
          {t('bridge.order.source')}
        </EtherscanLinkButton>
        <Box
          sx={{
            width: 16,
          }}
        />
        <EtherscanLinkButton chainId={toChainId} address={toHash}>
          {t('bridge.order.destination')}
        </EtherscanLinkButton>
      </Box>
    </Box>
  );
}
