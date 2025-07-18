import { Box } from '@dodoex/components';
import BigNumber from 'bignumber.js';
import { formatExponentialNotation } from '../../../../utils';
import { CurvePoolT } from '../types';
import { CoinsLogoList } from './CoinsLogoList';

export default function TokenListPoolItem({
  list,
  onClick,
}: {
  list: CurvePoolT[];
  onClick: () => void;
}) {
  return (
    <>
      {list?.map((item) => {
        return (
          <Box
            key={item.address}
            onClick={onClick}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              px: 10,
              py: 20,
              borderRadius: 8,
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'custom.background.listHover',
              },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <CoinsLogoList pool={item} separate={false} wrap={false} />
              <Box
                sx={{
                  typography: 'h5',
                }}
              >
                {item.name}
              </Box>
            </Box>
            <Box>
              <Box
                sx={{
                  color: 'custom.status.green.default',
                  fontWeight: 600,
                }}
              >
                $
                {item.tvl
                  ? formatExponentialNotation(new BigNumber(item.tvl))
                  : '-'}
              </Box>
              <Box
                sx={{
                  mt: 2,
                  typography: 'h6',
                  color: 'text.secondary',
                }}
              >
                TVL
              </Box>
            </Box>
          </Box>
        );
      })}
    </>
  );
}
