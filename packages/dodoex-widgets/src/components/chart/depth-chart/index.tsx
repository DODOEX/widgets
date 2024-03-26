import BigNumber from 'bignumber.js';
import { debounce } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { BiChevronLeft, BiChevronRight, BiMinus, BiPlus } from 'react-icons/bi';
import { Input } from '../components/Input';
import { usePreventWheel } from '../hooks/usePreventWheel';
import { ColorMap, DepthChartKonva } from './DepthChartKonva';
import { chartT as t } from '../i18n';
import {
  BaseMinAndZoomMultiples,
  baseZoomMultiples,
  beforePriceImpactEffect,
  computeBaseAfterZoom,
  computeBaseMinByDistance,
  computeTargetXByTargetPrice,
  computeZoomMultiplesWhenZoom,
} from './helper';
import {
  AmountInputContainer,
  Container,
  InputSectionWrapper,
  OptButton,
  OptButtonGroup,
  PriceImpactWrapper,
} from './index.styled';
import { computeMarginPrice, computeSellMarginPrice } from './utils';
import { PMMModel, PmmModelParams } from '@dodoex/api';
import {
  fixedInputStringToFormattedNumber,
  formatPercentageNumber,
} from '../../../utils/formatter';

type Props = {
  chartId: string;
  width?: number;
  baseTokenSymbol: string;
  quoteTokenSymbol: string;
  pmmModel?: PMMModel;
  pmmParams?: PmmModelParams;
  midPrice?: BigNumber;
  height?: number;
  notShowAmountInput?: boolean;
  colorMap?: ColorMap;
};

