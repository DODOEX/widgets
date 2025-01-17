import { Box, useTheme } from '@dodoex/components';
import { ArrowBack } from '@dodoex/icons';
import { t, Trans } from '@lingui/macro';
import BigNumber from 'bignumber.js';
import React from 'react';
import {
  CardPlusConnected,
  TokenCard,
} from '../../../components/Swap/components/TokenCard';
import WidgetContainer from '../../../components/WidgetContainer';
import { useWalletInfo } from '../../../hooks/ConnectWallet/useWalletInfo';
import { useWidgetDevice } from '../../../hooks/style/useWidgetDevice';
import { PageType, useRouterStore } from '../../../router';
import { BaseInfoCardList } from './components/BaseInfoCardList';
import { DepthChartWrapper } from './components/DepthChartWrapper';
import { FeeRateCard } from './components/FeeRateCard';
import { LqRatioSet } from './components/LqRatioSet';
import { LqSettingsShow } from './components/LqSettingsShow';
import { PriceModeCard } from './components/PriceModeCard';
import { SectionTitle } from './components/SectionTitle';
import { StepTitle } from './components/StepTitle';
import { VersionChartExample } from './components/VersionChartExample';
import useDefaultTokens from './hooks/useDefaultTokens';
import { usePriceInit } from './hooks/usePriceInit';
import { useVersionList } from './hooks/useVersionList';
import { BottomButtonGroup } from './operate-widgets/BottomButtonGroup';
import { FeeRateSetting } from './operate-widgets/FeeRateSetting';
import { InitPriceSetting } from './operate-widgets/InitPriceSetting';
import { PriceModeSetting } from './operate-widgets/PriceModeSetting';
import { RatioSetting } from './operate-widgets/RatioSetting';
import { SlippageCoefficientSetting } from './operate-widgets/SlippageCoefficientSetting';
import { TokenPairSelect } from './operate-widgets/TokenPairSelect';
import VersionSelect from './operate-widgets/VersionSelect';
import { SettingItemWrapper } from './operate-widgets/widgets';
import { reducer, Types } from './reducer';
import { Version } from './types';
import {
  DEFAULT_FEE_RATE,
  DEFAULT_INIT_PRICE,
  DEFAULT_INIT_PRICE_STANDARD,
  DEFAULT_SLIPPAGE_COEFFICIENT,
  PEGGED_RATIO_DECIMALS,
} from './utils';

