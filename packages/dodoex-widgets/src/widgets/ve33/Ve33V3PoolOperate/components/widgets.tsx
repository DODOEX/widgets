import { Box, useTheme, alpha, BoxProps } from '@dodoex/components';

const gapValues = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '24px',
  xl: '32px',
};
export type Gap = keyof typeof gapValues;

export interface YellowCardProps {
  children?: React.ReactNode;
}

export const Card = ({
  children,
  sx,
}: {
  sx?: BoxProps['sx'];
  children?: React.ReactNode;
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        px: 20,
        py: 20,
        borderRadius: 12,
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};

export const LightCard = ({
  children,
  border,
  sx,
}: {
  sx?: BoxProps['sx'];
  border?: boolean;
  children?: React.ReactNode;
}) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        ...sx,
        ...(border
          ? {
              borderWidth: 2,
              borderColor: theme.palette.background.paperContrast,
            }
          : {
              backgroundColor: theme.palette.background.paperContrast,
            }),
      }}
    >
      {children}
    </Card>
  );
};

export const YellowCard = ({ children }: YellowCardProps) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        p: 8,
        borderRadius: 8,
        backgroundColor: alpha(theme.palette.warning.main, 0.1),
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0.75 16.125L9 1.875L17.25 16.125H0.75ZM14.6475 14.625L8.99998 4.86749L3.35247 14.625H14.6475ZM9.75004 12.375H8.25003V13.875H9.75004V12.375ZM8.25003 7.875H9.75004V10.875H8.25003V7.875Z"
          fill={theme.palette.warning.main}
        />
      </svg>

      <Box
        sx={{
          typography: 'h6',
          color: theme.palette.warning.main,
          textAlign: 'left',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export function ColumnCenter({
  gap,
  flex,
  children,
  style,
}: {
  gap?: Gap | string;
  flex?: string;
  children: React.ReactNode;
  style?: BoxProps['sx'];
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        gap: (gap && gapValues[gap as Gap]) || gap,
        ...(flex && { flex }),
        width: '100%',
        alignItems: 'center',
        ...style,
      }}
    >
      {children}
    </Box>
  );
}

export function AutoColumn({
  gap,
  justify,
  grow,
  children,
  style,
}: {
  gap?: Gap | string;
  justify?:
    | 'stretch'
    | 'center'
    | 'start'
    | 'end'
    | 'flex-start'
    | 'flex-end'
    | 'space-between';
  grow?: true;
  children: React.ReactNode;
  style?: BoxProps['sx'];
}) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridAutoRows: 'auto',
        gridRowGap: (gap && gapValues[gap as Gap]) || gap,
        justifyItems: justify,
        flexGrow: grow && 1,
        ...style,
      }}
    >
      {children}
    </Box>
  );
}

export function Row({
  gap,
  children,
  sx,
}: {
  gap?: Gap | string;
  children: React.ReactNode;
  sx?: BoxProps['sx'];
}) {
  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        padding: 0,
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: (gap && gapValues[gap as Gap]) || gap,
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}

export function RowBetween({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: BoxProps['sx'];
}) {
  return (
    <Row
      sx={{
        justifyContent: 'space-between',
        ...style,
      }}
    >
      {children}
    </Row>
  );
}

export function RowFixed({
  gap,
  justify,
  children,
  sx,
}: {
  gap?: string;
  justify?: string;
  children: React.ReactNode;
  sx?: BoxProps['sx'];
}) {
  return (
    <Row
      sx={{
        position: 'relative',
        width: 'fit-content',
        margin: `-${gap}`,
        ...sx,
      }}
    >
      {children}
    </Row>
  );
}

export function DynamicSection({
  children,
  disabled,
  sx,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  sx?: BoxProps['sx'];
}) {
  return (
    <Row
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        gap: 20,
        opacity: disabled ? 0.2 : 1,
        pointerEvents: disabled ? 'none' : 'auto',
        ...sx,
      }}
    >
      {children}
    </Row>
  );
}
