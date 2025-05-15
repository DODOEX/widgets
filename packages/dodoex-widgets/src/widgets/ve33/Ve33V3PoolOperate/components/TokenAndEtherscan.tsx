import { Box } from '@dodoex/components';
import { ArrowTopRightBorder } from '@dodoex/icons';
import TokenLogo from '../../../../components/TokenLogo';
import { getEtherscanPage } from '../../../../utils';
import { TokenInfo } from '../../../../hooks/Token';

export default function TokenAndEtherscan({ token }: { token: TokenInfo }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        typography: 'body2',
        fontWeight: 600,
      }}
    >
      <TokenLogo
        chainId={token.chainId}
        address={token.address}
        width={20}
        height={20}
        noShowChain
        marginRight={0}
      />
      {token.symbol}
      <Box
        component="a"
        href={getEtherscanPage(token.chainId, token.address, 'address')}
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          display: 'inline-flex',
          color: 'text.secondary',
          '&:hover': {
            color: 'text.primary',
          },
        }}
      >
        <Box
          component={ArrowTopRightBorder}
          sx={{
            width: 16,
            height: 16,
          }}
        />
      </Box>
    </Box>
  );
}
