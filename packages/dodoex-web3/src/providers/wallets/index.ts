import { Web3Provider } from '@ethersproject/providers';
import { WalletType, Wallet } from './types';
import * as injectedListObject from './injected';
import * as standaloneListObject from './standalone';
import MetamaskWallet from './metamask';
import {
  getGnosisPackage,
  getIsOpenBlockIframe,
  getOpenBlockIframeConnector,
  injectedConnect,
} from '../connector';
import { getIsMobile } from '../../helpers/devices';

export { WalletType } from './types';
export type { Wallet } from './types';

export * as injectedListObject from './injected';
export * as standaloneListObject from './standalone';
export const injectedList = Object.values(injectedListObject);
export const standaloneList = Object.values(standaloneListObject);
export const allWalletList = [
  MetamaskWallet,
  ...injectedList,
  ...standaloneList,
];

const allWalletObject = { ...injectedListObject, ...standaloneListObject };

export const OpenBlockIframeWallet = {
  ...standaloneListObject.OpenBlock,
  disabled: () => false,
  type: WalletType.openBlockIframe,
  connector: getOpenBlockIframeConnector,
};

export interface WalletListParams {
  excludes?: WalletType[];
  /** include && sort */
  includes?: WalletType[];
  keysSort?: Array<keyof typeof allWalletObject>;
  mobileKeysSort?: Array<keyof typeof allWalletObject>;
  showSupportExtensionInjected?: boolean;
  /** Overlay wallet list */
  afterHooks?: (
    params: Omit<WalletListParams, 'afterHooks'> & {
      isMobile: boolean;
      PORTIS_ID?: string;
      chainId?: number;
      hasInjectedWallet: boolean;
      walletList: Wallet[];
    },
  ) => Wallet[];
}

const mobileNotInjectedSortShowNames = [
  standaloneListObject.WalletConnect.showName,
  MetamaskWallet.showName,
  standaloneListObject.WalletLink.showName,
];

export function getWalletList({
  PORTIS_ID,
  chainId,
  includes,
  excludes,
  keysSort,
  mobileKeysSort,
  showSupportExtensionInjected,
  afterHooks,
}: WalletListParams & {
  PORTIS_ID?: string;
  chainId?: number;
} = {}) {
  const isMobile = getIsMobile();
  const showInjected =
    (!includes || includes.includes(WalletType.injected)) &&
    (!excludes || !excludes.includes(WalletType.injected));

  const checkedParams = {
    PORTIS_ID,
  };

  let showWalletList = [] as Wallet[];
  let injectedWallet: Wallet | undefined;
  let hasInjectedWallet = false;
  if (showInjected) {
    injectedWallet = injectedList.find((wallet) => {
      if (!wallet.disabled) {
        throw new Error('injected wallet need checked');
      }
      return !wallet.disabled();
    });
    if (!injectedWallet) {
      injectedWallet = MetamaskWallet;
    }
    injectedWallet.connector = (_, events) =>
      injectedConnect(undefined, events);
    showWalletList.push(injectedWallet);
    hasInjectedWallet = injectedWallet.disabled
      ? !injectedWallet.disabled()
      : false;
  }

  const filterWallet = (wallet: Wallet) => {
    if (excludes?.includes(wallet.type)) return false;
    if (
      wallet.checked &&
      wallet.type !== WalletType.injected &&
      !wallet.checked(checkedParams)
    )
      return false;
    if (
      chainId &&
      wallet.supportChains &&
      !wallet.supportChains.includes(chainId)
    ) {
      return false;
    }
    if (includes && !includes.includes(wallet.type)) return false;
    return true;
  };

  if (isMobile) {
    if (hasInjectedWallet) {
      if (filterWallet(standaloneListObject.WalletConnect)) {
        showWalletList.push(standaloneListObject.WalletConnect);
      }
    } else {
      allWalletList.forEach((wallet) => {
        if (
          !filterWallet(wallet) ||
          !wallet.supportMobile ||
          wallet.showName === injectedWallet?.showName
        ) {
          return false;
        }
        showWalletList.push(wallet);
        return true;
      });
      const keysSortRes = mobileKeysSort ?? keysSort ?? [];
      const showNameSortProps = keysSortRes
        .map((key) => {
          const sortWallet = allWalletObject[key];
          if (!sortWallet) {
            throw new Error(`unknown key ${key}`);
          }
          return sortWallet.showName;
        })
        .filter(
          (showName) => !mobileNotInjectedSortShowNames.includes(showName),
        );
      const showNameSort = [
        ...mobileNotInjectedSortShowNames,
        ...showNameSortProps,
      ];
      showWalletList = showWalletList.sort((a, b) => {
        let aIndex = showNameSort.indexOf(a.showName);
        let bIndex = showNameSort.indexOf(b.showName);
        if (aIndex === -1) {
          aIndex = 999;
        }
        if (bIndex === -1) {
          bIndex = 999;
        }
        return aIndex - bIndex;
      });
    }
  } else {
    let otherWalletList = [] as Array<Wallet>;
    if (showSupportExtensionInjected) {
      injectedList.forEach((wallet) => {
        if (
          !wallet.supportExtension ||
          !filterWallet(wallet) ||
          wallet.showName === injectedWallet?.showName
        ) {
          return false;
        }
        otherWalletList.push(wallet);
        return true;
      });
    }
    standaloneList.forEach((wallet) => {
      if (!filterWallet(wallet)) {
        return false;
      }
      otherWalletList.push(wallet);
      return true;
    });
    if (keysSort) {
      const showNameSort = keysSort.map((key) => {
        const sortWallet = allWalletObject[key];
        if (!sortWallet) {
          throw new Error(`unknown key ${key}`);
        }
        return sortWallet.showName;
      });
      otherWalletList = otherWalletList.sort((a, b) => {
        let aIndex = showNameSort.indexOf(a.showName);
        let bIndex = showNameSort.indexOf(b.showName);
        if (aIndex === -1) {
          aIndex = 999;
        }
        if (bIndex === -1) {
          bIndex = 999;
        }
        return aIndex - bIndex;
      });
    }
    showWalletList = [...showWalletList, ...otherWalletList];
  }

  if (afterHooks) {
    return afterHooks({
      isMobile,
      PORTIS_ID,
      chainId,
      includes,
      excludes,
      showSupportExtensionInjected,
      hasInjectedWallet,
      walletList: showWalletList,
    });
  }

  return showWalletList;
}

export async function getIsolatedEnvironmentWallet() {
  if (typeof window !== 'undefined' && window.top !== window) {
    const isSafeIframe = await (await getGnosisPackage()).getIsSafe();
    if (isSafeIframe) {
      return standaloneListObject.Gnosis;
    }
    const isOpenBlockIframe = await getIsOpenBlockIframe();
    if (isOpenBlockIframe) {
      return OpenBlockIframeWallet;
    }
  }
  return undefined;
}
