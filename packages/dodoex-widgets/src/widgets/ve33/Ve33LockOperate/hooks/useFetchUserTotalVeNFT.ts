import { getFetchVE33VotingEscrowBalanceOfNFTQueryOptions, getFetchVE33VotingEscrowBalanceOfQueryOptions, getFetchVE33VotingEscrowOwnerToNFTokenIdListQueryOptions } from "@dodoex/dodo-contract-request";
import { useQueries, useQuery } from "@tanstack/react-query";
import { increaseArray } from "../../../../utils/utils";
import React from "react";

export function useFetchUserTotalVeNFT(chainId: number | undefined, account: string | undefined) {
  const fetchBalanceOf = useQuery(getFetchVE33VotingEscrowBalanceOfQueryOptions(chainId, account))

  const fetchTokenIds = useQueries({
    queries: increaseArray(fetchBalanceOf.data ? Number(fetchBalanceOf.data) :0).map((_, i) => getFetchVE33VotingEscrowOwnerToNFTokenIdListQueryOptions(chainId, account, i))
  });

  const tokenIds = fetchTokenIds.map(item => item.data ? Number(item.data) : 0).filter(tokenId => !!tokenId)

  const fetchBalanceOfNFT = useQueries({
    queries: tokenIds.map(id => getFetchVE33VotingEscrowBalanceOfNFTQueryOptions(chainId, id))
  });

  const totalNFT = React.useMemo(() => {
    let result = BigInt(0);
    fetchBalanceOfNFT.forEach(item => {
        if (item.data) {
          result += item.data; 
        }
    })
    return result;
  }, [fetchBalanceOfNFT]);

  return {
    totalNFT,
    isLoading: fetchBalanceOf.isLoading || fetchTokenIds.some(item => item.isLoading) || fetchBalanceOfNFT.some(item => item.isLoading),
    refetch: () => {
      fetchBalanceOf.refetch();      
      fetchBalanceOfNFT.forEach(item => item.refetch())
    },
    fetchBalanceOf,
    fetchTokenIds,
    fetchBalanceOfNFT,
  }
}
