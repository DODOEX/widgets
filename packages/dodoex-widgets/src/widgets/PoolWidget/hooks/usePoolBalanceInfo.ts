import { PoolType } from '@dodoex/api';
import { useQuery } from '@tanstack/react-query';
import { BigNumber } from 'bignumber.js';
import { poolApi } from '../utils';

type Balance = BigNumber | null | undefined;

function getLpBalance(
  queryUserLpBalance: Balance,
  totalLpBalance: Balance,
  lpDecimals: number | undefined,
  type: PoolType | undefined,
) {
  if (type === 'CLASSICAL') {
    // When all classical is extracted, 1 wei needs to be manually subtracted, otherwise the old version of the contract cannot calculate the handling fee and will fail to upload to the chain.
    if (
      queryUserLpBalance &&
      totalLpBalance &&
      queryUserLpBalance.isEqualTo(totalLpBalance)
    ) {
      return queryUserLpBalance
        .times(`1e${lpDecimals}`)
        .minus(1)
        .div(`1e${lpDecimals}`);
    }
  }
  return queryUserLpBalance;
}

/**
 * FIN/USDT There is an error in the pool calculation and special processing is required: If the calculated value is greater than reserve, special processing is required.
 * @param address pool address
 * @returns
 */
function isSpecificPool(address: string) {
  const specificPoolIds = [
    '0x9D9793e1E18CDEe6cf63818315D55244f73EC006',
    '0x0D04146B2Fe5d267629a7eb341Fb4388DcdBD22f',
    '0x3D9d765b0fbAf594F90F07bc42889473e6613C7A',
    '0x3854BdcB1a7cBA4b1A5f9a7C8719e247Df4c42c6',
    '0xA46F5eC3219f956d14C6816Ef9cf6CaBf13bdD77',
    '0xB16f2Ff8E8499E31B257d2A02D25e8956Ae6aFe7',
  ];
  return (
    specificPoolIds.findIndex(
      (s) => s.toLowerCase() === address.toLowerCase(),
    ) !== -1
  );
}
function computeLpProportion(
  lpTokenTotalSupply: BigNumber,
  reserve: BigNumber,
) {
  if (lpTokenTotalSupply.lte(0)) return new BigNumber(0);
  return reserve.div(lpTokenTotalSupply);
}
export function getLpToTokenBalance(
  userLpBalance: Balance,
  totalLpBalance: Balance,
  reserve: Balance,
  target: Balance,
  address: string | undefined,
  type: PoolType | undefined,
  decimals: number | undefined,
) {
  const isSpecific = address && isSpecificPool(address);
  let userLpToTokenBalance = undefined;
  let lpToTokenProportion: BigNumber | undefined;
  const computeProportionReserve = type === 'CLASSICAL' ? target : reserve;
  if (
    userLpBalance &&
    totalLpBalance &&
    computeProportionReserve &&
    decimals !== undefined
  ) {
    lpToTokenProportion = computeLpProportion(
      totalLpBalance,
      computeProportionReserve,
    );
    userLpToTokenBalance = userLpBalance.times(lpToTokenProportion);
    if (type === 'CLASSICAL' && isSpecific) {
      if (!target) return [undefined, undefined];
      if (userLpToTokenBalance.gt(target) && reserve) {
        lpToTokenProportion = computeLpProportion(
          totalLpBalance,
          BigNumber.min(target, reserve),
        );
        userLpToTokenBalance = userLpToTokenBalance.times(lpToTokenProportion);
      }
    }
    return [
      lpToTokenProportion,
      userLpToTokenBalance.dp(Number(decimals), BigNumber.ROUND_DOWN),
    ];
  }
  return [undefined, undefined];
}

