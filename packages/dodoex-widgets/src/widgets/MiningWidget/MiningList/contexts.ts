import { createContext, Dispatch, SetStateAction } from 'react';

export const MiningContext = createContext<{
  operateId: string | null;
  viewType: 'view' | null;
  setViewType: Dispatch<SetStateAction<'view' | null>>;
  setOperateId: Dispatch<SetStateAction<string | null>>;
  refetchContractData: () => void;
}>({
  operateId: null,
  viewType: null,
  setOperateId: () => {},
  setViewType: () => {},
  refetchContractData: () => {},
});
