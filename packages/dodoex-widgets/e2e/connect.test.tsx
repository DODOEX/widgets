/**
 * @jest-environment hardhat/dist/jsdom
 */

import '@ethersproject/providers';
import 'jest-environment-hardhat/dist/jsdom';
import '@testing-library/jest-dom';

import {
  act,
  fireEvent,
  queryAllByTestId,
  render,
  screen,
  waitFor,
  cleanup,
} from '@testing-library/react/pure';

import React from 'react';
import { SwapWidget } from '../src/index';
import {
  numberInputWrapper,
  swapAlertEnterAmountBtn,
  swapAlertFetchPriceBtn,
  swapAlertInsufficientBalanceBtn,
  swapAlertSelectTokenBtn,
  swapReviewBtn,
  swapSelectTokenBtn,
  tokenPickerItem,
  tokenPickerWrapper,
} from '../src/constants/testId';
import { TokenInfo } from '../src/hooks/Token';
import {
  RoutePriceAPI,
  FiatPriceAPI,
  getCGTokenListAPI,
} from '../src/constants/api';
import {
  tokenListMap,
  tokenList,
  routeRes,
  tokenListRes,
  fiatPriceBatchRes,
} from './constants';
import { mineUpToNext, setBalance } from './utils/hardhat';

const chainId = 1;
const baseToken = tokenListMap.ETH;
const quoteToken = tokenListMap.DODO;
const routeApi = `${RoutePriceAPI}`;
const priceApi = FiatPriceAPI;
const TIMEOUT = 10000;

jest.mock('axios', () => ({
  ...jest.requireActual('axios'),
  get: (url: string, options: any) => {
    if (url === routeApi) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            data: routeRes,
          });
        }, 100);
      });
    } else if (url === getCGTokenListAPI(chainId)) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            data: tokenListRes,
          });
        }, 100);
      });
    } else {
      console.log(url);
      return jest.requireActual('axios').post(url, options);
    }
  },
  post: (url: string, options: any) => {
    if (url === priceApi) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            data: fiatPriceBatchRes,
          });
        }, 100);
      });
    }
    console.log(url);
    return jest.requireActual('axios').post(url, options);
  },
}));

async function selectToken($selectTokenBtn: HTMLElement, token: TokenInfo) {
  /** open token picker dialog */
  await fireEvent.click($selectTokenBtn);
  const $tokenPickerWrappers = screen.queryAllByTestId(tokenPickerWrapper);
  let $tokenPickerActive: undefined | HTMLElement;
  const { symbol, logoURI } = token;
  $tokenPickerWrappers.some((el) => {
    if (el.dataset.active === '1') {
      $tokenPickerActive = el;
    }
  });
  expect($tokenPickerActive).toBeVisible();
  /** search symbol */
  const $searchInput = $tokenPickerActive?.querySelector('input');
  expect($searchInput).toBeVisible();
  await fireEvent.change($searchInput as HTMLElement, {
    target: {
      value: symbol,
    },
  });
  /** select token */
  const $tokenItems = queryAllByTestId(
    $tokenPickerActive as HTMLElement,
    tokenPickerItem,
  );
  expect($tokenItems).toHaveLength(1);
  await fireEvent.click($tokenItems[0]);
  await waitFor(
    () => {
      expect($selectTokenBtn.querySelector('img')).not.toBeNull();
    },
    {
      timeout: TIMEOUT,
    },
  );
  expect($selectTokenBtn.querySelector('img')?.getAttribute('src')).toBe(
    logoURI,
  );
  expect(($selectTokenBtn.textContent ?? '').indexOf(symbol) > -1).toBeTruthy();
}

describe('connect and trade', () => {
  beforeAll(async () => {
    await setBalance(0);
  });

  afterAll(() => {
    cleanup();
  });

  it('provider connect', async () => {
    await act(() => {
      render(
        <SwapWidget
          apikey="ef9apopzq9qrgntjubojbxe7hy4z5eez" // for default test
          provider={hardhat.provider}
          defaultChainId={chainId}
          tokenList={tokenList}
        />,
      );
    });
  });

  it('need enter amount', async () => {
    expect(screen.queryByTestId(swapAlertEnterAmountBtn)).toBeVisible();
    const $numberInput = screen.queryAllByTestId(numberInputWrapper);
    expect($numberInput).toHaveLength(2);
    const $baseInput = $numberInput[0].querySelector(
      'input',
    ) as HTMLInputElement;
    expect($baseInput).toBeVisible();
    await fireEvent.change($baseInput, {
      target: {
        value: '1',
      },
    });
  });

  it('alert when the balance is insufficient', async () => {
    await waitFor(
      () => {
        expect(
          screen.queryByTestId(swapAlertInsufficientBalanceBtn),
        ).toBeVisible();
      },
      {
        timeout: TIMEOUT,
      },
    );
  });

  it('update the balance when blockNumber is updated', async () => {
    await setBalance(10);
    await mineUpToNext();
  });

  // it('can be traded', async () => {
  //   await waitFor(
  //     () => {
  //       expect(screen.queryByTestId(swapReviewBtn)).toBeVisible();
  //     },
  //     {
  //       timeout: TIMEOUT,
  //     },
  //   );
  // });
});
