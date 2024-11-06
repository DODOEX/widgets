import crossFetch from 'cross-fetch';
import { merge } from 'lodash';
import qs from 'qs';

type Fetch = typeof crossFetch;

export interface RestApiRequestConfig {
  host?: string;
  fetch?: Fetch;
}

const defaultConfig = {
  host: 'https://api.dodoex.io',
  fetch: crossFetch,
};

export default class RestApiRequest {
  private host: string;
  private _getFetch: () => Fetch;
  constructor(configProps?: RestApiRequestConfig) {
    const config = { ...defaultConfig, ...configProps };
    this.host = config.host;
    this._getFetch = () => {
      return config.fetch;
    };
  }

  getUrl(path: string, params?: Record<string, any>) {
    let url = `${this.host}/${path}`;
    if (params) {
      url = `${url}?${qs.stringify(params)}`;
    }
    return url;
  }

  async responseProcessor<T>(response: Response) {
    if (response.ok) {
      const result = await response.json();
      return {
        response: response,
        result: result as {
          code: number;
          msg: string | null;
          data: T | null;
        },
      };
    }
    throw new Error(`Response ${JSON.stringify(response)} failed`);
  }

  async getJson<T>(
    path: string,
    params?: Record<string, any>,
    init?: RequestInit,
  ) {
    const url = this.getUrl(path, params);
    const _fetch = this._getFetch();
    const response = await _fetch(
      url,
      merge(
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
        init,
      ),
    );
    return this.responseProcessor<T>(response);
  }

  async postJson<T = any>(
    path: string,
    body?: Record<string, any>,
    params?: Record<string, any>,
    init?: RequestInit,
  ) {
    const url = this.getUrl(path, params);
    const _fetch = this._getFetch();
    const response = await _fetch(
      url,
      merge(
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: body ? JSON.stringify(body) : undefined,
        },
        init,
      ),
    );
    return this.responseProcessor<T>(response);
  }
}
