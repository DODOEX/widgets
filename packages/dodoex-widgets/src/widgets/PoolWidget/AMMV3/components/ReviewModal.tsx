import { Box, Button } from '@dodoex/components';
import { t } from '@lingui/macro';
import Dialog from '../../../../components/Dialog';
import { useWidgetDevice } from '../../../../hooks/style/useWidgetDevice';
import { Currency, CurrencyAmount, Price } from '../sdks/sdk-core';
import { Position } from '../sdks/v3-sdk';
import { Bound, Field } from '../types';
import { PositionPreview } from './PositionPreview';

export interface ReviewModalProps {
  position?: Position;
  existingPosition?: Position;
  parsedAmounts: { [field in Field]?: CurrencyAmount<Currency> };
  priceLower?: Price<Currency, Currency>;
  priceUpper?: Price<Currency, Currency>;
  outOfRange: boolean;
  ticksAtLimit: { [bound in Bound]?: boolean | undefined };
  on: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export const ReviewModal = ({
  on,
  onClose,
  position,
  outOfRange,
  ticksAtLimit,
  onConfirm,
  loading,
}: ReviewModalProps) => {
  const { isMobile } = useWidgetDevice();

  return (
    <Dialog open={on} onClose={onClose} modal title={t`Add liquidity`}>
      <Box
        sx={{
          flex: 1,
          px: 20,
          pb: 20,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: isMobile ? undefined : 420,
        }}
      >
        <Box
          sx={{
            pt: 40,
            px: 8,
          }}
        >
          {position ? (
            <PositionPreview
              position={position}
              inRange={!outOfRange}
              ticksAtLimit={ticksAtLimit}
              title="Selected Range"
            />
          ) : null}
        </Box>

        <Button
          fullWidth
          isLoading={loading}
          sx={{
            mt: 30,
          }}
          onClick={onConfirm}
        >
          {t`Add`}
        </Button>
      </Box>
    </Dialog>
  );
};
