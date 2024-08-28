import { Address, beginCell, JettonMaster, toNano } from 'ton';
import useTonConnectStore from '../../ConnectWallet/TonConnect';
import {
  getHashByBoc,
  waitForTransaction,
} from '../../ConnectWallet/TonConnect/contract';
import { TokenInfo } from '../../Token';
import {
  LAYERSWAP_API_KEY,
  LAYERSWAP_LIMITS_URL,
  LAYERSWAP_NETWORKS_URL,
  LAYERSWAP_QUOTE_URL,
  LAYERSWAP_SWAPS_URL,
} from './constants';
import { DepositAction, Network, Quote, SwapResponse, Token } from './types';

export async function getLayerSwapData<T>(url: string) {
  const response = await fetch(url, {
    headers: {
      'X-LS-APIKEY': LAYERSWAP_API_KEY,
      'Content-Type': 'application/json',
    },
  });
  const result = await response.json();
  if (result.error) {
    throw new Error(result.error);
  }
  return result.data as T;
}

export async function getNetworks() {
  return getLayerSwapData<Array<Network>>(LAYERSWAP_NETWORKS_URL);
}

export async function getLimits({
  fromToken,
  toToken,
  fromNetworkName,
  toNetworkName,
}: {
  fromToken: TokenInfo | null;
  toToken: TokenInfo | null;
  fromNetworkName: string | undefined | null;
  toNetworkName: string | undefined | null;
}) {
  if (!fromToken || !toToken || !fromNetworkName || !toNetworkName) return;
  const data = await getLayerSwapData<{
    min_amount_in_usd: number;
    min_amount: number;
    max_amount_in_usd: number;
    max_amount: number;
  }>(
    `${LAYERSWAP_LIMITS_URL}?source_network=${fromNetworkName}&source_token=${fromToken.symbol}&destination_network=${toNetworkName}&destination_token=${toToken.symbol}`,
  );
  return data;
}

export async function getQuote({
  fromToken,
  toToken,
  fromNetworkName,
  toNetworkName,
  slippage,
  fromAmount,
}: {
  fromToken: TokenInfo | null;
  toToken: TokenInfo | null;
  fromNetworkName: string | undefined | null;
  toNetworkName: string | undefined | null;
  slippage?: number;
  fromAmount: string;
}) {
  if (
    !fromToken ||
    !toToken ||
    !fromNetworkName ||
    !toNetworkName ||
    !fromAmount
  )
    return;
  const data = await getLayerSwapData<Quote>(
    `${LAYERSWAP_QUOTE_URL}?source_network=${fromNetworkName}&source_token=${fromToken.symbol}&destination_network=${toNetworkName}&destination_token=${toToken.symbol}&slippage=${slippage}&amount=${fromAmount}`,
  );
  return data;
}

const transactionBuilder = async (
  amount: number,
  token: Token,
  depositAddress: string,
  sourceAddress: string,
  callData: string,
) => {
  const parsedCallData = JSON.parse(callData);

  if (token.contract) {
    const destinationAddress = Address.parse(depositAddress);
    const userAddress = Address.parse(sourceAddress);

    const forwardPayload = beginCell()
      .storeUint(0, 32) // 0 opcode means we have a comment
      .storeStringTail(parsedCallData.comment)
      .endCell();

    const body = beginCell()
      .storeUint(0x0f8a7ea5, 32) // opcode for jetton transfer
      .storeUint(0, 64) // query id
      .storeCoins(parsedCallData.amount) // jetton amount
      .storeAddress(destinationAddress) // TON wallet destination address
      .storeAddress(destinationAddress) // response excess destination
      .storeBit(0) // no custom payload
      .storeCoins(toNano('0.00002')) // forward amount (if >0, will send notification message)
      .storeBit(1) // we store forwardPayload as a reference
      .storeRef(forwardPayload)
      .endCell();

    const jettonMasterAddress = Address.parse(token.contract!);
    const tonClient = useTonConnectStore.getState().client;
    if (!tonClient) {
      throw new Error('No Ton Connect client available');
    }
    const jettonMaster = tonClient.open(
      JettonMaster.create(jettonMasterAddress),
    );
    const jettonAddress = await jettonMaster.getWalletAddress(userAddress);

    const tx = {
      validUntil: Math.floor(Date.now() / 1000) + 360,
      messages: [
        {
          address: jettonAddress.toString(), // sender jetton wallet
          amount: toNano('0.045').toString(), // for commission fees, excess will be returned
          payload: body.toBoc().toString('base64'), // payload with jetton transfer and comment body
        },
      ],
    };
    return tx;
  } else {
    const body = beginCell()
      .storeUint(0, 32) // write 32 zero bits to indicate that a text comment will follow
      .storeStringTail(parsedCallData.comment) // write our text comment
      .endCell();

    const tx = {
      validUntil: Math.floor(Date.now() / 1000) + 360,
      messages: [
        {
          address: depositAddress,
          amount: toNano(amount).toString(),
          payload: body.toBoc().toString('base64'), // payload with comment in body
        },
      ],
    };
    return tx;
  }
};

