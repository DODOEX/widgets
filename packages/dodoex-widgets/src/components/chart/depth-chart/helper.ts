import BigNumber from 'bignumber.js';
import Konva from 'konva';
import { formatShortNumber } from '../../../utils/formatter';
import { PMMModel } from '@dodoex/api';

export function colorRgb(str: string) {
  let sColor = str.toLowerCase();
  // Regular expression for hexadecimal color values
  const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
  // If it is a hexadecimal color
  if (sColor && reg.test(sColor)) {
    if (sColor.length === 4) {
      let sColorNew = '#';
      for (let i = 1; i < 4; i += 1) {
        sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
      }
      sColor = sColorNew;
    }
    // Handle six-bit color values
    const sColorChange = [];
    for (let i = 1; i < 7; i += 2) {
      sColorChange.push(parseInt(`0x${sColor.slice(i, i + 2)}`));
    }
    return sColorChange.join(',');
  }
  return sColor;
}

export type EvaluatedPoint = {
  side: 'bid' | 'ask' | 'no-one';
  vert: BigNumber;
  base: BigNumber;
  quote: BigNumber;
};

export type BaseMinAndZoomMultiples = {
  baseMin: BigNumber;
  zoomMultiples: number;
  /** Price impact point active display hover */
  targetMarginPriceX: number;
};

export function evalPoint({
  val,
  model,
}: // midPrice,
{
  val: BigNumber;
  model: PMMModel;
  midPrice: BigNumber;
}): EvaluatedPoint {
  let v = val;
  if (val.isNaN()) {
    return {
      side: 'no-one',
      vert: new BigNumber(0),
      base: new BigNumber(0),
      quote: new BigNumber(0),
    };
  }
  // If Q0=0, the minimum value of the abscissa must be greater than or equal to i. If the abscissa input is less than i, the vertical axis value when the abscissa is i is returned.
  // If B0=0, the maximum value of the abscissa must be less than or equal to i. If the abscissa input is greater than i, the vertical axis value when the abscissa is i is returned.
  if (model.Q0.eq(0) && val.lt(model.i)) {
    v = model.i;
  }
  if (model.B0.eq(0) && val.gt(model.i)) {
    v = model.i;
  }

  const resp = model.getPriceDepth(v);
  const base = resp.baseAmount;
  const quote = resp.quoteAmount;
  const { isBuy } = resp;

  return {
    side: isBuy ? 'ask' : 'bid',
    // vert: isBuy ? base.multipliedBy(midPrice) : quote,
    vert: isBuy ? base : quote,
    base,
    quote,
  };
}

/**
 * Returns two vertical coordinates, buyBaseVert on the left and sellBaseVert on the right.
 * @param param0
 */
export function computeBaseVert({
  midPrice,
  q,
  q0,
  pmmModel,
}: {
  midPrice: BigNumber;
  q: number;
  q0: number;
  pmmModel: PMMModel;
}) {
  let baseVert = BigNumber.maximum(q, q0, pmmModel.B.multipliedBy(midPrice));
  // Special handling to avoid exceptions
  if (baseVert.isNaN()) {
    baseVert = new BigNumber(10);
  }
  if (baseVert.eq(0)) {
    baseVert = new BigNumber(1);
  }
  return {
    buyBaseVert: baseVert.multipliedBy(1.2),
    sellBaseVert: baseVert.div(midPrice).multipliedBy(1.2),
  };
}

/**
 * // 1000/800 The price represented by one pixel
  // Maximum value on the right side of the middle price = middle price * 10 = middle price * 10^1
  // Calculate the x-axis coordinate (price): middle price*10^(xPortion*x)+middle price; x is the number of equal parts that divide the right half into 50 parts
 * @param chartWidth icon width
 * @param zoomMultiples magnification factors
 * @returns
 */
export function computeXPortion(chartWidth: number, zoomMultiples = 1) {
  return new BigNumber(zoomMultiples).div(chartWidth / 2);
}

