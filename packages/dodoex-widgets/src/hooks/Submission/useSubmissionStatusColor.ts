import { useTheme } from '@dodoex/components';
import { t } from '@lingui/macro';

export enum StateText {
  Running = 'pending',
  Success = 'success',
  Failed = 'failed',
  /** Accelerated or canceled tx warning handling */
  Warning = 'reset',
}

export function useSubmissionStatusColor({
  status,
  stateTextMap,
}: {
  status: string | number;
  stateTextMap?: {
    [key: string | number]: StateText;
  };
}) {
  let stateValue = (stateTextMap ? stateTextMap[status] : status) as StateText;

  const theme = useTheme();
  let statusText = t`Loading`;
  let statusColor = theme.palette.text.primary;
  let statusAlphaColor: undefined | number;
  switch (status) {
    case StateText.Warning:
      statusText = t`Canceled`;
      statusAlphaColor = 0.1;
      break;
    case StateText.Failed:
      statusText = t`Failed`;
      statusColor = theme.palette.error.main;
      break;
    case StateText.Success:
      statusText = t`Succeeded`;
      statusColor = theme.palette.success.main;
      break;

    default:
      break;
  }

  return {
    state: stateValue,
    statusText,
    statusColor,
    statusAlphaColor,
  };
}
