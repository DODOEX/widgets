import { t, Trans } from '@lingui/macro';
import Confirm from '../../../../components/Confirm';

export default function FixedInitPriceConfirm({
  on,
  onClose,
  onConfirm,
}: {
  on: boolean;
  onClose: () => void;
  onConfirm?: () => void;
}) {
  return (
    <Confirm
      open={on}
      onClose={onClose}
      onConfirm={onConfirm}
      title={t`Initial Price Alert`}
      modal
    >
      <Trans>
        The initial price is different from the current market price, which may
        cause your pool to be arbitraged
      </Trans>
    </Confirm>
  );
}
