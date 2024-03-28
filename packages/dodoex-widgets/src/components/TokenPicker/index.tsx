import { Box, SearchInput } from '@dodoex/components';
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
import { t } from '@lingui/macro';
import SelectChainItem from './SelectChainItem';
import { useSelectChainList } from '../../hooks/Token/useSelectChainList';
import { ChainId } from '../../constants/chains';
import { useQuery } from '@tanstack/react-query';
import { isAddress } from '../../utils';
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
  const [fixedSizeHeight, setFixedSizeHeight] = useState(0);

  const prevVisible = useRef(visible);
  useEffect(() => {
    if (!prevVisible.current && visible && value) {
      if (Array.isArray(value)) {
        const [firstValue] = value;
        if (firstValue && firstValue.chainId !== selectChainId) {
          setSelectChainId(firstValue.chainId);
        }
      } else {
        setSelectChainId(value.chainId);
      }
    }
    prevVisible.current = visible;
  }, [value, visible]);

  useEffect(() => {
    if (visible) {
      if (ref.current) {
        // 16 is spacing
        setFixedSizeHeight(ref.current.offsetHeight - 16);
      }
    }
  }, [ref, visible, selectChainId]);

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
        px: 20,
        flex: 1,
        overflow: 'hidden',
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
      {chainId === undefined && chainList.length ? (
        <Box
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
      ) : (
        ''
      )}
      <Box
        sx={{
          pb: 16,
          flex: 1,
          minHeight: 64,
        }}
        ref={ref}
      >
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
        ) : (
          <Box
            sx={{
              height: fixedSizeHeight,
              overflowY: 'auto',
            }}
          >
            {searchOtherAddressQuery.isLoading ? (
              <TokenSearchLoadingSkelton />
            ) : (
              ''
            )}
            {searchOtherAddressQuery.data ? searchOtherAddressQuery.data : ''}
          </Box>
        )}
      </Box>
    </Box>
  );
}
