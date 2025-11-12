import { BigNumber } from 'bignumber.js';
import ContractRequests, {
  ABIName,
  CONTRACT_QUERY_KEY,
  ContractRequestsConfig,
} from '../../helper/ContractRequests';
import { swapGraphqlQuery } from './graphqlQuery';

export interface SwapApiProps {
  contractRequests?: ContractRequests;
  contractRequestsConfig?: ContractRequestsConfig;
}

export class SwapApi {
  contractRequests: ContractRequests;
  constructor(config: SwapApiProps) {
    if (config.contractRequests) {
      this.contractRequests = config.contractRequests;
    } else if (config.contractRequests) {
      this.contractRequests = new ContractRequests(
        config.contractRequestsConfig,
      );
    } else {
      throw new Error('SwapApi does not initialize the contractRequests');
    }
  }

  static graphql = swapGraphqlQuery;

  getRefundInfoZRC20(
    chainId: number | undefined,
    contractAddress: string | undefined,
    externalId: string | undefined,
  ) {
    return {
      queryKey: [CONTRACT_QUERY_KEY, 'swap', 'getRefundInfo', ...arguments],
      enabled: !!chainId && !!contractAddress && !!externalId,
      queryFn: async () => {
        if (!chainId || !contractAddress || !externalId) {
          return null;
        }
        const refundInfo = await this.contractRequests.batchCallQuery(chainId, {
          abiName: ABIName.RefundVault,
          contractAddress: contractAddress,
          method: 'getRefundInfo',
          params: [externalId],
        });

        console.log('refundInfo', refundInfo);

        if (!refundInfo.token) {
          return null;
        }

        const withdrawGasFee = await this.contractRequests.batchCallQuery(
          chainId,
          {
            abiName: ABIName.RefundVault,
            contractAddress: contractAddress,
            method: 'getWithdrawGasFee',
            params: [refundInfo.token],
          },
        );

        console.log(
          'withdrawGasFee',
          withdrawGasFee.gasZRC20,
          withdrawGasFee.gasFee.toString(),
        );

        if (!withdrawGasFee.gasZRC20) {
          return null;
        }

        const gasZRC20 = withdrawGasFee.gasZRC20;
        const decimals = await this.contractRequests.batchCallQuery<number>(
          chainId,
          {
            abiName: ABIName.erc20ABI,
            contractAddress: gasZRC20,
            method: 'decimals',
            params: [],
          },
        );

        console.log('decimals', decimals);

        const gasFee = new BigNumber(withdrawGasFee.gasFee.toString()).div(
          10 ** decimals,
        );

        console.log('gasFee', gasFee.toString());

        return {
          gasZRC20,
          gasFee,
        };
      },
    };
  }
}
