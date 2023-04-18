// @ts-nocheck
const DAPP_INPAGE = 'dapp-inpage-integration';
const OPENBLOCK_CONTENT = 'openblock-content-integration';
const REQUEST_AUTH = 'eth_requestAccounts';
const EVENT_NEED_RELOAD_LIST = [
  'https://cocoswap.com',
  'https://app.openocean.finance',
];
const IGNORE_EVENT_LIST = ['https://oec.cocoswap.com'];

const guid = () => {
  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }
  return S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4();
};
class openBlockInpageProvider {
  constructor() {
    console.log('start initialize openblockinpage provider');
    this.callBackList = {};
    this.eventListener = {};
    this.isMetaMask = true;
    this.isOpenBlock = true;
    this.chainId = null;
    this.networkVersion = null;
    this.selectedAddress = null;
    this.request = this.request.bind(this);
    this.send = this.send.bind(this);
    this.sendAsync = this.sendAsync.bind(this);
    this.on = this.on.bind(this);
    this.isConnected = this.isConnected.bind(this);
    this.enable = this.enable.bind(this);
    this._metamask = this._getExperimentalApi();
    this._initInpageListener();
    this.getProviderData();
  }

  async getProviderData() {
    const res = await this.request('metamask_getProviderState');
    this.chainId = res?.chainId;
    this.networkVersion = res?.networkVersion;
    this.selectedAddress = res?.accounts?.[0];
  }

  async request(params) {
    if (params.method === REQUEST_AUTH) {
      const res = await this._hookRequest('eth_accounts');
      if (res.length) {
        return new Promise((resolve) => resolve(res));
      }
    }
    return this._hookRequest(params);
  }

  async send(...params) {
    if (typeof params[1] === 'function') {
      this.sendAsync(params[0], params[1]);
      return;
    }
    if (typeof params[0] === 'string') {
      return this.request({ method: params[0], params: params[1] });
    }
    if (params.length === 1) {
      return this.request(params);
    }
  }

  async sendAsync(...paramsArr) {
    const paramsObj = {
      method: paramsArr[0].method,
      params: paramsArr[0].params,
    };
    const request_id = paramsArr[0].id;
    this.request(paramsObj)
      .then((res) => {
        paramsArr[1](null, { id: request_id, jsonrpc: '2.0', result: res });
      })
      .catch((error) => {
        paramsArr[1](null, { id: request_id, jsonrpc: '2.0', error });
      });
  }

  isConnected() {
    return true;
  }

  async enable() {
    const res = await this._hookRequest('eth_accounts');
    if (res.length) {
      return new Promise((resolve) => resolve(res));
    }
    return this.request({ method: 'eth_requestAccounts' });
  }

  on(event, callback) {
    if (typeof event !== 'string' || typeof callback !== 'function') {
      return;
    }
    if (this.eventListener[event] && this.eventListener[event].length > 5) {
      return;
    }
    if (this.eventListener[event]) {
      this.eventListener[event].push(callback);
      this.eventListener[event] = Array.from(
        new Set(this.eventListener[event]),
      );
    } else if (!this.eventListener[event]) {
      this.eventListener = {
        ...this.eventListener,
        [event]: [callback],
      };
    }
    /// /console.log("this.eventListener", this.eventListener);
    this._registerEvent(event);
  }

  removeListener() {}

  _initInpageListener() {
    window.addEventListener(
      'message',
      (event) => {
        if (event.data.target !== DAPP_INPAGE) {
          return;
        }
        const mark = event.data?.value?.data?.mark;

        if (mark) {
          if (mark.type === 'call_method') {
            this._handleNormalMethod(mark, event);
          } else if (mark.type === 'register_event') {
            this._handleEventMethod(mark, event);
          }
        }
      },
      false,
    );
  }

  _handleNormalMethod(mark, event) {
    if (event.data.value.data?.error) {
      this.callBackList[mark.id]?.reject(event.data.value.data?.error);
    } else {
      this.callBackList[mark.id]?.resolve(event.data.value.data?.result);
    }
    delete this.callBackList[mark.id];
  }

  _handleEventMethod(mark, event) {
    const eventName = event.data?.value?.data?.mark?.eventName;
    const params = event.data?.value?.data?.params;
    if (eventName) {
      const fireList = this.eventListener[eventName];
      // console.log('fireList', fireList)
      if (!fireList) {
        if (window.location.origin === 'https://app.openocean.finance') {
          window.location.reload();
        }
        return;
      }
      fireList.forEach((func) => {
        if (eventName === 'chainChanged') {
          this.chainId = params;
          this.networkVersion = Number(params);
        }
        if (
          IGNORE_EVENT_LIST.includes(window.location.origin) &&
          eventName === 'chainChanged'
        )
          return;
        if (EVENT_NEED_RELOAD_LIST.includes(window.location.origin)) {
          window.location.reload();
        } else {
          func(params);
        }
      });
    }
  }

  _hookRequest(paramsObj) {
    return new Promise((resolve, reject) => {
      const _guid = guid();

      if (typeof paramsObj === 'string') {
        paramsObj = {
          method: paramsObj,
        };
      }
      paramsObj = {
        ...paramsObj,
        mark: {
          id: _guid,
          method: paramsObj.method,
          type: 'call_method',
        },
      };

      window.parent.postMessage(
        {
          from: DAPP_INPAGE,
          target: OPENBLOCK_CONTENT,
          data: paramsObj,
        },
        '*',
      );

      this.callBackList[_guid] = {
        resolve,
        reject,
      };
    });
  }

  _registerEvent(event) {
    const value = {
      mark: {
        eventName: event,
        type: 'register_event',
      },
      eventName: event,
    };
    // console.log('0.registerEvent', event, value)

    window.parent.postMessage(
      { from: DAPP_INPAGE, target: OPENBLOCK_CONTENT, data: value },
      '*',
    );
  }

  _getExperimentalApi() {
    return new Proxy(
      {
        isUnlocked: () => new Promise((resolve) => resolve(true)),
      },
      {
        get: (obj, prop, ...args) => {
          return Reflect.get(obj, prop, ...args);
        },
      },
    );
  }
}

export default function initializeProvider() {
  if (window.obethereum?.isOpenBlock) {
    return window.obethereum;
  }
  let provider = new openBlockInpageProvider();
  provider = new Proxy(provider, {
    deleteProperty: () => true,
  });

  try {
    Object.defineProperty(window, 'obethereum', {
      set(newEthereum) {
        console.log('set ethereum', newEthereum);
      },
      get() {
        return provider;
      },
    });
  } catch (error) {
    console.log('initializeProvider error', error);
    window.obethereum = provider;
  }
  window.web3 = { ...window.web3 };
  window.web3.currentProvider = provider;
  window.dispatchEvent(new Event('ethereum#initialized'));
  return provider;
}
