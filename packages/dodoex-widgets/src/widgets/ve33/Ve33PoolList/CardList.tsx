import {
  Box,
  BoxProps,
  Button,
  LoadingSkeleton,
  useTheme,
} from '@dodoex/components';
import { t } from '@lingui/macro';
import {
  formatApy,
  formatShortNumber,
  formatTokenAmountNumber,
} from '../../../utils';
import React from 'react';
import { ChainId } from '@dodoex/api';
import { OperateTypeE, Ve33PoolInfoI, Ve33PoolOperateProps } from '../types';
import PoolTokenInfo from '../components/PoolTokenInfo';
import TokenItem from '../../../components/Token/TokenItem';

export interface CardListProps {
  chainId: ChainId;
  poolList: Ve33PoolInfoI[];
  usdValueChecked: boolean;
  setOperatePool: (operate: Ve33PoolOperateProps | null) => void;
  onClickPoolListRow: (id: string, chainId: ChainId) => void;
}

export const CardList = ({ poolList, ...props }: CardListProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      {poolList?.map((item) => {
        return <CardItem key={item.id + item.chainId} item={item} {...props} />;
      })}
    </Box>
  );
};

export function CardItem({
  item,
  chainId,
  usdValueChecked,
  setOperatePool,
  onClickPoolListRow,
}: Partial<
  Omit<CardListProps, 'poolList'> & {
    item?: Ve33PoolInfoI;
  }
>) {
  const theme = useTheme();
  const { baseToken, quoteToken } = item ?? {};
  const aprText = item?.apr ? formatApy(item.apr.fees) : undefined;

  return (
    <Box
      sx={{
        position: 'relative',
        p: theme.spacing(20, 20, 12),
        borderRadius: 24,
        backgroundColor: theme.palette.background.paper,
        cursor: item ? 'pointer' : undefined,
      }}
      onClick={
        item && onClickPoolListRow
          ? () => onClickPoolListRow(item.id, item?.chainId)
          : undefined
      }
    >
      <PoolTokenInfo item={item} />

      {usdValueChecked ? (
        <Box
          sx={{
            mt: 40,
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            gap: 20,
          }}
        >
          <InfoItem
            loading={!item}
            label={t`APR`}
            usdValueChecked
            valueColor="success.main"
          >
            {aprText}
          </InfoItem>
          <Split />
          <InfoItem loading={!item} label={t`TVL`} usdValueChecked>
            {`$${formatShortNumber(item?.totalValueLockedUSD)}`}
          </InfoItem>
          <InfoItem loading={!item} label={t`Volume`} usdValueChecked>
            {`$${formatShortNumber(item?.volumeUSD)}`}
          </InfoItem>
          <Split />
          <InfoItem loading={!item} label={t`Fees`} usdValueChecked>
            {`$${formatShortNumber(item?.feesUSD)}`}
          </InfoItem>
        </Box>
      ) : (
        <>
          <InfoItem
            label={t`APR`}
            usdValueChecked
            valueColor="success.main"
            loading={!item}
            sx={{
              mt: 40,
            }}
          >
            {aprText}
          </InfoItem>
          <Box
            sx={{
              mt: 16,
              pt: 16,
              borderTop: `solid 1px ${theme.palette.border.main}`,
              display: 'grid',
              gap: 8,
            }}
          >
            <InfoItem label={t`TVL`} loading={!item}>
              <TokenItem
                chainId={chainId!}
                address={baseToken?.address ?? ''}
                showName={formatTokenAmountNumber({
                  input: item?.totalValueLockedToken0,
                  decimals: baseToken?.decimals,
                })}
                size={16}
                offset={4}
              />
              <TokenItem
                chainId={chainId!}
                address={quoteToken?.address ?? ''}
                showName={formatTokenAmountNumber({
                  input: item?.totalValueLockedToken1,
                  decimals: quoteToken?.decimals,
                })}
                size={16}
                offset={4}
              />
            </InfoItem>
            <InfoItem label={t`Volume`} loading={!item}>
              <TokenItem
                chainId={chainId!}
                address={baseToken?.address ?? ''}
                showName={formatTokenAmountNumber({
                  input: item?.volumeToken0,
                  decimals: baseToken?.decimals,
                })}
                size={16}
                offset={4}
              />
              <TokenItem
                chainId={chainId!}
                address={quoteToken?.address ?? ''}
                showName={formatTokenAmountNumber({
                  input: item?.volumeToken1,
                  decimals: quoteToken?.decimals,
                })}
                size={16}
                offset={4}
              />
            </InfoItem>
            <InfoItem label={t`Fees`} loading={!item}>
              <TokenItem
                chainId={chainId!}
                address={baseToken?.address ?? ''}
                showName={formatTokenAmountNumber({
                  input: item?.feesToken0,
                  decimals: baseToken?.decimals,
                })}
                size={16}
                offset={4}
              />
              <TokenItem
                chainId={chainId!}
                address={quoteToken?.address ?? ''}
                showName={formatTokenAmountNumber({
                  input: item?.feesToken1,
                  decimals: quoteToken?.decimals,
                })}
                size={16}
                offset={4}
              />
            </InfoItem>
          </Box>
        </>
      )}

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          mt: 20,
        }}
      >
        <Button
          sx={{
            p: theme.spacing(0, 16),
            height: 32,
            typography: 'body2',
            fontWeight: 600,
            borderRadius: 8,
            flex: 1,
          }}
          disabled={!item}
          onClick={(evt) => {
            evt.stopPropagation();
            setOperatePool?.({
              chainId: chainId!,
              poolInfo: item!,
              operateType: OperateTypeE.Add,
            });
          }}
        >
          {t`Add`}
        </Button>
      </Box>
    </Box>
  );
}

function InfoItem({
  label,
  valueColor,
  children,
  loading,
  usdValueChecked,
  sx,
}: React.PropsWithChildren<{
  label: React.ReactNode;
  valueColor?: string;
  loading?: boolean;
  usdValueChecked?: boolean;
  sx?: BoxProps['sx'];
}>) {
  return (
    <Box
      sx={{
        ...(!usdValueChecked && {
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: 'row-reverse',
          alignItems: 'center',
        }),
        ...sx,
      }}
    >
      <LoadingSkeleton
        loading={loading}
        loadingProps={{ width: 100 }}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          color: valueColor,
          ...(!usdValueChecked
            ? {
                typography: 'body2',
                fontWeight: 600,
                lineHeight: 1,
              }
            : {
                typography: 'h5',
              }),
        }}
      >
        {children}
      </LoadingSkeleton>
      <Box
        sx={{
          typography: 'h6',
          color: 'text.secondary',
        }}
      >
        {label}
      </Box>
    </Box>
  );
}

function Split() {
  return (
    <Box
      sx={{
        height: 24,
        width: '1px',
        backgroundColor: 'border.main',
      }}
    />
  );
}
