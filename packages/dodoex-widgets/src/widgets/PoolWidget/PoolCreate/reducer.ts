import BigNumber from 'bignumber.js';
import { SubPeggedVersionE, Version } from './types';
import {
  computePeggedRecommendRatio,
  DEFAULT_INIT_PRICE,
  DEFAULT_INIT_PRICE_STANDARD,
  DEFAULT_SLIPPAGE_COEFFICIENT,
  DEFAULT_SLIPPAGE_COEFFICIENT_PEGGED,
  PEGGED_RATIO_DECIMALS,
} from './utils';
import { getDefaultSlippageCoefficientList } from './hooks/useSlippageCoefficientList';
import { TokenInfo } from '../../../hooks/Token';
import { PMMModel } from '@dodoex/api';

export interface StateProps {
  /** The pegged type is created in 5 steps, and the other types are created in 3 steps. */
  currentStep: 0 | 1 | 2 | 3 | 4;
  selectedVersion: Version;
  selectedSubPeggedVersion?: SubPeggedVersionE;
  baseToken: TokenInfo | null;
  quoteToken: TokenInfo | null;
  baseAmount: string;
  quoteAmount: string;
  /**
   * Whether to fix the exchange rate fixedRatioPrice to the current legal currency price, true means no modification is allowed
   * single-token is not fixed by default and cannot be fixed, and can be modified
   * After fixing, when modifying the quantity, standard needs to keep the ratio of baseAmount, quoteAmount, fixedRatioPrice unchanged. Pegged needs to be linked regardless of whether it is fixed or not. dpp does not need to, and the three can be modified independently.
   */
  isFixedRatio: boolean;
  /**
   * PmmState.i
   * The value of standard pool is always DEFAULT_INIT_PRICE_STANDARD
   * Other types can be modified, the initial value is DEFAULT_INIT_PRICE
   * The value of this field for single-token, pegged and dpp types is synchronized with fixedRatioPrice
   */
  initPrice: string;
  /**
   * Exchange rate, price, exchange ratio, price ratio
   * Except for single-token types, use the initial fiat price to initialize this field
   * single-token defaults to empty, others default to 1
   */
  fixedRatioPrice: string;
  /** The token on the left side of the exchange rate input box */
  leftTokenAddress: TokenInfo['address'] | undefined;
  slippageCoefficient: string;
  isSlippageCoefficientCustomized: boolean;
  feeRate: string | '0.01' | '0.3' | '1';
  isFeeRateCustomized: boolean;
  /** pegged type base token liquidity ratio */
  peggedBaseTokenRatio: string;
  /** pegged type quote token liquidity ratio */
  peggedQuoteTokenRatio: string;
}

type Pool = any;

export enum Types {
  SetCurrentStep = 1,
  SelectNewVersion,
  SelectNewSubPeggedVersion,
  UpdateBaseToken,
  UpdateQuoteToken,
  SwitchTokens,
  UpdateBaseAmount,
  UpdateQuoteAmount,
  UpdateIsFixedRatio,
  UpdateFixedRatioPrice,
  InitFixedRatioPrice,
  ToggleLeftToken,
  UpdateSlippageCoefficient,
  UpdateIsSlippageCoefficientCustomized,
  UpdateFeeRate,
  UpdateIsFeeRateCustomized,
  InitEditParameters,
  UpdatePeggedBaseTokenRatio,
  UpdatePeggedQuoteTokenRatio,
}

type Payload = {
  [Types.SetCurrentStep]: StateProps['currentStep'];
  [Types.SelectNewVersion]: Version;
  [Types.SelectNewSubPeggedVersion]: SubPeggedVersionE;
  [Types.UpdateBaseToken]: TokenInfo;
  [Types.UpdateQuoteToken]: TokenInfo;
  [Types.SwitchTokens]: undefined;
  [Types.UpdateBaseAmount]: string;
  [Types.UpdateQuoteAmount]: string;
  [Types.UpdateIsFixedRatio]: boolean;
  [Types.UpdateFixedRatioPrice]: string;
  [Types.InitFixedRatioPrice]: {
    baseTokenFiatPrice: number | undefined;
    quoteTokenFiatPrice: number | undefined;
  };
  [Types.ToggleLeftToken]: undefined;
  [Types.UpdateSlippageCoefficient]: string;
  [Types.UpdateIsSlippageCoefficientCustomized]: boolean;
  [Types.UpdateFeeRate]: StateProps['feeRate'];
  [Types.UpdateIsFeeRateCustomized]: boolean;
  [Types.InitEditParameters]: Pool;
  [Types.UpdatePeggedBaseTokenRatio]: string;
  [Types.UpdatePeggedQuoteTokenRatio]: string;
};

