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
