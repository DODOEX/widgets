import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppThunkDispatch } from '../../store/actions';
import {
  setAutoSlippage,
  setAutoSlippageLoading,
} from '../../store/actions/globals';
import { TokenInfo } from '../Token';

export type GetAutoSlippage = (options: {
  fromToken: TokenInfo | null;
  toToken: TokenInfo | null;
}) => Promise<number | undefined> | number | undefined;

/**
 * Sets the slippage based on the incoming getAutoSlippage method. If there is an interface error or no data is returned, the default data with a lower priority will be used.
 */
export function useSetAutoSlippage({
  fromToken,
  toToken,
  getAutoSlippage,
}: {
  fromToken: TokenInfo | null;
  toToken: TokenInfo | null;
  getAutoSlippage?: GetAutoSlippage;
}) {
  const dispatch = useDispatch<AppThunkDispatch>();
  useEffect(() => {
    const computed = async () => {
      if (!getAutoSlippage) {
        return;
      }
      const getAutoSlippageResult = getAutoSlippage({
        fromToken,
        toToken,
      });
      if (
        typeof getAutoSlippageResult === 'undefined' ||
        typeof getAutoSlippageResult === 'number'
      ) {
        dispatch(
          setAutoSlippage({
            loading: false,
            value: null,
          }),
        );
        return;
      }
      dispatch(setAutoSlippageLoading(true));
      try {
        const result = await getAutoSlippageResult;
        dispatch(
          setAutoSlippage({
            loading: false,
            value: result ?? null,
          }),
        );
      } catch (error) {
        console.error(error);
        dispatch(
          setAutoSlippage({
            loading: false,
            value: null,
          }),
        );
      }
    };
    computed();
  }, [fromToken, toToken]);
}
