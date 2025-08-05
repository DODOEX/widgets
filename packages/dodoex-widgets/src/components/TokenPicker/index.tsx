import { ChainId } from '@dodoex/api';
import { Box, BoxProps, SearchInput } from '@dodoex/components';
import { t } from '@lingui/macro';
import { useQuery } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FixedSizeList as List } from 'react-window';
import type { TokenInfo } from '../../hooks/Token';
import { useTokenList } from '../../hooks/Token';
import { useSelectChainList } from '../../hooks/Token/useSelectChainList';
import { isAddress } from '../../utils';
import { EmptyList } from '../List/EmptyList';
import SelectChainItem from './SelectChainItem';
import TokenItem from './TokenItem';
import { TokenSearchLoadingSkelton } from './TokenSearchLoadingSkelton';

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
  filterBySupportTargetChain?: boolean;
}

function Row({
  data,
  index,
  style,
}: {
  data: {
    onSelectToken: (token: TokenInfo) => void;
    tokenList: TokenInfo[];
    getIsDisabled: (token: TokenInfo) => boolean;
    getBalance: (token: TokenInfo) => BigNumber | undefined;
  };
  index: number;
  // isScrolling: boolean;
  style: any;
}) {
  const token = data.tokenList[index];
  const disabled = data.getIsDisabled(token);
  const balance = data.getBalance(token);
  return (
    <TokenItem
      key={token.address + token.chainId}
      token={token}
      disabled={disabled}
      style={style}
      onSelect={data.onSelectToken}
      balance={balance}
    />
  );
}

function VirtualizedList({
  fixedSizeHeight,
  tokenList,
  onSelectToken,
  getIsDisabled,
  getBalance,
}: {
  fixedSizeHeight: number;
  onSelectToken: (token: TokenInfo) => void;
  tokenList: TokenInfo[];
  getIsDisabled: (token: TokenInfo) => boolean;
  getBalance: (token: TokenInfo) => BigNumber | undefined;
}) {
  const itemData = useMemo<Parameters<typeof Row>[0]['data']>(() => {
    return {
      onSelectToken,
      tokenList,
      getIsDisabled,
      getBalance,
    };
  }, [onSelectToken, tokenList, getIsDisabled, getBalance]);

  return (
    <List
      height={fixedSizeHeight}
      width={'100%'}
      itemSize={56}
      itemData={itemData}
      itemCount={tokenList.length}
    >
      {Row}
    </List>
  );
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
  filterBySupportTargetChain,
}: TokenPickerProps) {
  const { chainList, selectChainId, setSelectChainId } =
    useSelectChainList(value);

  const {
    showTokenList,
    filter,
    setFilter,
    onSelectToken,
    popularTokenList,
    tokenInfoMap,
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
    filterBySupportTargetChain,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const chainListRef = useRef<HTMLDivElement>(null);
  const [fixedSizeHeight, setFixedSizeHeight] = useState(329);

  useEffect(() => {
    if (containerRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (entry.target === containerRef.current) {
            const height = entry.contentRect.height - 1;
            if (height > 0) {
              setFixedSizeHeight(height);
            }
          }
        }
      });

      resizeObserver.observe(containerRef.current);

      return () => {
        resizeObserver.disconnect();
      };
    }
  }, []);

  const searchOtherAddressQuery = useQuery({
    queryKey: ['token-picker-searchOtherAddress', filter],
    queryFn: () => {
      if (!searchOtherAddress) return null;
      return searchOtherAddress(filter);
    },
    enabled: isAddress(filter) && !!searchOtherAddress,
  });

  const getIsDisabled = useCallback(
    (token: TokenInfo) => {
      if (value) {
        return Array.isArray(value)
          ? value.some(
              (valueItem) =>
                valueItem.address === token.address &&
                valueItem.chainId === token.chainId,
            )
          : value.address === token.address && value.chainId === token.chainId;
      }

      return false;
    },
    [value],
  );

  const getBalance = useCallback(
    (token: TokenInfo) => {
      return tokenInfoMap.get(`${token.chainId}-${token.address}`)?.balance;
    },
    [tokenInfoMap],
  );

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        px: 16,
        flexGrow: 1,
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
        sx={{
          mb: 16,
        }}
      />

      {chainId === undefined && chainList.length > 0 && (
        <Box
          ref={chainListRef}
          sx={{
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
      )}

      <Box
        sx={{
          pb: 15,
          flexGrow: 1,
        }}
        ref={containerRef}
      >
        {showTokenList.length ? (
          <VirtualizedList
            fixedSizeHeight={fixedSizeHeight}
            tokenList={showTokenList}
            onSelectToken={onSelectToken}
            getIsDisabled={getIsDisabled}
            getBalance={getBalance}
          />
        ) : (
          <Box
            sx={{
              height: fixedSizeHeight,
              overflowY: 'auto',
            }}
          >
            {searchOtherAddressQuery.isLoading ? (
              <TokenSearchLoadingSkelton />
            ) : searchOtherAddressQuery.data ? (
              searchOtherAddressQuery.data
            ) : (
              <EmptyList
                hasSearch
                sx={{
                  mt: 80,
                }}
              />
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}
