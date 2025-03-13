import { useCallback } from 'react';
import { Actions, Types } from '../reducer';
import { Field } from '../types';

export function useV3MintActionHandlers({
  dispatch,
}: {
  dispatch: React.Dispatch<Actions>;
}): {
  onField1Input: (typedValue: string) => void;
  onField2Input: (typedValue: string) => void;
  onLeftRangeInput: (typedValue: string) => void;
  onRightRangeInput: (typedValue: string) => void;
  onStartPriceInput: (typedValue: string) => void;
} {
  const onField1Input = useCallback(
    (typedValue: string) => {
      dispatch({
        type: Types.typeInput,
        payload: {
          field: Field.DEPOSIT_1,
          typedValue,
        },
      });
    },
    [dispatch],
  );

  const onField2Input = useCallback(
    (typedValue: string) => {
      dispatch({
        type: Types.typeInput,
        payload: {
          field: Field.DEPOSIT_2,
          typedValue,
        },
      });
    },
    [dispatch],
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
    onField1Input,
    onField2Input,
    onLeftRangeInput,
    onRightRangeInput,
    onStartPriceInput,
  };
}
