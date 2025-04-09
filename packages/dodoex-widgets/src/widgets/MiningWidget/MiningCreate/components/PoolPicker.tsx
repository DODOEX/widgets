import {
  alpha,
  Box,
  ButtonBase,
  HoverOpacity,
  Input,
  SearchInput,
  Skeleton,
  Tabs,
  TabsGroup,
  useTheme,
} from '@dodoex/components';
import { t } from '@lingui/macro';
import { useEffect, useMemo, useState } from 'react';
import Dialog from '../../../../components/Dialog';
import { TokenPickerDialog } from '../../../../components/Swap/components/TokenCard/TokenPickerDialog';
import TokenLogo from '../../../../components/TokenLogo';
import { useWalletInfo } from '../../../../hooks/ConnectWallet/useWalletInfo';
import { TokenInfo } from '../../../../hooks/Token';
import { useFetchFiatPriceBatch } from '../../../../hooks/useFetchFiatPriceBatch';
import { usePoolPairList } from '../hooks/usePoolPairList';
import { usePoolTokenBalance } from '../hooks/usePoolTokenBalance';
import { useTokenPair } from '../hooks/useTokenPair';
import { getOtherDexPool, getWrappedTokenAddress } from '../utils';
import PoolCard from './PoolCard';
import { ReactComponent as SelectTokenIcon } from './select-token.svg';
import { DexKey, useDexList } from '../hooks/useDexList';
import { EmptyDataIcon } from '../../../../components/List/EmptyList';

export interface PoolInfo {
  id: string;
  baseReserve: string;
  quoteReserve: string;
  baseToken: TokenInfo;
  quoteToken: TokenInfo;
  basePrice: number;
  quotePrice: number;
  creator?: string;
  createdAtTimestamp?: string;
}
interface Props {
  on: boolean;
  onClose: () => void;
  onConfirm: (pool: PoolInfo) => void;
  platform?: DexKey;
  handleGotoCreatePool?: () => void;
}

enum PoolPickerTabType {
  tokenPair = 1,
  address,
  myPools,
}

