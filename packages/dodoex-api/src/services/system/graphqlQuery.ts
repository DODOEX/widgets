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
};
