/**
 * @jest-environment hardhat/jsdom
 */

import '@ethersproject/providers';
import 'jest-environment-hardhat/dist/jsdom';
import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';

import React from 'react';
import { SwapWidget } from '../src/index';
import { connectWalletBtn, swapReviewBtn } from '../src/constants/testId';
import { act } from '@testing-library/react-hooks';

describe('default', () => {
  it('waiting for the wallet to connect', async () => {
    await act(() => {
      render(
        <SwapWidget
          apikey="55ea0a80b62316d9bc" // for default test
        />,
      );
    });
    expect(screen.queryByTestId(connectWalletBtn)).toBeVisible();
    expect(screen.queryByTestId(swapReviewBtn)).toBeNull();
  });
});
