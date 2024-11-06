import { Box, useTheme } from '@dodoex/components';
import { Trans } from '@lingui/macro';
import BigNumber from 'bignumber.js';
import { useMemo } from 'react';
import { chainListMap } from '../../../../constants/chainList';
import { ChainId } from '@dodoex/api';
import { BridgeStepTool } from '../../../../hooks/Bridge/useFetchRoutePriceBridge';
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
  const theme = useTheme();

  const chain = useMemo(() => {
    return chainListMap.get(chainId as ChainId);
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
            <Trans>For</Trans>
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
              <Trans>on</Trans>
            </span>
            <Box
              component={chain?.logo}
              sx={{
                marginLeft: 4,
                width: 18,
                height: 18,
              }}
            />
            <Box
              component="span"
              sx={{
                ml: 4,
              }}
            >
              {chain?.name}
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
            <Trans>on</Trans>
          </span>
          <Box
            component={chain?.logo}
            sx={{
              marginLeft: 4,
              width: 18,
              height: 18,
            }}
          />
          <Box
            component="span"
            sx={{
              ml: 4,
              mr: 8,
            }}
          >
            {chain?.name}
          </Box>
        </Box>

        <EtherscanLinkButton chainId={chainId} address={hash}>
          <Trans>Tx</Trans>
        </EtherscanLinkButton>
      </Box>
    </Box>
  );
}
