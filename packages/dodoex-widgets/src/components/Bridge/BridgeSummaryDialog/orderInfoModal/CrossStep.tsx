import { Box, useTheme } from '@dodoex/components';
import { Trans } from '@lingui/macro';
import BigNumber from 'bignumber.js';
import { useMemo } from 'react';
import { chainListMap } from '../../../../constants/chainList';
import { ChainId } from '@dodoex/api';
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
  const theme = useTheme();

  const [fromChain, toChain] = useMemo(() => {
    return [
      chainListMap.get(fromChainId as ChainId),
      chainListMap.get(toChainId as ChainId),
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
          flexWrap: 'wrap',
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
            <Trans>On</Trans>
          </span>
          <Box
            component={fromChain?.logo}
            sx={{
              marginLeft: 4,
              width: 18,
              height: 18,
            }}
          />
          <span
            style={{
              marginLeft: 4,
              marginRight: 4,
              color: theme.palette.text.secondary,
            }}
          >
            <Trans>To</Trans>
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
            <Trans>On</Trans>
          </span>
          <Box
            component={toChain?.logo}
            sx={{
              marginLeft: 4,
              width: 18,
              height: 18,
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
          <Trans>Source</Trans>
        </EtherscanLinkButton>
        <Box
          sx={{
            width: 16,
          }}
        />
        <EtherscanLinkButton chainId={toChainId} address={toHash}>
          <Trans>Destination</Trans>
        </EtherscanLinkButton>
      </Box>
    </Box>
  );
}
