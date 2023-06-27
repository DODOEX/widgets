const AUTO_SWITCH_NETWORK = 'DODO_WIDGET_AUTO_SWITCH_NETWORK';

export function getAuthSwitchCache() {
  const storage = localStorage.getItem(AUTO_SWITCH_NETWORK);
  return storage === '1';
}

export function setAuthSwitchCache(isAuto: boolean) {
  localStorage.setItem(AUTO_SWITCH_NETWORK, isAuto ? '1' : '0');
}
