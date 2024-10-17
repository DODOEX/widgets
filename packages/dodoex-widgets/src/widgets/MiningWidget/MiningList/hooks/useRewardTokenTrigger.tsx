import { Box } from '@dodoex/components';
import { uniqBy } from 'lodash';
import { useMemo } from 'react';

export function useRewardTokenTrigger({
  rewardTokenList,
}: {
  rewardTokenList: { symbol?: string }[];
}) {
  const rewardTokenTrigger = useMemo(() => {
    const trigger = uniqBy(rewardTokenList, 'symbol')
      .map((r) => r.symbol)
      .join(' & ');

    return (
      <Box
        component="span"
        sx={{
          display: 'inline-block',
          ...(trigger.length > 17
            ? {
                width: '120px',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                textAlign: 'left',
              }
            : {}),
        }}
        title={typeof trigger === 'string' ? (trigger as string) : undefined}
      >
        {trigger}
      </Box>
    );
  }, [rewardTokenList]);

  return rewardTokenTrigger;
}
