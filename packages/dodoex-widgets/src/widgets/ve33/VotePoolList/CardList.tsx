import { Box, LoadingSkeleton, useTheme } from '@dodoex/components';
import { t } from '@lingui/macro';
import { formatShortNumber } from '../../../utils';
import { VotePoolInfoI } from '../types';
import {
  FeesWidgets,
  IncentivesWidgets,
  TotalVoteWidgets,
  VAPRWidgets,
} from './widgets';
import PoolTokenInfo from '../components/PoolTokenInfo';
import React from 'react';
import { Done } from '@dodoex/icons';

export interface CardListProps {
  poolList: VotePoolInfoI[];
  onSelectPool: (item: VotePoolInfoI) => void;
  selectedPoolList: string[];
  onAddIncentives: (item: VotePoolInfoI) => void;
}

export const CardList = ({ poolList, ...props }: CardListProps) => {
  return (
    <>
      {poolList.map((item) => {
        return <CardItem key={item.id} item={item} {...props} />;
      })}
    </>
  );
};

export function CardItem({
  item,
  onSelectPool,
  selectedPoolList,
  onAddIncentives,
}: Partial<CardListProps> & {
  item?: VotePoolInfoI;
}) {
  const theme = useTheme();
  const checked = !!item && selectedPoolList?.includes(item?.id);

  return (
    <Box
      sx={{
        position: 'relative',
        p: 20,
        borderRadius: 24,
        backgroundColor: 'background.paper',
        ...(checked && {
          border: `solid 2px ${theme.palette.secondary.main}`,
        }),
      }}
      onClick={item ? () => onSelectPool?.(item) : undefined}
    >
      {!!item && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            px: 20,
            py: 8,
            borderRadius: theme.spacing(0, 24, 0, 12),
            backgroundColor: checked
              ? theme.palette.secondary.main
              : theme.palette.background.paperDarkContrast,
            color: checked
              ? theme.palette.secondary.contrastText
              : theme.palette.text.secondary,
          }}
        >
          <Box
            component={Done}
            sx={{
              width: 18,
              height: 18,
            }}
          />
        </Box>
      )}
      <PoolTokenInfo item={item} />
      <LoadingSkeleton
        loading={!item}
        loadingProps={{
          width: 100,
        }}
        sx={{
          mt: 40,
        }}
      >
        <VAPRWidgets item={item!} />
      </LoadingSkeleton>
      <Box sx={{ typography: 'h6', color: 'text.secondary' }}>{t`APR`}</Box>

      <Box
        sx={{
          display: 'grid',
          gap: 8,
          mt: 16,
          pt: 16,
          borderTop: `solid 1px ${theme.palette.border.main}`,
        }}
      >
        <ItemInfo label={t`TVL`} loading={!item}>
          ${formatShortNumber(item?.tvl)}
        </ItemInfo>
        <ItemInfo label={t`Fees`} loading={!item}>
          <FeesWidgets item={item!} showLogo />
        </ItemInfo>
        <ItemInfo label={t`Incentives`} loading={!item}>
          <IncentivesWidgets
            item={item!}
            showLogo
            singleLine
            onAddIncentives={onAddIncentives}
          />
        </ItemInfo>
        <ItemInfo label={t`Total Vote`} loading={!item}>
          <TotalVoteWidgets item={item!} showLogo singleLine />
        </ItemInfo>
      </Box>
    </Box>
  );
}

function ItemInfo({
  label,
  loading,
  children,
}: React.PropsWithChildren<{
  loading?: boolean;
  label: React.ReactNode;
}>) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Box sx={{ typography: 'h6', color: 'text.secondary' }}>{label}</Box>
      <LoadingSkeleton
        loading={loading}
        loadingProps={{
          width: 100,
        }}
        sx={{
          typography: 'body2',
          fontWeight: 600,
        }}
      >
        {children}
      </LoadingSkeleton>
    </Box>
  );
}
