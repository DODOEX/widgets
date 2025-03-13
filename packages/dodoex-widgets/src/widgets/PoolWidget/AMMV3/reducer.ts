import { TokenInfo } from '../../../hooks/Token/type';
import { FeeAmount } from './sdks/v3-sdk/constants';
import { Field, FullRange } from './types';

export interface StateProps {
  /**
   * 代币对中第一个代币，与顺序无关
   *
   * mint1-mint2 和 mint-2-mint1 创建出来的 clmm 是同一个池子。最终 clmm 中 mintA 和 mintB 是按照从小到大排序的
   *
   * 最终创建完的 clmm 中的 mintA 和 mintB 的顺序可能和 mint1 和 mint2 的顺序相反
   */
  mint1: TokenInfo | undefined;
  /**
   * 代币对中第二个代币，与顺序无关；最终创建完的 clmm 中的 mintA 和 mintB 的顺序可能和 mint1 和 mint2 的顺序相反；
   */
  mint2: TokenInfo | undefined;
  /**
   * 手续费率；
   */
  feeAmount: FeeAmount | undefined;

  // 0: mintA, 1: mintB
  selectedMintIndex: 0 | 1;

  // Starting price: the number of Quote Tokens needed to purchase 1 Base Token.
  // selectedMintIndex = 0 => the number of mintBs needed to purchase 1 mintA.
  // selectedMintIndex = 1 => the number of mintAs needed to purchase 1 mintB.
  readonly startPriceTypedValue: string; // for the case when there's no liquidity

  readonly independentField: Field;
  readonly typedValue: string;
  readonly leftRangeTypedValue: string | FullRange;
  readonly rightRangeTypedValue: string | FullRange;
}

export enum Types {
  UpdateMint1,
  UpdateMint2,
  UpdateDefaultMint1,
  UpdateDefaultMint2,
  UpdateMint1AndClearMint2,
  UpdateFeeAmount,
  UpdateSelectedMintIndex,
  setFullRange,
  typeStartPriceInput,
  typeLeftRangeInput,
  typeRightRangeInput,
  typeInput,
}

type Payload = {
  [Types.UpdateMint1]: TokenInfo;
  [Types.UpdateDefaultMint1]: TokenInfo;
  [Types.UpdateMint2]: TokenInfo;
  [Types.UpdateDefaultMint2]: TokenInfo;
  [Types.UpdateMint1AndClearMint2]: TokenInfo;
  [Types.UpdateFeeAmount]: FeeAmount;
  [Types.UpdateSelectedMintIndex]: 0 | 1;
  [Types.setFullRange]: void;
  [Types.typeStartPriceInput]: { typedValue: string };
  [Types.typeLeftRangeInput]: { typedValue: string };
  [Types.typeRightRangeInput]: { typedValue: string };
  [Types.typeInput]: { field: Field; typedValue: string };
};

export type Actions = ActionMap<Payload>[keyof ActionMap<Payload>];

export function reducer(state: StateProps, action: Actions): StateProps {
  switch (action.type) {
    case Types.UpdateMint1: {
      const mint1 = action.payload;
      return {
        ...state,
        mint1,
      };
    }

    case Types.UpdateDefaultMint1: {
      const mint1 = action.payload;
      if (!state.mint1) {
        return {
          ...state,
          mint1,
        };
      }
      return state;
    }

    case Types.UpdateMint2: {
      const mint2 = action.payload;
      return {
        ...state,
        mint2,
      };
    }

    case Types.UpdateDefaultMint2: {
      const mint2 = action.payload;
      if (!state.mint2) {
        return {
          ...state,
          mint2,
        };
      }
      return state;
    }

    case Types.UpdateMint1AndClearMint2: {
      const mint1 = action.payload;
      return {
        ...state,
        mint1,
        mint2: undefined,
      };
    }

    case Types.UpdateFeeAmount: {
      return {
        ...state,
        feeAmount: action.payload,
      };
    }

    case Types.UpdateSelectedMintIndex: {
      return {
        ...state,
        selectedMintIndex: action.payload,
      };
    }

    case Types.setFullRange: {
      return {
        ...state,
        leftRangeTypedValue: true,
        rightRangeTypedValue: true,
      };
    }

    case Types.typeStartPriceInput: {
      return {
        ...state,
        startPriceTypedValue: action.payload.typedValue,
      };
    }

    case Types.typeLeftRangeInput: {
      return {
        ...state,
        leftRangeTypedValue: action.payload.typedValue,
      };
    }

    case Types.typeRightRangeInput: {
      return {
        ...state,
        rightRangeTypedValue: action.payload.typedValue,
      };
    }

    case Types.typeInput: {
      const {
        payload: { field, typedValue },
      } = action;
      return {
        ...state,
        independentField: field,
        typedValue,
      };
    }

    default:
      // @ts-ignore
      throw Error('Unknown action: ' + action.type);
  }
}