export function updateTooltip({
  tooltip,
  x,
  chartWidth,
  chartHeight,
  buyBaseVert,
  sellBaseVert,
  pmmModel,
  midPrice,
  baseTokenSymbol,
  quoteTokenSymbol,
  t,
  baseMinAndZoomMultiples,
  isHover,
  color,
  leftColor,
  rightColor,
}: {
  x: number;
  tooltip: Konva.Layer;
  chartWidth: number;
  chartHeight: number;
  buyBaseVert: BigNumber;
  sellBaseVert: BigNumber;
  pmmModel: PMMModel;
  midPrice: BigNumber;
  baseTokenSymbol: string;
  quoteTokenSymbol: string;
  t: any;
  baseMinAndZoomMultiples: BaseMinAndZoomMultiples;
  // The middle price is only displayed when hovering
  isHover?: boolean;
  // text color
  color?: string;
  // main color of base
  leftColor?: string;
  // main color of quote
  rightColor?: string;
}) {
  const { zoomMultiples, baseMin } = baseMinAndZoomMultiples;
  const xPortion = computeXPortion(chartWidth, zoomMultiples);
  const buyYPortion = buyBaseVert.div(chartHeight);
  const sellYPortion = sellBaseVert.div(chartHeight);

  const multiplesNum = zoomMultiples * 2;

  const price = baseMin.multipliedBy(10 ** xPortion.multipliedBy(x).toNumber());
  let midPriceN = new BigNumber(
    Math.log(midPrice.div(baseMin).toNumber()) / Math.log(10),
  );
  midPriceN = BigNumber.minimum(multiplesNum, midPriceN);
  midPriceN = BigNumber.maximum(0, midPriceN);
  const xMidPrice = midPriceN.div(xPortion);
  const result = evalPoint({ val: price, model: pmmModel, midPrice });
  if (result.vert.isNaN()) {
    return;
  }

  const isQuote = price.lt(midPrice);

  let yy = chartHeight - result.vert.div(buyYPortion).toNumber();
  if (!isQuote) {
    yy = chartHeight - result.vert.div(sellYPortion).toNumber();
  }

  const priceText = formatShortNumber(price);
  const amountText = formatShortNumber(result.vert);
  const slippageText = price
    .minus(midPrice)
    .abs()
    .div(midPrice)
    .multipliedBy(100)
    .toFixed(2);
  const xMidPriceText = xMidPrice.toNumber();

  const toolTipVertLine = tooltip.findOne<Konva.Line>('#toolTipVertLine');
  const toolTipHoriLine = tooltip.findOne<Konva.Line>('#toolTipHoriLine');
  const joinCircle = tooltip.findOne<Konva.Line>('#joinCircle');
  const tooltipLabel = tooltip.findOne<Konva.Label>('#toolTip');
  const priceTextLabel = tooltip.findOne<Konva.Label>('#priceTextLabel');
  const slippageTextLabel = tooltip.findOne<Konva.Label>('#slippageTextLabel');

  if (!tooltipLabel) {
    return;
  }

  tooltipLabel.x(x);
  // yy + radius of intersection circle + border of intersection circle
  tooltipLabel.y(yy - 5 - 6);
  const toolTipText = tooltipLabel.getText();
  const toolTipTag = tooltipLabel.getTag();
  let oppositeAmountText =
    result.side === 'ask'
      ? formatShortNumber(result.quote)
      : formatShortNumber(result.base);
  const isZeroK = pmmModel.k.lte(0);
  if (isZeroK) {
    oppositeAmountText = amountText;
  }
  const midPriceText = formatShortNumber(midPrice);
  const tipTextParams = {
    amountText,
    baseTokenSymbol,
    oppositeAmountText,
    quoteTokenSymbol,
    priceText: isZeroK ? midPriceText : priceText,
    slippageText: `${isQuote ? '-' : '+'}${slippageText}`,
  };
  if (xMidPrice.minus(4).lte(x) && xMidPrice.plus(2).gte(x) && isHover) {
    // midPrice hover
    toolTipText.text(
      t('depth-chart.tips.mid-price', {
        amountText: 1,
        baseTokenSymbol,
        oppositeAmountText: midPriceText,
        quoteTokenSymbol,
      }),
    );
    tooltipLabel.x(xMidPriceText);
    tooltipLabel.y(chartHeight / 2);

    toolTipVertLine?.hide();
    toolTipHoriLine?.hide();
    joinCircle?.hide();
    priceTextLabel?.hide();
    slippageTextLabel?.hide();
  } else {
    toolTipText.text(
      isQuote
        ? t('depth-chart.tips.buy', {
            amountText: oppositeAmountText,
            baseTokenSymbol,
            oppositeAmountText: amountText,
            quoteTokenSymbol,
            priceText: isZeroK ? midPriceText : priceText,
            slippageText: `${isQuote ? '-' : '+'}${slippageText}`,
          })
        : t('depth-chart.tips.sell', tipTextParams),
    );
    const textColor = color || (isQuote ? '#55f6db' : '#ff4f73');
    const lineColor = isQuote
      ? leftColor || '#55f6db'
      : rightColor || '#ff4f73';
    toolTipText.fill(textColor);

    if (tooltipLabel.width() / 2 > x) {
      toolTipTag.pointerDirection('left');
      toolTipTag.pointerHeight(15);
      toolTipTag.pointerWidth(8);
      tooltipLabel.offsetX(-(5 + 6));
      tooltipLabel.offsetY(-(5 + 6));
    } else if (tooltipLabel.width() / 2 + x > chartWidth) {
      toolTipTag.pointerDirection('right');
      toolTipTag.pointerHeight(15);
      toolTipTag.pointerWidth(8);
      tooltipLabel.offsetX(5 + 6);
      tooltipLabel.offsetY(-(5 + 6));
    } else {
      // @ts-ignore
      toolTipTag.pointerDirection('down');
      toolTipTag.pointerHeight(8);
      toolTipTag.pointerWidth(15);
      tooltipLabel.offsetX(0);
      tooltipLabel.offsetY(0);
    }

    toolTipVertLine?.points([x, chartHeight, x, yy]);
    toolTipVertLine?.stroke(lineColor);

    toolTipHoriLine?.points(
      isQuote ? [x, yy, xMidPriceText, yy] : [xMidPriceText, yy, x, yy],
    );
    toolTipHoriLine?.stroke(lineColor);

    joinCircle?.x(x);
    joinCircle?.y(yy);
    joinCircle?.fill(
      isQuote ? leftColor || 'rgb(86, 246, 218)' : rightColor || '#FF5072',
    );
    joinCircle?.stroke(
      // eslint-disable-next-line no-nested-ternary
      isQuote
        ? leftColor
          ? `rgba(${colorRgb(leftColor)}, 0.4)`
          : 'rgba(86, 246, 218, 0.3)'
        : rightColor
        ? `rgba(${colorRgb(rightColor)}, 0.4)`
        : 'rgba(255, 80, 114, 0.3)',
    );

    if (priceTextLabel) {
      priceTextLabel.x(x);
      priceTextLabel.y(chartHeight);
      priceTextLabel.offsetX(priceTextLabel.width() / 2);
      if (priceTextLabel.x() - priceTextLabel.width() / 2 < 0) {
        priceTextLabel.x(priceTextLabel.width() / 2);
      } else if (priceTextLabel.x() + priceTextLabel.width() / 2 > chartWidth) {
        priceTextLabel.x(chartWidth - priceTextLabel.width() / 2);
      } else {
        priceTextLabel.x(x);
      }
    }

    const priceTextLabelText = priceTextLabel?.findOne<Konva.Text>(
      '#priceTextLabel-text',
    );
    if (priceTextLabelText) {
      priceTextLabelText.fill(textColor);
      priceTextLabelText.text(priceText);
    }

    if (slippageTextLabel) {
      slippageTextLabel.x(
        isQuote ? x + (xMidPriceText - x) / 2 : x - (x - xMidPriceText) / 2,
      );
      slippageTextLabel.y(yy);
      slippageTextLabel.offsetY(slippageTextLabel.height() / 2);
      slippageTextLabel.offsetX(slippageTextLabel.width() / 2);
    }
    const slippageTextLabelText = slippageTextLabel?.findOne<Konva.Text>(
      '#slippageTextLabel-text',
    );
    if (slippageTextLabelText) {
      slippageTextLabelText.fill(textColor);
      slippageTextLabelText.text(`${isQuote ? '-' : '+'}${slippageText}%`);
    }

    toolTipVertLine?.show();
    toolTipHoriLine?.show();
    joinCircle?.show();
    priceTextLabel?.show();
    slippageTextLabel?.show();
  }

  tooltip.show();
}

