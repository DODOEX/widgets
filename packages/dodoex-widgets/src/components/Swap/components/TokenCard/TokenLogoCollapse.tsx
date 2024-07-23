import { Box, useTheme, ButtonBase } from '@dodoex/components';
import { TokenPickerProps } from '../../../TokenPicker';
import { Trans } from '@lingui/macro';
import { CaretUp } from '@dodoex/icons';
import TokenLogo from '../../../TokenLogo';
import { swapSelectTokenBtn } from '../../../../constants/testId';
import { TokenInfo } from '../../../../hooks/Token';

export function TokenLogoCollapse({
  token,
  onClick,
  showChainLogo,
  readonly,
}: {
  token?: TokenInfo | null;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  showChainLogo?: boolean;
  readonly?: boolean;
}) {
  const theme = useTheme();
  return (
    <Box
      component={ButtonBase}
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
        if (readonly) return;
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
            chainId={token?.chainId}
            noShowChain={!showChainLogo}
          />
          <Box>{token?.symbol ?? '-'}</Box>
        </>
      ) : (
        <Trans>SELECT TOKEN</Trans>
      )}
      {!readonly && (
        <Box
          sx={{ ml: 7, width: 12, transform: 'rotateX(180deg)' }}
          component={CaretUp}
        />
      )}
    </Box>
  );
}
