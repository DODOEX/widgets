import { CP_STATUS, Crowdpooling, CrowdpoolingDetail } from '../../types';
import { getStatusWithTimes } from '../../helper';

interface Props {
  cp?: Crowdpooling | CrowdpoolingDetail;
  isSettled?: boolean;
}

export const useCPDynamicStatus = ({ cp, isSettled }: Props) => {
  let status: Crowdpooling['status'] = cp?.status ?? CP_STATUS.PROCESSING;

  if (cp && cp.bidEndTime && cp.bidStartTime) {
    status = getStatusWithTimes(
      cp.bidStartTime,
      cp.bidEndTime,
      cp.calmEndTime,
      cp.settled || isSettled,
    );
  }

  return { status };
};