/**
 * Calculate the minimum value on the left by pulling distance or button click
 */
export function computeBaseMinByDistance({
  dragDistance,
  prevBaseMin,
  chartWidth,
  zoomMultiples,
}: {
  dragDistance: number;
  prevBaseMin: BigNumber;
  chartWidth: number;
  zoomMultiples: number;
}) {
  const xPortion = computeXPortion(chartWidth, zoomMultiples);
  if (dragDistance > 0) {
    return prevBaseMin.multipliedBy(
      10 ** 0 - xPortion.multipliedBy(dragDistance).toNumber(),
    );
  }
  return prevBaseMin.multipliedBy(
    10 **
      xPortion
        .multipliedBy(new BigNumber(dragDistance).abs())
        .plus(0)
        .toNumber(),
  );
}

export const baseZoomMultiples = 1;
export function computeZoomMultiplesWhenZoom({
  prevZoomMultiples,
  zoomIn,
}: {
  prevZoomMultiples: number;
  zoomIn: boolean;
}) {
  if (!zoomIn) {
    if (prevZoomMultiples <= baseZoomMultiples * 0.1) {
      return prevZoomMultiples;
    }
    // The reduction ratio cannot exceed 0.001
    // if (prevZoomMultiples <= baseZoomMultiples * 0.1) {
    //   if (prevZoomMultiples <= baseZoomMultiples * 0.01) {
    //     if (prevZoomMultiples === baseZoomMultiples * 0.001) {
    //       return prevZoomMultiples;
    //     }
    //     return prevZoomMultiples - baseZoomMultiples * 0.001;
    //   }
    //   return prevZoomMultiples - baseZoomMultiples * 0.01;
    // }
  }
  return zoomIn
    ? prevZoomMultiples + baseZoomMultiples * 0.1
    : prevZoomMultiples - baseZoomMultiples * 0.1;
}

