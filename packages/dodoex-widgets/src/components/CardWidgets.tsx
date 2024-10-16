import { ChainId } from '@dodoex/api';
import {
  alpha,
  Box,
  BoxProps,
  useTheme,
  ButtonBase,
  Skeleton,
} from '@dodoex/components';
import BigNumber from 'bignumber.js';
import { chainListMap } from '../constants/chainList';
import { scanUrlDomainMap } from '../constants/chains';
import { TokenInfo } from '../hooks/Token';
import {
  formatReadableNumber,
  formatTokenAmountNumber,
} from '../utils/formatter';
import { increaseArray } from '../utils/utils';
import { AddTokenToMetamask } from './AddTokenToMetamask';
import { EmptyList } from './List/EmptyList';
import TokenLogo from './TokenLogo';
import { TokenLogoPair } from './TokenLogoPair';
import { ReactComponent as Link } from '../assets/logo/link.svg';

export function CardStatus({
  isMobile,
  loading,
  empty,
  children,
}: React.PropsWithChildren<{
  isMobile: boolean;
  loading: boolean;
  empty: boolean;
}>) {
  const gap = isMobile ? 28 : 16;
  if (loading) {
    return (
      <Box
        sx={{
          mt: gap,
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
          px: 20,
        }}
      >
        {increaseArray(4).map((_, i) => (
          <Skeleton key={i} width="100%" height={45} />
        ))}
      </Box>
    );
  }
  if (empty) {
    return (
      <EmptyList
        sx={{
          mt: gap,
          height: 252,
        }}
      />
    );
  }
  return <>{children}</>;
}

export default function FoldBtn({
  show,
  onClick,
}: {
  show: boolean;
  onClick: () => void;
}) {
  const theme = useTheme();
  return (
    <Box
      component={ButtonBase}
      sx={{
        padding: theme.spacing(4, 8),
        transform: show ? 'rotate(180deg)' : 'none',
        transition: 'all 100ms',
      }}
      onClick={onClick}
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
          d="M8.58398 11.376C8.78189 11.6728 9.21811 11.6728 9.41603 11.376L12.4818 6.77735C12.7033 6.44507 12.4651 6 12.0657 6H5.93426C5.53491 6 5.29672 6.44507 5.51823 6.77735L8.58398 11.376Z"
          fill="currentColor"
        />
      </svg>
    </Box>
  );
}

export function TypeText({ color, type }: { color: string; type: string }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        typography: 'body2',
        fontWeight: 600,
        color,
        '&::before': {
          content: '""',
          width: 6,
          height: 6,
          borderRadius: '50%',
          backgroundColor: color,
        },
      }}
    >
      {type}
    </Box>
  );
}

export function StatusAndTime({
  isMobile,
  statusText,
  statusColor: statusColorProps,
  time,
  alphaColor,
  sx,
}: {
  isMobile: boolean;
  statusText: string;
  statusColor: string;
  time?: string;
  alphaColor?: number;
  sx?: BoxProps['sx'];
}) {
  const theme = useTheme();
  const statusBgColor = alpha(statusColorProps, 0.1);
  const statusColor = alphaColor
    ? alpha(statusColorProps, alphaColor)
    : statusColorProps;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: isMobile ? 'center' : 'flex-start',
        gap: 2,
        typography: 'h6',
        color: 'text.secondary',
        ...sx,
      }}
    >
      <Box
        sx={{
          padding: theme.spacing(4, 8),
          borderRadius: 4,
          backgroundColor: statusBgColor,
          color: statusColor,
          textAlign: 'center',
        }}
      >
        {statusText}
      </Box>
      {time}
    </Box>
  );
}

export function ChainName({ chainId }: { chainId: ChainId }) {
  const chain = chainListMap.get(chainId);

  if (!chain) return null;
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        px: 8,
        py: 4,
        borderRadius: 4,
        backgroundColor: 'background.paperDarkContrast',
        typography: 'h6',
      }}
    >
      <>
        <Box
          component={chain.logo}
          sx={{
            width: 16,
            height: 16,
          }}
        />
        {chain.name}
      </>
    </Box>
  );
}

export function TokenAndAmount({
  token,
  amount,
  showChain,
  hideLogo,
  canAddMetamask,
  sx,
}: {
  token: TokenInfo;
  amount: string | BigNumber;
  showChain?: boolean;
  hideLogo?: boolean;
  canAddMetamask?: boolean;
  sx?: BoxProps['sx'];
}) {
  let chainName = '';
  if (showChain) {
    chainName = chainListMap.get(token.chainId)?.name ?? '';
  }
  const amountText = formatTokenAmountNumber({
    input: amount,
    decimals: token.decimals,
  });

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        ...sx,
      }}
    >
      {!hideLogo && (
        <TokenLogo
          address={token.address}
          chainId={token.chainId}
          width={20}
          height={20}
        />
      )}
      <Box
        sx={{
          fontWeight: 600,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            wordBreak: 'break-word',
          }}
        >
          {`${amountText} ${token.symbol}`}
          {canAddMetamask && <AddTokenToMetamask token={token} />}
        </Box>
        {!!chainName && (
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 2,
              typography: 'h6',
              fontWeight: 500,
              color: 'text.secondary',
            }}
          >
            {chainName}
            <Link />
            {/* <Box
              component="a"
              href={`https://${
                scanUrlDomainMap[token.chainId as ChainId]
              }/address/${token.address}`}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: 'flex',
                color: 'primary.main',
              }}
            >
              <Link />
            </Box> */}
          </Box>
        )}
      </Box>
    </Box>
  );
}

export function TokenPairAndAmount({
  baseToken,
  quoteToken,
  amount,
  sx,
}: {
  baseToken: TokenInfo;
  quoteToken: TokenInfo;
  amount: BigNumber;
  sx?: BoxProps['sx'];
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        fontWeight: 600,
        ...sx,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          wordBreak: 'break-word',
        }}
      >
        <TokenLogoPair
          tokens={[baseToken, quoteToken]}
          chainId={baseToken.chainId}
          width={20}
          height={20}
        />
        {formatReadableNumber({ input: amount })}
      </Box>
      <Box>{`${baseToken.symbol}-${quoteToken.symbol} LP`}</Box>
    </Box>
  );
}

export function TokenPairOrTokenListAndAmount({
  baseToken,
  quoteToken,
  baseAmount,
  quoteAmount,
  sx,
}: {
  baseToken: TokenInfo;
  quoteToken: TokenInfo;
  baseAmount: BigNumber;
  quoteAmount: BigNumber | null;
  sx?: BoxProps['sx'];
}) {
  return (
    <>
      {quoteAmount === null ? (
        <TokenPairAndAmount
          baseToken={baseToken}
          quoteToken={quoteToken}
          amount={baseAmount}
          sx={sx}
        />
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            ...sx,
          }}
        >
          <TokenAndAmount token={baseToken} amount={baseAmount} />
          <TokenAndAmount token={quoteToken} amount={quoteAmount} />
        </Box>
      )}
    </>
  );
}
