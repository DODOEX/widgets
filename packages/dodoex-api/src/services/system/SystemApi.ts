import MerkleDistributorABI from '../../helper/ContractRequests/abi/ABIs/MerkleDistributorABI';
import { encodeFunctionDataByFragments } from '../../helper/ContractRequests/encode';
import { systemGraphqlQuery } from './graphqlQuery';

export class SystemApi {
  constructor() {}

  static graphql = systemGraphqlQuery;

  static encode = {
    /**
     * Encode a Merkle distributor `claim(index, account, amount, merkleProof)`
     * call for the LP fee reward. `claimContract`, `index`, `proof` and the raw
     * `amount` (claimableRewardRaw) come from `lp_fee_reward_getUserReward`.
     */
    claimLpFeeReward({
      claimContract,
      index,
      account,
      amount,
      proof,
    }: {
      claimContract: string;
      index: number;
      account: string;
      amount: string;
      proof: string[];
    }) {
      const data = encodeFunctionDataByFragments(MerkleDistributorABI, 'claim', [
        index,
        account,
        amount,
        proof,
      ]);
      return {
        to: claimContract,
        data,
        value: 0,
      };
    },
  };
}