/**
 * Given a price target corresponding to the abscissa, calculate the abscissa of the point
 * The buying impact point is at the left 1/4 position
 * The selling impact point is 3/4 on the right
 *
 * Returns a coordinate point, baseMin and zoomMultiples
 *
 * Take the initial state as the starting point, that is, midPrice * 10 ^ -1 as the starting point of the horizontal axis, and it is a left-right symmetrical state, that is, the logarithm of the horizontal axis is from -1 -> 0 -> 1
 *
 * type === 'sell'
 * targetPrice = midPrice * 10 ^ n
 * n = Math.log10(targetPrice / midPrice)
 * n = maxN * (3 / 4)
 *
 * If the new price is within the existing range, the zoom factor will not be adjusted (the price impact will not change the shape of the graph after graph scaling or translation)
 * If it is not within the current interval, check whether it is midPrice * 10 ^-1 and midPrice * 10^1. If you still do not adjust the zoom factor, hit the specified point directly, otherwise you need to adjust the zoom factor (avoid inputting extremely small values) The value cannot be scaled to the specified range, resulting in stuck)
 */
export function computeTargetXByTargetPrice({
  type,
  targetPrice,
  midPrice,
  width,
}: {
  type: 'buy' | 'sell';
  targetPrice: BigNumber;
  midPrice: BigNumber;
  width: number;
}) {
  if (type === 'sell') {
    const n = new BigNumber(Math.log10(targetPrice.div(midPrice).toNumber()));
    const maxN = n
      .minus(0)
      .div(3 / 4)
      .abs();
    const zoomMultiples = maxN;

    return {
      zoomMultiples,
      targetX: (width / 2) * (3 / 4) + width / 2,
    };
  }

  const n = new BigNumber(Math.log10(targetPrice.div(midPrice).toNumber()));
  const maxN = new BigNumber(0)
    .minus(n)
    .div(3 / 4)
    .abs();
  const zoomMultiples = maxN;

  return {
    zoomMultiples,
    targetX: (width / 2) * (1 / 4),
  };
}

