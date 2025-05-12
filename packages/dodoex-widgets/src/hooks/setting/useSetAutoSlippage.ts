import { useEffect } from 'react';
import { TokenInfo } from '../Token';
import { setAutoSlippage, setAutoSlippageLoading } from '../useGlobalState';

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
        setAutoSlippage({
          loading: false,
          value: null,
        });
        return;
      }

      setAutoSlippageLoading(true);
      try {
        const result = await getAutoSlippageResult;
        setAutoSlippage({
          loading: false,
          value: result ?? null,
        });
      } catch (error) {
        console.error(error);
        setAutoSlippage({
          loading: false,
          value: null,
        });
      }
    };
    computed();
  }, [fromToken, toToken]);
}
