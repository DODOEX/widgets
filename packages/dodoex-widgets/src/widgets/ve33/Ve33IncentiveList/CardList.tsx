import { Box, Button, LoadingSkeleton, useTheme } from '@dodoex/components';
import { t } from '@lingui/macro';
import { formatApy, formatReadableNumber } from '../../../utils';
import { Ve33PoolInfoI } from '../types';
import PoolTokenInfo from '../components/PoolTokenInfo';
import React from 'react';

export interface CardListProps {
  poolList: Ve33PoolInfoI[];
  onAdd: (pool: Ve33PoolInfoI) => void;
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
  onAdd,
}: {
  item?: Ve33PoolInfoI;
  onAdd?: (pool: Ve33PoolInfoI) => void;
}) {
  const theme = useTheme();
  const aprText = item?.apr ? formatApy(item.apr.fees) : undefined;

  return (
    <Box
      sx={{
        position: 'relative',
        p: 20,
        borderRadius: 24,
        backgroundColor: 'background.paper',
      }}
    >
      <PoolTokenInfo item={item} />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          gap: 20,
          mt: 40,
        }}
      >
        <Box>
          <LoadingSkeleton
            loading={!item}
            loadingProps={{
              width: 100,
            }}
            sx={{
              typography: 'h5',
              color: 'success.main',
            }}
          >
            {aprText}
          </LoadingSkeleton>
          <Box sx={{ typography: 'h6', color: 'text.secondary' }}>{t`APR`}</Box>
        </Box>

        <Box
          sx={{
            display: 'inline-block',
            height: '24px',
            width: '1px',
            backgroundColor: 'border.main',
          }}
        />

        <Box>
          <LoadingSkeleton
            loading={!item}
            loadingProps={{
              width: 100,
            }}
            sx={{
              typography: 'h5',
              color: theme.palette.success.main,
            }}
          >
            ${formatReadableNumber({ input: item?.tvl })}
          </LoadingSkeleton>
          <Box sx={{ typography: 'h6', color: 'text.secondary' }}>{t`TVL`}</Box>
        </Box>
      </Box>

      <Button
        fullWidth
        variant={Button.Variant.outlined}
        size={Button.Size.small}
        disabled={!item || !onAdd}
        onClick={() => onAdd?.(item!)}
        sx={{
          mt: 20,
        }}
      >{t`Add Incentive`}</Button>
    </Box>
  );
}
