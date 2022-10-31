import { Box, useTheme, BaseButton } from '@dodoex-io/components';
import TokenPicker, { TokenPickerProps } from '../../../TokenPicker';
import { Trans } from '@lingui/macro';
import { CaretUp } from '@dodoex-io/icons';
import TokenLogo from '../../../TokenLogo';
import { swapSelectTokenBtn } from '../../../../constants/testId';

export function TokenLogoCollapse({
  token,
  onClick,
}: {
  token?: TokenPickerProps['value'];
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}) {
  const theme = useTheme();

  return (
    <Box
      component={BaseButton}
      sx={{
        display: 'flex',
        alignItems: 'center',
        color: theme.palette.text.primary,
        typography: 'h5',
        fontWeight: 600,
      }}
      onClick={(e: any) => {
        onClick && onClick(e);
      }}
      data-testid={swapSelectTokenBtn}
    >
      {token?.address ? (
        <>
          <TokenLogo address={token?.address ?? ''} marginRight={6} />
          <Box>{token?.symbol ?? '-'}</Box>
        </>
      ) : (
        <Trans>SELECT TOKEN</Trans>
      )}
      <Box
        sx={{ ml: 7, width: 12, transform: 'rotateX(180deg)' }}
        component={CaretUp}
      />
    </Box>
  );
}
