import {
  MiningTokenI,
  TabMiningI,
  MiningLpTokenI,
  MiningStakeTokenWithAmountI,
} from '../../types';

export function getOptTokenSymbol({
  stakedTokenList,
  type,
  selectedStakeTokenIndex,
}: {
  stakedTokenList: Array<MiningTokenI>;
  type: TabMiningI['type'];
  selectedStakeTokenIndex: 0 | 1;
}) {
  if (type === 'single' || type === 'vdodo') {
    return stakedTokenList[selectedStakeTokenIndex].symbol ?? '-';
  }
  if (type === 'dvm' || type === 'lptoken') {
    return stakedTokenList[0] && stakedTokenList[1]
      ? `${stakedTokenList[0].symbol}-${stakedTokenList[1].symbol} LP`
      : '- LP';
  }
  if (type === 'classical') {
    const stakedToken = stakedTokenList[selectedStakeTokenIndex];
    if (stakedToken) {
      return `${stakedToken.symbol ?? '-'} LP`;
    }
    return '- LP';
  }
  return '-';
}

export function getOptToken({
  stakedTokenList,
  type,
  lpToken,
  selectedStakeTokenIndex,
}: {
  stakedTokenList: Array<MiningTokenI>;
  type: TabMiningI['type'];
  lpToken: MiningLpTokenI;
  selectedStakeTokenIndex: 0 | 1;
}): MiningLpTokenI {
  const symbol = getOptTokenSymbol({
    stakedTokenList,
    type,
    selectedStakeTokenIndex,
  });

  return {
    ...lpToken,
    symbol,
  };
}

export function getOptTokenPairs({
  stakedTokenList,
  type,
  selectedStakeTokenIndex,
}: {
  stakedTokenList: Array<MiningStakeTokenWithAmountI>;
  type: TabMiningI['type'];
  selectedStakeTokenIndex: 0 | 1;
}): Array<{
  address?: string;
  logoUrl?: string;
}> {
  const [baseToken, quoteToken] = stakedTokenList;
  if (type === 'single') {
    if (!baseToken?.address) {
      return [];
    }
    return [{ address: baseToken.address, logoUrl: baseToken.logoImg }];
  }
  if (type === 'dvm' || type === 'lptoken') {
    if (!baseToken?.address || !quoteToken?.address) {
      return [];
    }
    return [
      {
        address: baseToken.address,
        logoUrl: baseToken.logoImg,
      },
      {
        address: quoteToken.address,
        logoUrl: quoteToken.logoImg,
      },
    ];
  }
  if (type === 'classical') {
    if (selectedStakeTokenIndex === 0) {
      if (!baseToken?.address) {
        return [];
      }
      return [
        {
          address: baseToken.address,
          logoUrl: baseToken.logoImg,
        },
      ];
    }
    if (!quoteToken?.address) {
      return [];
    }
    return [
      {
        address: quoteToken.address,
        logoUrl: quoteToken.logoImg,
      },
    ];
  }
  return [];
}
