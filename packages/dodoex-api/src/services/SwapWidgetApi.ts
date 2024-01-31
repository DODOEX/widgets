import RestApiRequest, {
  RestApiRequestConfig,
} from '../helper/RestApiRequests';
import { strToColorStr } from '../utils/color';
import type { SwapWidgetProps } from '@dodoex/widgets';

interface WidgetConfigBasis {
  crossChainSupport: boolean;
  swapSlippage?: string;
  crossChainSlippage?: string;
  rebate?: {
    address?: string;
    ratio?: string;
  };
  rpcMap?: {
    [key: number]: string[];
  };
  name?: string;
  locale?: 'en-US' | 'zh-CN';
  width?: string;
  height?: string;
  fontSizeModify: number;
  backgroundImage?: string;
  themeType?: number;
  noPowerBy?: boolean;
}
interface WidgetConfigColor {
  primary?: string;
  secondary?: string;
  secondaryContrast?: string;
  error?: string;
  errorContrast?: string;
  warning?: string;
  success?: string;
  background1?: string;
  background2?: string;
  mask?: string;
  input?: string;
  card?: string;
  text1?: string;
  text2?: string;
  textDisable?: string;
  textPlaceholder?: string;
  borderSolid?: string;
  borderDash?: string;
}
export interface ConfigTokenList {
  chains: Array<{
    chainId: string;
    logoImg: string;
    name: string;
    fromTokens?: Array<string>;
    toTokens?: Array<string>;
    tokens?: Array<{
      address: string;
      chainId: number;
      decimals: number;
      logoImg: string;
      name: string;
      symbol: string;
    }>;
  }>;
  rebateAddress: string | null;
  rebateRatio: number | null;
  swapSlippage: number | null;
  crossChainSlippage: number | null;
  basis?: WidgetConfigBasis;
  style?: WidgetConfigColor;
}

export class SwapWidgetApi extends RestApiRequest {
  constructor(configProps?: RestApiRequestConfig) {
    super(configProps);
  }

  getWidgetTokenListConfig(projectId: string, apikey: string) {
    const path = `/config-center/user/tokenlist/v2`;
    return this.getJson<ConfigTokenList>(path, { project: projectId, apikey });
  }

  convertConfigToSwapWidgetProps(configTokenList: ConfigTokenList) {
    /** set token list */
    const tokenList: SwapWidgetProps['tokenList'] = [];
    let isAllChainFrom = true;
    let isAllChainTo = true;
    configTokenList.chains.forEach((item) => {
      if (item.fromTokens) {
        isAllChainFrom = false;
      }
      if (item.toTokens) {
        isAllChainTo = false;
      }
    });
    configTokenList.chains.forEach(
      ({ chainId: chainIdStr, fromTokens, toTokens, tokens }) => {
        if (tokens?.length) {
          const chainId = Number(chainIdStr);
          [
            {
              isAllChain: isAllChainFrom,
              selectTokens: fromTokens,
              side: 'from' as 'from',
            },
            {
              isAllChain: isAllChainTo,
              selectTokens: toTokens,
              side: 'to' as 'to',
            },
          ].forEach(({ isAllChain, selectTokens, side }) => {
            if (isAllChain || selectTokens) {
              if (selectTokens?.length) {
                tokens.forEach((token) => {
                  if (
                    selectTokens.some(
                      (address) =>
                        address.toLocaleLowerCase() ===
                        token.address.toLocaleLowerCase(),
                    )
                  ) {
                    tokenList.push({
                      logoURI: token.logoImg,
                      ...token,
                      chainId: token.chainId ?? chainId,
                      side,
                    });
                  }
                });
              } else {
                tokens.forEach((token) => {
                  tokenList.push({
                    logoURI: token.logoImg,
                    ...token,
                    chainId: token.chainId ?? chainId,
                    side,
                  });
                });
              }
            }
          });
        }
      },
    );

    /** set theme */
    let theme: SwapWidgetProps['theme'] | undefined;
    if (configTokenList?.style && Object.keys(configTokenList.style).length) {
      const fontSizeModify = configTokenList?.basis?.fontSizeModify;
      theme = {
        palette: {
          mode: 'light',
          primary: {
            main: strToColorStr(configTokenList.style.primary),
          },
          secondary: {
            main: strToColorStr(configTokenList.style.secondary),
            contrastText: strToColorStr(
              configTokenList.style.secondaryContrast,
            ),
          },
          error: {
            main: strToColorStr(configTokenList.style.error),
            contrastText: strToColorStr(configTokenList.style.errorContrast),
          },
          warning: {
            main: strToColorStr(configTokenList.style.warning),
          },
          success: {
            main: strToColorStr(configTokenList.style.success),
          },
          background: {
            default: strToColorStr(configTokenList.style.background1),
            paper: strToColorStr(configTokenList.style.background1),
            paperContrast: strToColorStr(configTokenList.style.background2),
            backdrop: strToColorStr(configTokenList.style.mask),
            input: strToColorStr(configTokenList.style.input),
            tag: strToColorStr(configTokenList.style.card),
          },
          text: {
            primary: strToColorStr(configTokenList.style.text1),
            secondary: strToColorStr(configTokenList.style.text2),
            disabled: strToColorStr(configTokenList.style.textDisable),
            placeholder: strToColorStr(configTokenList.style.textPlaceholder),
          },
          border: {
            main: strToColorStr(configTokenList.style.borderSolid),
            light: strToColorStr(configTokenList.style.borderDash),
            disabled: strToColorStr(configTokenList.style.borderSolid),
          },
        },
        typography: fontSizeModify
          ? {
              fontSize: 16 + fontSizeModify,
              ht: {
                fontSize: 36 + fontSizeModify,
              },
              h2: {
                fontSize: 32 + fontSizeModify,
              },
              h3: {
                fontSize: 28 + fontSizeModify,
              },
              caption: {
                fontSize: 20 + fontSizeModify,
              },
              h5: {
                fontSize: 18 + fontSizeModify,
              },
              body1: {
                fontSize: 16 + fontSizeModify,
              },
              body2: {
                fontSize: 14 + fontSizeModify,
              },
              h6: {
                fontSize: 12 + fontSizeModify,
              },
              button: {
                fontSize: 16 + fontSizeModify,
              },
            }
          : undefined,
      };
    }

    const rebateAddress = configTokenList.rebateAddress;
    const rebateRatio = configTokenList.rebateRatio;
    const swapSlippage = configTokenList.swapSlippage;
    const bridgeSlippage = configTokenList.crossChainSlippage;
    const width = configTokenList.basis?.width;
    const height = configTokenList.basis?.height;
    const locale = configTokenList.basis?.locale;
    const crossChain = configTokenList.basis?.crossChainSupport ?? true;
    const jsonRpcUrlMap = configTokenList.basis?.rpcMap;
    const noPowerBy = configTokenList.basis?.noPowerBy;
    return {
      tokenList,
      theme,
      rebateAddress,
      rebateRatio,
      swapSlippage,
      bridgeSlippage,
      width,
      height,
      locale,
      crossChain,
      jsonRpcUrlMap,
      noPowerBy,
    } as SwapWidgetProps;
  }

  async getConfigSwapWidgetProps(projectId: string, apikey: string) {
    const { result } = await this.getWidgetTokenListConfig(projectId, apikey);
    const configTokenList = result.data;
    if (!configTokenList) {
      throw new Error(result.msg ?? 'Error');
    }

    return {
      swapWidgetProps: this.convertConfigToSwapWidgetProps(configTokenList),
      configTokenList,
    };
  }
}
