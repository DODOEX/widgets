import { Box } from '@dodoex/components';
import { TokenInfo } from '../../hooks/Token';
import TokenLogo from '../TokenLogo';

export default function PopularToken({
  token,
  disabled,
  onClick,
}: {
  token: TokenInfo;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        p: 8,
        border: 'solid 1px',
        typography: 'body2',
        borderRadius: 8,
        ...(disabled
          ? {
              borderColor: 'transparent',
              backgroundColor: 'border.disabled',
              cursor: 'auto',
            }
          : {
              borderColor: 'border.main',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'hover.default',
              },
            }),
      }}
      onClick={() => {
        if (disabled) return;
        onClick();
      }}
    >
      <TokenLogo token={token} />
      {token.symbol}
    </Box>
  );
}
