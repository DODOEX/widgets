import { t } from '@lingui/macro';
import { ReactComponent as PeggedChartExampleDarkImgUrl } from '../components/pegged-chart-example-dark.svg';
import { ReactComponent as PeggedChartExampleImgUrl } from '../components/pegged-chart-example.svg';
import { ReactComponent as PrivateChartExampleDarkImgUrl } from '../components/private-chart-example-dark.svg';
import { ReactComponent as PrivateChartExampleImgUrl } from '../components/private-chart-example.svg';
import { ReactComponent as SingleChartExampleDarkImgUrl } from '../components/single-token-chart-example-dark.svg';
import { ReactComponent as SingleChartExampleImgUrl } from '../components/single-token-chart-example.svg';
import { ReactComponent as StandardChartExampleDarkImgUrl } from '../components/standard-chart-example-dark.svg';
import { ReactComponent as StandardChartExampleImgUrl } from '../components/standard-chart-example.svg';
import { SubPeggedVersionE, Version, VersionItem } from '../types';
import { getDODODspProxyContractAddressByChainId } from '@dodoex/dodo-contract-request';

export function useVersionList(chainId: number | undefined) {
  const docUrl =
    'https://docs.dodoex.io/product/tutorial/how-to-create-pools#learn-more-about-the-characteristics-of-different-pool-models';
  const versionList: VersionItem[] = [
    {
      version: Version.standard,
      title: t`Standard`,
      description: t`Classical AMM-like pool. Suitable for most assets.`,
      exampleImgUrl: StandardChartExampleImgUrl,
      exampleDarkImgUrl: StandardChartExampleDarkImgUrl,
      docUrl,
      initPriceLabel: t`Initial Price`,
      initPriceTips: t`Since this pool uses the PMM algorithm, which is different from the normal AMM pool mechanism, the initial price calculation is also different from AMM.`,
      initPriceTipsLink:
        'https://docs.dodoex.io/en/product/dodo-v2-pools/dodo-vending-machine/dvm-initial-price-formula-explanation',
    },
    {
      version: Version.pegged,
      title: t`Pegged`,
      description: t`Suitable for synthetic assets. The liquidity is super concentrated at some price like Curve Finance.`,
      exampleImgUrl: PeggedChartExampleImgUrl,
      exampleDarkImgUrl: PeggedChartExampleDarkImgUrl,
      docUrl,
      initPriceLabel: t`Pegged Exchange Rate`,
      initPriceTips: t`The pegged exchange rate refers to the exchange rate between two token assets where one's value is pegged/fixed by the other. For example, the pegged exchange rate between the US Dollar and USDT is 1.`,
    },
    {
      version: Version.singleToken,
      title: t`Single-Token`,
      description: t`For those who are looking to sell tokens and only need ask-side liquidity.`,
      exampleImgUrl: SingleChartExampleImgUrl,
      exampleDarkImgUrl: SingleChartExampleDarkImgUrl,
      docUrl,
      initPriceLabel: t`Initial Price`,
      initPriceTips: t`You can set the minimum selling price for single-token pools.`,
    },
    {
      version: Version.marketMakerPool,
      title: t`Private Pool`,
      description: t`100% use your own funds and enjoy the maximum degree of flexibility.`,
      exampleImgUrl: PrivateChartExampleImgUrl,
      exampleDarkImgUrl: PrivateChartExampleDarkImgUrl,
      docUrl,
      initPriceLabel: t`Mid Price`,
      initPriceTips: t`set current mid price`,
    },
  ];

  const versionMap = versionList.reduce(
    (map, item) => {
      map[item.version] = item;
      return map;
    },
    {} as Record<Version, VersionItem>,
  );

  const subPeggedVersionList = getSubPeggedVersionList(chainId);
  return { versionList, versionMap, subPeggedVersionList };
}

export function getSubPeggedVersionList(chainId: number | undefined): Array<
  Pick<VersionItem, 'title' | 'description'> & {
    version: SubPeggedVersionE;
  }
> {
  const result = [
    {
      version: SubPeggedVersionE.DSP,
      title: t`The pool’s market-making price is fixed`,
      description: t`Once created, the price cannot be changed. This option applies to assets like ETH-WETH.`,
    },
  ];
  const hasGSP =
    chainId !== undefined && getDODODspProxyContractAddressByChainId(chainId);
  if (hasGSP) {
    result.push({
      version: SubPeggedVersionE.GSP,
      title: t`The pool’s market-making price can be adjusted`,
      description: t`Once created, you can adjust the pool’s market-making price at any time. This option is suitable for assets with fluctuating pegged prices. Adjusting the pool’s market-making price allows for more competitive quotes.`,
    });
  }
  return result;
}

export function getSubPeggedVersionMap(chainId: number | undefined) {
  const subPeggedVersionList = getSubPeggedVersionList(chainId);

  return subPeggedVersionList.reduce(
    (map, item) => {
      map[item.version] = item;
      return map;
    },
    {} as Record<SubPeggedVersionE, Pick<VersionItem, 'title' | 'description'>>,
  );
}
