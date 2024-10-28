import { Box, BoxProps, useTheme } from '@dodoex/components';
import { t } from '@lingui/macro';
import TokenLogo from '../../../../components/TokenLogo';
import { TokenLogoPair } from '../../../../components/TokenLogoPair';
import { truncatePoolAddress } from '../../../../utils/address';
import { StateProps, TokenType } from '../hooks/reducers';
import { SectionStatusT } from '../types';

function Card({
  title,
  children,
  isWaiting,
  sx,
}: {
  title: string;
  children: React.ReactNode;
  isWaiting: boolean;
  sx?: BoxProps['sx'];
}) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        padding: 16,
        borderRadius: 16,
        backgroundColor: theme.palette.background.paper,
        flexGrow: 0,
        flexBasis: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        // height: '100%',
        ...sx,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          typography: 'h5',
        }}
      >
        {isWaiting ? '-' : children}
      </Box>
      <Box
        sx={{
          typography: 'h6',
          fontWeight: 500,
          color: theme.palette.text.secondary,
          // mt: 8,
          // mt: 'auto',
        }}
      >
        {title}
      </Box>
    </Box>
  );
}

export function StakingRules({
  status,
  tokenType,
  saveAToken,
  pool,
}: {
  status: SectionStatusT;
  tokenType: StateProps['tokenType'];
  saveAToken: StateProps['saveAToken'];
  pool: StateProps['pool'];
}) {
  const theme = useTheme();

  const isWaiting = status === 'waiting';
  const isLpToken = tokenType === TokenType.LP;
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'stretch',
        flexWrap: isLpToken ? 'wrap' : 'nowrap',
        gap: 12,
        opacity: isWaiting ? 0.5 : 1,
        [theme.breakpoints.down('tablet')]: {
          flexWrap: 'wrap',
        },
      }}
    >
      <Card
        title={t`Staked Tokens`}
        isWaiting={isWaiting}
        sx={{
          flexBasis: 'calc(50% - 6px)',
          [theme.breakpoints.down('tablet')]: {
            backgroundColor: theme.palette.background.tag,
            flexBasis: '100%',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            typography: 'h5',
            fontWeight: 600,
          }}
        >
          {isLpToken ? (
            pool ? (
              <>
                <TokenLogoPair
                  tokens={[
                    { address: pool.baseToken.address },
                    { address: pool.quoteToken.address },
                  ]}
                  mr={8}
                />
                {pool.baseToken.symbol}-{pool.quoteToken.symbol}
              </>
            ) : (
              '-'
            )
          ) : saveAToken ? (
            <>
              <TokenLogo
                address={saveAToken.address}
                width={24}
                height={24}
                chainId={saveAToken.chainId}
                url={saveAToken.logoURI}
                noShowChain
                marginRight={8}
              />
              {saveAToken?.symbol}
            </>
          ) : (
            '-'
          )}
        </Box>
      </Card>

      <Card
        title={isLpToken ? t`Liquidity Pool` : t`Address`}
        isWaiting={isWaiting}
        sx={{
          flexBasis: 'calc(50% - 6px)',
          [theme.breakpoints.down('tablet')]: {
            backgroundColor: theme.palette.background.tag,
            flexBasis: '100%',
          },
        }}
      >
        {truncatePoolAddress(
          isLpToken
            ? pool
              ? pool.id
              : '-'
            : saveAToken
              ? saveAToken.address
              : '-',
        )}
      </Card>
    </Box>
  );
}
