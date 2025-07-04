import { Box, Button } from '@dodoex/components';
import { t } from '@lingui/macro';
import Dialog from '../../../../components/Dialog';
import { useWidgetDevice } from '../../../../hooks/style/useWidgetDevice';
import { PositionPreview } from './PositionPreview';
import { TokenInfo } from '../../../../hooks/Token';

export interface ReviewModalProps {
  on: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
  token0: TokenInfo | undefined;
  token1: TokenInfo | undefined;
  liquidity: number | string | undefined;
  amount0: string | undefined;
  amount1: string | undefined;
  title?: React.ReactNode;
  price: string | undefined;
  tickLower: number | undefined;
  tickUpper: number | undefined;
  inRange: boolean;
}

export const ReviewModal = ({
  on,
  onClose,
  onConfirm,
  loading,
  token0,
  token1,
  liquidity,
  amount0,
  amount1,
  price,
  tickLower,
  tickUpper,
  title,
  inRange,
}: ReviewModalProps) => {
  const { isMobile } = useWidgetDevice();

  return (
    <Dialog
      open={on}
      onClose={onClose}
      modal
      title={title ?? t`Add liquidity`}
      height={683}
    >
      <Box
        sx={{
          flex: 1,
          px: 20,
          pb: 24,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: isMobile ? undefined : 420,
        }}
      >
        <Box
          sx={{
            pt: 0,
            px: 0,
          }}
        >
          <PositionPreview
            token0={token0}
            token1={token1}
            price={price}
            tickLower={tickLower}
            tickUpper={tickUpper}
            liquidity={liquidity}
            amount0={amount0}
            amount1={amount1}
            inRange={inRange}
            title={t`Selected Range`}
          />
        </Box>

        <Button
          size={Button.Size.big}
          fullWidth
          isLoading={loading}
          sx={{
            mt: 20,
          }}
          onClick={onConfirm}
        >
          {t`Confirm`}
        </Button>
      </Box>
    </Dialog>
  );
};
