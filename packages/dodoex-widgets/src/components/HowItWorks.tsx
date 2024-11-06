import { Box, BoxProps, alpha, useTheme } from '@dodoex/components';
import { Trans } from '@lingui/macro';

export function HowItWorks({
  title,
  desc,
  linkTo,
  LeftImage,
  sx,
}: {
  title: React.ReactNode;
  desc: React.ReactNode;
  linkTo: string;
  LeftImage?: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & {
      title?: string | undefined;
    }
  >;
  sx?: BoxProps['sx'];
}) {
  const theme = useTheme();

  const isLight = theme.palette.mode === 'light';
  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.paper,
        borderRadius: 16,
        padding: 20,
        ...sx,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}
      >
        <Box
          sx={{
            backgroundColor: alpha(theme.palette.secondary.main, 0.3),
            color: isLight ? '#EB8D27' : theme.palette.secondary.main,
            borderRadius: 6,
            width: 24,
            height: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M7.55558 0.888672C3.87558 0.888672 0.888916 3.87534 0.888916 7.55534C0.888916 11.2353 3.87558 14.222 7.55558 14.222C11.2356 14.222 14.2222 11.2353 14.2222 7.55534C14.2222 3.87534 11.2356 0.888672 7.55558 0.888672ZM8.22225 11.5553V10.222H6.88892V11.5553H8.22225ZM4.88892 6.22201C4.88892 4.74867 6.08225 3.55534 7.55558 3.55534C9.02892 3.55534 10.2222 4.74867 10.2222 6.22201C10.2222 7.07728 9.69557 7.53755 9.18276 7.9857C8.69626 8.41085 8.22225 8.82509 8.22225 9.55534H6.88892C6.88892 8.34116 7.51699 7.85973 8.06921 7.43646C8.50241 7.10441 8.88892 6.80815 8.88892 6.22201C8.88892 5.48867 8.28892 4.88867 7.55558 4.88867C6.82225 4.88867 6.22225 5.48867 6.22225 6.22201H4.88892Z"
              fill="currentColor"
            />
          </svg>
        </Box>

        <Box
          sx={{
            color: theme.palette.text.primary,
            typography: 'body1',
            fontWeight: 600,
            ml: 4,
          }}
        >
          <Trans>SEE HOW IT WORKS</Trans>
        </Box>
      </Box>

      <Box
        sx={{
          mt: 20,
          borderTopWidth: 1,
          pt: 20,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Box
            component={LeftImage}
            sx={{
              width: 64,
              height: 64,
              flexShrink: 0,
            }}
          />
          <Box
            sx={{
              ml: 16,
              color: theme.palette.text.primary,
              typography: 'body1',
              fontWeight: 600,
            }}
          >
            {title}
            <Box
              sx={{
                mt: 4,
                color: theme.palette.text.secondary,
                typography: 'body2',
                fontWeight: 500,
              }}
            >
              {desc}
            </Box>
          </Box>
        </Box>

        <Box
          component="a"
          href={linkTo}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            pl: 16,
            flexShrink: 0,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M7.23375 3.75L6 4.98375L10.0075 9L6 13.0162L7.23375 14.25L12.4838 9L7.23375 3.75Z"
              fill={theme.palette.text.primary}
            />
          </svg>
        </Box>
      </Box>
    </Box>
  );
}
