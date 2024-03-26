import BigNumber from 'bignumber.js';
import { computeMarginPrice, computeSellMarginPrice } from '../utils';

describe('sell or buy baseToken', () => {
  // https://rinkeby.etherscan.io/address/0x7da6c7c4eb768ea9ff06e9d997fab185a31ea419#readContract
  test.skip('dvm computeMarginPrice', () => {
    const b = 17.5;
    const q = 17.095471;
    const b0 = 17305.305121251746;
    const q0 = 0;
    const i = 0.000001;
    const k = 1;
    const R = 1;

    const target = new BigNumber(6.91);

    const params = {
      b,
      q,
      b0,
      q0,
      k,
      i,
      R,
      lpFeeRate: 0,
      mtFeeRate: 0,
    };
    const buyPrice = computeMarginPrice({ params, target });
    const price = computeSellMarginPrice({ params, target });
    expect(buyPrice.toFixed(6)).toBe('0.502601');
    expect(price.toFixed(6)).toBe('2.670340');
  });

  // https://rinkeby.etherscan.io/address/0xf4a6c55f31b6e3f70a339b50e31765d1a3a7c2a4#readContract
  test.skip('dpp computeMarginPrice', () => {
    const b = 37;
    const q = 23;
    const b0 = 37;
    const q0 = 23;
    const i = 0.621621;
    const k = 1;
    const R = 0;

    const target = new BigNumber(6.91);

    const params = {
      b,
      q,
      b0,
      q0,
      k,
      i,
      R,
      lpFeeRate: 0,
      mtFeeRate: 0,
    };
    const buyPrice = computeMarginPrice({ params, target });
    const price = computeSellMarginPrice({ params, target });
    expect(buyPrice.toFixed(3)).toBe('0.441');
    expect(price.toFixed(6)).toBe('0.939907');
  });

  // http://localhost:3000/pool/list/0xde2011ab0e6f4c80840acaddc222cbed35252cba?network=mainnet
  test.skip('dsp computeMarginPrice: b > b0, q < q0', () => {
    const b = 119613.5838271424;
    const q = 355473.08386418;
    const b0 = 118078.21924994938;
    const q0 = 360149.7930075969;
    const i = 3.05;
    const k = 0.1;
    const R = 2;

    const target = new BigNumber(100000);

    const params = {
      b,
      q,
      b0,
      q0,
      k,
      i,
      R,
      lpFeeRate: 0,
      mtFeeRate: 0,
    };
    const buyPrice = computeMarginPrice({ params, target });
    const price = computeSellMarginPrice({ params, target });
    expect(buyPrice.toFixed(6)).toBe('1.526196');
    expect(price.toFixed(6)).toBe('13.799154');
  });

  // http://localhost:3000/pool/list/0xaa7f19ab46a61566d5459645b7046b79ab261d4a?network=polygon
  test.skip('dsp computeMarginPrice: b < b0, q > q0', () => {
    const b = 262299.9799926594;
    const q = 2238834.109;
    const b0 = 1114292.9341153332;
    const q0 = 1110100;
    const i = 1;
    const k = 0.1;
    const R = 1;

    const target = new BigNumber(260000);

    const params = {
      b,
      q,
      b0,
      q0,
      k,
      i,
      R,
      lpFeeRate: 0,
      mtFeeRate: 0,
    };
    const buyPrice = computeMarginPrice({ params, target });
    const price = computeSellMarginPrice({ params, target });
    expect(buyPrice.toFixed(6)).toBe('1.355154');
    expect(price.toFixed(6)).toBe('23472.929208');
  });

  // http://localhost:3000/pool/list/0x8876819535b48b551c9e97ebc07332c7482b4b2d?network=mainnet
  test.skip('01 classical computeMarginPrice: b < b0, q > q0', () => {
    const b = 2378301.0226432797;
    const q = 3448586.808296;
    const b0 = 10175435.74327973;
    const q0 = 115180.007942;
    const i = 0.1;
    const k = 0.999;
    const R = 1;

    const target = new BigNumber(1000000);

    const params = {
      b,
      q,
      b0,
      q0,
      k,
      i,
      R,
      lpFeeRate: 0,
      mtFeeRate: 0,
    };
    const buyPrice = computeMarginPrice({ params, target });
    const price = computeSellMarginPrice({ params, target });
    expect(buyPrice.toFixed(6)).toBe('0.906406');
    expect(price.toFixed(6)).toBe('5.444918');
  });

  // https://app.dodoex.io/pool/list/0x2109f78b46a789125598f5ad2b7f243751c2934d?network=mainnet
  test.skip('02 classical computeMarginPrice: b < b0, q > q0', () => {
    const b = 194.68963817;
    const q = 5768622.846181;
    const b0 = 195.6692186;
    const q0 = 5704628.311129;
    const i = 65230.05211447;
    const k = 0.3;
    const R = 1;

    const target = new BigNumber(192);

    const params = {
      b,
      q,
      b0,
      q0,
      k,
      i,
      R,
      lpFeeRate: 0,
      mtFeeRate: 0,
    };
    const buyPrice = computeMarginPrice({ params, target });
    const price = computeSellMarginPrice({ params, target });
    expect(buyPrice.toFixed(6)).toBe('5148.075868');
    expect(price.toFixed(6)).toBe('103613826.303394');
  });

  // https://app.dodoex.io/pool/list/0x2109f78b46a789125598f5ad2b7f243751c2934d?network=mainnet
  test.skip('03 classical computeMarginPrice: b > b0, q < q0', () => {
    const b = 196.72771147;
    const q = 7342296.223337;
    const b0 = 196.51003563;
    const q0 = 7356408.620941;
    const i = 64869.55605925;
    const k = 0.3;
    const R = 2;

    const target = new BigNumber(192);

    const params = {
      b,
      q,
      b0,
      q0,
      k,
      i,
      R,
      lpFeeRate: 0,
      mtFeeRate: 0,
    };
    const buyPrice = computeMarginPrice({ params, target });
    const price = computeSellMarginPrice({ params, target });
    expect(buyPrice.toFixed(6)).toBe('8513.933995');
    expect(price.toFixed(6)).toBe('33667886.955142');
  });

  // https://app.dodoex.io/pool/list/0x9d9793e1e18cdee6cf63818315d55244f73ec006?network=mainnet
  test.skip('04 classical computeMarginPrice: b > b0, q < q0', () => {
    const b = 2935.983021609493;
    const q = 1120.039411;
    const b0 = 19.232658497004344;
    const q0 = 2452.709177;
    const i = 1;
    const k = 0.999;
    const R = 2;

    const target = new BigNumber(100);

    const params = {
      b,
      q,
      b0,
      q0,
      k,
      i,
      R,
      lpFeeRate: 0,
      mtFeeRate: 0,
    };
    const buyPrice = computeMarginPrice({ params, target });
    const price = computeSellMarginPrice({ params, target });
    expect(buyPrice.toFixed(6)).toBe('0.201134');
    expect(price.toFixed(6)).toBe('0.216697');
  });
});
