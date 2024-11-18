import { TokenInfo } from '../../../hooks/Token/type';
import { Currency } from './sdks/sdk-core/entities/currency';
import { FeeAmount } from './sdks/v3-sdk/constants';
import { Field, FullRange } from './types';
import { buildCurrency } from './utils';

export interface StateProps {
  baseToken: Maybe<Currency>;
  quoteToken: Maybe<Currency>;
  baseAmount: string;
  quoteAmount: string;
  feeAmount: FeeAmount | undefined;

  readonly independentField: Field;
  readonly typedValue: string;
  readonly startPriceTypedValue: string; // for the case when there's no liquidity
  readonly leftRangeTypedValue: string | FullRange;
  readonly rightRangeTypedValue: string | FullRange;
}

export enum Types {
  UpdateBaseToken,
  UpdateQuoteToken,
  UpdateBaseTokenAndClearQuoteToken,
  UpdateBaseAmount,
  UpdateQuoteAmount,
  UpdateFeeAmount,
  ToggleRate,
  setFullRange,
  typeStartPriceInput,
  typeLeftRangeInput,
  typeRightRangeInput,
  typeInput,
}

type Payload = {
  [Types.UpdateBaseToken]: TokenInfo;
  [Types.UpdateQuoteToken]: TokenInfo;
  [Types.UpdateBaseTokenAndClearQuoteToken]: TokenInfo;
  [Types.UpdateBaseAmount]: string;
  [Types.UpdateQuoteAmount]: string;
  [Types.UpdateFeeAmount]: FeeAmount;
  [Types.ToggleRate]: void;
  [Types.setFullRange]: void;
  [Types.typeStartPriceInput]: { typedValue: string };
  [Types.typeLeftRangeInput]: { typedValue: string };
  [Types.typeRightRangeInput]: { typedValue: string };
  [Types.typeInput]: { field: Field; typedValue: string; noLiquidity: boolean };
};

export type Actions = ActionMap<Payload>[keyof ActionMap<Payload>];

export function reducer(state: StateProps, action: Actions): StateProps {
  switch (action.type) {
    case Types.UpdateBaseToken: {
      const baseToken = action.payload;
      return {
        ...state,
        baseToken: buildCurrency(baseToken),
        baseAmount: '',
      };
    }

    case Types.UpdateQuoteToken: {
      const quoteToken = action.payload;
      return {
        ...state,
        quoteToken: buildCurrency(quoteToken),
        quoteAmount: '',
      };
    }

    case Types.UpdateBaseTokenAndClearQuoteToken: {
      const baseToken = action.payload;
      return {
        ...state,
        baseToken: buildCurrency(baseToken),
        quoteToken: null,
        baseAmount: '',
        quoteAmount: '',
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
        baseAmount: '',
        quoteAmount: '',
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

    case Types.UpdateBaseAmount: {
      const baseAmount = action.payload;
      const { quoteToken } = state;
      if (!quoteToken) {
        throw new Error('token is required');
      }

      return {
        ...state,
        baseAmount,
      };
    }

    case Types.UpdateQuoteAmount: {
      const quoteAmount = action.payload;
      const { baseToken } = state;
      if (!baseToken) {
        throw new Error('token is required');
      }
      return {
        ...state,
        quoteAmount,
      };
    }

    default:
      // @ts-ignore
      throw Error('Unknown action: ' + action.type);
  }
}
