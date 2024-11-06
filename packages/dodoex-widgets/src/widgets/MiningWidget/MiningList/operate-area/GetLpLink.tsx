import { ButtonBase, HoverAddUnderLine, useTheme } from '@dodoex/components';
import { t } from '@lingui/macro';

export function GetLpLink({
  tokenSymbol,
  goLpLink,
}: {
  tokenSymbol: string | undefined;
  goLpLink: () => Promise<void>;
}) {
  const theme = useTheme();

  return (
    <HoverAddUnderLine
      sx={{
        color: theme.palette.text.secondary,
        typography: 'h6',
        display: 'flex',
        alignItems: 'center',
      }}
      component={ButtonBase}
      onClick={goLpLink}
    >
      {t`Get ${tokenSymbol}`}
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5.83324 3.88867L5.01074 4.71117L7.68241 7.38867L5.01074 10.0662L5.83324 10.8887L9.33324 7.38867L5.83324 3.88867Z"
          fill="currentColor"
        />
      </svg>
    </HoverAddUnderLine>
  );
}