export function usePoolBalanceInfo({
  account,
  pool,
}: {
  account?: string;
  pool?: {
    address: string;
    chainId: number;
    baseTokenDecimals: number;
    quoteTokenDecimals: number;
    baseLpTokenDecimals: number;
    quoteLpTokenDecimals: number;
    type: PoolType;
  };
}) {
  const {
    chainId,
    address,
    type,
    baseTokenDecimals,
    quoteTokenDecimals,
    baseLpTokenDecimals,
    quoteLpTokenDecimals,
  } = pool ?? {};

  const totalBaseLpQuery = useQuery(
    poolApi.getTotalBaseLpQuery(chainId, address, type, baseLpTokenDecimals),
  );
  const totalQuoteLpQuery = useQuery(
    poolApi.getTotalQuoteLpQuery(chainId, address, type, quoteLpTokenDecimals),
  );
  const userBaseLpQuery = useQuery(
    poolApi.getUserBaseLpQuery(
      chainId,
      address,
      type,
      baseLpTokenDecimals,
      account,
    ),
  );
  const userQuoteLpQuery = useQuery(
    poolApi.getUserQuoteLpQuery(
      chainId,
      address,
      type,
      quoteLpTokenDecimals,
      account,
    ),
  );
  const reserveQuery = useQuery(
    poolApi.getReserveLpQuery(
      chainId,
      address,
      type,
      baseTokenDecimals,
      quoteTokenDecimals,
    ),
  );

  const classicalTargetQuery = useQuery(
    poolApi.getClassicalTargetQuery(
      chainId,
      address,
      type,
      baseTokenDecimals,
      quoteTokenDecimals,
    ),
  );

  const totalBaseLpBalance = totalBaseLpQuery.data;
  const totalQuoteLpBalance = totalQuoteLpQuery.data;
  const { baseReserve, quoteReserve } = reserveQuery.data || {};
  const classicalBaseTarget = classicalTargetQuery.data?.baseTarget;
  const classicalQuoteTarget = classicalTargetQuery.data?.quoteTarget;

  const isPrivate = type === 'DPP';

  const userBaseLpBalance = isPrivate
    ? baseReserve
    : getLpBalance(
        userBaseLpQuery.data,
        totalBaseLpBalance,
        baseLpTokenDecimals,
        type,
      );
  const userQuoteLpBalance = isPrivate
    ? quoteReserve
    : getLpBalance(
        userQuoteLpQuery.data,
        totalQuoteLpBalance,
        quoteLpTokenDecimals,
        type,
      );

  const [baseLpToTokenProportion, userBaseLpToTokenBalance] = isPrivate
    ? [new BigNumber(1), baseReserve]
    : getLpToTokenBalance(
        userBaseLpBalance,
        totalBaseLpBalance,
        baseReserve,
        classicalBaseTarget,
        address,
        type,
        baseTokenDecimals,
      );

  let quoteLpToTokenProportion: BigNumber | undefined;
  let userQuoteLpToTokenBalance: BigNumber | undefined | null;

  if (quoteReserve) {
    let quoteSupply = totalQuoteLpQuery.data;
    if (
      !quoteSupply &&
      !totalQuoteLpQuery.isLoading &&
      !totalQuoteLpQuery.error &&
      totalBaseLpBalance
    ) {
      // There is only one supply and there is no quoteSupply
      quoteSupply = totalBaseLpBalance;
    }

    // userQuoteLpQuery returns null after querying. This kind of pool does not distinguish the balance of baseLp or quoteLp. Here, the baseLp balance of the query is directly used for calculation.
    const userLpBalance =
      userQuoteLpQuery.isFetched &&
      !userQuoteLpQuery.error &&
      userQuoteLpBalance === null
        ? userBaseLpBalance
        : userQuoteLpBalance;
    if (isPrivate) {
      quoteLpToTokenProportion = new BigNumber(1);
      userQuoteLpToTokenBalance = quoteReserve;
    } else if (
      !userQuoteLpQuery.isLoading &&
      !userQuoteLpQuery.error &&
      !classicalTargetQuery.error &&
      !userLpBalance
    ) {
      userQuoteLpToTokenBalance = new BigNumber(0);
    } else {
      [quoteLpToTokenProportion, userQuoteLpToTokenBalance] =
        getLpToTokenBalance(
          userLpBalance,
          quoteSupply,
          quoteReserve,
          classicalQuoteTarget,
          address,
          type,
          quoteTokenDecimals,
        );
    }
  }

  const userLpBalanceLoading =
    userBaseLpQuery.isLoading || userQuoteLpQuery.isLoading;
  const userLpBalanceError =
    userBaseLpQuery.isError || userQuoteLpQuery.isError;
  const userLpBalanceRefetch = () => {
    userBaseLpQuery.refetch();
    userQuoteLpQuery.refetch();
  };

  const userLpToTokenBalanceRefetch = () => {
    userLpBalanceRefetch();
    totalBaseLpQuery.refetch();
    totalQuoteLpQuery.refetch();
    reserveQuery.refetch();
    classicalTargetQuery.refetch();
  };

  const userLpToTokenBalanceLoading =
    userLpBalanceLoading ||
    totalBaseLpQuery.isLoading ||
    totalQuoteLpQuery.isLoading ||
    reserveQuery.isLoading ||
    classicalTargetQuery.isLoading;

  const userLpToTokenBalanceError =
    userLpBalanceError ||
    totalBaseLpQuery.isError ||
    totalQuoteLpQuery.isError ||
    reserveQuery.isError ||
    classicalTargetQuery.isError;

  const isSinglePool =
    pool?.type === 'DVM' && (!quoteReserve || quoteReserve.isZero());

  return {
    /** existing base lp balance */
    totalBaseLpBalance,
    /** existing quote lp balance */
    totalQuoteLpBalance,
    /** the total deposited base lp balance */
    baseReserve,
    /** the total deposited quote lp balance */
    quoteReserve,
    /** classical base equilibrium target */
    classicalBaseTarget,
    /** classical quote equilibrium target */
    classicalQuoteTarget,
    /** the user's existing base lp balance */
    userBaseLpBalance,
    /** the user's existing quote lp balance */
    userQuoteLpBalance,
    /** The number of base that can be obtained when a user withdraws from the pool */
    userBaseLpToTokenBalance,
    /** The number of quote that can be obtained when a user withdraws from the pool */
    userQuoteLpToTokenBalance,

    baseLpToTokenProportion,
    quoteLpToTokenProportion,

    isSinglePool,

    // loading
    userLpBalanceLoading,
    userLpToTokenBalanceLoading,

    userLpBalanceError,
    userLpToTokenBalanceError,

    userLpToTokenBalanceRefetch,

    error: userLpToTokenBalanceError,
    loading: userLpToTokenBalanceLoading,
    refetch: userLpToTokenBalanceRefetch,
  };
}
