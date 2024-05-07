import { TokenInfo } from '../hooks/Token';
import { ChainId } from './chains';

const AUTO_SWITCH_NETWORK = 'DODO_WIDGET_AUTO_SWITCH_NETWORK';
export function getAuthSwitchCache() {
  const storage = localStorage.getItem(AUTO_SWITCH_NETWORK);
  return storage === '1';
}
export function setAuthSwitchCache(isAuto: boolean) {
  localStorage.setItem(AUTO_SWITCH_NETWORK, isAuto ? '1' : '0');
}

const LAST_FROM_TOKEN = 'DODO_WIDGET_LAST_FROM_TOKEN';
const LAST_TO_TOKEN = 'DODO_WIDGET_LAST_TO_TOKEN';
export interface LastTokenCache {
  chainId: ChainId;
  address: string;
}
export function getLastToken(side: TokenInfo['side']) {
  const storage = localStorage.getItem(
    side === 'from' ? LAST_FROM_TOKEN : LAST_TO_TOKEN,
  );
  if (!storage) return null;
  try {
    return JSON.parse(storage) as LastTokenCache;
  } catch (error) {
    console.error(error);
    return null;
  }
}
export function setLastToken(
  side: TokenInfo['side'],
  token: LastTokenCache | null,
) {
  localStorage.setItem(
    side === 'from' ? LAST_FROM_TOKEN : LAST_TO_TOKEN,
    token ? JSON.stringify(token) : '',
  );
}

const SLIPPAGE_SWAP = 'DODO_WIDGET_SLIPPAGE_SWAP';
const SLIPPAGE_BRIDGE = 'DODO_WIDGET_SLIPPAGE_BRIDGE';
export function getLastSlippage(isBridge: boolean) {
  const storage = localStorage.getItem(
    isBridge ? SLIPPAGE_BRIDGE : SLIPPAGE_SWAP,
  );
  return storage ? Number(storage) : null;
}
export function setLastSlippage(
  isBridge: boolean,
  slippage: number | string | null,
) {
  if (slippage === null) {
    localStorage.removeItem(isBridge ? SLIPPAGE_BRIDGE : SLIPPAGE_SWAP);
  } else {
    localStorage.setItem(
      isBridge ? SLIPPAGE_BRIDGE : SLIPPAGE_SWAP,
      String(slippage),
    );
  }
}

// The data stored in the corresponding Key means that it has been confirmed. After confirmation, the risk prompt will no longer be displayed.
const RiskWarningOnceKeyPrefix = 'risk-warning-once-';
export const RiskOncePageLocalStorage: Record<string, string> = {
  PoolEditPage: `${RiskWarningOnceKeyPrefix}pool-edit`,
};
export function getIsPoolEditRiskWarningOpen() {
  return !window.localStorage.getItem(RiskOncePageLocalStorage.PoolEditPage);
}
