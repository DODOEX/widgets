import { FeeAmount } from '../sdks/v3-sdk/constants';

export const FEE_AMOUNT_DETAIL: Record<FeeAmount, { label: string }> = {
  // [FeeAmount.LOWEST]: {
  //   label: '0.01%',
  // },
  // [FeeAmount.LOW_200]: {
  //   label: '0.02%',
  // },
  // [FeeAmount.LOW_300]: {
  //   label: '0.03%',
  // },
  // [FeeAmount.LOW_400]: {
  //   label: '0.04%',
  // },
  [FeeAmount.LOW]: {
    label: '0.1%',
  },
  // [FeeAmount.MEDIUM]: {
  //   label: '0.30%',
  // },
  // [FeeAmount.HIGH]: {
  //   label: '1.00%',
  // },
};