/**
 * @see https://github.com/layerswap/layerswapapp/blob/dev/components/Swap/Withdraw/Wallet/TonWalletWithdraw.tsx
 */
export async function submitTonWalletWithdraw({
  fromAddress,
  toAddress,
  fromToken,
  toToken,
  fromNetworkName,
  toNetworkName,
  fromAmount,
  slippage,
  params,
}: {
  fromAddress: string | undefined;
  toAddress: string | undefined;
  fromToken: TokenInfo | null;
  toToken: TokenInfo | null;
  fromNetworkName: string | undefined | null;
  toNetworkName: string | undefined | null;
  fromAmount: string;
  slippage?: number;
  params: {
    onSubmit?: (tx: string, reportInfo?: Record<string, any>) => void;
    onSuccess?: (tx: string, reportInfo?: Record<string, any>) => Promise<void>;
    onError?: (e: any) => void;
  };
}) {
  if (
    !fromToken ||
    !toToken ||
    !fromNetworkName ||
    !toNetworkName ||
    !fromAddress ||
    !toAddress
  )
    return;
  const response = await fetch(LAYERSWAP_SWAPS_URL, {
    method: 'POST',
    headers: {
      'X-LS-APIKEY': LAYERSWAP_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      destination_address: toAddress,
      source_address: fromAddress,
      source_network: fromNetworkName,
      source_token: fromToken.symbol,
      destination_network: toNetworkName,
      destination_token: toToken.symbol,
      use_deposit_address: false,
      amount: fromAmount,
      slippage,
    }),
  });
  const swapResponse = await response.json();
  if (swapResponse.error) {
    throw new Error(swapResponse.error);
  }
  const { swap } = swapResponse.data as SwapResponse;
  const { id: swapId, source_token: sourceToken } = swap;

  const deposit_actions_endpoint = `${LAYERSWAP_SWAPS_URL}/${swapId}/deposit_actions`;
  const depositActionsResponse = await getLayerSwapData<Array<DepositAction>>(
    deposit_actions_endpoint,
  );

  const depositAddress = depositActionsResponse?.find((da) => true)?.to_address;
  const amount = depositActionsResponse?.find((da) => true)?.amount || 0;
  const callData = depositActionsResponse?.find((da) => true)?.call_data;
  if (!callData || !depositAddress) {
    throw new Error('No deposit action found in the swap response');
  }
  const transaction = await transactionBuilder(
    amount,
    sourceToken,
    depositAddress,
    fromAddress,
    callData,
  );

  const { tonConnectUI, client } = useTonConnectStore.getState();
  if (!tonConnectUI || !client) {
    throw new Error('No tonConnectUI or client available');
  }
  const res = await tonConnectUI.sendTransaction(transaction);
  const bocHash = getHashByBoc(res.boc);
  if (params.onSubmit) {
    params.onSubmit(bocHash);
  }

  const data = await waitForTransaction(
    {
      boc: res.boc,
      address: fromAddress,
    },
    client,
  );
  if (params.onSuccess) {
    params.onSuccess(data?.hash()?.toString('base64') ?? bocHash, {
      tonTransaction: data,
    });
  }
  return data;
}
