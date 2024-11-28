import { ChainId } from '@dodoex/api';
import { Box, Button, EmptyDataIcon, useTheme } from '@dodoex/components';
import { Error } from '@dodoex/icons';
import { t } from '@lingui/macro';
import { useMemo, useState } from 'react';
import NeedConnectButton from '../../../components/ConnectWallet/NeedConnectButton';
import Dialog from '../../../components/Dialog';
import { useWalletInfo } from '../../../hooks/ConnectWallet/useWalletInfo';
import { useWidgetDevice } from '../../../hooks/style/useWidgetDevice';
import { TokenInfo } from '../../../hooks/Token/type';
import { AMMV3PositionManage } from './AMMV3PositionManage';
import { PositionViewCard } from './components/PositionViewCard';
import { useV3Positions } from './hooks/useV3Positions';
import { FeeAmount } from './sdks/v3-sdk';
import { PositionDetails } from './types/position';

export interface AMMV3PositionsViewProps {
  chainId: ChainId;
  baseToken: TokenInfo;
  quoteToken: TokenInfo;
  feeAmount: FeeAmount;
  onClose: (() => void) | undefined;
  handleGoToAddLiquidityV3: (params: {
    fromAddress: string;
    toAddress: string;
    feeAmount: FeeAmount;
  }) => void;
}

export const AMMV3PositionsView = ({
  chainId,
  baseToken,
  quoteToken,
  feeAmount,
  onClose,
  handleGoToAddLiquidityV3,
}: AMMV3PositionsViewProps) => {
  const { isMobile } = useWidgetDevice();
  const theme = useTheme();

  const { account } = useWalletInfo();

  const { positions, loading } = useV3Positions(account, chainId);

  const [manageItem, setManageItem] = useState<PositionDetails | null>(null);

  const content = useMemo(() => {
    return (
      <Box
        sx={{
          p: 20,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <Box
          sx={{
            pb: 16,
            borderBottomColor: theme.palette.border.main,
            borderBottomStyle: 'solid',
            borderBottomWidth: 1,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              typography: 'body1',
              fontWeight: 600,
              color: theme.palette.text.primary,
            }}
          >
            {t`My Positions`}&nbsp;({positions?.length ?? 0})
          </Box>

          {onClose ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: 24,
                height: 24,
                borderRadius: '50%',
                borderWidth: 1,
                color: 'text.secondary',
                cursor: 'pointer',
              }}
            >
              <Box
                component={Error}
                sx={{
                  width: 16,
                  height: 16,
                }}
                onClick={() => {
                  onClose();
                }}
              />
            </Box>
          ) : undefined}
        </Box>

        {positions && positions.length > 0 ? (
          <>
            {positions?.map((p) => {
              return (
                <PositionViewCard
                  key={p.tokenId}
                  p={p}
                  baseToken={baseToken}
                  quoteToken={quoteToken}
                  onClickManage={() => {
                    setManageItem(p);
                  }}
                />
              );
            })}
            <Button
              size={Button.Size.big}
              variant={Button.Variant.second}
              onClick={() => {
                handleGoToAddLiquidityV3({
                  fromAddress: baseToken.address,
                  toAddress: quoteToken.address,
                  feeAmount,
                });
              }}
              sx={{
                gap: 8,
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z"
                  fill="#1A1A1B"
                />
              </svg>
              {t`Add Position`}
            </Button>
          </>
        ) : (
          <>
            <Box
              sx={{
                mt: 100,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <EmptyDataIcon />
              <Box
                sx={{
                  typography: 'body1',
                  color: theme.palette.text.secondary,
                }}
              >{t`Your position is  empty`}</Box>
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {positions !== undefined && positions.length === 0 ? (
                <Button
                  size={Button.Size.small}
                  onClick={() => {
                    handleGoToAddLiquidityV3({
                      fromAddress: baseToken.address,
                      toAddress: quoteToken.address,
                      feeAmount,
                    });
                  }}
                >{t`Add Position`}</Button>
              ) : (
                <NeedConnectButton size={Button.Size.small} />
              )}
            </Box>
          </>
        )}
      </Box>
    );
  }, [
    baseToken,
    feeAmount,
    handleGoToAddLiquidityV3,
    onClose,
    positions,
    quoteToken,
    theme.palette.border.main,
    theme.palette.text.primary,
    theme.palette.text.secondary,
  ]);

  if (manageItem !== null) {
    return (
      <AMMV3PositionManage
        baseToken={baseToken}
        quoteToken={quoteToken}
        feeAmount={feeAmount}
        tokenId={manageItem.tokenId}
        chainId={chainId}
        onClose={() => {
          setManageItem(null);
        }}
      />
    );
  }

  if (isMobile) {
    return (
      <Dialog
        open={baseToken != null && quoteToken != null}
        onClose={onClose}
        scope={!isMobile}
        modal={undefined}
        id="pool-operate"
      >
        {content}
      </Dialog>
    );
  }

  return content;
};