import { TokenInfo } from '../../../../hooks/Token';
import { PoolInfo } from '../components/PoolPicker';
import { isBrowser } from '../utils';

export enum TokenType {
  SINGLE = 1,
  LP,
}

export interface RewardI {
  token: TokenInfo | undefined;
  total: string;
  startTime: number | null;
  endTime: number | null;
}

export interface StateProps {
  tokenType: TokenType;
  saveAToken?: TokenInfo;
  isHadSetDefaultRewardToken?: boolean;
  pool: PoolInfo | undefined;
  rewards: RewardI[];
  isInitCache: boolean;
  currentStep: 0 | 1 | 2 | 3;
  confirmModalVisible: boolean;
}

export function init(): StateProps {
  const search = isBrowser ? new URLSearchParams(window.location.search) : null;
  const searchTokenType = search?.get('type');
  return {
    tokenType: searchTokenType
      ? (Number(searchTokenType) as unknown as TokenType)
      : TokenType.SINGLE,
    saveAToken: undefined,
    isHadSetDefaultRewardToken: undefined,
    pool: undefined,
    rewards: [
      {
        token: undefined,
        total: '',
        startTime: null,
        endTime: null,
      },
    ],
    isInitCache: false,
    currentStep: 0,
    confirmModalVisible: false,
  };
}

export enum Types {
  updateTokenType = 1,
  updateSaveAToken,
  updatePlatform,
  updatePool,
  updateReward,
  addReward,
  removeReward,
  reset,
  cover,
  updateInitCache,
  SetCurrentStep,
  SetConfirmModalVisible,
}

interface PayloadRewardI extends Partial<RewardI> {
  index: number;
}

type Payload = {
  [Types.updateTokenType]: TokenType;
  [Types.updateSaveAToken]: TokenInfo | undefined;
  [Types.updatePool]: PoolInfo | undefined;
  [Types.updateReward]: PayloadRewardI;
  [Types.addReward]: undefined;
  [Types.removeReward]: number;
  [Types.reset]: undefined;
  [Types.cover]: StateProps;
  [Types.updateInitCache]: boolean;
  [Types.SetCurrentStep]: StateProps['currentStep'];
  [Types.SetConfirmModalVisible]: boolean;
};

export type Actions = ActionMap<Payload>[keyof ActionMap<Payload>];

const getNewRewardsByUpdateReward = (
  state: StateProps,
  payload: PayloadRewardI,
) => {
  return state.rewards.map<RewardI>((reward, index) => {
    if (index !== payload.index) {
      return reward;
    }

    return {
      ...reward,
      ...payload,
    };
  });
};

export function reducer(state: StateProps, action: Actions): StateProps {
  switch (action.type) {
    case Types.SetCurrentStep: {
      const { payload: nextStep } = action;
      return {
        ...state,
        currentStep: nextStep >= 3 ? 3 : nextStep <= 0 ? 0 : nextStep,
      };
    }

    case Types.updateTokenType:
      return {
        ...state,
        tokenType: action.payload,
      };

    case Types.updateSaveAToken:
      return {
        ...state,
        isHadSetDefaultRewardToken: true,
        saveAToken: action.payload,
        rewards:
          state.isHadSetDefaultRewardToken || state.tokenType === TokenType.LP
            ? state.rewards
            : state.rewards.map((reward, index) => {
                if (index === 0 && !reward.token) {
                  return {
                    ...reward,
                    token: action.payload,
                  };
                }
                return reward;
              }),
      };

    case Types.updatePool:
      return {
        ...state,
        pool: action.payload,
      };

    case Types.updateReward:
      return {
        ...state,
        rewards: getNewRewardsByUpdateReward(state, action.payload),
      };

    case Types.addReward:
      return {
        ...state,
        rewards: [
          ...state.rewards,
          {
            token: undefined,
            total: '',
            startTime: null,
            endTime: null,
          },
        ],
      };

    case Types.removeReward:
      return {
        ...state,
        rewards: state.rewards.filter((_, index) => index !== action.payload),
      };

    case Types.reset:
      return init();

    case Types.cover:
      return {
        ...state,
        ...action.payload,
        isInitCache: true,
      };

    case Types.updateInitCache:
      return {
        ...state,
        isInitCache: action.payload,
      };

    case Types.SetConfirmModalVisible:
      return {
        ...state,
        confirmModalVisible: action.payload,
      };

    default:
      throw new Error();
  }
}
