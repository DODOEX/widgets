import { Box, BoxProps, useTheme } from '@dodoex/components';

export function HowItWorks({
  title,
  descList,
  linkTo,
  sx,
}: {
  title: React.ReactNode;
  descList: {
    title: React.ReactNode;
    desc: React.ReactNode;
  }[];
  linkTo: string;
  sx?: BoxProps['sx'];
}) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.default,
        backdropFilter: 'blur(4px)',
        borderWidth: 1,
        borderColor: theme.palette.border.main,
        borderStyle: 'solid',
        borderRadius: 12,
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 24,
        ...sx,
      }}
    >
      <Box
        sx={{
          color: theme.palette.text.primary,
          typography: 'body1',
          fontWeight: 500,
          lineHeight: '25px',
        }}
      >
        {title}
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'stretch',
          gap: 24,
        }}
      >
        {descList.map((item, index) => (
          <Box
            key={index}
            sx={{
              flex: 1,
              padding: 16,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: 8,
              borderWidth: 1,
              borderColor: theme.palette.border.main,
              borderStyle: 'solid',
              borderRadius: 8,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <Box
                sx={{
                  color: theme.palette.primary.contrastText,
                  typography: 'h6',
                  fontWeight: 600,
                  lineHeight: '20px',
                  width: 20,
                  height: 20,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  backgroundColor: theme.palette.primary.main,
                }}
              >
                {index + 1}
              </Box>
              <Box
                sx={{
                  color: theme.palette.text.primary,
                  typography: 'body2',
                  fontWeight: 500,
                  lineHeight: '24px',
                }}
              >
                {item.title}
              </Box>
            </Box>
            <Box
              sx={{
                color: theme.palette.text.secondary,
                typography: 'h6',
                fontWeight: 500,
                lineHeight: '18px',
              }}
            >
              {item.desc}
            </Box>
          </Box>
        ))}
      </Box>

      <Box
        component="a"
        href={linkTo}
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          px: 24,
          py: 12,
          borderRadius: 8,
          backgroundColor: theme.palette.background.tag,
          color: theme.palette.text.primary,
          typography: 'body2',
          fontWeight: 700,
          lineHeight: '21px',
          textDecoration: 'none',
        }}
      >
        Read Docs
      </Box>
    </Box>
  );
}
