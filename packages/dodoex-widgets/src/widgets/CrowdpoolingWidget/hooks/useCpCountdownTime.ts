import { t } from '@lingui/macro';
import { CP_STATUS } from '../types';
import BigNumber from 'bignumber.js';

export function useCpCountdownTime({
  status,
  bidStartTime,
  bidEndTime,
  calmEndTime,
  isSettled,
  settledTime,
  duration,
  vestingDuration,
  isClaimed,
}: {
  status: string;
  bidStartTime?: number;
  bidEndTime?: number;
  calmEndTime?: number;
  isSettled?: boolean;
  settledTime?: number;
  duration?: number;
  vestingDuration?: number;
  isClaimed?: boolean;
}) {
  let label = '';
  let time: string | number | undefined = '';
  switch (status) {
    case CP_STATUS.WAITING:
      label = t`Start in`;
      time = bidStartTime;
      break;
    case CP_STATUS.PROCESSING:
      label = t`Sale Ends In`;
      time = bidEndTime;
      break;
    case CP_STATUS.CALMING:
      label = t`Cooling-off Period`;
      time = calmEndTime;
      break;
    case CP_STATUS.ENDED:
      if (isSettled) {
        const result = new BigNumber(settledTime ?? 0)
          .plus(new BigNumber(duration ?? 0).times(1000))
          .plus(new BigNumber(vestingDuration ?? 0).times(1000))
          .toNumber();
        if (!isClaimed && result > Date.now()) {
          label = t`Full Release In`;
          time = result;
        }
      }
  }

  return {
    time,
    label,
  };
}
