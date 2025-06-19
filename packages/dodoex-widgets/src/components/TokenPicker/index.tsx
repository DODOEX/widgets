import { ChainId } from '@dodoex/api';
import { Box, BoxProps, SearchInput } from '@dodoex/components';
import { t } from '@lingui/macro';
import { useQuery } from '@tanstack/react-query';
import { CSSProperties, useCallback, useEffect, useRef, useState } from 'react';
import { FixedSizeList as List } from 'react-window';
import type { TokenInfo } from '../../hooks/Token';
import { useTokenList } from '../../hooks/Token';
import { useSelectChainList } from '../../hooks/Token/useSelectChainList';
import { isAddress } from '../../utils';
import { EmptyDataIcon, EmptyList } from '../List/EmptyList';
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
  });

  const ref = useRef<HTMLDivElement>(null);
  const chainListRef = useRef<HTMLDivElement>(null);
  const [fixedSizeHeight, setFixedSizeHeight] = useState(329);

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
    if (visible && ref.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (entry.target === ref.current && chainListRef.current) {
            const height =
              entry.contentRect.height -
              48 -
              chainListRef.current.offsetHeight -
              16;
            if (height > 0) {
              setFixedSizeHeight(height);
            }
          }
        }
      });

      resizeObserver.observe(ref.current);

      return () => {
        resizeObserver.disconnect();
      };
    }
  }, [visible, selectChainId]);

  const searchOtherAddressQuery = useQuery({
    queryKey: ['token-picker-searchOtherAddress', filter],
    queryFn: () => {
      if (!searchOtherAddress) return null;
      return searchOtherAddress(filter);
    },
    enabled: isAddress(filter) && !!searchOtherAddress,
  });

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
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        px: 16,
        flexGrow: 1,
        overflow: 'hidden',
        ...sx,
      }}
      ref={ref}
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
          pb: 16,
          flexGrow: 1,
        }}
      >
        {showTokenList.length ? (
          <List
            height={fixedSizeHeight}
            itemCount={showTokenList.length}
            itemSize={56}
            width={'100%'}
            className="token-list"
          >
            {TokenItemFixedSizeMemo as any}
          </List>
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
