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
      }
    }
  `),
};