export type Actions = ActionMap<Payload>[keyof ActionMap<Payload>];

function getQuoteByMidPriceStandard(state: StateProps, midPrice: BigNumber) {
  // The main purpose here is to call the getQuoteByMidPrice method without passing too many parameters.
  const model = new PMMModel();
  model.B = new BigNumber(state.baseAmount);
  model.i = new BigNumber(state.initPrice);
  model.k = new BigNumber(state.slippageCoefficient);
  // k of the standard pool will not be 0, here R uses 1
  model.RStatus = 1;
  return model.getQuoteByMidPrice(midPrice);
}

function formatBN(input: BigNumber | undefined, decimals: number | undefined) {
  if (!input || decimals == null || input.isNaN()) {
    return '';
  }
  return input.dp(decimals, BigNumber.ROUND_DOWN).toString();
}

function initEditParameters(state: StateProps, poolDetail: Pool): StateProps {
  const { baseToken, quoteToken } = poolDetail;

  if (!baseToken || !quoteToken) return state;

  return {
    ...state,
    baseToken,
    quoteToken,
    leftTokenAddress: baseToken?.address,
    slippageCoefficient: '',
    initPrice: '',
    fixedRatioPrice: '',
    feeRate: '',
    isFixedRatio: false,
  };
}

function updateFixedRatioPriceAndInitPrice({
  state,
  fixedRatioPrice,
}: {
  state: StateProps;
  fixedRatioPrice: string;
}) {
  const {
    selectedVersion,
    baseToken,
    quoteToken,
    baseAmount,
    isFixedRatio,
    leftTokenAddress,
  } = state;
  if (!baseToken || !quoteToken) {
    throw new Error('token is required');
  }
  const isForward = leftTokenAddress === baseToken?.address;
  const isStandard = selectedVersion === Version.standard;
  const isPegged = selectedVersion === Version.pegged;
  const fixedRatioPriceBN = new BigNumber(fixedRatioPrice);
  let initPrice = isStandard
    ? DEFAULT_INIT_PRICE_STANDARD
    : isForward
    ? fixedRatioPrice
    : !fixedRatioPriceBN.isNaN() && fixedRatioPriceBN.gt(0)
    ? new BigNumber(1)
        .div(fixedRatioPriceBN)
        .dp(isForward ? quoteToken.decimals : baseToken.decimals)
        .toString()
    : DEFAULT_INIT_PRICE;
  if (isStandard) {
    const iDecimals = 18 - baseToken.decimals + quoteToken.decimals;
    if (iDecimals < String(DEFAULT_INIT_PRICE_STANDARD).split('.')[1].length) {
      initPrice = new BigNumber(1).div(10 ** iDecimals).toString();
    }
  }

  if (isPegged) {
    const peggedRecommendRatio = computePeggedRecommendRatio({
      initPrice,
    });
    const peggedBaseTokenRatio = peggedRecommendRatio.base
      ? peggedRecommendRatio.base.multipliedBy(100).toString()
      : '';
    const peggedQuoteTokenRatio = peggedRecommendRatio.quote
      ? peggedRecommendRatio.quote.multipliedBy(100).toString()
      : '';
    return {
      ...state,
      initPrice,
      fixedRatioPrice,
      peggedBaseTokenRatio,
      peggedQuoteTokenRatio,
    };
  }

  if (isStandard && isFixedRatio) {
    const baseAmountBN = new BigNumber(baseAmount);
    if (
      !baseAmountBN.isNaN() &&
      !fixedRatioPriceBN.isNaN() &&
      fixedRatioPriceBN.gt(0)
    ) {
      const quoteAmountBN = isForward
        ? baseAmountBN.multipliedBy(fixedRatioPriceBN)
        : baseAmountBN.div(fixedRatioPriceBN);
      return {
        ...state,
        initPrice,
        fixedRatioPrice,
        baseAmount: formatBN(baseAmountBN, baseToken.decimals),
        quoteAmount: formatBN(quoteAmountBN, quoteToken.decimals),
      };
    }
  }
  return {
    ...state,
    initPrice,
    fixedRatioPrice,
  };
}