export default function PoolPicker({
  on,
  onClose,
  onConfirm,
  platform,
  handleGotoCreatePool,
}: Props) {
  const theme = useTheme();
  const { account, chainId } = useWalletInfo();

  const [side, setSide] = useState<'base' | 'quote' | undefined>();
  const [poolTab, setPoolTab] = useState(PoolPickerTabType.tokenPair);
  const [search, setSearch] = useState('');
  const [checkedId, setCheckedId] = useState('');

  const {
    token,
    occupiedAddrs,
    onTokenChange,
    baseToken,
    quoteToken,
    reset: tokenReset,
  } = useTokenPair({
    side,
  });

  const isThirdPlatform = useMemo(
    () => platform && platform !== 'dodo',
    [platform],
  );
  const tabList = useMemo(() => {
    if (!isThirdPlatform) {
      return [
        {
          key: PoolPickerTabType.myPools,
          value: t`My Pools`,
        },
        {
          key: PoolPickerTabType.tokenPair,
          value: t`Token Pair`,
        },
        {
          key: PoolPickerTabType.address,
          value: t`Address`,
        },
      ];
    }
    return [
      {
        key: PoolPickerTabType.tokenPair,
        value: t`Token Pair`,
      },
    ];
  }, [isThirdPlatform]);

  const baseAddress = useMemo(
    () => baseToken && baseToken.address.toLocaleLowerCase(),
    [baseToken],
  );
  const quoteAddress = useMemo(
    () => quoteToken && quoteToken.address.toLocaleLowerCase(),
    [quoteToken],
  );

  const skip = useMemo(
    () =>
      !on ||
      isThirdPlatform ||
      (poolTab === PoolPickerTabType.address && !search) ||
      (poolTab === PoolPickerTabType.tokenPair &&
        (!baseAddress || !quoteAddress)),
    [on, isThirdPlatform, poolTab, baseAddress, quoteAddress, search],
  );

  const { datas, loading } = usePoolPairList({
    baseAddress,
    quoteAddress,
    isMyPool: poolTab === PoolPickerTabType.myPools,
    skip,
    poolAddress: (search && search.toLocaleLowerCase()) || undefined,
  });
  const { dexListObj, GetGeneralUniInfo } = useDexList();

  const activePlatform = useMemo(() => {
    if (!platform) return null;
    return dexListObj[platform];
  }, [platform, dexListObj]);

  const platformPoolAddress = useMemo(() => {
    if (!isThirdPlatform || !activePlatform || !baseAddress || !quoteAddress)
      return '';
    const params: Parameters<typeof getOtherDexPool> = [
      chainId,
      activePlatform.name,
      getWrappedTokenAddress(baseAddress, chainId),
      getWrappedTokenAddress(quoteAddress, chainId),
      GetGeneralUniInfo,
    ];
    return getOtherDexPool(...params);
  }, [isThirdPlatform, activePlatform, baseAddress, quoteAddress, chainId]);

  const matchBaseToken = useMemo(
    () =>
      baseToken
        ? {
            ...baseToken,
            address: getWrappedTokenAddress(baseToken.address, chainId),
          }
        : undefined,
    [baseToken, chainId],
  );
  const matchQuoteToken = useMemo(
    () =>
      quoteToken
        ? {
            ...quoteToken,
            address: getWrappedTokenAddress(quoteToken.address, chainId),
          }
        : undefined,
    [chainId, quoteToken],
  );
  const { loading: reserveLoading, reserves } = usePoolTokenBalance(
    platformPoolAddress,
    matchBaseToken,
    matchQuoteToken,
  );

  const allTokens = useMemo(() => {
    const tokenIds: string[] = [];
    const tokens: TokenInfo[] = [];
    datas.forEach((item) => {
      if (!tokenIds.includes(item.baseToken.id)) {
        tokenIds.push(item.baseToken.id);
        tokens.push({
          address: item.baseToken.id,
          symbol: item.baseToken.symbol,
          decimals: item.baseToken.decimals,
          chainId,
          name: item.baseToken.name,
        });
      }
      if (!tokenIds.includes(item.quoteToken.id)) {
        tokenIds.push(item.quoteToken.id);
        tokens.push({
          address: item.quoteToken.id,
          symbol: item.quoteToken.symbol,
          decimals: item.quoteToken.decimals,
          chainId,
          name: item.quoteToken.name,
        });
      }
    });
    if (baseToken && !tokenIds.includes(baseToken.address)) {
      tokens.push({
        address: baseToken.address,
        symbol: baseToken.symbol,
        decimals: baseToken.decimals,
        chainId,
        name: baseToken.name,
      });
    }
    if (quoteToken && !tokenIds.includes(quoteToken.address)) {
      tokens.push({
        address: quoteToken.address,
        symbol: quoteToken.symbol,
        decimals: quoteToken.decimals,
        chainId,
        name: quoteToken.name,
      });
    }
    return tokens;
  }, [datas, baseToken, quoteToken, chainId]);

  const { data: fiatPriceMap } = useFetchFiatPriceBatch({ tokens: allTokens });

  const poolList = useMemo(() => {
    if (isThirdPlatform) {
      if (!platformPoolAddress || !baseToken || !quoteToken) return [];
      let baseReserve = '0';
      let quoteReserve = '0';
      if (reserves && reserves.length === 2) {
        const [token0Reserve, token1Reserve] = reserves;
        if (token0Reserve.lte(0) && token1Reserve.lte(0)) {
          return [];
        }
        baseReserve = token0Reserve.toString();
        quoteReserve = token1Reserve.toString();
      }
      return [
        {
          id: platformPoolAddress,
          baseReserve,
          quoteReserve,
          basePrice: fiatPriceMap?.get(baseToken.address),
          quotePrice: fiatPriceMap?.get(quoteToken.address),
          baseToken,
          quoteToken,
        },
      ] as PoolInfo[];
    }

    return datas.map((item) => ({
      ...item,
      baseToken: {
        ...item.baseToken,
        address: item.baseToken.id,
        chainId,
        name: item.baseToken.name,
      },
      quoteToken: {
        ...item.quoteToken,
        address: item.quoteToken.id,
        chainId,
        name: item.quoteToken.name,
      },
      basePrice: fiatPriceMap?.get(item.baseToken.id),
      quotePrice: fiatPriceMap?.get(item.quoteToken.id),
    })) as PoolInfo[];
  }, [
    baseToken,
    chainId,
    datas,
    fiatPriceMap,
    isThirdPlatform,
    platformPoolAddress,
    quoteToken,
    reserves,
  ]);

  useEffect(() => {
    if (on) {
      setCheckedId('');
      setSearch('');
      setPoolTab(
        isThirdPlatform
          ? PoolPickerTabType.tokenPair
          : PoolPickerTabType.myPools,
      );
    }
    tokenReset();
  }, [on, isThirdPlatform]);

  return (
    <Dialog
      open={on}
      onClose={onClose}
      title={t`Select Pool`}
      modal
      height="75vh"
    >
      <Tabs
        value={poolTab}
        onChange={(_, value) => {
          setSearch('');
          tokenReset();
          setPoolTab(value as PoolPickerTabType);
        }}
        sx={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <TabsGroup
          tabs={tabList}
          tabsListSx={{
            mx: 0,
            justifyContent: 'flex-start',
          }}
          tabSx={{
            pt: 0,
            px: 20,
          }}
        />
      </Tabs>

      <Box
        sx={{
          width: 420,
          px: 20,
        }}
      >
        {poolTab !== PoolPickerTabType.address &&
        (poolTab !== PoolPickerTabType.myPools ||
          poolList.length ||
          baseAddress ||
          quoteAddress) ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              my: 12,
            }}
          >
            <Input
              height={48}
              fullWidth
              readOnly
              value={baseToken ? ' ' : ''}
              onClick={() => {
                setSide('base');
              }}
              placeholder={t`SELECT TOKEN`}
              sx={{
                cursor: 'pointer',
                backgroundColor: 'transparent',
                '&:hover': {
                  '& > div': {
                    borderTopColor: alpha(theme.palette.text.primary, 0.5),
                  },
                },
              }}
              inputSx={{
                cursor: 'pointer',
              }}
              prefix={
                baseToken ? (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      fontWeight: 600,
                      lineHeight: 1,
                    }}
                  >
                    <TokenLogo
                      address={baseToken.address}
                      width={24}
                      height={24}
                      chainId={baseToken.chainId}
                      url={baseToken.logoURI}
                      noShowChain
                      marginRight={8}
                    />
                    {baseToken.symbol}
                  </Box>
                ) : (
                  ''
                )
              }
              suffix={
                <Box
                  sx={{
                    display: 'inline-block',
                    borderStyle: 'solid',
                    borderWidth: '6px 4px 0 4px',
                    borderColor: 'transparent',
                    borderTopColor: 'text.primary',
                  }}
                />
              }
            />
            <Input
              height={48}
              fullWidth
              readOnly
              value={quoteToken ? ' ' : ''}
              onClick={() => {
                setSide('quote');
              }}
              placeholder={t`SELECT TOKEN`}
              sx={{
                cursor: 'pointer',
                ml: 8,
                backgroundColor: 'transparent',
                '&:hover': {
                  '& > div': {
                    borderTopColor: alpha(theme.palette.text.primary, 0.5),
                  },
                },
              }}
              inputSx={{
                cursor: 'pointer',
              }}
              prefix={
                quoteToken ? (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      fontWeight: 600,
                      lineHeight: 1,
                    }}
                  >
                    <TokenLogo
                      address={quoteToken.address}
                      width={24}
                      height={24}
                      chainId={quoteToken.chainId}
                      url={quoteToken.logoURI}
                      noShowChain
                      marginRight={8}
                    />
                    {quoteToken.symbol}
                  </Box>
                ) : (
                  ''
                )
              }
              suffix={
                <Box
                  sx={{
                    display: 'inline-block',
                    borderStyle: 'solid',
                    borderWidth: '6px 4px 0 4px',
                    borderColor: 'transparent',
                    borderTopColor: 'text.primary',
                  }}
                />
              }
            />
          </Box>
        ) : poolTab === PoolPickerTabType.address ? (
          <Box
            sx={{
              mt: 12,
            }}
          >
            <SearchInput
              fullWidth
              placeholder={t`Search by address`}
              value={search}
              onChange={(evt) => {
                const v = evt.target.value;
                setSearch(v);
              }}
              clearValue={() => {
                setSearch('');
              }}
            />
          </Box>
        ) : (
          ''
        )}

        {poolTab === PoolPickerTabType.address && !search ? (
          ''
        ) : (loading && !skip) || reserveLoading ? (
          <Skeleton
            variant="rounded"
            height={137}
            sx={{
              my: 12,
              borderRadius: 8,
            }}
          />
        ) : poolTab === PoolPickerTabType.tokenPair &&
          (!baseAddress || !quoteAddress) ? (
          <Box
            sx={{
              textAlign: 'center',
              pt: 80,
            }}
          >
            <Box component={SelectTokenIcon} />
            <Box
              sx={{
                typography: 'body2',
                mt: 20,
                color: 'text.secondary',
                whiteSpace: 'pre-wrap',
              }}
            >
              {t`Select pool by tokens`}
            </Box>
          </Box>
        ) : poolList.length ? (
          poolList.map((item) => (
            <PoolCard
              key={item.id}
              checked={checkedId === item.id}
              activePlatform={activePlatform}
              loading={!fiatPriceMap?.size}
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...item}
              onClick={() => {
                setCheckedId(checkedId === item.id ? '' : item.id);
                onConfirm(item);
                onClose();
              }}
            />
          ))
        ) : (
          <Box
            sx={{
              textAlign: 'center',
              pt: 80,
            }}
          >
            <EmptyDataIcon hasSearch />
            <Box
              sx={{
                typography: 'body2',
                mt: 20,
                color: 'text.secondary',
              }}
            >
              {t`No matching pool found`}
            </Box>
            {isThirdPlatform ? (
              ''
            ) : (
              <HoverOpacity weak color={theme.palette.secondary.main}>
                <Box
                  component={ButtonBase}
                  onClick={() => handleGotoCreatePool?.()}
                  sx={{
                    typography: 'h6',
                    mt: 8,
                    fontWeight: 600,
                  }}
                >
                  {t`Create One`}&nbsp;&gt;
                </Box>
              </HoverOpacity>
            )}
          </Box>
        )}
      </Box>

      <TokenPickerDialog
        value={token}
        open={!!side}
        chainId={chainId}
        occupiedAddrs={occupiedAddrs}
        occupiedChainId={token?.chainId}
        onClose={() => {
          setSide(undefined);
        }}
        onTokenChange={(selectedToken, occupied) => {
          if (Array.isArray(selectedToken)) {
            return;
          }
          onTokenChange(selectedToken, occupied);
          setSide(undefined);
        }}
        modal
      />
    </Dialog>
  );
}
