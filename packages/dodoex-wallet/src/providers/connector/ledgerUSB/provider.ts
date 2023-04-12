import { JsonRpcEngine } from 'json-rpc-engine';
import { deepCopy } from '@ethersproject/properties';
import { TypedDataUtils, SignTypedDataVersion } from '@metamask/eth-sig-util';
import {
  createWalletMiddleware,
  createFetchMiddleware,
  MessageParams,
  TransactionParams,
} from '@metamask/eth-json-rpc-middleware';
import { providerFromEngine } from '@metamask/eth-json-rpc-provider';
import AppEth from '@ledgerhq/hw-app-eth';
import { hexlify } from '@ethersproject/bytes';
import { serialize } from '@ethersproject/transactions';
import { getTransport } from './connect';
import { convertTransactionType } from '../../../helpers/transactions';
import { convertWeb3Provider } from '../../../helpers/providers';
import { ConnectorParams } from '../types';
import { getAccountList, HD_PATH_LIST } from './account';

let nextId = 1;

export async function createLedgerUSBProvider({
  chainId = 1,
  rpcUrl,
  fetchGasPrice,
  ledgerParams,
}: ConnectorParams) {
  if (!rpcUrl) {
    throw new Error('Ledger USB provider requires rpcUrl');
  }
  const path = ledgerParams?.path ?? HD_PATH_LIST[0].path;
  let account = ledgerParams?.account as string;
  let accounts = account ? [account] : ([] as Array<string>);
  if (!account) {
    accounts = await (await getAccountList(path)).map((item) => item.account);
    account = accounts[0];
  }
  const engine = new JsonRpcEngine();

  const getAccounts = async () => {
    return Promise.resolve(accounts);
  };

  const processPersonalMessage = async (msgParams: MessageParams) => {
    if (!path) throw new Error(`address unknown '${msgParams.from}'`);
    const transport = await getTransport();
    try {
      const eth = new AppEth(transport);
      const result = await eth.signPersonalMessage(
        path,
        hexlify(msgParams.data).substring(2),
      );
      const v = parseInt(String(result.v), 10) - 27;
      let vHex = v.toString(16);
      if (vHex.length < 2) {
        vHex = `0${v}`;
      }
      return `0x${result.r}${result.s}${vHex}`;
    } finally {
      transport.close();
    }
  };

  const processTransaction = async (txParams: TransactionParams) => {
    if (!path) throw new Error(`address unknown '${txParams.from}'`);

    const transport = await getTransport();
    try {
      const eth = new AppEth(transport);
      const convertTxParams = await convertTransactionType(
        chainId,
        txParams,
        fetchGasPrice,
      );
      const txParamsResult = {
        chainId: chainId,
        data: convertTxParams.data,
        // @ts-ignore
        gasLimit: convertTxParams.gasLimit || convertTxParams.gas,
        to: convertTxParams.to,
        value: convertTxParams.value,
      };
      const unsignedTx = serialize(txParamsResult).substring(2);
      const result = await eth.signTransaction(path, unsignedTx);
      return serialize(txParamsResult, {
        v: parseInt(`0x${result.v}`, 2),
        r: `0x${result.r}`,
        s: `0x${result.s}`,
      });
    } finally {
      transport.close();
    }
  };

  // EIP-712
  const processTypedMessageV4 = async (
    msgParams: MessageParams & {
      version: string;
    },
    // req: JsonRpcRequest<unknown>,
    // version: string,
  ) => {
    const transport = await getTransport();
    try {
      if (!path) throw new Error(`address unknown '${msgParams.from}'`);
      const eth = new AppEth(transport);
      const data = JSON.parse(msgParams.data);
      const { domain, types, primaryType, message } = data;
      const domainSeparatorHex = TypedDataUtils.hashStruct(
        'EIP712Domain',
        domain,
        types,
        SignTypedDataVersion.V4,
      ).toString('hex');
      const hashStructMessageHex = TypedDataUtils.hashStruct(
        primaryType,
        message,
        types,
        SignTypedDataVersion.V4,
      ).toString('hex');
      const payload = await eth.signEIP712HashedMessage(
        path,
        domainSeparatorHex,
        hashStructMessageHex,
      );
      const vNum = parseInt(String(payload.v), 10);
      let v = vNum.toString(16);
      if (v.length < 2) {
        v = `0${v}`;
      }
      const signature = `0x${payload.r}${payload.s}${v}`;
      return signature as any;
    } finally {
      transport.close();
    }
  };

  engine.push(
    createWalletMiddleware({
      getAccounts,
      processPersonalMessage,
      processTransaction,
      processTypedMessageV4,
    }),
  );
  engine.push(
    createFetchMiddleware({
      rpcUrl,
    }),
  );
  const provider = providerFromEngine(engine);
  const JsonRpcFetchFunc = (method: string, params?: Array<any>) => {
    nextId += 1;
    const request = {
      method,
      params,
      id: nextId,
      jsonrpc: '2.0' as const,
    };
    const fetcher = 'ledgerFetcher';
    return new Promise((resolve, reject) => {
      provider.emit('debug', {
        action: 'request',
        fetcher,
        request: deepCopy(request),
        provider,
      });

      provider.sendAsync(request, (error, response) => {
        if (error) {
          provider.emit('debug', {
            action: 'response',
            fetcher,
            error,
            request,
            provider,
          });

          return reject(error);
        }

        provider.emit('debug', {
          action: 'response',
          fetcher,
          request,
          response,
          provider,
        });

        if (response.error) {
          const e = new Error(response.error.message);
          (<any>e).code = response.error.code;
          (<any>e).data = response.error.data;
          return reject(e);
        }

        resolve(response.result);
      });
    });
  };
  return convertWeb3Provider(JsonRpcFetchFunc);
}