export default function PoolCreate() {
  const { defaultBaseToken, defaultQuoteToken } = useDefaultTokens();
  const { chainId } = useWalletInfo();
  const theme = useTheme();

  const [state, dispatch] = React.useReducer<typeof reducer>(reducer, {
    currentStep: 0,
    selectedVersion: Version.standard,
    baseToken: defaultBaseToken,
    quoteToken: defaultQuoteToken,
    baseAmount: '',
    quoteAmount: '',
    isFixedRatio: true,
    initPrice: DEFAULT_INIT_PRICE_STANDARD,
    fixedRatioPrice: DEFAULT_INIT_PRICE,
    leftTokenAddress: defaultBaseToken?.address,
    feeRate: DEFAULT_FEE_RATE,
    isFeeRateCustomized: false,
    slippageCoefficient: DEFAULT_SLIPPAGE_COEFFICIENT,
    isSlippageCoefficientCustomized: false,
    peggedBaseTokenRatio: '',
    peggedQuoteTokenRatio: '',
  });
  if (
    defaultBaseToken &&
    (!state.baseToken || state.baseToken.chainId !== chainId)
  ) {
    dispatch({
      type: Types.UpdateBaseToken,
      payload: defaultBaseToken,
    });
  }
  if (
    defaultQuoteToken &&
    (!state.quoteToken || state.quoteToken.chainId !== chainId)
  ) {
    dispatch({
      type: Types.UpdateQuoteToken,
      payload: defaultQuoteToken,
    });
  }

  const { isMobile } = useWidgetDevice();
  const { versionMap } = useVersionList();
  const versionItem = versionMap[state.selectedVersion];
  const isSingleTokenVersion = state.selectedVersion === Version.singleToken;
  const isStandardVersion = state.selectedVersion === Version.standard;
  const isPeggedVersion = state.selectedVersion === Version.pegged;

  const leftToken = isSingleTokenVersion ? state.quoteToken : state.baseToken;
  const rightToken = isSingleTokenVersion ? state.baseToken : state.quoteToken;

  const priceInfo = usePriceInit({
    isSingleTokenVersion,
    leftTokenAddress: state.leftTokenAddress,
    baseToken: state.baseToken,
    quoteToken: state.quoteToken,
    dispatch,
  });

  const peggedBaseTokenRatioBN = new BigNumber(state.peggedBaseTokenRatio)
    .div(100)
    .dp(PEGGED_RATIO_DECIMALS, BigNumber.ROUND_DOWN);
  const peggedQuoteTokenRatioBN = new BigNumber(state.peggedQuoteTokenRatio)
    .div(100)
    .dp(PEGGED_RATIO_DECIMALS, BigNumber.ROUND_DOWN);
  const peggedBaseTokenRatioBNLte0 =
    isPeggedVersion && peggedBaseTokenRatioBN.lte(0);
  const peggedQuoteTokenRatioBNLte0 =
    isPeggedVersion && peggedQuoteTokenRatioBN.lte(0);
  const tokenAmountInputArea = (
    <Box
      sx={{
        px: 20,
      }}
    >
      <TokenCard
        canClickBalance
        showPercentage
        amt={isSingleTokenVersion ? state.quoteAmount : state.baseAmount}
        onInputChange={
          isSingleTokenVersion
            ? undefined
            : (payload) => {
                dispatch({
                  type: isSingleTokenVersion
                    ? Types.UpdateQuoteAmount
                    : Types.UpdateBaseAmount,
                  payload,
                });
              }
        }
        readOnly={isSingleTokenVersion || peggedBaseTokenRatioBNLte0}
        inputReadonlyTooltip={
          peggedBaseTokenRatioBNLte0 ? t`ratio is 0` : undefined
        }
        token={leftToken}
        occupiedAddrs={rightToken ? [rightToken.address] : undefined}
        occupiedChainId={chainId}
        chainId={chainId}
        onTokenChange={
          isPeggedVersion
            ? undefined
            : (payload, occupied) => {
                if (occupied) {
                  dispatch({
                    type: Types.SwitchTokens,
                  });
                  return;
                }
                dispatch({
                  type: isSingleTokenVersion
                    ? Types.UpdateQuoteToken
                    : Types.UpdateBaseToken,
                  payload,
                });
              }
        }
        sx={{
          backgroundColor: theme.palette.background.paper,
        }}
        inputSx={{
          backgroundColor: 'transparent',
        }}
      />
      <CardPlusConnected />
      <TokenCard
        canClickBalance
        showPercentage
        amt={isSingleTokenVersion ? state.baseAmount : state.quoteAmount}
        onInputChange={(payload) => {
          dispatch({
            type: isSingleTokenVersion
              ? Types.UpdateBaseAmount
              : Types.UpdateQuoteAmount,
            payload,
          });
        }}
        readOnly={
          (isStandardVersion &&
            state.isFixedRatio &&
            !!state.fixedRatioPrice) ||
          peggedQuoteTokenRatioBNLte0
        }
        inputReadonlyTooltip={
          peggedQuoteTokenRatioBNLte0
            ? t`ratio is 0`
            : t`The token amount is calculated by initial price.`
        }
        token={rightToken}
        occupiedAddrs={leftToken ? [leftToken.address] : undefined}
        occupiedChainId={chainId}
        chainId={chainId}
        onTokenChange={(payload, occupied) => {
          if (occupied) {
            dispatch({
              type: Types.SwitchTokens,
            });
            return;
          }
          dispatch({
            type: isSingleTokenVersion
              ? Types.UpdateBaseToken
              : Types.UpdateQuoteToken,
            payload,
          });
        }}
        sx={{
          backgroundColor: theme.palette.background.paper,
        }}
        inputSx={{
          backgroundColor: 'transparent',
        }}
      />
    </Box>
  );

  const back = () => {
    useRouterStore.getState().push({
      type: PageType.Pool,
    });
  };

  return (
    <WidgetContainer
      sx={{
        backgroundColor: 'transparent',
        padding: 0,
      }}
    >
      <Box
        sx={{
          position: 'relative',
          display: 'none',
          justifyContent: 'center',
          alignItems: 'center',
          px: 20,
          py: 24,
          typography: 'caption',
          borderRadius: 20,
          backgroundColor: theme.palette.tabActive.main,
          [theme.breakpoints.up('tablet')]: {
            display: 'flex',
          },
        }}
      >
        <Box
          component={ArrowBack}
          sx={{
            position: 'absolute',
            left: 20,
            cursor: 'pointer',
          }}
          onClick={back}
        />
        <Trans>Pool Setup</Trans>
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          height: '100%',
          ...(!isMobile
            ? {
                height: 'auto',
                overflowX: 'auto',
              }
            : {}),
        }}
      >
        {isMobile ? null : (
          <Box
            sx={{
              mt: 20,
              mr: 20,
              flexGrow: 1,
              display: 'block',
              overflow: 'hidden',
              px: 20,
              pb: 20,
              borderRadius: 20,
              backgroundColor: theme.palette.background.default,
            }}
          >
            <SectionTitle
              titleKey={t`Select Pool Version`}
              index={1}
              status={state.currentStep === 0 ? 'running' : 'completed'}
            />
            <VersionChartExample
              key={versionItem.version}
              versionItem={versionItem}
              status={state.currentStep === 0 ? 'running' : 'completed'}
            />

            <SectionTitle
              titleKey={t`Parameter Settings`}
              index={2}
              status={
                state.currentStep === 0
                  ? 'waiting'
                  : state.currentStep === 1
                    ? 'running'
                    : 'completed'
              }
            />
            {isPeggedVersion ? (
              <BaseInfoCardList
                status={
                  state.currentStep === 0
                    ? 'waiting'
                    : state.currentStep === 1
                      ? 'running'
                      : 'completed'
                }
                baseToken={state.baseToken}
                quoteToken={state.quoteToken}
                initPrice={state.initPrice}
                slippageCoefficient={state.slippageCoefficient}
                selectedVersion={state.selectedVersion}
                midPrice={undefined}
              />
            ) : (
              <LqSettingsShow
                status={
                  state.currentStep === 0
                    ? 'waiting'
                    : state.currentStep === 1
                      ? 'running'
                      : 'completed'
                }
                baseToken={state.baseToken}
                quoteToken={state.quoteToken}
                initPrice={state.initPrice}
                slippageCoefficient={state.slippageCoefficient}
                selectedVersion={state.selectedVersion}
                baseAmount={state.baseAmount}
                quoteAmount={state.quoteAmount}
              />
            )}

            {isPeggedVersion && (
              <>
                <SectionTitle
                  titleKey={t`Pricing Model`}
                  index={3}
                  status={
                    state.currentStep > 2
                      ? 'completed'
                      : state.currentStep === 2
                        ? 'running'
                        : 'waiting'
                  }
                />
                <PriceModeCard
                  isWaiting={state.currentStep < 2}
                  selectedSubPeggedVersion={state.selectedSubPeggedVersion}
                />
              </>
            )}

            <SectionTitle
              titleKey={t`Fee Rate`}
              index={3}
              status={state.currentStep === 2 ? 'running' : 'waiting'}
            />
            <FeeRateCard
              isWaiting={state.currentStep < (isPeggedVersion ? 3 : 2)}
              feeRate={state.feeRate}
            />

            {isPeggedVersion && (
              <>
                <SectionTitle
                  titleKey={t`Asset ratio within the pool`}
                  index={5}
                  status={
                    state.currentStep > 4
                      ? 'completed'
                      : state.currentStep === 4
                        ? 'running'
                        : 'waiting'
                  }
                />
                <LqRatioSet
                  isWaiting={state.currentStep < 4}
                  baseToken={state.baseToken}
                  quoteToken={state.quoteToken}
                  initPrice={state.initPrice}
                  slippageCoefficient={state.slippageCoefficient}
                  selectedVersion={state.selectedVersion}
                  baseAmount={state.baseAmount}
                  quoteAmount={state.quoteAmount}
                  peggedBaseTokenRatio={state.peggedBaseTokenRatio}
                  peggedQuoteTokenRatio={state.peggedQuoteTokenRatio}
                />
              </>
            )}
          </Box>
        )}

        <Box
          sx={{
            flexGrow: 1,
            flexShrink: 0,
            flexBasis: 375,
            borderRadius: 0,
            backgroundColor: 'background.default',
            minHeight: '100%',
            ...(!isMobile
              ? {
                  pb: 20,
                  borderRadius: 16,
                  flexGrow: 0,
                  minHeight: 'auto',
                  height: '100%',
                  position: 'sticky',
                  top: '20px',
                  overflowY: 'hidden',
                }
              : {}),
          }}
        >
          <StepTitle
            currentStep={state.currentStep}
            isPeggedVersion={isPeggedVersion}
          />

          {state.currentStep === 0 && (
            <VersionSelect
              selectedVersion={state.selectedVersion}
              dispatch={dispatch}
            />
          )}

          {state.currentStep === 1 && (
            <>
              {isPeggedVersion ? (
                <>
                  <TokenPairSelect
                    baseToken={state.baseToken}
                    quoteToken={state.quoteToken}
                    dispatch={dispatch}
                  />
                </>
              ) : (
                <>
                  <DepthChartWrapper
                    baseToken={state.baseToken}
                    quoteToken={state.quoteToken}
                    initPrice={state.initPrice}
                    slippageCoefficient={state.slippageCoefficient}
                    selectedVersion={state.selectedVersion}
                    baseAmount={state.baseAmount}
                    quoteAmount={state.quoteAmount}
                  />
                  {tokenAmountInputArea}
                </>
              )}
              <SlippageCoefficientSetting
                dispatch={dispatch}
                slippageCoefficient={state.slippageCoefficient}
                selectedVersion={state.selectedVersion}
                isCustomized={state.isSlippageCoefficientCustomized}
                isStandardVersion={isStandardVersion}
              />
              <InitPriceSetting
                selectedVersion={state.selectedVersion}
                isFixedRatio={state.isFixedRatio}
                leftTokenAddress={state.leftTokenAddress}
                baseToken={state.baseToken}
                quoteToken={state.quoteToken}
                fixedRatioPrice={state.fixedRatioPrice}
                dispatch={dispatch}
                isStandardVersion={isStandardVersion}
                isSingleTokenVersion={isSingleTokenVersion}
                priceInfo={priceInfo}
              />
            </>
          )}

          {isPeggedVersion && state.currentStep === 2 && (
            <PriceModeSetting
              selectedVersion={state.selectedVersion}
              selectedSubPeggedVersion={state.selectedSubPeggedVersion}
              baseToken={state.baseToken}
              quoteToken={state.quoteToken}
              initPrice={state.initPrice}
              dispatch={dispatch}
            />
          )}

          {state.currentStep === (isPeggedVersion ? 3 : 2) && (
            <FeeRateSetting
              dispatch={dispatch}
              feeRate={state.feeRate}
              isFeeRateCustomized={state.isFeeRateCustomized}
            />
          )}

          {isPeggedVersion && state.currentStep === 4 && (
            <>
              <DepthChartWrapper
                baseToken={state.baseToken}
                quoteToken={state.quoteToken}
                initPrice={state.initPrice}
                slippageCoefficient={state.slippageCoefficient}
                selectedVersion={state.selectedVersion}
                baseAmount={state.baseAmount}
                quoteAmount={state.quoteAmount}
              />

              <RatioSetting
                dispatch={dispatch}
                baseToken={state.baseToken}
                quoteToken={state.quoteToken}
                peggedBaseTokenRatio={state.peggedBaseTokenRatio}
                peggedQuoteTokenRatio={state.peggedQuoteTokenRatio}
                initPrice={state.initPrice}
                baseAmount={state.baseAmount}
                quoteAmount={state.quoteAmount}
              />

              <SettingItemWrapper
                title={<Trans>Add Initial Liquidity</Trans>}
                sx={{
                  mt: 20,
                }}
              >
                <Box
                  sx={{
                    mx: -20,
                  }}
                >
                  {tokenAmountInputArea}
                </Box>
              </SettingItemWrapper>
            </>
          )}

          <Box
            sx={{
              pb: 28,
              ...(!isMobile
                ? {
                    pb: 28,
                  }
                : {}),
            }}
          />
          <BottomButtonGroup
            state={state}
            dispatch={dispatch}
            isPeggedVersion={isPeggedVersion}
            isStandardVersion={isStandardVersion}
            isSingleTokenVersion={isSingleTokenVersion}
            fiatPriceLoading={priceInfo.fiatPriceLoading}
          />
        </Box>
      </Box>
    </WidgetContainer>
  );
}
