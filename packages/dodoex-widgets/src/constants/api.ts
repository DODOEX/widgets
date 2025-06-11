import { ContractRequests, TokenApi, ChainId } from '@dodoex/api';
import { getRpcSingleUrlMap } from './chains';

export enum APIServiceKey {
  routePrice = 'routePrice',
  solanaRoutePrice = 'solanaRoutePrice',
  fiatPrice = 'fiatPrice',
  bridgeRoutePrice = 'bridgeRoutePrice',
  bridgeEncode = 'bridgeEncode',
  bridgeCreateRoute = 'bridgeCreateRoute',
}

export type APIServices = {
  [key in APIServiceKey]: string;
};

export const AppUrl = `https://app.dodoex.io`;

export const getCGTokenListAPI = (chainId: ChainId) => {
  const defaultCGAPI = 'https://tokens.coingecko.com/uniswap/all.json';
  const cgAPIMap: any = {
    [ChainId.ARBITRUM_ONE]:
      'https://tokens.coingecko.com/arbitrum-one/all.json',
    [ChainId.AURORA]: 'https://tokens.coingecko.com/aurora/all.json',
    [ChainId.BSC]: 'https://tokens.coingecko.com/binance-smart-chain/all.json',
  };
  return cgAPIMap[chainId] || defaultCGAPI;
};

const BridgeUrlPrefix = 'https://api.dodoex.io/cross-chain/widget';

/**
https://api.dodoex.io/route-service/zetachain/swap?apikey=d5f476a6fd58e5e989&slippage=5&chainId=7001&source=dodoMix&fromTokenAddress=0x4bC32034caCcc9B7e02536945eDbC286bACbA073&toTokenAddress=0xcC683A782f4B30c138787CB5576a86AF66fdc31d&fromAmount=100000&userAddr=0x996AF9757c4995A91E3A9b2fAd59e72eE4436382


{
  "status": 200,
  "data": {
    "resAmount": 0.100184,
    "resPricePerToToken": 0.9981633793819373,
    "resPricePerFromToken": 1.0018399999999998,
    "priceImpact": 0,
    "useSource": "DODORoute",
    "targetDecimals": 6,
    "targetApproveAddr": "0x143bE32C854E4Ddce45aD48dAe3343821556D0c3",
    "to": "0x026eea5c10f526153e7578E5257801f8610D1142",
    "data": "0xff84aafa0000000000000000000000004bc32034caccc9b7e02536945edbc286bacba073000000000000000000000000cc683a782f4b30c138787cb5576a86af66fdc31d00000000000000000000000000000000000000000000000000000000000186a0000000000000000000000000000000000000000000000000000000000001875800000000000000000000000000000000000000000000000000000000000173c6000000000000000000000000000000000000000000000000000000000000018000000000000000000000000000000000000000000000000000000000000001c000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000026000000000000000000000000000000000000000000000000000000000000002e000000000000000000000000000000000000000000000000000000000682d987600000000000000000000000000000000000000000000000000000000000000010000000000000000000000000f9053e174c123098c17e60a2b1fab3b303f9e2900000000000000000000000000000000000000000000000000000000000000010000000000000000000000004f59b88556c1b133939b2655729ad53226ed5fad00000000000000000000000000000000000000000000000000000000000000020000000000000000000000004f59b88556c1b133939b2655729ad53226ed5fad000000000000000000000000026eea5c10f526153e7578e5257801f8610d11420000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
    "minReturnAmount": "95174",
    "gasLimit": "0",
    "routeInfo": {
      "subRouteTotalPart": 100,
      "subRoute": [
        {
          "midPathPart": 100,
          "midPath": [
            {
              "fromToken": "0x4bc32034caccc9b7e02536945edbc286bacba073",
              "toToken": "0xcc683a782f4b30c138787cb5576a86af66fdc31d",
              "oneSplitTotalPart": 20,
              "poolDetails": [
                {
                  "poolName": "DODOV2",
                  "pool": "0x4f59b88556c1b133939b2655729ad53226ed5fad",
                  "poolPart": 20,
                  "poolInAmount": "100000",
                  "poolOutAmount": "100184"
                }
              ],
              "fromAmount": "100000",
              "toAmount": "100184"
            }
          ]
        }
      ]
    },
    "value": "0",
    "id": "4767a82128f23ea114ae4f05c4faef21"
  }
}

 */
