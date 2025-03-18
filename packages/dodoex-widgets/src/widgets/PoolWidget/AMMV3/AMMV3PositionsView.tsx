import { Box, Button, EmptyDataIcon, useTheme } from '@dodoex/components';
import { Error } from '@dodoex/icons';
import { t } from '@lingui/macro';
import { PositionInfoLayout } from '@raydium-io/raydium-sdk-v2';
import { PublicKey } from '@solana/web3.js';
import { useMemo, useState } from 'react';
import NeedConnectButton from '../../../components/ConnectWallet/NeedConnectButton';
import Dialog from '../../../components/Dialog';
import { LoadingRotation } from '../../../components/LoadingRotation';
import { useWalletInfo } from '../../../hooks/ConnectWallet/useWalletInfo';
import { useWidgetDevice } from '../../../hooks/style/useWidgetDevice';
import { AMMV3PositionManage } from './AMMV3PositionManage';
import { PositionViewCard } from './components/PositionViewCard';
import { useMintAAndMintB } from './hooks/useMintAAndMintB';
import { useV3Positions } from './hooks/useV3Positions';
import { FeeAmount } from './sdks/v3-sdk/constants';

export interface AMMV3PositionsViewProps {
  mint1Address: string;
  mint2Address: string;
  feeAmount: FeeAmount;
  poolId: string;
  onClose: (() => void) | undefined;
  handleGoToAddLiquidityV3: (params: {
    from?: string;
    to?: string;
    fee?: string;
  }) => void;
}

export const AMMV3PositionsView = ({
  mint1Address,
  mint2Address,
  feeAmount,
  poolId,
  onClose,
  handleGoToAddLiquidityV3,
}: AMMV3PositionsViewProps) => {
  const { isMobile } = useWidgetDevice();
  const theme = useTheme();

  const { chainId, account } = useWalletInfo();

  const { positions, loading } = useV3Positions(chainId);

  const { mintA, mintB } = useMintAAndMintB({
    mint1Address,
    mint2Address,
  });

  const currentPairPositions = useMemo(() => {
    if (positions === undefined) {
      return undefined;
    }
    return positions.filter((p) => p.poolId.equals(new PublicKey(poolId)));
  }, [positions, poolId]);

  const [manageItem, setManageItem] = useState<ReturnType<
    typeof PositionInfoLayout.decode
  > | null>(null);

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

        {loading || !currentPairPositions ? (
          <>
            <Box
              sx={{
                mt: 100,
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <LoadingRotation />
            </Box>
          </>
        ) : currentPairPositions.length > 0 ? (
          <>
            {currentPairPositions?.map((p) => {
              return (
                <PositionViewCard
                  key={p.nftMint.toBase58()}
                  position={p}
                  mintA={mintA}
                  mintB={mintB}
                  feeAmount={feeAmount}
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
                  from: mintA?.address,
                  to: mintB?.address,
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
                  fill="currentColor"
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
              <NeedConnectButton size={Button.Size.small} includeButton>
                <Button
                  size={Button.Size.small}
                  onClick={() => {
                    handleGoToAddLiquidityV3({
                      from: mintA?.address,
                      to: mintB?.address,
                      fee: String(feeAmount),
                    });
                  }}
                >{t`Add Position`}</Button>
              </NeedConnectButton>
            </Box>
          </>
        )}
      </Box>
    );
  }, [
    currentPairPositions,
    feeAmount,
    handleGoToAddLiquidityV3,
    loading,
    mintA,
    mintB,
    onClose,
    theme.palette.background.paper,
    theme.palette.border.main,
    theme.palette.text.primary,
    theme.palette.text.secondary,
  ]);

  if (manageItem !== null) {
    return (
      <AMMV3PositionManage
        mint1Address={mint1Address}
        mint2Address={mint2Address}
        feeAmount={feeAmount}
        poolId={manageItem.poolId.toBase58()}
        nftMint={manageItem.nftMint.toBase58()}
        onClose={() => {
          setManageItem(null);
        }}
      />
    );
  }

  if (isMobile) {
    return (
      <Dialog
        open={mintA != null && mintB != null}
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
