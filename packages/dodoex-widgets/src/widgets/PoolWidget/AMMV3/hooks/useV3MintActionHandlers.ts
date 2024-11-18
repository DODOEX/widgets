import { useCallback } from 'react';
import { Actions, Types } from '../reducer';
import { Field } from '../types';

export function useV3MintActionHandlers({
  noLiquidity,
  dispatch,
}: {
  noLiquidity: boolean | undefined;
  dispatch: React.Dispatch<Actions>;
}): {
  onFieldAInput: (typedValue: string) => void;
  onFieldBInput: (typedValue: string) => void;
  onLeftRangeInput: (typedValue: string) => void;
  onRightRangeInput: (typedValue: string) => void;
  onStartPriceInput: (typedValue: string) => void;
} {
  const onFieldAInput = useCallback(
    (typedValue: string) => {
      dispatch({
        type: Types.typeInput,
        payload: {
          field: Field.CURRENCY_A,
          typedValue,
          noLiquidity: noLiquidity === true,
        },
      });
    },
    [dispatch, noLiquidity],
  );

  const onFieldBInput = useCallback(
    (typedValue: string) => {
      dispatch({
        type: Types.typeInput,
        payload: {
          field: Field.CURRENCY_B,
          typedValue,
          noLiquidity: noLiquidity === true,
        },
      });
    },
    [dispatch, noLiquidity],
  );

  const onLeftRangeInput = useCallback(
    (typedValue: string) => {
      dispatch({
        type: Types.typeLeftRangeInput,
        payload: {
          typedValue,
        },
      });
    },
    [dispatch],
  );

  const onRightRangeInput = useCallback(
    (typedValue: string) => {
      dispatch({
        type: Types.typeRightRangeInput,
        payload: {
          typedValue,
        },
      });
    },
    [dispatch],
  );

  const onStartPriceInput = useCallback(
    (typedValue: string) => {
      dispatch({
        type: Types.typeStartPriceInput,
        payload: {
          typedValue,
        },
      });
    },
    [dispatch],
  );

  return {
    onFieldAInput,
    onFieldBInput,
    onLeftRangeInput,
    onRightRangeInput,
    onStartPriceInput,
  };
}
