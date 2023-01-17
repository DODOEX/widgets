import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppThunkDispatch } from '../../store/actions';
import { setGlobalProps } from '../../store/actions/globals';
import { setDefaultChainId } from '../../store/actions/wallet';
import { setColorMode } from '../../store/actions/settings';
import { setDefaultFromToken, setDefaultToToken } from '../../store/actions/token';
import { WidgetProps } from '../../components/Widget/'

export function useInitPropsToRedux({
  width,
  height,
  feeRate,
  rebateTo,
  colorMode,
  apikey,
  defaultChainId,
  defaultToToken,
  defaultFromToken }: WidgetProps) {
  const dispatch = useDispatch<AppThunkDispatch>();

  useEffect(() => {
    if (colorMode) {
      dispatch(setColorMode(colorMode));
    }
  }, [colorMode]);

  useEffect(() => {
    if (defaultChainId) {
      dispatch(setDefaultChainId(defaultChainId));
    }
  }, [defaultChainId]);

  useEffect(() => {
    dispatch(
      setGlobalProps({
        height,
      }),
    );
  }, [height]);

  useEffect(() => {
    dispatch(
      setGlobalProps({
        width,
      }),
    );
  }, [width]);

  useEffect(() => {
    if (apikey) {
      dispatch(
        setGlobalProps({
          apikey,
        }),
      );
    }
  }, [apikey]);

  useEffect(() => {
    if (feeRate) {
      dispatch(
        setGlobalProps({
          feeRate,
        }),
      );
    }
  }, [feeRate]);

  useEffect(() => {
    if (rebateTo) {
      dispatch(
        setGlobalProps({
          rebateTo,
        }),
      );
    }
  }, [rebateTo]);

  useEffect(() => {
    if (defaultFromToken) {
      dispatch(
        setDefaultFromToken(defaultFromToken),
      );
    }
  }, [defaultFromToken]);

  useEffect(() => {
    if (defaultToToken) {
      dispatch(
        setDefaultToToken(defaultToToken),
      );
    }
  }, [defaultToToken]);
}
