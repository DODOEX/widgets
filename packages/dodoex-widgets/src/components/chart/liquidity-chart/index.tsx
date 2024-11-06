import { PMMModel, PmmModelParams } from '@dodoex/api';
import BigNumber from 'bignumber.js';
import { Container, TipWrapper } from './index.styled';
import { ColorMap, LiquidityChartKonva } from './LiquidityChartKonva';
import { chartT as t } from '../i18n';

type Props = {
  width?: number;
  height?: number;
  baseTokenSymbol: string;
  quoteTokenSymbol: string;
  pmmModel?: PMMModel;
  pmmParams?: PmmModelParams;
  midPrice?: BigNumber;
  notShowTipText?: boolean;
  colorMap?: ColorMap;
};

const LiquidityChart: React.FC<Props> = ({
  width = 834,
  height = 462,
  baseTokenSymbol,
  quoteTokenSymbol,
  pmmModel,
  pmmParams,
  midPrice,
  notShowTipText,
  colorMap,
}: Props) => {
  return (
    <Container>
      {pmmParams !== undefined &&
        midPrice !== undefined &&
        pmmModel !== undefined &&
        midPrice !== undefined && (
          <LiquidityChartKonva
            width={width}
            height={height}
            params={pmmParams}
            midPrice={midPrice}
            pmmModel={pmmModel}
            baseTokenSymbol={baseTokenSymbol}
            quoteTokenSymbol={quoteTokenSymbol}
            colorMap={colorMap}
          />
        )}

      {!notShowTipText ? (
        <TipWrapper>
          *&nbsp;
          {t('pool.chart.liquidity-chart-tip', {
            baseTokenSymbol,
          })}
        </TipWrapper>
      ) : (
        ''
      )}
    </Container>
  );
};

export default LiquidityChart;
