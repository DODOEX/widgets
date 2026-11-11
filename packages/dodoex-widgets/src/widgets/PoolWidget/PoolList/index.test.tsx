import React from 'react';
import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
} from '@testing-library/react';
import PoolList from './index';
import { useWidgetDevice } from '../../../hooks/style/useWidgetDevice';
import {
  OperateTab,
  usePoolOperateTabs,
} from '../PoolOperate/hooks/usePoolOperateTabs';

jest.mock('@dodoex/components', () => ({
  Box: ({ children }: any) => <div>{children}</div>,
  Tabs: ({ children }: any) => <div>{children}</div>,
  TabPanel: ({ children }: any) => <div>{children}</div>,
  TabsGroup: () => null,
}));
jest.mock('../../../components/HowItWorks', () => ({ HowItWorks: () => null }));
jest.mock('../../../components/Swap/components/Dialog', () => ({
  transitionTime: 0,
}));
jest.mock('../../../components/UserOptionsProvider', () => ({
  useUserOptions: (select: any) => select({ noDocumentLink: true }),
}));
jest.mock('../../../components/WidgetContainer', () => ({
  __esModule: true,
  default: jest
    .requireActual('react')
    .forwardRef(({ children }: any, ref: any) => (
      <div ref={ref}>{children}</div>
    )),
}));
jest.mock('../../../hooks/ConnectWallet/useWalletInfo', () => ({
  useWalletInfo: () => ({ account: '0xuser' }),
}));
jest.mock('../../../hooks/style/useWidgetDevice', () => ({
  useWidgetDevice: jest.fn(() => ({ isMobile: false })),
}));
jest.mock('../../../router', () => ({ useRouterStore: jest.fn() }));
jest.mock('../AMMV3/AMMV3PositionManage', () => ({
  AMMV3PositionManage: () => null,
}));
jest.mock('../AMMV3/AMMV3PositionsView', () => ({
  AMMV3PositionsView: () => null,
}));
jest.mock('./components/CreatePoolBtn', () => ({ CreatePoolBtn: () => null }));
jest.mock('./components/LpFeeRewardBanner', () => () => null);
jest.mock('./hooks/usePoolListFilterChainId', () => ({
  usePoolListFilterChainId: () => ({ filterChainIds: [1] }),
}));
jest.mock('./hooks/usePoolListTabs', () => ({
  PoolTab: { addLiquidity: 0, myLiquidity: 1, myCreated: 2 },
  usePoolListTabs: () => ({ poolTab: 0, tabs: [] }),
}));
jest.mock('./MyCreated', () => () => null);
jest.mock('./MyLiquidity', () => () => null);
jest.mock('./pool-left.svg', () => ({ ReactComponent: () => null }));

// Keep network-backed list contents out of these state synchronization tests.
jest.mock('./AddLiquidity', () => ({
  __esModule: true,
  default: ({ operatePool, setOperatePool }: any) => (
    <div>
      {['pool-a', 'pool-b'].map((address) => (
        <div key={address}>
          <button onClick={() => setOperatePool({ address, chainId: 1 })}>
            {address} Add
          </button>
          <button
            onClick={() =>
              setOperatePool({
                address,
                chainId: 1,
                operate: OperateTab.Remove,
              })
            }
          >
            {address} Remove
          </button>
          {operatePool?.address === address && (
            <span>
              {address}{' '}
              {operatePool.operate === OperateTab.Remove
                ? 'Removing'
                : 'Adding'}
            </span>
          )}
        </div>
      ))}
    </div>
  ),
}));

jest.mock('../PoolOperate', () => {
  function Panel({ address, operate, onOperateChange, onClose }: any) {
    const { operateTab, handleChangeTab } = usePoolOperateTabs(
      operate,
      onOperateChange,
    );
    if (!address) return null;
    return (
      <div>
        <span>Panel {operateTab === OperateTab.Remove ? 'Remove' : 'Add'}</span>
        <button onClick={() => handleChangeTab(OperateTab.Add)}>
          Panel Add
        </button>
        <button onClick={() => handleChangeTab(OperateTab.Remove)}>
          Panel Remove
        </button>
        <button onClick={onClose}>Close panel</button>
      </div>
    );
  }
  return { __esModule: true, default: Panel, PoolOperate: Panel };
});

describe.each([false, true])(
  'pool operation synchronization (mobile=%s)',
  (isMobile) => {
    beforeEach(() => {
      (useWidgetDevice as jest.Mock).mockReturnValue({ isMobile });
    });

    it('updates the list label when changing the operation in the panel', () => {
      render(<PoolList />);
      fireEvent.click(screen.getByText('pool-a Add'));
      expect(screen.queryByText('pool-a Adding')).not.toBeNull();
      expect(
        screen.queryByText('Panel Add', { selector: 'span' }),
      ).not.toBeNull();

      fireEvent.click(screen.getByText('Panel Remove', { selector: 'button' }));
      expect(screen.queryByText('pool-a Removing')).not.toBeNull();
      expect(screen.queryByText('pool-a Adding')).toBeNull();
      expect(
        screen.queryByText('Panel Remove', { selector: 'span' }),
      ).not.toBeNull();

      fireEvent.click(screen.getByText('Panel Add', { selector: 'button' }));
      expect(screen.queryByText('pool-a Adding')).not.toBeNull();
      expect(screen.queryByText('pool-a Removing')).toBeNull();
    });

    it('selects the requested operation when switching pools or reopening the panel', () => {
      render(<PoolList />);
      fireEvent.click(screen.getByText('pool-a Add'));
      fireEvent.click(screen.getByText('Panel Remove', { selector: 'button' }));
      fireEvent.click(screen.getByText('pool-b Add'));
      expect(screen.queryByText('pool-b Adding')).not.toBeNull();
      expect(screen.queryByText('pool-a Removing')).toBeNull();
      expect(
        screen.queryByText('Panel Add', { selector: 'span' }),
      ).not.toBeNull();

      fireEvent.click(screen.getByText('pool-a Remove'));
      expect(
        screen.queryByText('Panel Remove', { selector: 'span' }),
      ).not.toBeNull();
      fireEvent.click(screen.getByText('Close panel'));
      fireEvent.click(screen.getByText('pool-a Add'));
      expect(
        screen.queryByText('Panel Add', { selector: 'span' }),
      ).not.toBeNull();
    });
  },
);

it('preserves local tab switching for panels without an operation callback', () => {
  const { result } = renderHook(() => usePoolOperateTabs());
  expect(result.current.operateTab).toBe(OperateTab.Add);
  act(() => result.current.handleChangeTab(OperateTab.Remove));
  expect(result.current.operateTab).toBe(OperateTab.Remove);
  act(() => result.current.handleChangeTab(OperateTab.Add));
  expect(result.current.operateTab).toBe(OperateTab.Add);
});

it('follows operation prop changes for standalone panels', () => {
  const { result, rerender } = renderHook(
    ({ operate }) => usePoolOperateTabs(operate),
    { initialProps: { operate: OperateTab.Add } },
  );
  rerender({ operate: OperateTab.Remove });
  expect(result.current.operateTab).toBe(OperateTab.Remove);
  rerender({ operate: OperateTab.Add });
  expect(result.current.operateTab).toBe(OperateTab.Add);
});