const DepthChart: React.FC<Props> = ({
  chartId,
  width = 834,
  height = 460,
  baseTokenSymbol,
  quoteTokenSymbol,
  pmmModel,
  pmmParams,
  midPrice = new BigNumber(0),
  colorMap,
  notShowAmountInput,
}: Props) => {
  usePreventWheel({ id: chartId });

  const [buyAmount, setBuyAmount] = useState<string>('');
  const [sellAmount, setSellAmount] = useState<string>('');
  const [buyImpact, setBuyImpact] = useState('-');
  const [sellImpact, setSellImpact] = useState('-');

  // 横轴起点和缩放比例同时变化，变化也会引起价格冲击点变化
  const [baseMinAndZoomMultiples, setBaseMinAndZoomMultiples] =
    useState<BaseMinAndZoomMultiples>({
      baseMin: new BigNumber(0),
      zoomMultiples: baseZoomMultiples,
      targetMarginPriceX: 0,
    });

  useEffect(() => {
    if (midPrice !== undefined) {
      setBaseMinAndZoomMultiples((prev) => {
        return {
          baseMin: computeBaseAfterZoom({
            midPrice,
            zoomMultiples: prev.zoomMultiples,
          }),
          zoomMultiples: prev.zoomMultiples,
          targetMarginPriceX: prev.targetMarginPriceX,
        };
      });
    }
  }, [midPrice]);

  const amountOnChange = useMemo(
    () =>
      debounce(({ type, amount }: { type: 'buy' | 'sell'; amount: string }) => {
        if (amount === '' && midPrice) {
          setBaseMinAndZoomMultiples({
            baseMin: computeBaseAfterZoom({
              midPrice,
              zoomMultiples: baseZoomMultiples,
            }),
            zoomMultiples: baseZoomMultiples,
            targetMarginPriceX: 0,
          });
          if (type === 'buy') {
            setBuyImpact('-');
          } else {
            setSellImpact('-');
          }
        }
        const amountB = new BigNumber(amount);
        if (
          amountB.lte(0) ||
          amountB.isNaN() ||
          !pmmParams?.b ||
          amountB.gte(pmmParams.b) ||
          !midPrice
        ) {
          return;
        }
        if (type === 'buy') {
          const marginPrice = computeMarginPrice({
            params: pmmParams,
            target: amountB,
          });
          setBaseMinAndZoomMultiples((prev) => {
            const impactResult = beforePriceImpactEffect({
              currentBaseMinAndZoomMultiples: prev,
              targetPrice: marginPrice,
              midPrice,
              width,
            });
            if (impactResult.isSkip) {
              return {
                baseMin: prev.baseMin,
                zoomMultiples: prev.zoomMultiples,
                targetMarginPriceX: impactResult.targetX,
              };
            }

            if (impactResult.targetX > 0) {
              return {
                baseMin: impactResult.baseMin,
                zoomMultiples: impactResult.zoomMultiples,
                targetMarginPriceX: impactResult.targetX,
              };
            }

            const result = computeTargetXByTargetPrice({
              midPrice,
              width,
              type,
              targetPrice: marginPrice,
            });
            const newZoomMultiples = result.zoomMultiples.dp(6).toNumber();
            return {
              baseMin: computeBaseAfterZoom({
                midPrice,
                zoomMultiples: newZoomMultiples,
              }),
              zoomMultiples: newZoomMultiples,
              targetMarginPriceX: result.targetX,
            };
          });
          // console.log(
          //   'v2 marginPrice',
          //   amountB.toFixed(6),
          //   marginPrice.toFixed(6),
          //   result.targetX,
          //   result.zoomMultiples.toFixed(6),
          // );
          setBuyImpact(
            `${formatPercentageNumber({
              input: marginPrice.minus(midPrice).div(midPrice),
            })}`,
          );
        } else {
          const marginPrice = computeSellMarginPrice({
            params: pmmParams,
            target: amountB,
          });
          setBaseMinAndZoomMultiples((prev) => {
            const impactResult = beforePriceImpactEffect({
              currentBaseMinAndZoomMultiples: prev,
              targetPrice: marginPrice,
              midPrice,
              width,
            });
            if (impactResult.isSkip) {
              return {
                baseMin: prev.baseMin,
                zoomMultiples: prev.zoomMultiples,
                targetMarginPriceX: impactResult.targetX,
              };
            }

            if (impactResult.targetX > 0) {
              return {
                baseMin: impactResult.baseMin,
                zoomMultiples: impactResult.zoomMultiples,
                targetMarginPriceX: impactResult.targetX,
              };
            }
            const result = computeTargetXByTargetPrice({
              midPrice,
              width,
              type,
              targetPrice: marginPrice,
            });
            const newZoomMultiples = result.zoomMultiples.dp(6).toNumber();
            return {
              baseMin: computeBaseAfterZoom({
                midPrice,
                zoomMultiples: newZoomMultiples,
              }),
              zoomMultiples: newZoomMultiples,
              targetMarginPriceX: result.targetX,
            };
          });
          setSellImpact(
            `+${formatPercentageNumber({
              input: marginPrice.minus(midPrice).div(midPrice),
            })}`,
          );
        }
      }, 300),
    [pmmParams, midPrice, width],
  );
  useEffect(() => {
    if (buyAmount !== undefined) {
      amountOnChange({
        type: 'buy',
        amount: buyAmount,
      });
    }
  }, [amountOnChange, buyAmount]);
  useEffect(() => {
    if (sellAmount !== undefined) {
      amountOnChange({
        type: 'sell',
        amount: sellAmount,
      });
    }
  }, [amountOnChange, sellAmount]);

  const handleDragButtonMouseDown = (moveLeft?: boolean) => {
    let dragDistance = 0;
    if (moveLeft) {
      dragDistance = -(width * 0.1);
    } else {
      dragDistance = width * 0.1;
    }
    setBaseMinAndZoomMultiples((prev) => {
      if (prev.baseMin === undefined) {
        return prev;
      }
      return {
        baseMin: computeBaseMinByDistance({
          dragDistance,
          prevBaseMin: prev.baseMin,
          chartWidth: width,
          zoomMultiples: prev.zoomMultiples,
        }),
        zoomMultiples: prev.zoomMultiples,
        targetMarginPriceX: prev.targetMarginPriceX,
      };
    });
  };

  const handleZoomButtonMouseDown = (zoomIn?: boolean) => {
    setBaseMinAndZoomMultiples((prev) => {
      const newZoomMultiples = computeZoomMultiplesWhenZoom({
        zoomIn: zoomIn ?? false,
        prevZoomMultiples: prev.zoomMultiples,
      });
      return {
        baseMin: computeBaseAfterZoom({
          midPrice,
          zoomMultiples: newZoomMultiples,
        }),
        zoomMultiples: newZoomMultiples,
        targetMarginPriceX: prev.targetMarginPriceX,
      };
    });
  };

  const buyInputError = useMemo(() => {
    if (buyAmount === '') {
      return false;
    }
    const amountB = new BigNumber(buyAmount);
    if (
      amountB.lte(0) ||
      amountB.isNaN() ||
      !pmmParams?.b ||
      amountB.gte(pmmParams.b)
    ) {
      return true;
    }
    return false;
  }, [buyAmount, pmmParams]);
  const sellInputError = useMemo(() => {
    if (sellAmount === '') {
      return false;
    }
    const amountB = new BigNumber(sellAmount);
    if (
      amountB.lte(0) ||
      amountB.isNaN() ||
      !pmmParams?.b ||
      amountB.gte(pmmParams.b)
    ) {
      return true;
    }
    return false;
  }, [sellAmount, pmmParams]);

  return (
    <Container id={chartId}>
      {!notShowAmountInput ? (
        <AmountInputContainer>
          <InputSectionWrapper borderColor={colorMap && colorMap.grid}>
            {t('pool.chart.buy-amount', { symbol: baseTokenSymbol })}
            <Input
              value={buyAmount}
              error={buyInputError}
              onChange={(evt) => {
                const amount = fixedInputStringToFormattedNumber(
                  evt.target.value,
                  2,
                );
                if (amount !== null) {
                  setBuyAmount(amount);
                }
              }}
            />
            <PriceImpactWrapper>
              {t('pool.chart.price-impact', { amount: buyImpact })}
            </PriceImpactWrapper>
          </InputSectionWrapper>
          <InputSectionWrapper borderColor={colorMap && colorMap.grid}>
            {t('pool.chart.sell-amount', { symbol: baseTokenSymbol })}
            <Input
              value={sellAmount}
              error={sellInputError}
              onChange={(evt) => {
                const amount = fixedInputStringToFormattedNumber(
                  evt.target.value,
                  2,
                );
                if (amount !== null) {
                  setSellAmount(amount);
                }
              }}
            />
            <PriceImpactWrapper>
              {t('pool.chart.price-impact', { amount: sellImpact })}
            </PriceImpactWrapper>
          </InputSectionWrapper>
        </AmountInputContainer>
      ) : (
        ''
      )}

      {pmmParams !== undefined &&
        midPrice !== undefined &&
        pmmModel !== undefined &&
        baseMinAndZoomMultiples.baseMin !== undefined &&
        midPrice !== undefined && (
          <DepthChartKonva
            width={width}
            height={height}
            params={pmmParams}
            midPrice={midPrice}
            pmmModel={pmmModel}
            baseTokenSymbol={baseTokenSymbol}
            quoteTokenSymbol={quoteTokenSymbol}
            baseMinAndZoomMultiples={baseMinAndZoomMultiples}
            colorMap={colorMap}
            setBaseMinAndZoomMultiples={setBaseMinAndZoomMultiples}
          />
        )}

      <OptButtonGroup className="operate-btn-wrapper">
        <OptButton onClick={() => handleDragButtonMouseDown(true)}>
          <BiChevronLeft />
        </OptButton>
        <OptButton onClick={() => handleZoomButtonMouseDown(false)}>
          <BiMinus />
        </OptButton>
        <OptButton onClick={() => handleZoomButtonMouseDown(true)}>
          <BiPlus />
        </OptButton>
        <OptButton onClick={() => handleDragButtonMouseDown(false)}>
          <BiChevronRight />
        </OptButton>
      </OptButtonGroup>
    </Container>
  );
};

export default DepthChart;
