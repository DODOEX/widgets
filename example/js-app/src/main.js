'use strict';
import { InitSwapWidget } from '@dodoex/widgets';

function initDodoWidget() {
  InitSwapWidget({
    crossChain: true,
    colorMode: 'dark',
    apikey: 'ef9apopzq9qrgntjubojbxe7hy4z5eez', // for default test
  });
}

initDodoWidget();
