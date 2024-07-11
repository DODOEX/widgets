import { Box, useTheme, BaseButton } from '@dodoex/components';
import { TokenPickerProps } from '../../../TokenPicker';
import { Trans } from '@lingui/macro';
import { CaretUp } from '@dodoex/icons';
import TokenLogo from '../../../TokenLogo';
import { swapSelectTokenBtn } from '../../../../constants/testId';

export function TokenLogoCollapse({
  token,
  onClick,
  showChainLogo,
}: {
  token?: TokenPickerProps['value'];
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  showChainLogo?: boolean;
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
        '&:focus-visible': {
          opacity: 0.5,
        },
      }}
      onClick={(e: any) => {
        onClick && onClick(e);
      }}
      data-testid={swapSelectTokenBtn}
    >
      {token?.address ? (
        <>
          <TokenLogo
            url={token?.logoURI}
            address={token?.address ?? ''}
            marginRight={6}
            chainId={showChainLogo ? token?.chainId : undefined}
          />
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
