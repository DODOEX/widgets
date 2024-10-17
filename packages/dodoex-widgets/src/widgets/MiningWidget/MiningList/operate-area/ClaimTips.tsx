import { Box, useTheme } from '@dodoex/components';
import { Trans } from '@lingui/macro';

export function ClaimTips() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.paperDarkContrast,
        borderRadius: 8,
        px: 16,
        py: 12,
        mb: 12,
        color: theme.palette.text.primary,
        typography: 'h6',
        fontWeight: 500,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 8,
      }}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M9.20379 1.80945L4.81274 1.79788L1.69961 4.89464L1.68804 9.28569L4.7848 12.3988L9.17585 12.4104L12.289 9.31363L12.3006 4.92258L9.20379 1.80945ZM13.4685 4.44241L9.69012 0.644062L4.33257 0.629942L0.534222 4.40832L0.520101 9.76587L4.29848 13.5642L9.65602 13.5783L13.4544 9.79996L13.4685 4.44241Z"
          fill="currentColor"
        />
        <path
          d="M7.584 3.79184H6.41734V8.45851H7.584V3.79184Z"
          fill="currentColor"
        />
        <path
          d="M7.00068 10.8196C7.44558 10.8196 7.80624 10.4589 7.80624 10.014C7.80624 9.56913 7.44558 9.20847 7.00068 9.20847C6.55579 9.20847 6.19513 9.56913 6.19513 10.014C6.19513 10.4589 6.55579 10.8196 7.00068 10.8196Z"
          fill="currentColor"
        />
      </svg>

      <Trans>You will also claim all rewards from this pool.</Trans>
    </Box>
  );
}
