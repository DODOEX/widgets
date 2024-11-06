import { Box, Skeleton, useTheme } from '@dodoex/components';
import { t, Trans } from '@lingui/macro';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import WidgetConfirm from '../../../components/WidgetConfirm';
import GoBack from '../../../components/GoBack';
import RiskDialog from '../../../components/RiskDialog';
import {
  CardPlusConnected,
  TokenCard,
} from '../../../components/Swap/components/TokenCard';
import WidgetContainer from '../../../components/WidgetContainer';
import {
  getIsPoolEditRiskWarningOpen,
  RiskOncePageLocalStorage,
} from '../../../constants/localstorage';
import { useWalletInfo } from '../../../hooks/ConnectWallet/useWalletInfo';
import { useWidgetDevice } from '../../../hooks/style/useWidgetDevice';
import { useRouterStore } from '../../../router';
import { Page, PageType } from '../../../router/types';
import { usePoolDetail } from '../hooks/usePoolDetail';
import { DepthChartWrapper } from '../PoolCreate/components/DepthChartWrapper';
import { FeeRateCard } from '../PoolCreate/components/FeeRateCard';
import { LqSettingsShow } from '../PoolCreate/components/LqSettingsShow';
import { VersionChartExample } from '../PoolCreate/components/VersionChartExample';
import { getFeeRateList } from '../PoolCreate/hooks/useFeeRateList';
import { getDefaultSlippageCoefficientList } from '../PoolCreate/hooks/useSlippageCoefficientList';
import { useVersionList } from '../PoolCreate/hooks/useVersionList';
import { InitPriceSetting } from '../PoolCreate/operate-widgets/InitPriceSetting';
import { SlippageCoefficientSetting } from '../PoolCreate/operate-widgets/SlippageCoefficientSetting';
import { reducer, Types } from '../PoolCreate/reducer';
import { Version } from '../PoolCreate/types';
import {
  DEFAULT_FEE_RATE,
  DEFAULT_INIT_PRICE,
  DEFAULT_SLIPPAGE_COEFFICIENT,
} from '../PoolCreate/utils';
import { poolApi } from '../utils';
import { BottomButtonGroup } from './operate-widgets/BottomButtonGroup';
import { FeeRateSetting } from './operate-widgets/FeeRateSetting';
import { SectionTitle } from './SectionTitle';
import { usePriceInit } from '../PoolCreate/hooks/usePriceInit';

