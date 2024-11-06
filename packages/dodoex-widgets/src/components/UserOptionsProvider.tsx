import React from 'react';
import { WidgetProps } from './Widget';

export const UserOptionsContext = React.createContext<WidgetProps | null>(null);

type UserOptionsProviderProps = React.PropsWithChildren<WidgetProps>;
export function UserOptionsProvider({
  children,
  ...props
}: UserOptionsProviderProps) {
  return (
    <UserOptionsContext.Provider value={props}>
      {children}
    </UserOptionsContext.Provider>
  );
}

export function useUserOptions<T = WidgetProps>(
  selector?: (state: WidgetProps) => T,
): T {
  const store = React.useContext(UserOptionsContext);
  if (!store)
    throw new Error('Missing UserOptionsContext.Provider in the tree');

  const selectorResult = selector ?? ((state) => state as T);
  const result = selectorResult(store);
  return React.useMemo(() => result, [result]);
}
