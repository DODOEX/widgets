/**
 * @jest-environment hardhat/jsdom
 */

import '@ethersproject/providers';
import 'jest-environment-hardhat/dist/jsdom';
import '@testing-library/jest-dom';

import { act, render, screen } from '@testing-library/react';

import React from 'react';
import { SwapWidget } from '../src/index';
import { connectWalletBtn, swapReviewBtn } from '../src/constants/testId';

describe('default', () => {
  it('waiting for the wallet to connect', async () => {
    await act(() => {
      render(
        <SwapWidget
          apikey="ef9apopzq9qrgntjubojbxe7hy4z5eez" // for default test
        />,
      );
    });
    expect(screen.queryByTestId(connectWalletBtn)).toBeVisible();
    expect(screen.queryByTestId(swapReviewBtn)).toBeNull();
  });
});
