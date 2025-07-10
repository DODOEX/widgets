import BigNumber from 'bignumber.js';
import { ChainId } from '../../chainConfig';
import ContractRequests, {
  CONTRACT_QUERY_KEY,
  ContractRequestsConfig,
} from '../../helper/ContractRequests';
import { ABIName } from '../../helper/ContractRequests/abi/abiName';
import { poolUtils } from '../pool/poolUtils';
import { AllV3TicksDocument } from './queries';

interface TokenInfo {
  readonly chainId: ChainId;
  readonly address: string;
  readonly name: string;
  readonly decimals: number;
  readonly symbol: string;
}

export interface CurveApiProps {
  contractRequests?: ContractRequests;
  contractRequestsConfig?: ContractRequestsConfig;
}

export class CurveApi {
  contractRequests: ContractRequests;
  constructor(config: CurveApiProps) {
    if (config.contractRequests) {
      this.contractRequests = config.contractRequests;
    } else if (config.contractRequests) {
      this.contractRequests = new ContractRequests(
        config.contractRequestsConfig,
      );
    } else {
      throw new Error('CurveApi does not initialize the contractRequests');
    }
  }

  static graphql = {
    AllV3TicksDocument,
  };

  static utils = poolUtils;

  static encode = {};

  getBalances(
    chainId: number | undefined,
    contractAddress: string | undefined,
    coins: TokenInfo[],
  ) {
    return {
      queryKey: [CONTRACT_QUERY_KEY, 'curve', 'balances', ...arguments],
      enabled: !!chainId && !!contractAddress,
      queryFn: async () => {
        if (!chainId || !contractAddress) {
          return null;
        }

        const result = await this.contractRequests.callMultiQuery(
          chainId,
          coins.map((_, i) => {
            return {
              abiName: ABIName.CurveStableSwapNG,
              contractAddress,
              method: 'balances',
              params: [i],
            };
          }),
        );
        if (
          !result ||
          !Array.isArray(result) ||
          result.length !== coins.length
        ) {
          return null;
        }
        return result.map((r) => {
          return new BigNumber(r[0].toString());
        });
      },
    };
  }

  getBalanceOf(
    chainId: number | undefined,
    contractAddress: string | undefined,
    account: string | undefined,
  ) {
    return {
      queryKey: [CONTRACT_QUERY_KEY, 'curve', 'balanceOf', ...arguments],
      enabled: !!chainId && !!contractAddress && !!account,
      queryFn: async () => {
        if (!chainId || !contractAddress || !account) {
          return null;
        }
        const result = await this.contractRequests.batchCallQuery(chainId, {
          abiName: ABIName.CurveStableSwapNG,
          contractAddress: contractAddress,
          method: 'balanceOf',
          params: [account],
        });
        const balance = new BigNumber(result.toString());
        return balance;
      },
    };
  }

  getTotalSupply(
    chainId: number | undefined,
    contractAddress: string | undefined,
  ) {
    return {
      queryKey: [CONTRACT_QUERY_KEY, 'curve', 'totalSupply', ...arguments],
      enabled: !!chainId && !!contractAddress,
      queryFn: async () => {
        if (!chainId || !contractAddress) {
          return null;
        }
        const result = await this.contractRequests.batchCallQuery(chainId, {
          abiName: ABIName.CurveStableSwapNG,
          contractAddress: contractAddress,
          method: 'totalSupply',
          params: [],
        });
        const totalSupply = new BigNumber(result.toString());
        return totalSupply;
      },
    };
  }

  calcTokenAmount(
    chainId: number | undefined,
    contractAddress: string | undefined,
    amounts: string[],
    isDeposit: boolean,
  ) {
    return {
      queryKey: [
        CONTRACT_QUERY_KEY,
        'curve',
        'calc_token_amount',
        ...arguments,
      ],
      enabled: !!chainId && !!contractAddress,
      queryFn: async () => {
        if (!chainId || !contractAddress) {
          return null;
        }
        const result = await this.contractRequests.batchCallQuery(chainId, {
          abiName: ABIName.CurveStableSwapNG,
          contractAddress: contractAddress,
          method: 'calc_token_amount',
          params: [amounts, isDeposit],
        });

        const lpTokenReceived = new BigNumber(result.toString());
        return lpTokenReceived;
      },
    };
  }

  calcWithdrawOneCoin(
    chainId: number | undefined,
    contractAddress: string | undefined,
    burnAmount: string,
    coinIndex: number,
  ) {
    return {
      queryKey: [
        CONTRACT_QUERY_KEY,
        'curve',
        'calc_withdraw_one_coin',
        ...arguments,
      ],
      enabled: !!chainId && !!contractAddress,
      queryFn: async () => {
        // burnAmount = 0 合约会报错
        if (!chainId || !contractAddress || !burnAmount || burnAmount === '0') {
          return null;
        }
        const result = await this.contractRequests.batchCallQuery(chainId, {
          abiName: ABIName.CurveStableSwapNG,
          contractAddress: contractAddress,
          method: 'calc_withdraw_one_coin',
          params: [burnAmount, coinIndex],
        });

        const tokenReceived = new BigNumber(result.toString());
        return tokenReceived;
      },
    };
  }
}
