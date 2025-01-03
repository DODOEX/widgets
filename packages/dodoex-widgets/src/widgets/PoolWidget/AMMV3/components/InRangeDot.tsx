import { Box, Tooltip, useTheme } from '@dodoex/components';
import { t } from '@lingui/macro';

export interface InRangeDotProps {
  outOfRange: boolean;
}

export const InRangeDot = ({ outOfRange }: InRangeDotProps) => {
  const theme = useTheme();

  return (
    <Tooltip title={outOfRange ? t`Out of range` : t`In range`}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {outOfRange ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0.583252 12.5416L6.99992 1.45825L13.4166 12.5416H0.583252ZM11.3924 11.3749L6.9999 3.78575L2.6074 11.3749H11.3924ZM7.58328 9.62492H6.41661V10.7916H7.58328V9.62492ZM6.41661 6.12492H7.58328V8.45825H6.41661V6.12492Z"
              fill={theme.palette.warning.main}
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="8"
            height="8"
            viewBox="0 0 8 8"
            fill="none"
          >
            <circle cx="4" cy="4" r="4" fill={theme.palette.success.main} />
          </svg>
        )}
      </Box>
    </Tooltip>
  );
};
