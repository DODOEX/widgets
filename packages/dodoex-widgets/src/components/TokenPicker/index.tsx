import {
  Box,
  BoxProps,
  Button,
  SearchInput,
  TabPanel,
  Tabs,
  TabsButtonGroup,
  TabsGroup,
} from '@dodoex/components';
import React, {
  CSSProperties,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { FixedSizeList as List } from 'react-window';
import type { TokenInfo } from '../../hooks/Token';
import { useTokenList } from '../../hooks/Token';
import TokenItem from './TokenItem';
import { t, Trans } from '@lingui/macro';
import SelectChainItem from './SelectChainItem';
import { useSelectChainList } from '../../hooks/Token/useSelectChainList';
import { ChainId } from '@dodoex/api';
import { useQuery } from '@tanstack/react-query';
import { isAddress } from '../../utils';
import { TokenSearchLoadingSkelton } from './TokenSearchLoadingSkelton';
import { tokenApi } from '../../constants/api';
import { useWalletInfo } from '../../hooks/ConnectWallet/useWalletInfo';
import TokenLogo from '../TokenLogo';
import TokenDetailInfo from './TokenDetailInfo';
import { EmptyList } from '../List/EmptyList';
import ImportToken from './ImportToken';
import { deleteCustomTokenList } from '../../hooks/useTokenState';

export interface TokenPickerProps {
  chainId?: ChainId;
  value?: TokenInfo | null | Array<TokenInfo>;
  onChange: (token: TokenInfo | Array<TokenInfo>, isOccupied: boolean) => void;
  /** token pair usage */
  occupiedAddrs?: string[];
  /** token pair usage */
  occupiedChainId?: ChainId;
  /** hide props */
  hiddenAddrs?: string[];
  /** only show props */
  showAddrs?: string[];
  visible?: boolean;
  side?: 'from' | 'to';
  defaultLoadBalance?: boolean;
  multiple?: boolean;
  searchPlaceholder?: string;
  /** like search pool address */
  searchOtherAddress?: (address: string) => Promise<JSX.Element | null>;
  sx?: BoxProps['sx'];
}

enum ListType {
  All = 1,
  MyAdded,
}

export default function TokenPicker({
  chainId,
  value,
  onChange,
  occupiedAddrs,
  occupiedChainId,
  hiddenAddrs,
  showAddrs,
  visible,
  side,
  defaultLoadBalance,
  multiple,
  searchPlaceholder,
  searchOtherAddress,
  sx,
}: TokenPickerProps) {
  const { chainList, selectChainId, setSelectChainId } =
    useSelectChainList(side);
  const { account } = useWalletInfo();
  const {
    showTokenList,
    filter,
    setFilter,
    onSelectToken,
    popularTokenList,
    tokenInfoMap,
    customTokenList,
  } = useTokenList({
    value,
    onChange,
    occupiedAddrs,
    occupiedChainId,
    hiddenAddrs,
    showAddrs,
    side,
    chainId: chainId ?? selectChainId,
    visible,
    defaultLoadBalance,
    multiple,
  });

  const ref = useRef<HTMLDivElement>(null);
  const [fixedSizeHeight, setFixedSizeHeight] = useState(0);

  const [listType, setListType] = useState<ListType>(ListType.All);
  const tabList = [
    { key: ListType.All, value: t`ALL` },
    { key: ListType.MyAdded, value: t`My Added` },
  ];

  useEffect(() => {
    if (visible && value) {
      if (Array.isArray(value)) {
        const [firstValue] = value;
        if (firstValue && firstValue.chainId !== selectChainId) {
          setSelectChainId(firstValue.chainId);
        }
      } else {
        setSelectChainId(value.chainId);
      }
    }
  }, [value, visible]);

  useEffect(() => {
    let time = 0;
    if (visible) {
      time = window.setTimeout(() => {
        if (ref.current) {
          // 16 is spacing
          setFixedSizeHeight(ref.current.offsetHeight - 16);
        }
      }, 300);
    }
    return () => {
      clearTimeout(time);
    };
  }, [ref, visible, selectChainId]);

  const isFilterAddress = isAddress(filter);
  const searchOtherAddressQuery = useQuery({
    queryKey: ['token-picker-searchOtherAddress', filter],
    queryFn: () => {
      if (!searchOtherAddress) return null;
      return searchOtherAddress(filter);
    },
    enabled: isFilterAddress && !!searchOtherAddress,
  });
  const isEnableCustom =
    isFilterAddress &&
    !!selectChainId &&
    !searchOtherAddress &&
    !showTokenList.length;
  const fetchCustomTokenQueryOptions = tokenApi.getFetchTokenQuery(
    chainId ?? selectChainId,
    isEnableCustom ? filter : undefined,
    account ?? filter,
  );
  const fetchCustomTokenQuery = useQuery(fetchCustomTokenQueryOptions);
  const customToken = fetchCustomTokenQuery.data;

  const TokenItemFixedSizeMemo = useCallback(
    ({ index, style }: { index: number; style: CSSProperties }) => {
      const token = showTokenList[index];
      if (!token) return null;
      let disabled = false;
      if (value) {
        disabled = Array.isArray(value)
          ? value.some(
              (valueItem) =>
                valueItem.address === token.address &&
                valueItem.chainId === token.chainId,
            )
          : value.address === token.address && value.chainId === token.chainId;
      }
      return (
        <TokenItem
          key={token.address + token.chainId}
          token={token}
          disabled={disabled}
          style={style}
          onClick={() => onSelectToken(token)}
          balance={
            tokenInfoMap.get(`${token.chainId}-${token.address}`)?.balance
          }
        />
      );
    },
    [showTokenList, popularTokenList, value],
  );

  return (
    <Tabs
      value={listType}
      onChange={(_, v) => setListType(v as ListType)}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        px: 20,
        flex: 1,
        overflow: 'hidden',
        ...sx,
      }}
    >
      <SearchInput
        fullWidth
        height={48}
        value={filter}
        onChange={(evt: any) => setFilter(evt.target.value)}
        clearValue={() => setFilter('')}
        placeholder={searchPlaceholder ?? t`Enter the token symbol or address`}
      />
      {chainId === undefined && chainList.length ? (
        <Box
          sx={{
            mt: 16,
            position: 'relative',
            display: 'flex',
            gap: 8,
            flexWrap: 'wrap',
            pb: 32,
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: 16,
              left: 0,
              right: 0,
              height: '1px',
              backgroundColor: 'border.main',
            },
          }}
        >
          {chainList.map((chain) => (
            <SelectChainItem
              key={chain.chainId}
              chain={chain}
              active={chain.chainId === selectChainId}
              onClick={() => {
                setSelectChainId(chain.chainId);
              }}
            />
          ))}
        </Box>
      ) : !filter ? (
        <TabsGroup
          tabs={tabList}
          tabsListSx={{
            ml: -20,
            mb: 16,
            width: 'calc(100% + 40px)',
          }}
        />
      ) : (
        <Box sx={{ height: 20 }} />
      )}
      <Box
        sx={{
          pb: 16,
          flex: 1,
          minHeight: 64,
        }}
        ref={ref}
      >
        <TabPanel value={ListType.All}>
          {showTokenList.length ? (
            <List
              height={fixedSizeHeight}
              itemCount={showTokenList.length}
              itemSize={52}
              width={'100%'}
              className="token-list"
            >
              {TokenItemFixedSizeMemo as any}
            </List>
          ) : null}
        </TabPanel>
        <TabPanel value={ListType.MyAdded}>
          {customTokenList.map((token) => {
            let disabled = false;
            if (value) {
              disabled = Array.isArray(value)
                ? value.some(
                    (valueItem) =>
                      valueItem.address === token.address &&
                      valueItem.chainId === token.chainId,
                  )
                : value.address === token.address &&
                  value.chainId === token.chainId;
            }
            return (
              <TokenItem
                key={token.address + token.chainId}
                token={token}
                disabled={disabled}
                onClick={() => onSelectToken(token)}
                balance={
                  tokenInfoMap.get(`${token.chainId}-${token.address}`)?.balance
                }
                onDelete={() => deleteCustomTokenList(token)}
              />
            );
          })}
        </TabPanel>
        {searchOtherAddressQuery.isLoading ||
        fetchCustomTokenQuery.isLoading ||
        searchOtherAddressQuery.data ||
        customToken ? (
          <Box
            sx={{
              height: fixedSizeHeight,
              overflowY: 'auto',
            }}
          >
            {searchOtherAddressQuery.isLoading ||
            fetchCustomTokenQuery.isLoading ? (
              <TokenSearchLoadingSkelton />
            ) : (
              ''
            )}
            {searchOtherAddressQuery.data ? searchOtherAddressQuery.data : ''}
            {!!customToken && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  typography: 'body2',
                  px: 6,
                  py: 5,
                  borderRadius: 8,
                  cursor: 'pointer',
                  opacity: 1,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    textAlign: 'left',
                    opacity: 0.5,
                  }}
                >
                  <TokenLogo token={customToken} />
                  <Box>
                    <Box
                      sx={{
                        fontWeight: 600,
                      }}
                    >
                      {customToken.symbol}
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        typography: 'h6',
                        color: 'text.secondary',
                      }}
                    >
                      {customToken.name}
                      <TokenDetailInfo token={customToken} isCustom />
                    </Box>
                  </Box>
                </Box>
                <ImportToken
                  token={customToken}
                  onImport={() => {
                    onSelectToken(customToken!);
                  }}
                />
              </Box>
            )}
          </Box>
        ) : !(listType === ListType.MyAdded
            ? customTokenList.length
            : showTokenList.length) ? (
          <EmptyList
            hasSearch={!!filter}
            sx={{
              height: '100%',
            }}
          />
        ) : null}
      </Box>
    </Tabs>
  );
}
