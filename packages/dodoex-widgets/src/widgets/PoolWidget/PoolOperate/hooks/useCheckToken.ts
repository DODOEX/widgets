import { PoolApi } from '@dodoex/api';
import React from 'react';
import { TokenInfo } from '../../../../hooks/Token';
import { OperatePool } from '../types';

export enum CheckTokenType {
  base = 1,
  quote,
}

export const useCheckToken = (pool?: OperatePool) => {
  const [checkTokenType, setCheckToken] = React.useState(CheckTokenType.base);

  let isBase: undefined | boolean = undefined;
  let checkToken: undefined | TokenInfo = undefined;
  if (pool && PoolApi.utils.singleSideLp(pool.type)) {
    isBase = checkTokenType === CheckTokenType.base;
    checkToken = isBase ? pool.baseToken : pool.quoteToken;
  }

  return {
    isBase,
    checkToken,
    checkTokenType,
    setCheckToken,
  };
};
