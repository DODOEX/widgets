import { Box, useTheme } from '@dodoex/components';

export function SectionTitle({ titleKey }: { titleKey: string }) {
  const theme = useTheme();

  return (
    <>
      <Box
        sx={{
          mt: 28,
          mb: 28,
          borderTopColor: 'divider',
          borderTopStyle: 'solid',
          borderTopWidth: 1,
        }}
      />

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mb: 20,
        }}
      >
        <Box
          sx={{
            typography: 'body1',
            fontWeight: 600,
            color: theme.palette.text.primary,
          }}
        >
          {titleKey}
        </Box>
      </Box>
    </>
  );
}
