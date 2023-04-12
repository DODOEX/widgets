import { Provider as ReduxProvider } from 'react-redux';
import { store } from '../configure-store';
import { WithMuiTheme } from './theme/WithTheme';

export function RootPage({ children }: { children: React.ReactNode }) {
  return <ReduxProvider store={store}>{children}</ReduxProvider>;
}