export default function PoolModify({
  params,
}: {
  params: Page<PageType.PoolDetail>['params'];
}) {
  const theme = useTheme();
  const { isMobile } = useWidgetDevice();
  const { chainId } = useWalletInfo();

  const [showRiskDialog, setShowRiskDialog] = React.useState(false);

  const [state, dispatch] = React.useReducer<typeof reducer>(reducer, {
    currentStep: 0,
    selectedVersion: Version.marketMakerPool,
    baseToken: null,
    quoteToken: null,
    baseAmount: '',
    quoteAmount: '',
    isFixedRatio: true,
    initPrice: DEFAULT_INIT_PRICE,
    fixedRatioPrice: DEFAULT_INIT_PRICE,
    leftTokenAddress: undefined,
    feeRate: DEFAULT_FEE_RATE,
    isFeeRateCustomized: false,
    slippageCoefficient: DEFAULT_SLIPPAGE_COEFFICIENT,
    isSlippageCoefficientCustomized: false,
    peggedBaseTokenRatio: '',
    peggedQuoteTokenRatio: '',
  });

  React.useEffect(() => {
    setShowRiskDialog(getIsPoolEditRiskWarningOpen());
  }, []);

  const [noResultModalVisible, setNoResultModalVisible] = React.useState<
    'inital' | 'open' | 'close'
  >('inital');

  const { poolDetail, ...fetchPoolQuery } = usePoolDetail({
    id: params?.address,
    chainId: params?.chainId,
  });
  if (
    !fetchPoolQuery.isPending &&
    !fetchPoolQuery.error &&
    !poolDetail &&
    noResultModalVisible === 'inital'
  ) {
    setNoResultModalVisible('open');
  }
  if (!state.baseToken && poolDetail?.baseToken) {
    dispatch({
      type: Types.InitEditParameters,
      payload: poolDetail,
    });
  }

  const pmmStateQuery = useQuery(
    poolApi.getPMMStateQuery(
      poolDetail?.chainId,
      poolDetail?.address,
      poolDetail?.type,
      poolDetail?.baseToken?.decimals,
      poolDetail?.quoteToken?.decimals,
    ),
  );
  if (!state.slippageCoefficient && pmmStateQuery.data?.pmmParamsBG?.k) {
    const slippageCoefficientNew = pmmStateQuery.data.pmmParamsBG.k.toString();
    const isSlippageCoefficientCustomized = !getDefaultSlippageCoefficientList({
      selectedVersion: state.selectedVersion,
    }).includes(slippageCoefficientNew);
    dispatch({
      type: Types.UpdateSlippageCoefficient,
      payload: slippageCoefficientNew,
    });
    dispatch({
      type: Types.UpdateIsSlippageCoefficientCustomized,
      payload: isSlippageCoefficientCustomized,
    });
  }
  if (!state.baseAmount && pmmStateQuery.data) {
    dispatch({
      type: Types.UpdateBaseAmount,
      payload: pmmStateQuery.data.baseReserve.toString(),
    });
    dispatch({
      type: Types.UpdateQuoteAmount,
      payload: pmmStateQuery.data.quoteReserve.toString(),
    });
  }
  if (!state.fixedRatioPrice && pmmStateQuery.data) {
    dispatch({
      type: Types.UpdateFixedRatioPrice,
      payload: pmmStateQuery.data.pmmParamsBG.i.toString(),
    });
  }

  const feeRateQuery = useQuery(
    poolApi.getLPFeeRateQuery(
      poolDetail?.chainId,
      poolDetail?.address,
      poolDetail?.type,
    ),
  );
  if (!state.feeRate && feeRateQuery.data) {
    const feeRateNew = feeRateQuery.data.times(100).toString();
    const feeRateList = getFeeRateList();
    const isFeeRateCustomized =
      feeRateList.findIndex((item) => item.value === feeRateNew) === -1;
    dispatch({
      type: Types.UpdateFeeRate,
      payload: feeRateNew,
    });
    dispatch({
      type: Types.UpdateIsFeeRateCustomized,
      payload: isFeeRateCustomized,
    });
  }

  const isSingleTokenVersion = state.selectedVersion === Version.singleToken;
  const isStandardVersion = state.selectedVersion === Version.standard;

  const priceInfo = usePriceInit({
    isSingleTokenVersion,
    leftTokenAddress: state.leftTokenAddress,
    baseToken: state.baseToken,
    quoteToken: state.quoteToken,
    dispatch,
  });

  const { versionMap } = useVersionList();

  const versionItem = versionMap[state.selectedVersion];
  const poolDetailLoading = !poolDetail?.baseToken;
  const loadingEle = (
    <Skeleton
      variant="rounded"
      width={210}
      height={60}
      sx={{
        padding: 16,
        borderRadius: 8,
      }}
    />
  );
  const loadingEleInput = (
    <Skeleton
      variant="rounded"
      height={167}
      sx={{
        mx: 20,
        borderRadius: 16,
      }}
    />
  );

  return (
    <>
      <WidgetContainer>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            ...(isMobile
              ? {
                  height: '100%',
                }
              : {
                  height: 'auto',
                }),
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
                  typography: 'h5',
                  fontWeight: 600,
                  color: 'text.primary',
                }}
              >
                <Trans>Pool Setup</Trans>
              </Box>

              <SectionTitle titleKey={t`Select Pool Version`} />
              <VersionChartExample
                key={versionItem.version}
                versionItem={versionItem}
                status={'completed'}
              />

              <SectionTitle titleKey={t`Parameter Settings`} />
              {poolDetailLoading ? (
                loadingEle
              ) : (
                <LqSettingsShow
                  status="running"
                  baseToken={state.baseToken}
                  quoteToken={state.quoteToken}
                  initPrice={state.initPrice}
                  slippageCoefficient={state.slippageCoefficient}
                  selectedVersion={state.selectedVersion}
                  baseAmount={state.baseAmount}
                  quoteAmount={state.quoteAmount}
                />
              )}

              <SectionTitle titleKey={t`Fee Rate`} />
              {poolDetailLoading ? (
                loadingEle
              ) : (
                <FeeRateCard isWaiting={false} feeRate={state.feeRate} />
              )}
            </Box>
          )}

          <Box
            sx={{
              flexGrow: 1,
              flexShrink: 0,
              flexBasis: 375,
              backgroundColor: 'background.paper',
              ...(isMobile
                ? {
                    width: '100%',
                    borderRadius: 0,
                    minHeight: '100%',
                  }
                : {
                    pb: 20,
                    borderRadius: 16,
                    flexGrow: 0,
                    minHeight: 'auto',
                  }),
            }}
          >
            <Box
              sx={{
                top: 0,
                py: 20,
                px: 20,
                backgroundColor: theme.palette.background.paper,
                zIndex: 1,
                ...(isMobile
                  ? {
                      position: 'sticky',
                    }
                  : {
                      position: 'static',
                      borderTopLeftRadius: 16,
                      borderTopRightRadius: 16,
                    }),
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Box
                  sx={{
                    typography: 'h5',
                    color: theme.palette.text.primary,
                    fontWeight: 600,
                  }}
                >
                  <Trans>Edit Parameter Settings</Trans>
                </Box>
              </Box>
            </Box>

            {poolDetailLoading ? null : (
              <DepthChartWrapper
                baseToken={state.baseToken}
                quoteToken={state.quoteToken}
                initPrice={state.initPrice}
                slippageCoefficient={state.slippageCoefficient}
                selectedVersion={state.selectedVersion}
                baseAmount={state.baseAmount}
                quoteAmount={state.quoteAmount}
              />
            )}

            {poolDetailLoading ? (
              loadingEleInput
            ) : (
              <Box
                sx={{
                  px: 20,
                }}
              >
                <TokenCard
                  canClickBalance
                  showPercentage
                  amt={state.baseAmount}
                  onInputChange={(payload) => {
                    dispatch({
                      type: Types.UpdateBaseAmount,
                      payload,
                    });
                  }}
                  readOnly={isSingleTokenVersion}
                  token={state.baseToken}
                  occupiedAddrs={
                    state.quoteToken ? [state.quoteToken.address] : undefined
                  }
                  occupiedChainId={chainId}
                  chainId={chainId}
                />
                <CardPlusConnected />
                <TokenCard
                  canClickBalance
                  showPercentage
                  amt={state.quoteAmount}
                  onInputChange={(payload) => {
                    dispatch({
                      type: Types.UpdateQuoteAmount,
                      payload,
                    });
                  }}
                  token={state.quoteToken}
                  occupiedAddrs={
                    state.baseToken ? [state.baseToken.address] : undefined
                  }
                  occupiedChainId={chainId}
                  chainId={chainId}
                />
              </Box>
            )}
            {poolDetailLoading ? null : (
              <>
                {state.selectedVersion !== Version.standard && (
                  <SlippageCoefficientSetting
                    dispatch={dispatch}
                    slippageCoefficient={state.slippageCoefficient}
                    selectedVersion={state.selectedVersion}
                    isCustomized={state.isSlippageCoefficientCustomized}
                    isStandardVersion={isStandardVersion}
                  />
                )}
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
                <FeeRateSetting
                  dispatch={dispatch}
                  feeRate={state.feeRate}
                  isCustomized={state.isFeeRateCustomized}
                />
              </>
            )}

            <Box
              sx={{
                pb: 160,
                [theme.breakpoints.up('tablet')]: {
                  pb: 28,
                },
              }}
            />
            <BottomButtonGroup
              state={state}
              pool={poolDetail}
              loading={poolDetailLoading}
            />
          </Box>
        </Box>
      </WidgetContainer>

      <WidgetConfirm
        singleBtn
        open={noResultModalVisible === 'open'}
        onClose={() => setNoResultModalVisible('close')}
        onConfirm={() => setNoResultModalVisible('close')}
        title={t`Pool not found. Please switch to another network and retry.`}
      />

      <RiskDialog
        open={showRiskDialog}
        onClose={() => {
          setShowRiskDialog(false);
        }}
        onConfirm={() => {
          window.localStorage.setItem(
            RiskOncePageLocalStorage.PoolEditPage,
            '1',
          );
          setShowRiskDialog(false);
        }}
        alertContent={
          <Trans>
            You are making changes to the liquidity of a private pool. This is a
            highly discretionary operation that may cause substantial
            inflows/outflows of funds and changes in market prices. Please make
            sure you are fully aware of the implications of each parameter
            modification.
          </Trans>
        }
      />
    </>
  );
}
