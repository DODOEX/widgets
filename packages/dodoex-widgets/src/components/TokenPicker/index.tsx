import { Box, SearchInput } from '@dodoex/components';
import { CSSProperties, useCallback, useEffect, useRef, useState } from 'react';
import { FixedSizeList as List } from 'react-window';
import type { TokenInfo } from '../../hooks/Token';
import { useTokenList } from '../../hooks/Token';
import TokenItem from './TokenItem';
import { t } from '@lingui/macro';
import SelectChainItem from './SelectChainItem';
import { useSelectChainList } from '../../hooks/Token/useSelectChainList';

export interface TokenPickerProps {
  value?: TokenInfo | null;
  onChange: (token: TokenInfo, isOccupied: boolean) => void;
  /** token pair usage */
  occupiedAddrs?: string[];
  /** hide props */
  hiddenAddrs?: string[];
  /** only show props */
  showAddrs?: string[];
  visible?: boolean;
  side?: 'from' | 'to';
  defaultLoadBalance?: boolean;
}

export default function TokenPicker({
  value,
  onChange,
  occupiedAddrs,
  hiddenAddrs,
  showAddrs,
  visible,
  side,
  defaultLoadBalance,
}: TokenPickerProps) {
  const { chainList, selectChainId, setSelectChainId } =
    useSelectChainList(side);
  const { showTokenList, filter, setFilter, onSelectToken, popularTokenList } =
    useTokenList({
      value,
      onChange,
      occupiedAddrs,
      hiddenAddrs,
      showAddrs,
      side,
      chainId: selectChainId,
      visible,
      defaultLoadBalance,
    });
  const ref = useRef<HTMLDivElement>(null);
  const [fixedSizeHeight, setFixedSizeHeight] = useState(0);

  const prevVisible = useRef(visible);
  useEffect(() => {
    if (!prevVisible.current && visible && value?.chainId !== selectChainId) {
      setSelectChainId(value?.chainId);
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

  const TokenItemFixedSizeMemo = useCallback(
    ({ index, style }: { index: number; style: CSSProperties }) => {
      const token = showTokenList[index];
      if (!token) return null;
      return (
        <TokenItem
          key={token.address + token.chainId}
          token={token}
          disabled={!!value && value.address === token.address}
          style={style}
          onClick={() => onSelectToken(token)}
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
        placeholder={t`Enter the token symbol or address`}
      />
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          gap: 8,
          flexWrap: 'wrap',
          pt: 16,
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
      <Box
        sx={{
          pb: 16,
          flex: 1,
          minHeight: 64,
        }}
        ref={ref}
      >
        <List
          height={fixedSizeHeight}
          itemCount={showTokenList.length}
          itemSize={52}
          width={'100%'}
          className="token-list"
        >
          {TokenItemFixedSizeMemo as any}
        </List>
      </Box>
    </Box>
  );
}
