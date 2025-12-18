import { TokenInfo } from '../../../hooks/Token/type';
import { Currency } from './sdks/sdk-core';
import { FeeAmount } from './sdks/v3-sdk';
import { Field, FullRange } from './types';
import { buildCurrency } from './utils';

export interface StateProps {
  baseToken: Maybe<Currency>;
  quoteToken: Maybe<Currency>;
  feeAmount: FeeAmount | undefined;

  step?: number;

  readonly independentField: Field;
  readonly typedValue: string;
  readonly startPriceTypedValue: string; // for the case when there's no liquidity
  readonly leftRangeTypedValue: string | FullRange;
  readonly rightRangeTypedValue: string | FullRange;
}

export enum Types {
  UpdateBaseToken,
  UpdateDefaultBaseToken,
  UpdateQuoteToken,
  UpdateDefaultQuoteToken,
  UpdateBaseTokenAndClearQuoteToken,
  UpdateFeeAmount,
  ToggleRate,
  setFullRange,
  typeStartPriceInput,
  typeLeftRangeInput,
  typeRightRangeInput,
  typeInput,
  UpdateStep,
}

type Payload = {
  [Types.UpdateBaseToken]: TokenInfo;
  [Types.UpdateDefaultBaseToken]: TokenInfo;
  [Types.UpdateQuoteToken]: TokenInfo;
  [Types.UpdateDefaultQuoteToken]: TokenInfo;
  [Types.UpdateBaseTokenAndClearQuoteToken]: TokenInfo;
  [Types.UpdateFeeAmount]: FeeAmount;
  [Types.ToggleRate]: void;
  [Types.setFullRange]: void;
  [Types.typeStartPriceInput]: { typedValue: string };
  [Types.typeLeftRangeInput]: { typedValue: string };
  [Types.typeRightRangeInput]: { typedValue: string };
  [Types.typeInput]: { field: Field; typedValue: string; noLiquidity: boolean };
  [Types.UpdateStep]: number;
};

export type Actions = ActionMap<Payload>[keyof ActionMap<Payload>];

export function reducer(state: StateProps, action: Actions): StateProps {
  switch (action.type) {
    case Types.UpdateBaseToken: {
      const baseToken = action.payload;
      return {
        ...state,
        baseToken: buildCurrency(baseToken),
      };
    }

    case Types.UpdateDefaultBaseToken: {
      const baseToken = action.payload;
      if (!state.baseToken) {
        return {
          ...state,
          baseToken: buildCurrency(baseToken),
        };
      }
      return state;
    }

    case Types.UpdateQuoteToken: {
      const quoteToken = action.payload;
      return {
        ...state,
        quoteToken: buildCurrency(quoteToken),
      };
    }

    case Types.UpdateDefaultQuoteToken: {
      const quoteToken = action.payload;
      if (!state.quoteToken) {
        return {
          ...state,
          quoteToken: buildCurrency(quoteToken),
        };
      }
      return state;
    }

    case Types.UpdateBaseTokenAndClearQuoteToken: {
      const baseToken = action.payload;
      return {
        ...state,
        baseToken: buildCurrency(baseToken),
        quoteToken: null,
      };
    }

    case Types.UpdateFeeAmount: {
      return {
        ...state,
        feeAmount: action.payload,
      };
    }

    case Types.ToggleRate: {
      const { baseToken, quoteToken } = state;
      return {
        ...state,
        baseToken: quoteToken,
        quoteToken: baseToken,
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
        payload: { field, typedValue, noLiquidity },
      } = action;
      if (noLiquidity) {
        // they're typing into the field they've last typed in
        if (field === state.independentField) {
          return {
            ...state,
            independentField: field,
            typedValue,
          };
        }
        // they're typing into a new field, store the other value
        else {
          return {
            ...state,
            independentField: field,
            typedValue,
          };
        }
      } else {
        return {
          ...state,
          independentField: field,
          typedValue,
        };
      }
    }

    case Types.UpdateStep: {
      return {
        ...state,
        step: action.payload,
      };
    }

    default:
      // @ts-ignore
      throw Error('Unknown action: ' + action.type);
  }
}
