import { t } from '@lingui/macro';
import { CreateMiningTypeI } from '../types';
import { TokenType } from './reducers';

export function useCreateMiningTypeList() {
  const createMiningTypeList: CreateMiningTypeI[] = [
    {
      type: TokenType.SINGLE,
      title: t`Single-Token Stake Mining`,
      description: t`Stake tokens to receive mining rewards.`,
    },
    {
      type: TokenType.LP,
      title: t`Token Pair Mining`,
      description: t`Stake LP tokens and receive mining rewards.`,
    },
  ];

  const createMiningTypeMap = createMiningTypeList.reduce((map, item) => {
    map[item.type] = item;
    return map;
  }, {} as Record<TokenType, CreateMiningTypeI>);

  return {
    createMiningTypeList,
    createMiningTypeMap,
  };
}
