import {
  alpha,
  Box,
  BoxProps,
  Button,
  Tooltip,
  useTheme,
} from '@dodoex/components';
import React from 'react';
import { ReactComponent as HoverIcon } from './hover.svg';
import { useLingui } from '@lingui/react';

export function TextAndDesc({
  text,
  children,
  sx,
}: {
  text: React.ReactNode;
  children: React.ReactNode;
  sx?: BoxProps['sx'];
}) {
  const theme = useTheme();
  return (
    <Box sx={sx}>
      <Box
        sx={{
          typography: 'h5',
          color: theme.palette.text.primary,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}
      >
        {text}
      </Box>
      <Box
        sx={{
          mt: 0,
          typography: 'h6',
          color: theme.palette.text.secondary,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

export const OperateButton = ({
  operating,
  onClick,
  sx,
  disabled,
  children,
}: {
  operating?: boolean;
  onClick: () => void;
  sx?: BoxProps['sx'];
  disabled?: boolean;
  children?: React.ReactNode;
}) => {
  const theme = useTheme();

  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      sx={{
        textTransform: 'none',
        fontSize: 12,
        lineHeight: '17px',
        fontWeight: 600,
        paddingTop: 7,
        paddingRight: 0,
        paddingBottom: 8,
        paddingLeft: 0,
        width: '100%',
        flex: '1 1 auto',
        borderRadius: 8,
        color: operating
          ? theme.palette.mode === 'light'
            ? alpha(theme.palette.text.primary, 0.3)
            : alpha(theme.palette.primary.contrastText, 0.3)
          : theme.palette.text.primary,
        ...(operating
          ? {
              background: `linear-gradient(0deg, ${theme.palette.background.tag}, ${theme.palette.background.tag}), ${theme.palette.secondary.main}`,
            }
          : {
              backgroundColor: theme.palette.background.tag,
            }),
        '&:hover': operating
          ? {
              color:
                theme.palette.mode === 'light'
                  ? alpha(theme.palette.text.primary, 0.3)
                  : alpha(theme.palette.primary.contrastText, 0.3),
              backgroundColor: theme.palette.secondary.main,
            }
          : {
              color:
                theme.palette.mode === 'light'
                  ? theme.palette.text.primary
                  : theme.palette.primary.contrastText,
              backgroundColor: theme.palette.secondary.main,
            },
        '&[disabled]': {
          backgroundColor: theme.palette.background.tag,
          color: theme.palette.text.disabled,
        },
        ...sx,
      }}
    >
      {children}
    </Button>
  );
};

export const DailyRewardsLabel = ({
  titleTitle,
}: {
  titleTitle?: React.ReactNode;
}) => {
  const theme = useTheme();
  const { i18n } = useLingui();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 4,
      }}
    >
      {i18n._('Daily Rewards')}
      <Tooltip
        placement="top"
        title={
          <>
            {titleTitle}
            <Box>
              {i18n._(
                'Calculation = current rewards for a single block  × number of blocks in 24h',
              )}
            </Box>
            <Box>
              {i18n._(
                'When adding rewards, the number of rewards for a single block may be adjusted',
              )}
            </Box>
          </>
        }
      >
        <Box
          component={HoverIcon}
          sx={{
            color: theme.palette.text.secondary,
            width: 16,
            height: 17,
            '&:hover': {
              color: theme.palette.text.primary,
            },
          }}
        />
      </Tooltip>
    </Box>
  );
};

export const HowItWorksWrapper = ({
  id,
  sx,
  children,
}: {
  id?: string;
  sx?: BoxProps['sx'];
  children?: React.ReactNode;
}) => {
  const theme = useTheme();
  return (
    <Box
      id={id}
      sx={{
        marginLeft: 20,
        marginRight: 20,
        flexGrow: 0,
        flexShrink: 0,
        marginTop: 4,
        [theme.breakpoints.up('tablet')]: {
          width: 375,
          marginLeft: 12,
          marginRight: 0,
          marginTop: 0,
        },
        [theme.breakpoints.up('laptop')]: {
          height: '100%',
          minHeight: 'calc(100vh - 28px - 70px - 20px)',
          position: 'sticky',
          top: '28px',
          overflowY: 'hidden',
        },
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};

export const OperateButtonWrapper = ({
  sx,
  children,
}: {
  sx?: BoxProps['sx'];
  children?: React.ReactNode;
}) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 20,
        paddingBottom: 20,
        backgroundColor: theme.palette.background.paper,
        [theme.breakpoints.up('tablet')]: {
          borderBottomLeftRadius: 16,
          borderBottomRightRadius: 16,
        },
        [theme.breakpoints.down('tablet')]: {
          marginTop: 'auto',
          position: 'sticky',
          bottom: 0,
        },
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};
