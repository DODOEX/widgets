import { Box, useTheme } from '@dodoex/components';
import { Trans } from '@lingui/macro';
import { memo } from 'react';
import { CP_STATUS, CPStatusType } from '../../types';
import { Done } from '@dodoex/icons';

export enum TimelineType {
  Upcoming = 'Upcoming',
  OnSale = 'OnSale',
  Settling = 'Settling',
  Claimable = 'Claimable',
}

interface IProps {
  status: CPStatusType;
}

const STAGE_LIST = [
  TimelineType.Upcoming,
  TimelineType.OnSale,
  TimelineType.Settling,
  TimelineType.Claimable,
];

export const Timeline = memo(({ status }: IProps) => {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';

  const currentStage = {
    [CP_STATUS.WAITING]: 0,
    [CP_STATUS.PROCESSING]: 1,
    [CP_STATUS.SETTLING]: 2,
    [CP_STATUS.CALMING]: 3,
    [CP_STATUS.ENDED]: 4,
  }[status];

  const timelineMainColor = theme.palette.primary.main;

  const Point = ({ index }: { index: number }) => {
    const isActive = index === currentStage;
    const isFinished = index < currentStage;

    const label = {
      0: <Trans>Upcoming</Trans>,
      1: <Trans>On Sale</Trans>,
      2: <Trans>Settling</Trans>,
      3: <Trans>Claimable</Trans>,
    }[index];

    return (
      <>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              width: 28,
              height: 28,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: '50%',
              border: '2px solid',
              borderColor: isFinished ? timelineMainColor : 'transparent',
              backgroundColor: isActive
                ? timelineMainColor
                : theme.palette.background.paperDarkContrast,
              color: isActive
                ? theme.palette.primary.contrastText
                : theme.palette.text.primary,
              typography: 'body2',
              fontWeight: 600,
            }}
          >
            {isFinished ? (
              <Box component={Done} sx={{ width: 16, height: 16 }} />
            ) : (
              index + 1
            )}
          </Box>
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              fontSize: 12,
              textAlign: 'center',
              whiteSpace: 'nowrap',
              color: isActive
                ? theme.palette.primary.main
                : theme.palette.text.primary,
            }}
          >
            {label}
          </Box>
        </Box>
        {index !== STAGE_LIST.length - 1 && (
          <Box
            sx={{
              flex: 1,
              height: 2,
              backgroundColor: isFinished
                ? theme.palette.primary.main
                : theme.palette.border.main,
            }}
          />
        )}
      </>
    );
  };

  return (
    <Box
      sx={{
        pb: 28,
      }}
    >
      <Box
        sx={{
          mb: 20,
          typography: 'body2',
        }}
      >
        <Trans>Timeline</Trans>
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          pb: 30,
          px: 16,
          position: 'relative',
        }}
      >
        {STAGE_LIST.map((_, index) => (
          <Point key={index} index={index} />
        ))}
      </Box>
    </Box>
  );
});