/**
 * If the new price is within the existing range, the zoom factor will not be adjusted (the price impact will not change the shape of the graph after graph scaling or translation)
 * If it is not within the current interval, check whether it is midPrice * 10 ^-1 and midPrice * 10^1. If it is within the range, adjust the zoom factor to 1, and then impact to the specified point, otherwise you need to adjust the zoom factor ( Avoid entering extremely small values ​​that may result in inability to scale to the specified range and cause stucks)
 *
 * Returns an abscissa and a flag indicating whether to skip
 */
export function beforePriceImpactEffect({
  currentBaseMinAndZoomMultiples,
  targetPrice,
  midPrice,
  width,
}: {
  currentBaseMinAndZoomMultiples: BaseMinAndZoomMultiples;
  targetPrice: BigNumber;
  midPrice: BigNumber;
  width: number;
}) {
  const { baseMin, zoomMultiples } = currentBaseMinAndZoomMultiples;
  const minN = new BigNumber(Math.log10(baseMin.div(midPrice).toNumber()));
  const maxN = minN.plus(zoomMultiples * 2);
  // price maximum
  const baseMax = new BigNumber(midPrice.multipliedBy(10 ** maxN.toNumber()));

  if (targetPrice.gte(baseMin) && targetPrice.lte(baseMax)) {
    const n = new BigNumber(Math.log10(targetPrice.div(midPrice).toNumber()));
    const targetX = n
      .minus(minN)
      .div(zoomMultiples * 2)
      .multipliedBy(width)
      .toNumber();
    return {
      isSkip: true,
      targetX,
      baseMin: new BigNumber(0),
      zoomMultiples: baseZoomMultiples,
    };
  }

  // 是否在 midPrice 范围内
  const defaultBaseMin = new BigNumber(
    midPrice.multipliedBy(10 ** -baseZoomMultiples),
  );
  const defaultBaseMax = new BigNumber(
    midPrice.multipliedBy(10 ** baseZoomMultiples),
  );
  if (targetPrice.gte(defaultBaseMin) && targetPrice.lte(defaultBaseMax)) {
    const n = new BigNumber(Math.log10(targetPrice.div(midPrice).toNumber()));
    const targetX = n
      .minus(-baseZoomMultiples)
      .div(baseZoomMultiples * 2)
      .multipliedBy(width)
      .toNumber();
    return {
      isSkip: false,
      targetX,
      baseMin: defaultBaseMin,
      zoomMultiples: baseZoomMultiples,
    };
  }

  return {
    isSkip: false,
    targetX: -1,
    baseMin: new BigNumber(0),
    zoomMultiples: baseZoomMultiples,
  };
}

/**
 * Recalculate baseMin after the zoom factor changes
 */
export function computeBaseAfterZoom({
  midPrice,
  zoomMultiples,
}: {
  midPrice: BigNumber;
  zoomMultiples: number;
}) {
  return midPrice.multipliedBy(10 ** -zoomMultiples);
}
