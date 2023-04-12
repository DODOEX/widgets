import { Web3Provider } from '@ethersproject/providers';
import { WalletType, Wallet } from './types';
import * as injectedListObject from './injeteds';
import * as standaloneListObject from './standalone';
import MetamaskWallet from './metamask';
import { injectedConnect } from '../connector';
import { isMobile } from '../../helpers/devices';

export { WalletType } from './types';
export type { Wallet } from './types';

export const injectedList = Object.values(injectedListObject);
export const standaloneList = Object.values(standaloneListObject);
export const walletList = [...injectedList, ...standaloneList];

export interface WalletListParams {
  /** Judgment shows the wallet */
  isMobile?: boolean;
  /** exclude */
  excludes?: WalletType[];
  /** include && sort */
  includes?: WalletType[];
  /** Overlay wallet list */
  afterHooks?: (
    params: Omit<WalletListParams, 'afterHooks'> & {
      PORTIS_ID?: string;
      chainId?: number;
      walletList: Wallet[];
    },
  ) => Wallet[];
}

const mobileNotInjectedCanClickShowNames = [
  standaloneListObject.WalletConnect.showName,
  standaloneListObject.WalletLink.showName,
];
const mobileNotInjectedSortShowNames = [
  standaloneListObject.WalletConnect.showName,
  MetamaskWallet.showName,
  standaloneListObject.WalletLink.showName,
];

export function getWalletList({
  isMobile: isMobileProps,
  PORTIS_ID,
  chainId,
  includes,
  excludes,
  afterHooks,
}: WalletListParams & {
  PORTIS_ID?: string;
  chainId?: number;
} = {}) {
  const showInjected =
    (!includes || includes.includes(WalletType.injected)) &&
    (!excludes || !excludes.includes(WalletType.injected));

  const checkedParams = {
    PORTIS_ID,
  };

  let showWalletList = [] as Wallet[];
  let hasInjectedWallet = false;
  if (showInjected) {
    let injectedWallet = injectedList.find((wallet) => {
      if (!wallet.checked) {
        throw new Error('injected wallet need checked');
      }
      return wallet.checked(checkedParams);
    });
    if (!injectedWallet) {
      injectedWallet = MetamaskWallet;
    }
    injectedWallet.connector = (_, events) =>
      injectedConnect(undefined, events);
    showWalletList.push(injectedWallet);
    hasInjectedWallet = injectedWallet.checked
      ? injectedWallet.checked(checkedParams)
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
      walletList.forEach((wallet) => {
        if (!filterWallet(wallet) || !wallet.supportMobile) {
          return false;
        }
        showWalletList.push({
          ...wallet,
          disabled: () =>
            !mobileNotInjectedCanClickShowNames.includes(wallet.showName),
        });
        return true;
      });
      showWalletList = showWalletList.sort((a, b) => {
        let aIndex = mobileNotInjectedSortShowNames.indexOf(a.showName);
        let bIndex = mobileNotInjectedSortShowNames.indexOf(b.showName);
        if (aIndex === -1) {
          aIndex = 10;
        }
        if (bIndex === -1) {
          bIndex = 10;
        }
        return aIndex - bIndex;
      });
    }
  } else {
    standaloneList.forEach((wallet) => {
      if (!filterWallet(wallet)) {
        return false;
      }
      showWalletList.push(wallet);
      return true;
    });
  }

  if (afterHooks) {
    return afterHooks({
      isMobile,
      PORTIS_ID,
      chainId,
      includes,
      excludes,
      walletList: showWalletList,
    });
  }

  return showWalletList;
}
