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
import { areAddressesEqual, buildCurrency } from './utils';

export interface AMMV3PositionsViewProps {
  chainId: ChainId;
  baseToken: TokenInfo;
  quoteToken: TokenInfo;
  feeAmount: FeeAmount;
  onClose: (() => void) | undefined;
  handleGoToAddLiquidityV3: (params: {
    from?: string;
    to?: string;
    fee?: string;
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

  const currencyA = useMemo(
    () => (baseToken ? buildCurrency(baseToken) : undefined),
    [baseToken],
  );
  const currencyB = useMemo(
    () => (quoteToken ? buildCurrency(quoteToken) : undefined),
    [quoteToken],
  );

  const [tokenA, tokenB] = useMemo(
    () => [currencyA?.wrapped, currencyB?.wrapped],
    [currencyA, currencyB],
  );

  const [token0, token1] = useMemo(
    () =>
      tokenA && tokenB
        ? tokenA.sortsBefore(tokenB)
          ? [tokenA, tokenB]
          : [tokenB, tokenA]
        : [undefined, undefined],
    [tokenA, tokenB],
  );

  const currentPairPositions = useMemo<PositionDetails[] | undefined>(() => {
    if (positions === undefined) {
      return undefined;
    }
    return positions.filter(
      (p) =>
        areAddressesEqual(token0?.address, p.token0) &&
        areAddressesEqual(token1?.address, p.token1) &&
        p.fee === feeAmount,
    );
  }, [feeAmount, positions, token0?.address, token1?.address]);

  const [manageItem, setManageItem] = useState<PositionDetails | null>(null);

  const content = useMemo(() => {
    return (
      <Box
        sx={{
          p: 20,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          borderRadius: 16,
          backgroundColor: theme.palette.background.paper,
          minHeight: 480,
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
            {t`My Positions`}&nbsp;({currentPairPositions?.length ?? 0})
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

        {currentPairPositions && currentPairPositions.length > 0 ? (
          <>
            {currentPairPositions?.map((p) => {
              return (
                <PositionViewCard
                  key={p.tokenId}
                  p={p}
                  currency0={currencyA}
                  currency1={currencyB}
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
                  from: baseToken.address,
                  to: quoteToken.address,
                  fee: String(feeAmount),
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
              <EmptyDataIcon
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: (24 / 105) * 60,
                }}
              />
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
              {currentPairPositions !== undefined &&
              currentPairPositions.length === 0 ? (
                <Button
                  size={Button.Size.small}
                  onClick={() => {
                    handleGoToAddLiquidityV3({
                      from: baseToken.address,
                      to: quoteToken.address,
                      fee: String(feeAmount),
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
    theme.palette.background.paper,
    theme.palette.border.main,
    theme.palette.text.primary,
    theme.palette.text.secondary,
    currentPairPositions,
    onClose,
    currencyA,
    currencyB,
    handleGoToAddLiquidityV3,
    baseToken.address,
    quoteToken.address,
    feeAmount,
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
