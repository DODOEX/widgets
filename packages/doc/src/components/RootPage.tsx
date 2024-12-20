import { Provider as ReduxProvider } from 'react-redux';
import { store } from '../configure-store';
import { WithMuiTheme } from './theme/WithMuiTheme';

export function RootPage({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <WithMuiTheme>{children}</WithMuiTheme>
    </ReduxProvider>
  );
}
