import { chunk } from 'lodash';
import { defaultAbiCoder } from '@ethersproject/abi';
import { Contract } from '@ethersproject/contracts';

interface Web3CallData {
  to: string;
  data: string;
}

interface JsonRPCResp {
  result: any;
}

interface Fetched {
  req: Web3CallData;
  resp: JsonRPCResp;
}

interface RequestThunk<T> {
  callData: Web3CallData | null; // When null, processor is called with null
  processor: (_: any, index: number) => T;
}

export type BatchThunk<T> = RequestThunk<T>[];

type BatchThunkAll<Ts extends any[]> = {
  [Tidx in keyof Ts]: Ts[Tidx] extends Ts[number]
    ? BatchThunk<Ts[Tidx]>
    : never;
};

type BatchThunkAllResult<Ts extends any[]> = {
  [Tidx in keyof Ts]: Ts[Tidx] extends Ts[number] ? Array<Ts[Tidx]> : never;
};

export async function runAll<Ts extends any[]>(
  contract: Contract,
  contractAddress: string,
  ...batches: BatchThunkAll<Ts>
): Promise<BatchThunkAllResult<Ts>> {
  // Collect all rpcs
  const callDatas: Web3CallData[] = [];
  for (const batch of batches)
    for (const req of batch) if (req.callData) callDatas.push(req.callData);
  const executed = await sendReq(callDatas, contract, contractAddress);
  const mapper = new Map();
  for (const { req, resp } of executed) mapper.set(req, resp?.result);
  return batches.map(<T>(batch: BatchThunk<T>) => {
    const collected = batch
      .filter(
        (req: RequestThunk<T>) => !req.callData || mapper.get(req.callData),
      )
      .map((req: RequestThunk<T>, index: number) =>
        req.processor(req.callData ? mapper.get(req.callData) : null, index),
      );
    return collected;
  }) as BatchThunkAllResult<Ts>;
}

async function sendReq(
  rpcReqs: Web3CallData[],
  contract: Contract,
  contractAddress: string,
): Promise<Fetched[]> {
  const resps = await sendCallReqs(rpcReqs, contract, contractAddress);
  const mapping = new Map();
  for (const { req, resp } of resps) mapping.set(req, resp);
  return rpcReqs.map((e) => ({ req: e, resp: mapping.get(e) }));
}

async function sendCallReqs(
  rpcReqs: Web3CallData[],
  contract: Contract,
  contractAddress: string,
): Promise<Fetched[]> {
  const maxLen = 800;
  let chunkRpcReqs: Array<Web3CallData>[] = [rpcReqs];
  if (rpcReqs.length > maxLen) {
    chunkRpcReqs = chunk(rpcReqs, maxLen);
  }
  let res: Fetched[] = [];

  const chunkPromiseList = chunkRpcReqs.map(async (currentRpcReqs) => {
    const calls: Array<[string, string]> = currentRpcReqs.map((e) => [
      e.to,
      e.data,
    ]);
    const encoded = contract.interface.encodeFunctionData('aggregate', [calls]);
    const callData: Web3CallData = {
      data: encoded,
      to: contractAddress,
    };
    let raw: any;
    try {
      raw = await contract.provider.call(callData);
    } catch (error: any) {
      const currentRpcLen = currentRpcReqs.length;
      if (currentRpcLen > 20) {
        const half = Math.floor(currentRpcLen / 2);
        const [c0, c1] = await Promise.all([
          sendCallReqs(
            currentRpcReqs.slice(0, half),
            contract,
            contractAddress,
          ),
          sendCallReqs(
            currentRpcReqs.slice(half, currentRpcLen),
            contract,
            contractAddress,
          ),
        ]);
        res = [...res, ...c0, ...c1];
      } else {
        const api = '[sendCallReqs] error';
        console.error(api, error);
      }
    }

    if (raw === undefined) throw new Error('Unexpected batch result');
    const [blkNum, vals] = defaultAbiCoder.decode(['uint256', 'bytes[]'], raw);

    // Fuse with original request
    if (currentRpcReqs.length !== vals.length)
      throw new Error('Unexpected length mismatch');

    // Ignore blkNum
    void blkNum;

    // Fake JSONRPC resp
    return vals.map((row: any, idx: any) => {
      const req = currentRpcReqs[idx];
      const resp = {
        result: row,
      };
      return { resp, req };
    });
  });
  const chunkRes = await Promise.allSettled(chunkPromiseList);
  const fulfilledRes = chunkRes.filter(
    (item) => item.status === 'fulfilled',
  ) as PromiseFulfilledResult<Fetched[]>[];
  fulfilledRes.forEach(({ value }) => {
    res = [...res, ...value];
  });

  return res;
}
