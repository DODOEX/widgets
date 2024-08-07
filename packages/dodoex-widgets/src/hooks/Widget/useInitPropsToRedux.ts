import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppThunkDispatch } from '../../store/actions';
import { setGlobalProps } from '../../store/actions/globals';
import { setDefaultChainId } from '../../store/actions/wallet';
import { setColorMode } from '../../store/actions/settings';
import {
  setDefaultFromToken,
  setDefaultToToken,
} from '../../store/actions/token';
import { WidgetProps } from '../../components/Widget/';
import useTonConnectStore from '../ConnectWallet/TonConnect';

export function useInitPropsToRedux({
  width,
  height,
  feeRate,
  rebateTo,
  colorMode,
  apikey,
  defaultChainId,
  defaultToToken,
  defaultFromToken,
  jsonRpcUrlMap,
  swapSlippage,
  bridgeSlippage,
  apiServices,
  crossChain,
  noPowerBy,
  tonConnect,
}: WidgetProps) {
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
    if (swapSlippage) {
      dispatch(
        setGlobalProps({
          swapSlippage,
        }),
      );
    }
  }, [swapSlippage]);

  useEffect(() => {
    if (bridgeSlippage) {
      dispatch(
        setGlobalProps({
          bridgeSlippage,
        }),
      );
    }
  }, [bridgeSlippage]);

  useEffect(() => {
    if (apiServices) {
      dispatch(
        setGlobalProps({
          apiServices,
        }),
      );
    }
  }, [apiServices]);

  useEffect(() => {
    if (defaultFromToken) {
      dispatch(setDefaultFromToken(defaultFromToken));
    }
  }, [defaultFromToken]);

  useEffect(() => {
    if (defaultToToken) {
      dispatch(setDefaultToToken(defaultToToken));
    }
  }, [defaultToToken]);

  useEffect(() => {
    if (jsonRpcUrlMap) {
      dispatch(
        setGlobalProps({
          jsonRpcUrlMap,
        }),
      );
    }
  }, [jsonRpcUrlMap]);

  useEffect(() => {
    if (crossChain !== undefined) {
      dispatch(
        setGlobalProps({
          crossChain,
        }),
      );
    }
  }, [crossChain]);

  useEffect(() => {
    if (noPowerBy !== undefined) {
      dispatch(
        setGlobalProps({
          noPowerBy,
        }),
      );
    }
  }, [noPowerBy]);

  useEffect(() => {
    if (tonConnect !== undefined) {
      useTonConnectStore.setState({ enabled: !!tonConnect });
    }
  }, [tonConnect]);
}