export function reducer(state: StateProps, action: Actions): StateProps {
  switch (action.type) {
    case Types.SetCurrentStep: {
      const { payload: nextStep } = action;
      if (state.selectedVersion === Version.pegged) {
        return {
          ...state,
          currentStep: nextStep >= 4 ? 4 : nextStep <= 0 ? 0 : nextStep,
        };
      }
      return {
        ...state,
        currentStep: nextStep >= 2 ? 2 : nextStep <= 0 ? 0 : nextStep,
      };
    }
    case Types.SelectNewVersion: {
      const { payload: newVersion } = action;
      if (newVersion === state.selectedVersion) {
        return state;
      }
      let slippageCoefficient = DEFAULT_SLIPPAGE_COEFFICIENT;
      let selectedSubPeggedVersion: SubPeggedVersionE | undefined;
      if (newVersion === Version.pegged) {
        slippageCoefficient = DEFAULT_SLIPPAGE_COEFFICIENT_PEGGED;
        selectedSubPeggedVersion = SubPeggedVersionE.DSP;
      }
      let initPrice = DEFAULT_INIT_PRICE_STANDARD;
      if (newVersion === Version.singleToken) {
        initPrice = '';
      } else if (newVersion !== Version.standard) {
        initPrice = DEFAULT_INIT_PRICE;
      }
      let isFixedRatio = true;
      if (newVersion === Version.singleToken) {
        isFixedRatio = false;
      }
      return {
        ...state,
        baseAmount: '',
        quoteAmount: '',
        isFixedRatio,
        initPrice,
        fixedRatioPrice:
          newVersion === Version.singleToken ? '' : DEFAULT_INIT_PRICE,
        slippageCoefficient,
        isSlippageCoefficientCustomized: !getDefaultSlippageCoefficientList({
          selectedVersion: action.payload,
        }).includes(slippageCoefficient),
        selectedVersion: action.payload,
        selectedSubPeggedVersion,
        leftTokenAddress: state.baseToken?.address,
      };
    }
    case Types.SelectNewSubPeggedVersion: {
      return {
        ...state,
        selectedSubPeggedVersion: action.payload,
      };
    }
    case Types.UpdateBaseToken: {
      const baseToken = action.payload;
      return {
        ...state,
        baseToken,
        baseAmount: '',
        leftTokenAddress: baseToken?.address,
      };
    }
    case Types.UpdateQuoteToken: {
      const { baseToken } = state;
      return {
        ...state,
        quoteToken: action.payload,
        quoteAmount: '',
        leftTokenAddress: baseToken?.address,
      };
    }
    case Types.SwitchTokens: {
      const {
        selectedVersion,
        baseToken,
        quoteToken,
        baseAmount,
        quoteAmount,
      } = state;
      if (selectedVersion === Version.singleToken) {
        return {
          ...state,
          baseToken: quoteToken,
          quoteToken: baseToken,
          leftTokenAddress: quoteToken?.address,
        };
      }
      return {
        ...state,
        baseToken: quoteToken,
        quoteToken: baseToken,
        baseAmount: quoteAmount,
        quoteAmount: baseAmount,
        leftTokenAddress: quoteToken?.address,
      };
    }
    case Types.UpdateBaseAmount: {
      const baseAmount = action.payload;
      const {
        selectedVersion,
        quoteToken,
        fixedRatioPrice,
        isFixedRatio,
        peggedBaseTokenRatio,
      } = state;
      if (!quoteToken) {
        throw new Error('token is required');
      }
      const baseAmountBN = new BigNumber(baseAmount);

      /**
       * pegged pool fixedRatioPrice baseAmount quoteAmount three modifications linked together
       * If the legal currency price is the initial price query and the price query fails, the fixedRatioPrice input box can be modified at this time and filled with the default fixedRatioPrice. The three will still be modified in conjunction with each other.
       *
       * dpp, single-token pools do not need to be linked and can be modified separately
       */

      // baseAmount changes, keep initPrice unchanged, modify quoteAmount
      if (selectedVersion === Version.pegged) {
        const peggedBaseTokenRatioBN = new BigNumber(peggedBaseTokenRatio)
          .div(100)
          .dp(PEGGED_RATIO_DECIMALS, BigNumber.ROUND_DOWN);
        if (
          !peggedBaseTokenRatioBN.isFinite() ||
          peggedBaseTokenRatioBN.lt(0)
        ) {
          return {
            ...state,
            baseAmount,
            quoteAmount: '',
          };
        }
        const quoteAmountBN = baseAmountBN
          .div(peggedBaseTokenRatioBN)
          .minus(baseAmountBN);
        return {
          ...state,
          baseAmount,
          quoteAmount: formatBN(quoteAmountBN, quoteToken.decimals),
        };
      }

      /**
       * When the standard pool is bound to fixedRatioPrice, quoteAmount is calculated according to the algorithm.
       */

      if (
        selectedVersion === Version.standard &&
        isFixedRatio &&
        fixedRatioPrice
      ) {
        if (!baseAmount) {
          return {
            ...state,
            baseAmount,
            quoteAmount: baseAmount,
          };
        }
        const quoteAmountBN = getQuoteByMidPriceStandard(
          {
            ...state,
            baseAmount,
          },
          new BigNumber(fixedRatioPrice),
        );
        return {
          ...state,
          baseAmount,
          quoteAmount: formatBN(quoteAmountBN, quoteToken.decimals),
        };
      }

      return {
        ...state,
        baseAmount,
      };
    }
    case Types.UpdateQuoteAmount: {
      const quoteAmount = action.payload;
      const {
        selectedVersion,
        baseToken,
        fixedRatioPrice,
        isFixedRatio,
        leftTokenAddress,
        peggedQuoteTokenRatio,
      } = state;
      if (!baseToken) {
        throw new Error('token is required');
      }
      const isForward = leftTokenAddress === baseToken?.address;
      const quoteAmountBN = new BigNumber(quoteAmount);

      if (selectedVersion === Version.pegged) {
        const peggedQuoteTokenRatioBN = new BigNumber(peggedQuoteTokenRatio)
          .div(100)
          .dp(PEGGED_RATIO_DECIMALS, BigNumber.ROUND_DOWN);
        if (
          !peggedQuoteTokenRatioBN.isFinite() ||
          peggedQuoteTokenRatioBN.lt(0)
        ) {
          return {
            ...state,
            baseAmount: '',
            quoteAmount,
          };
        }
        const baseAmountBN = quoteAmountBN
          .div(peggedQuoteTokenRatioBN)
          .minus(quoteAmountBN);
        return {
          ...state,
          baseAmount: formatBN(baseAmountBN, baseToken.decimals),
          quoteAmount,
        };
      }

      if (selectedVersion === Version.standard && isFixedRatio) {
        const fixedRatioPriceBN = new BigNumber(fixedRatioPrice);
        const baseAmountBN = fixedRatioPriceBN.gt(0)
          ? isForward
            ? quoteAmountBN.div(fixedRatioPriceBN)
            : quoteAmountBN.multipliedBy(fixedRatioPriceBN)
          : undefined;
        return {
          ...state,
          baseAmount: formatBN(baseAmountBN, baseToken.decimals),
          quoteAmount,
        };
      }
      return {
        ...state,
        quoteAmount,
      };
    }
    case Types.UpdateIsFixedRatio: {
      return { ...state, isFixedRatio: action.payload };
    }
    case Types.InitFixedRatioPrice: {
      const { leftTokenAddress, baseToken, quoteToken } = state;
      if (!baseToken || !quoteToken) {
        throw new Error('token is required');
      }
      const isForward = leftTokenAddress === baseToken?.address;
      const { baseTokenFiatPrice, quoteTokenFiatPrice } = action.payload;
      const base2QuotePrice =
        baseTokenFiatPrice && quoteTokenFiatPrice
          ? new BigNumber(baseTokenFiatPrice).div(quoteTokenFiatPrice)
          : undefined;
      const quote2basePrice =
        baseTokenFiatPrice && quoteTokenFiatPrice
          ? new BigNumber(quoteTokenFiatPrice).div(baseTokenFiatPrice)
          : undefined;
      const currentPrice = isForward ? base2QuotePrice : quote2basePrice;
      const currentTokenDecimals = isForward
        ? quoteToken.decimals
        : baseToken.decimals;
      if (currentPrice && !currentPrice.isNaN()) {
        return updateFixedRatioPriceAndInitPrice({
          state,
          fixedRatioPrice: currentPrice
            .dp(currentTokenDecimals, BigNumber.ROUND_DOWN)
            .toString(),
        });
      }
      return state;
    }
    case Types.UpdateFixedRatioPrice: {
      const fixedRatioPrice = action.payload;
      return updateFixedRatioPriceAndInitPrice({ state, fixedRatioPrice });
    }
    case Types.ToggleLeftToken: {
      const { baseToken, quoteToken, fixedRatioPrice } = state;
      if (!baseToken || !quoteToken) {
        throw new Error('token is required');
      }
      const isForward = state.leftTokenAddress === baseToken?.address;
      const leftTokenAddress = isForward
        ? quoteToken?.address
        : baseToken?.address;
      const fixedRatioPriceBN = new BigNumber(fixedRatioPrice);
      if (!fixedRatioPriceBN.isNaN() && fixedRatioPriceBN.gt(0)) {
        const nextFixedRatioPriceBN = new BigNumber(1)
          .div(fixedRatioPriceBN)
          .dp(isForward ? baseToken.decimals : quoteToken.decimals);

        return updateFixedRatioPriceAndInitPrice({
          state: {
            ...state,
            leftTokenAddress,
          },
          fixedRatioPrice: nextFixedRatioPriceBN.toString(),
        });
      }
      return {
        ...state,
        leftTokenAddress,
      };
    }
    case Types.UpdateSlippageCoefficient: {
      return {
        ...state,
        slippageCoefficient: action.payload,
      };
    }
    case Types.UpdateIsSlippageCoefficientCustomized: {
      return {
        ...state,
        isSlippageCoefficientCustomized: action.payload,
      };
    }
    case Types.UpdateFeeRate: {
      return {
        ...state,
        feeRate: action.payload,
      };
    }
    case Types.UpdateIsFeeRateCustomized: {
      return {
        ...state,
        isFeeRateCustomized: action.payload,
      };
    }
    case Types.InitEditParameters: {
      // @ts-ignore
      return initEditParameters(state, action.payload);
    }
    case Types.UpdatePeggedBaseTokenRatio: {
      if (!state.quoteToken) {
        throw new Error('token is required');
      }
      const peggedBaseTokenRatio = action.payload;
      const peggedBaseTokenRatioBN = new BigNumber(peggedBaseTokenRatio).dp(
        PEGGED_RATIO_DECIMALS - 2,
        BigNumber.ROUND_DOWN,
      );
      if (!peggedBaseTokenRatioBN.isFinite() || peggedBaseTokenRatioBN.lt(0)) {
        return {
          ...state,
          peggedBaseTokenRatio: '',
          peggedQuoteTokenRatio: '',
          baseAmount: '',
          quoteAmount: '',
        };
      }
      const peggedQuoteTokenRatioBN = new BigNumber(100)
        .minus(peggedBaseTokenRatioBN)
        .dp(PEGGED_RATIO_DECIMALS - 2, BigNumber.ROUND_DOWN);

      const baseAmount = peggedBaseTokenRatioBN.lte(0) ? '0' : state.baseAmount;
      const baseAmountBN = new BigNumber(baseAmount);
      const quoteAmountBN = baseAmountBN
        .div(peggedBaseTokenRatioBN.div(100))
        .minus(baseAmountBN);

      return {
        ...state,
        peggedBaseTokenRatio,
        peggedQuoteTokenRatio: peggedQuoteTokenRatioBN.lt(0)
          ? '0'
          : peggedQuoteTokenRatioBN.toString(),
        baseAmount,
        quoteAmount: formatBN(quoteAmountBN, state.quoteToken.decimals),
      };
    }
    case Types.UpdatePeggedQuoteTokenRatio: {
      if (!state.baseToken) {
        throw new Error('token is required');
      }
      const peggedQuoteTokenRatio = action.payload;
      const peggedQuoteTokenRatioBN = new BigNumber(peggedQuoteTokenRatio).dp(
        PEGGED_RATIO_DECIMALS - 2,
        BigNumber.ROUND_DOWN,
      );
      if (
        !peggedQuoteTokenRatioBN.isFinite() ||
        peggedQuoteTokenRatioBN.lt(0)
      ) {
        return {
          ...state,
          peggedBaseTokenRatio: '',
          peggedQuoteTokenRatio,
          baseAmount: '',
          quoteAmount: '',
        };
      }
      const peggedBaseTokenRatioBN = new BigNumber(100)
        .minus(peggedQuoteTokenRatioBN)
        .dp(PEGGED_RATIO_DECIMALS - 2, BigNumber.ROUND_DOWN);

      const quoteAmount = peggedQuoteTokenRatioBN.lte(0)
        ? '0'
        : state.quoteAmount;
      const quoteAmountBN = new BigNumber(quoteAmount);
      const baseAmountBN = quoteAmountBN
        .div(peggedQuoteTokenRatioBN.div(100))
        .minus(quoteAmountBN);

      return {
        ...state,
        peggedBaseTokenRatio: peggedBaseTokenRatioBN.lt(0)
          ? '0'
          : peggedBaseTokenRatioBN.toString(),
        peggedQuoteTokenRatio,
        baseAmount: formatBN(baseAmountBN, state.baseToken.decimals),
        quoteAmount,
      };
    }
    default:
      // @ts-ignore
      throw Error('Unknown action: ' + action.type);
  }
}
