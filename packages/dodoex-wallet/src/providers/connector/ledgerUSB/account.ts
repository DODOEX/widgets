import AppEth from '@ledgerhq/hw-app-eth';
import { getTransport } from './connect';

export const HD_PATH_LIST = [
  {
    path: "m/44'/60'/x'/0/0",
    name: 'Ledger Live',
  },
  {
    path: "m/44'/60'/0'/x",
    name: 'Legacy',
  },
];
export interface HDAccountItem {
  path: string;
  account: string;
}

const getAddressRotation = async (
  eth: AppEth,
  pathRule: string,
  index: number,
  pageIndex: number,
  maxIndex: number,
  oldAccountList: HDAccountItem[] = [],
) => {
  const currentPath = pathRule.replace(/x/g, String(index + pageIndex));
  const address = await eth.getAddress(currentPath);
  let newAccountList: HDAccountItem[] = [
    ...oldAccountList,
    {
      path: currentPath,
      account: address.address,
    },
  ];
  if (index < maxIndex) {
    newAccountList = await getAddressRotation(
      eth,
      pathRule,
      index + 1,
      pageIndex,
      maxIndex,
      newAccountList,
    );
  }
  return newAccountList;
};

export const getAccountList = async (
  pathRule: string,
  page = 1,
  pageSize = 5,
) => {
  const transport = await getTransport();
  const eth = new AppEth(transport);
  let accountList: HDAccountItem[];
  try {
    if (pathRule.indexOf('x') === -1) {
      const address = await eth.getAddress(pathRule);
      return [
        {
          path: pathRule,
          account: address.address,
        },
      ];
    }
    const pageIndex = page * pageSize - pageSize;
    accountList = await getAddressRotation(
      eth,
      pathRule,
      0,
      pageIndex,
      pageSize - 1,
    );
  } finally {
    transport.close();
  }
  return accountList;
};
