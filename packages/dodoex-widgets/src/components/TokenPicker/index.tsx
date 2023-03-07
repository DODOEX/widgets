import { Box, SearchInput } from '@dodoex/components';
import { useWeb3React } from '@web3-react/core';
import { CSSProperties, useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { VariableSizeList as List } from 'react-window';
import { RootState } from '../../store/reducers';
import type { TokenInfo, TokenList } from '../../hooks/Token';
import { useTokenList } from '../../hooks/Token';
import { getPopularTokenList } from '../../store/selectors/token';
import PopularToken from './PopularToken';
import TokenItem from './TokenItem';
import { t } from '@lingui/macro';
import { useCurrentChainId } from '../../hooks/ConnectWallet';

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
}

export default function TokenPicker({
  value,
  onChange,
  occupiedAddrs,
  hiddenAddrs,
  showAddrs,
  visible,
}: TokenPickerProps) {
  const chainId = useCurrentChainId();
  const popularTokenList = useSelector((state: RootState) =>
    getPopularTokenList(chainId, state),
  );
  const { showTokenList, filter, setFilter, onSelectToken } = useTokenList({
    value,
    onChange,
    occupiedAddrs,
    hiddenAddrs,
    showAddrs,
  });
  const ref = useRef<HTMLDivElement>(null);
  const popularRef = useRef<HTMLDivElement>(null);
  const [fixedSizeHeight, setFixedSizeHeight] = useState(0);

  useEffect(() => {
    if (visible) {
      if (ref.current) {
        // 34 is spacing
        setFixedSizeHeight(ref.current.offsetHeight - 34);
      }
    }
  }, [ref, visible]);

  const TokenItemFixedSizeMemo = useCallback(
    ({
      key,
      index,
      style,
    }: {
      key: string;
      index: number;
      style: CSSProperties;
    }) => {
      const hasPopularToken = !!popularTokenList?.length;
      if (index === 0 && hasPopularToken) {
        return (
          <Box
            key={key}
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
            ref={popularRef}
            style={{
              ...style,
              // avoid occlusion
              visibility: !style.height ? 'hidden' : 'visible',
              height: !style.height ? 'auto' : style.height,
            }}
          >
            {popularTokenList.map((token) => (
              <PopularToken
                key={token.address}
                token={token}
                disabled={value?.address === token.address}
                onClick={() => onSelectToken(token)}
              />
            ))}
          </Box>
        );
      }
      const token = showTokenList[hasPopularToken ? index - 1 : index];
      return (
        <TokenItem
          key={key}
          token={token}
          disabled={!!value && value.address === token.address}
          style={style}
          onClick={() => onSelectToken(token)}
        />
      );
    },
    [showTokenList, popularTokenList, popularRef, value],
  );

  const getItemSize = useCallback(
    (index: number) => {
      const itemHeight = 52;
      if (index === 0 && popularTokenList?.length) {
        const popularHeight = popularRef.current?.offsetHeight || 0;
        return popularHeight <= itemHeight ? 0 : popularHeight;
      }

      return itemHeight;
    },
    [popularRef, popularTokenList],
  );

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        px: 20,
        flex: 1,
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
          mt: 16,
          pb: 16,
          flex: 1,
          minHeight: 64,
        }}
        ref={ref}
      >
        <List
          height={fixedSizeHeight}
          itemCount={showTokenList.length + (popularTokenList?.length ? 1 : 0)}
          itemSize={getItemSize}
          width={'100%'}
          className="token-list"
        >
          {TokenItemFixedSizeMemo as any}
        </List>
      </Box>
    </Box>
  );
}
