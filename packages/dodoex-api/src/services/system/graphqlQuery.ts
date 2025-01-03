import { graphql } from '../../gql';

export const systemGraphqlQuery = {
  fetchNoticeCenterTransactionList: graphql(`
    query FetchNoticeCenterTransactionList(
      $where: Notice_centertransactionListFilter
    ) {
      notice_center_transactionList(where: $where) {
        list {
          chainId
          createTime
          extend
          from
          id
          key
          type
        }
        count
        limit
        page
      }
    }
  `),
  fetchLiquidityLpPartnerRewards: graphql(`
    query FetchLiquidityLpPartnerRewards(
      $where: LiquidityLpPartnerRewardsInput
    ) {
      liquidity_getLpPartnerRewards(where: $where) {
        partnerInfos {
          partner
          logo
          introduction
          link
          theme
          sort
          platform
          extra
        }
        partnerRewards {
          chainId
          pool
          partner
          reward
          type
        }
      }
    }
  `),
  fetchUserprofileReward: graphql(`
    query FetchUserprofileReward($where: UserprofileReward_filter) {
      userprofile_reward(where: $where) {
        name_key
        token_address
        contract_address
        token_symbol
        locking
        version
        merkle {
          index
          amout
          proof
        }
      }
    }
  `),
};
