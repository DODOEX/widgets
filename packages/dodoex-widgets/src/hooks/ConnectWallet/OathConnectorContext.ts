import { createContext } from 'react';
import type OathWalletConnector from './Connectors/OathWalletConnector';

// Each widget owns its connector; multiple embeds must not share pairing state.
export const OathConnectorContext = createContext<OathWalletConnector | null>(
  null,
);
