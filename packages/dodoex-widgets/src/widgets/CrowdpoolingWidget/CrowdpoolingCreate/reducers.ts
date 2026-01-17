import BigNumber from 'bignumber.js';
import { TokenInfo } from '../../../hooks/Token/type';

export interface PriceSettingsType {
  baseToken: TokenInfo | null;
  quoteToken: TokenInfo | null;
  baseTokenShowDecimals?: number;
  quoteTokenShowDecimals?: number;
  price: string | null;
  baseTokenAmount: string;
  salesRatio: number | null;
  baseTokenSalesAmount: BigNumber;
  quoteCap: number | null;
  k: number;
  hardcapPrice: BigNumber | null;
  targetTakerTokenDisplayAmount: BigNumber;
}

export interface TimeSettingsType {
  bidStartTime: number | null;
  bidEndTime: number | null;
  freezeDuration: number;
}

export interface OptionalSettingsType {
  calmEndTime: number | null;
  delayClaim: boolean;
  initClaimRate: number | null;
  claimStartTime: number | null;
  freeCycle: number | null;
  overflowLimit: boolean;
  poolFeeRate: number;
  isHardCap: boolean;
  hardCapPricePerUser: number | null;
  liquidityAddedPercent: number | null;
  liquidityPoolType: 'dvm' | 'cp';
  creator: string | null;
}

export interface IntroSettingsType {
  projectName: string;
  coverImageUrl: string;
  description: string;
  websiteUrl: string;
  twitterUrl: string;
  telegramUrl: string;
  discordUrl: string;
  enabledSocialLinks: {
    website: boolean;
    twitter: boolean;
    discord: boolean;
    telegram: boolean;
  };
}

export interface StateProps {
  curStep: StepStatus;
  priceSettings: PriceSettingsType;
  timeSettings: TimeSettingsType;
  optionalSettings: OptionalSettingsType;
  introSettings: IntroSettingsType;
}

export enum Types {
  UpdateCurStep,
  UpdatePriceSettings,
  UpdateTimeSettings,
  UpdateOptionalSettings,
  UpdateIntroSettings,
  Cover,
}

export enum StepStatus {
  PriceSettings = 1,
  TimeSettings = 2,
  OptionalSettings = 3,
  IntroSettings = 4,
}

type Payload = {
  [Types.UpdateCurStep]: StepStatus;
  [Types.UpdatePriceSettings]: Partial<PriceSettingsType>;
  [Types.UpdateTimeSettings]: Partial<TimeSettingsType>;
  [Types.UpdateOptionalSettings]: Partial<OptionalSettingsType>;
  [Types.UpdateIntroSettings]: Partial<IntroSettingsType>;
  [Types.Cover]: Partial<StateProps>;
};

export type Actions = Payload[keyof Payload];

const Now = Date.now();
export const OneDayTime = 60 * 60 * 24 * 1000;

export const initPriceSettings: PriceSettingsType = {
  baseToken: null,
  quoteToken: null,
  price: null,
  baseTokenAmount: '',
  salesRatio: 50,
  baseTokenSalesAmount: new BigNumber(0),
  quoteCap: null,
  k: 1,
  hardcapPrice: null,
  targetTakerTokenDisplayAmount: new BigNumber(0),
};

export const initTimeSettings: TimeSettingsType = {
  bidStartTime: Now + OneDayTime,
  bidEndTime: Now + 2 * OneDayTime,
  freezeDuration: 30,
};

export const initOptionalSettings: OptionalSettingsType = {
  calmEndTime: Now + 2 * OneDayTime + 60 * 5 * 1000,
  delayClaim: false,
  initClaimRate: null,
  claimStartTime: null,
  freeCycle: null,
  overflowLimit: false,
  poolFeeRate: 0.3,
  isHardCap: false,
  hardCapPricePerUser: null,
  liquidityAddedPercent: null,
  liquidityPoolType: 'dvm',
  creator: null,
};

export const initIntroSettings: IntroSettingsType = {
  projectName: '',
  coverImageUrl: '',
  description: '',
  websiteUrl: '',
  twitterUrl: '',
  telegramUrl: '',
  discordUrl: '',
  enabledSocialLinks: {
    website: true,
    twitter: true,
    discord: false,
    telegram: false,
  },
};

export const initState: StateProps = {
  curStep: StepStatus.PriceSettings,
  priceSettings: initPriceSettings,
  timeSettings: initTimeSettings,
  optionalSettings: initOptionalSettings,
  introSettings: initIntroSettings,
};

export function reducer(
  state: StateProps,
  action: { type: Types; payload: any },
): StateProps {
  switch (action.type) {
    case Types.UpdateCurStep:
      return {
        ...state,
        curStep: action.payload,
      };
    case Types.UpdatePriceSettings:
      return {
        ...state,
        priceSettings: {
          ...state.priceSettings,
          ...action.payload,
        },
      };
    case Types.UpdateTimeSettings:
      return {
        ...state,
        timeSettings: {
          ...state.timeSettings,
          ...action.payload,
        },
      };
    case Types.UpdateOptionalSettings:
      return {
        ...state,
        optionalSettings: {
          ...state.optionalSettings,
          ...action.payload,
        },
      };
    case Types.UpdateIntroSettings:
      return {
        ...state,
        introSettings: {
          ...state.introSettings,
          ...action.payload,
        },
      };
    case Types.Cover:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}
