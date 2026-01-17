import { Box, BoxProps, ButtonBase, useTheme } from '@dodoex/components';
import { Trans } from '@lingui/macro';
import { PropsWithChildren, useMemo, useState } from 'react';
import { Crowdpooling } from '../../types';
import { chunk } from 'lodash';
import { ArrowRight } from '@dodoex/icons';
import CPCard from './CPCard';

export default function VoteTopList({ cpList }: { cpList: Crowdpooling[] }) {
  const theme = useTheme();
  const [currentPage, setCurrentPage] = useState(0);
  const chunkList = chunk(cpList, 3);
  const maxPage = chunkList.length - 1;
  const showingList = useMemo(
    () => chunkList[currentPage],
    [currentPage, chunkList],
  );

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 20,
        }}
      >
        <Box sx={{ typography: 'h5' }}>
          🔥<Trans>Hot</Trans>
        </Box>
        <Box
          sx={{
            display: 'flex',
            gap: 8,
          }}
        >
          <PageButton
            onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
            disabled={currentPage === 0}
          >
            <Box
              sx={{
                transform: 'rotate(180deg)',
                alignSelf: 'center',
              }}
              component={ArrowRight}
            />
          </PageButton>
          <PageButton
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage === maxPage}
          >
            <Box component={ArrowRight} />
          </PageButton>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gap: 12,
          [theme.breakpoints.up('tablet')]: {
            gridTemplateColumns: 'repeat(3, 1fr)',
          },
        }}
      >
        {showingList.map((data) => (
          <CPCard data={data} key={data.id} canFold />
        ))}
      </Box>
    </Box>
  );
}

function PageButton({
  sx,
  ...props
}: BoxProps & {
  disabled?: boolean;
}) {
  return (
    <ButtonBase
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 36,
        height: 36,
        minWidth: 36,
        borderRadius: 8,
        p: 0,
        backgroundColor: 'background.paperContrast',
        '[&:disabled]': {
          opacity: 0.3,
        },
        ...sx,
      }}
      {...props}
    />
  );
}
