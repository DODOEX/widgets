import {
  type BaseNetwork,
  ChainId,
  ChainNamespace,
  type CaipNetwork,
} from '@reown/appkit-common';
import type {
  NamespaceTypeMap,
  UseAppKitAccountReturn,
} from '@reown/appkit/react';

export type ChainNamespaceExtend = ChainNamespace | 'ton' | 'sui';

export type CaipNetworkIdExtend = `${ChainNamespaceExtend}:${ChainId}`;

export type CaipAddressExtend = `${ChainNamespaceExtend}:${ChainId}:${string}`;

type NamespaceTypeMapExtend = NamespaceTypeMap & {
  ton: 'eoa';
  sui: 'eoa';
};

type AccountTypeMapExtend = {
  [K in ChainNamespaceExtend]: {
    namespace: K;
    address: string;
    type: NamespaceTypeMapExtend[K];
    publicKey?: K extends 'bip122' ? string : never;
    path?: K extends 'bip122' ? string : never;
  };
};

type AccountTypeExtend = AccountTypeMapExtend[ChainNamespaceExtend];

export type UseAppKitAccountReturnExtend = {
  allAccounts: AccountTypeExtend[];
  caipAddress: CaipAddressExtend | undefined;
} & Pick<
  UseAppKitAccountReturn,
  'address' | 'isConnected' | 'embeddedWalletInfo' | 'status'
>;

export type CaipNetworkExtend = Omit<CaipNetwork, 'chainNamespace'> & {
  chainNamespace: ChainNamespaceExtend;
};

export type AppKitNetworkExtend = BaseNetwork | CaipNetworkExtend;
