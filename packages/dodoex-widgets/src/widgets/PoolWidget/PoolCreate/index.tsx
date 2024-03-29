import { Box, useTheme } from '@dodoex/components';
import { t, Trans } from '@lingui/macro';
import React from 'react';
import GoBack from '../../../components/GoBack';
import {
  CardPlus,
  CardPlusConnected,
  TokenCard,
} from '../../../components/Swap/components/TokenCard';
import { useWalletInfo } from '../../../hooks/ConnectWallet/useWalletInfo';
import { useWidgetDevice } from '../../../hooks/style/useWidgetDevice';
import { DepthChartWrapper } from './components/DepthChartWrapper';
import { FeeRateCard } from './components/FeeRateCard';
import { LqSettingsShow } from './components/LqSettingsShow';
import { SectionTitle } from './components/SectionTitle';
import { StepTitle } from './components/StepTitle';
import { VersionChartExample } from './components/VersionChartExample';
import useDefaultTokens from './hooks/useDefaultTokens';
import { useVersionList } from './hooks/useVersionList';
import { BottomButtonGroup } from './operate-widgets/BottomButtonGroup';
import { FeeRateSetting } from './operate-widgets/FeeRateSetting';
import { InitPriceSetting } from './operate-widgets/InitPriceSetting';
import { SlippageCoefficientSetting } from './operate-widgets/SlippageCoefficientSetting';
import VersionSelect from './operate-widgets/VersionSelect';
import { reducer, Types } from './reducer';
import { Version } from './types';
import {
  DEFAULT_FEE_RATE,
  DEFAULT_INIT_PRICE,
  DEFAULT_INIT_PRICE_STANDARD,
  DEFAULT_SLIPPAGE_COEFFICIENT,
} from './utils';

export default function PoolCreate() {
  const theme = useTheme();
  const { defaultBaseToken, defaultQuoteToken } = useDefaultTokens();
  const { chainId } = useWalletInfo();

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

  const leftToken = isSingleTokenVersion ? state.quoteToken : state.baseToken;
  const rightToken = isSingleTokenVersion ? state.baseToken : state.quoteToken;

  return (
    <Box
      sx={{
        position: 'relative',
        height: '100%',
        overflowY: 'auto',
        overflowX: 'hidden',
        ...(!isMobile
          ? {
              padding: theme.spacing(28, 20, 40, 40),
              backgroundColor: 'background.default',
            }
          : {
              padding: 0,
            }),
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          height: '100%',
          ...(!isMobile
            ? {
                height: 'auto',
              }
            : {}),
        }}
      >
        {isMobile ? null : (
          <Box
            sx={{
              mr: 12,
              flexGrow: 1,
              display: 'block',
            }}
          >
            <GoBack />

            <Box
              sx={{
                mt: 28,
                typography: 'h4',
                fontWeight: 600,
                color: 'text.primary',
              }}
            >
              <Trans>Pool Setup</Trans>
            </Box>

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

            <SectionTitle
              titleKey={t`Fee Rate`}
              index={3}
              status={state.currentStep === 2 ? 'running' : 'waiting'}
            />
            <FeeRateCard
              currentStep={state.currentStep}
              feeRate={state.feeRate}
            />
          </Box>
        )}

        <Box
          sx={{
            flexGrow: 1,
            flexShrink: 0,
            flexBasis: 375,
            borderRadius: 0,
            backgroundColor: 'background.paper',
            minHeight: '100%',
            ...(!isMobile
              ? {
                  pb: 20,
                  borderRadius: 16,
                  flexGrow: 0,
                  minHeight: 'auto',
                  height: '100%',
                  position: 'sticky',
                  top: '28px',
                  overflowY: 'hidden',
                }
              : {}),
          }}
        >
          <StepTitle currentStep={state.currentStep} />

          {state.currentStep === 0 && (
            <VersionSelect
              selectedVersion={state.selectedVersion}
              dispatch={dispatch}
            />
          )}

          {state.currentStep === 1 && (
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
              <Box
                sx={{
                  px: 20,
                }}
              >
                <TokenCard
                  showMaxBtn
                  showPercentage
                  amt={
                    isSingleTokenVersion ? state.quoteAmount : state.baseAmount
                  }
                  onInputChange={(payload) => {
                    dispatch({
                      type: isSingleTokenVersion
                        ? Types.UpdateQuoteAmount
                        : Types.UpdateBaseAmount,
                      payload,
                    });
                  }}
                  readOnly={isSingleTokenVersion}
                  token={leftToken}
                  occupiedAddrs={rightToken ? [rightToken.address] : undefined}
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
                        ? Types.UpdateQuoteToken
                        : Types.UpdateBaseToken,
                      payload,
                    });
                  }}
                />
                <CardPlusConnected />
                <TokenCard
                  showMaxBtn
                  showPercentage
                  amt={
                    isSingleTokenVersion ? state.baseAmount : state.quoteAmount
                  }
                  onInputChange={(payload) => {
                    dispatch({
                      type: isSingleTokenVersion
                        ? Types.UpdateBaseAmount
                        : Types.UpdateQuoteAmount,
                      payload,
                    });
                  }}
                  readOnly={
                    isStandardVersion &&
                    state.isFixedRatio &&
                    !!state.fixedRatioPrice
                  }
                  inputReadonlyTooltip={t`The token amount is calculated by initial price.`}
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
                />
              </Box>
              <InitPriceSetting
                selectedVersion={state.selectedVersion}
                isFixedRatio={state.isFixedRatio}
                leftTokenAddress={state.leftTokenAddress}
                baseToken={state.baseToken}
                quoteToken={state.quoteToken}
                fixedRatioPrice={state.fixedRatioPrice}
                dispatch={dispatch}
              />
              <SlippageCoefficientSetting
                dispatch={dispatch}
                slippageCoefficient={state.slippageCoefficient}
                selectedVersion={state.selectedVersion}
                isCustomized={state.isSlippageCoefficientCustomized}
              />
            </>
          )}

          {state.currentStep === 2 && (
            <FeeRateSetting
              dispatch={dispatch}
              feeRate={state.feeRate}
              isFeeRateCustomized={state.isFeeRateCustomized}
            />
          )}

          <Box
            sx={{
              pb: 72,
              ...(!isMobile
                ? {
                    pb: 28,
                  }
                : {}),
            }}
          />
          <BottomButtonGroup state={state} dispatch={dispatch} />
        </Box>
      </Box>
    </Box>
  );
}
