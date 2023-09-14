# JS App Example

<p align="center">
  <a>
    <img src="https://i.postimg.cc/W4q937Db/Logo.png" alt="DODO" />
  </a>
</p>

<p align="center">
<a href="https://www.npmjs.com/package/@dodoex/widgets"><img src="https://img.shields.io/npm/v/@dodoex/widgets" alt="npm version" /></a>
<p>

To demonstrate how to use the [@dodoex/widgets](https://github.com/DODOEX/widgets) package in js projects.

## dodoex-widgets

To start the demo:

```bash
yarn          # install dependencies
yarn start    # run the development server
# or
npm           # install dependencies
npm run start # run the development server
```

Navigate to [http://localhost:8080/](http://localhost:8080/) to see the widget.

---

html: add container element with `dodo-swap-widget` id in your html.

```html
<div id="dodo-swap-widget"></div>
```

---

js: init dodo widget in your js.

```js
import { InitSwapWidget } from '@dodoex/widgets';

function initDodoWidget() {
  InitSwapWidget({
    colorMode: 'dark',
    // other props
  });
}

initDodoWidget();
```

---

Supported [API](https://docs.dodoex.io/english/developers/swap-widget/api) from the `SwapWidget`:

- `provider`: EIP-1193 provider
- `jsonRpcUrlMap`: Specify nodes of different chains
- `defaultChainId`: Default Chain ID

- `tokenList`: a TokenList; in this case [Token List Example](https://raw.githubusercontent.com/compound-finance/token-list/master/compound.tokenlist.json)
- `popularTokenList`: Selectable List of Popular Tokens

- `onTxFail`: Triggered if transaction fails
- `onTxSubmit`: Triggered after transaction is submitted
- `onTxSuccess`: Triggered if transaction executes successfully

- `theme`: Can override theme, text, and style. Refer to the Instructions page for more information.
- `colorMode`: Light or dark mode
- `apikey`: Passed onto the apikey provided by DODO
- `width`: Widget width
- `height`: Widget height
- `feeRate`: Transaction fee rate. Unit: 1e18
- `rebateTo`: Profit sharing address
- `defaultFromToken`: Default Origin Token
- `defaultToToken`: Default Destination Token
- `crossChain`: Enable cross-chain
- `swapSlippage`: Default swap slippage
- `bridgeSlippage`: Default cross-chain slippage
- `apiServices`: Custom api service

For all available props (including theming), please refer to the up-to-date [documentation](https://docs.dodoex.io/english/developers/swap-widget).

### Additional documentation

- [DODO App](https://app.dodoex.io/)
  Trade tokens, deposit tokens in liquidity pools, & create Crowdpooling campaigns with DODO! Decentralized exchange with market-leading liquidity.

- [About DODO](https://docs.dodoex.io/english/)
  An Innovative Algorithm-Driven and Decentralized Trading Platform.

- [Swap Widget Docs](https://docs.dodoex.io/english/)-to be continue
  Explore the Swap Widget's features and API.

- [Discord](https://discord.com/invite/tyKReUK)
  Hop into #widgets for help.

- [GitHub](https://github.com/DODOEX/widgets)
  View the Swap Widget's source.
