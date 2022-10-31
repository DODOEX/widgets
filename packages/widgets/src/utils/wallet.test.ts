import { isETHChain } from './wallet';

describe('isETHChain', () => {
  it('mainnet', () => {
    const mainnetRes = isETHChain(1);
    expect(mainnetRes.isMainnet).toBeTruthy();
    expect(mainnetRes.isETH).toBeTruthy();
    expect(mainnetRes.isRinkeby).toBeFalsy();
    expect(mainnetRes.isGor).toBeFalsy();
  });
  it('rinkeby', () => {
    const rinkebyRes = isETHChain(4);
    expect(rinkebyRes.isMainnet).toBeFalsy();
    expect(rinkebyRes.isETH).toBeTruthy();
    expect(rinkebyRes.isRinkeby).toBeTruthy();
    expect(rinkebyRes.isGor).toBeFalsy();
  });
  it('gor', () => {
    const gorRes = isETHChain(5);
    expect(gorRes.isMainnet).toBeFalsy();
    expect(gorRes.isETH).toBeTruthy();
    expect(gorRes.isRinkeby).toBeFalsy();
    expect(gorRes.isGor).toBeTruthy();
  });
});