export const RoutePriceAPI = `https://api.dodoex.io/route-service/zetachain/swap`;
/**
https://api.dodoex.io/route-service/zetachain/svm/swap?apikey=d5f476a6fd58e5e989&inputMint=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&outputMint=Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB&amount=1000000&user=CjeWeg7Pfyq5VcakxaUwBHCZoEePKYuZTYgfkXaaiCw3&chainId=solana-mainnet&slippageBps=32&source=jupiter


{
  "status": 200,
  "data": {
    "resAmount": 0.999554,
    "priceImpact": 0.00010563595848026669,
    "useSource": "Jupiter",
    "inputMint": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    "inAmount": "1000000",
    "inputMintDecimal": 6,
    "outputMint": "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
    "outAmount": "999554",
    "outputMintDecimal": 6,
    "minOutAmount": "996356",
    "inAmountWithOutDecimals": 1,
    "outAmountWithOutDecimals": 0.999554,
    "slippageBps": 32,
    "routePlan": [
      {
        "swapInfo": {
          "ammKey": "5K7CHUbBYAh6wrantyJvDDqwT4VoKuZTi73CN1DTUUer",
          "label": "Stabble Stable Swap",
          "inputMint": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
          "outputMint": "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
          "inAmount": "1000000",
          "outAmount": "999554",
          "feeAmount": "10",
          "feeMint": "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"
        },
        "percent": 100
      }
    ],
    "data": "AIABAAgLrl1dPXkIuWhzYVhFtYxb+JQ3GoZqa2pq14bW0E52rOJp7jJXlYhamzIeZUst3brLJbcQ9ZMduX/Gud3GUE0+/6/x/V52dT9Bjl8YSwqdPxo1PUQ8QzrmBC38ogNXtRwqxvp6877brTo9ZfNqq8l0MbG75MLS9uDkfKYCA0UvXWHOAQ5gr+2yJxe9YxkvVBRaP5ZaM7uC0scCnrLOHiCCZIyXJY9OJInxuz0QKRSODYMLWhOZ2v8QhASOe9jb6fhZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEedVb8jHAbu50xW7OaBUH/bGy3qP0jlECsc2iVrwTj7Q/+if11/ZKdMCbHylYed5LCas238ndUUsyGqezjOXoAwZGb+UhFzL/7K26csOb57yM5bvF9xJrLEObOkAAAABynzuLbKQ30Ca3pj/0Wq5lWzvmdbFt2OddEbICsJmWXzN8dj2NJQ6itko+eogXWBEuAwQlfGA3cbUcKdhqHrdTAgkABQKcQBAACh4AAwQCAQ8FBg8AAgEHBAcIBxAAAgELDA0OERITFA9H4a81SdQvNO1AQg8AAAAAAIJADwAAAAAABDQPAAAAAAAjAAAA5RfLl3rjrSoBAAAAOGQAAUBCDwAAAAAAgkAPAAAAAAAgAAABWX05K6qoNBpFvohhQGiBxG4ZEV+GAgS6FrxyNTh9k9oETqYKoQYEERQMDQc=",
    "lastValidBlockHeight": 319671584
  }
}
 */
export const SolanaRoutePriceAPI = `https://api.dodoex.io/route-service/zetachain/svm/swap`;
export const FiatPriceAPI = `https://api.dodoex.io/frontend-price-api-v2/current/batch`;
const BridgeRoutePriceAPI = `${BridgeUrlPrefix}/routes`;
const BridgeEncodeAPI = `${BridgeUrlPrefix}/transaction/encode`;
const BridgeCreateRouteAPI = `${BridgeUrlPrefix}/order/create`;

export function getAPIService(
  key: APIServiceKey,
  serviceProps: Partial<APIServices> = {},
) {
  switch (key) {
    case APIServiceKey.routePrice:
      return serviceProps.routePrice ?? RoutePriceAPI;
    case APIServiceKey.solanaRoutePrice:
      return serviceProps.solanaRoutePrice ?? SolanaRoutePriceAPI;
    case APIServiceKey.fiatPrice:
      return serviceProps.fiatPrice ?? FiatPriceAPI;
    case APIServiceKey.bridgeRoutePrice:
      return serviceProps.bridgeRoutePrice ?? BridgeRoutePriceAPI;
    case APIServiceKey.bridgeEncode:
      return serviceProps.bridgeEncode ?? BridgeEncodeAPI;
    case APIServiceKey.bridgeCreateRoute:
      return serviceProps.bridgeCreateRoute ?? BridgeCreateRouteAPI;

    default:
      throw new Error(`Invalid key = ${key}`);
  }
}

export const contractRequests = new ContractRequests({
  rpc: getRpcSingleUrlMap(),
  // debugQuery: process.env.NODE_ENV === 'development',
  // debugProvider: process.env.NODE_ENV === 'development',
});

export const tokenContractRequests = contractRequests.createContractRequests();
export const tokenApi = new TokenApi({
  contractRequests: tokenContractRequests,
});
