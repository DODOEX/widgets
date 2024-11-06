import { Box, HoverOpacity } from '@dodoex/components';
import { t } from '@lingui/macro';
import BigNumber from 'bignumber.js';
import dayjs from 'dayjs';
import TokenLogo from '../../../../components/TokenLogo';
import { useWalletInfo } from '../../../../hooks/ConnectWallet/useWalletInfo';
import { TokenInfo } from '../../../../hooks/Token';
import {
  openEtherscanPage,
  truncatePoolAddress,
} from '../../../../utils/address';
import { formatReadableNumber } from '../../../../utils/formatter';
import { DexConfigI, LpTokenPlatformID } from '../../types';
import { ReactComponent as CheckIcon } from './check.svg';
import { ReactComponent as LinkIcon } from './open_link_24dp.svg';

export default function PoolCard({
  id: address,
  activePlatform,
  baseToken,
  quoteToken,
  baseReserve,
  quoteReserve,
  basePrice,
  quotePrice,
  creator,
  createdAtTimestamp,
  checked,
  onClick,
  children,
  loading,
}: {
  id: string;
  activePlatform: DexConfigI | null;
  baseToken: TokenInfo;
  quoteToken: TokenInfo;
  baseReserve: string;
  quoteReserve: string;
  creator?: string;
  createdAtTimestamp?: string;
  basePrice: number;
  quotePrice: number;
  checked?: boolean;
  onClick: () => void;
  children?: React.ReactNode;
  loading?: boolean;
}) {
  const { account, chainId } = useWalletInfo();

  const base =
    baseReserve && basePrice
      ? new BigNumber(baseReserve).multipliedBy(basePrice)
      : new BigNumber(1);
  const quote =
    quoteReserve && quotePrice
      ? new BigNumber(quoteReserve).multipliedBy(quotePrice)
      : new BigNumber(1);
  let total = base.plus(quote);
  total = total.lte(0) || total.isNaN() ? new BigNumber(1) : total;
  const basePercentage = base.div(total).multipliedBy(100).toFixed(2);
  const quotePercentage = quote.div(total).multipliedBy(100).toFixed(2);

  return (
    <Box
      sx={{
        backgroundColor: 'background.paperDarkContrast',
        borderRadius: 8,
        p: 16,
        mt: 12,
        position: 'relative',
        border: checked ? 'solid 1px' : 'none',
        borderColor: 'secondary.main',
        cursor: 'pointer',
      }}
      onClick={onClick}
    >
      {checked !== undefined ? (
        <Box
          sx={{
            px: 11,
            borderTopRightRadius: 8,
            borderBottomLeftRadius: 8,
            position: 'absolute',
            top: 0,
            right: 0,
            height: 23,
            display: 'flex',
            alignItems: 'center',
            backgroundColor: checked
              ? 'secondary.main'
              : 'background.paperDarkContrast',
            color: 'primary.main',
          }}
        >
          <CheckIcon />
        </Box>
      ) : (
        ''
      )}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mb: 12,
        }}
      >
        <Box
          sx={{
            typography: 'h5',
            mr: 4,
            cursor: 'pointer',
          }}
          onClick={() => {
            openEtherscanPage(`address/${address}`, chainId);
          }}
        >
          {truncatePoolAddress(address)}
        </Box>

        {activePlatform?.Icon ? (
          <activePlatform.Icon
            style={{
              width: 14,
              height: 14,
              borderRadius: 2,
            }}
          />
        ) : null}

        <HoverOpacity
          component={LinkIcon}
          sx={{
            width: 14,
            height: 14,
            ml: 4,
            color: 'text.secondary',
            cursor: 'pointer',
          }}
          onClick={() => {
            openEtherscanPage(`address/${address}`, chainId);
          }}
        />
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <TokenLogo
          address={baseToken.address}
          width={16}
          height={16}
          chainId={baseToken.chainId}
          url={baseToken.logoURI}
          noShowChain
          marginRight={8}
        />
        {formatReadableNumber({
          input: baseReserve,
        })}
        &nbsp;
        <Box
          sx={{
            color: 'text.secondary',
          }}
        >
          {baseToken.symbol}&nbsp;
          {loading ? '' : `${basePercentage}%`}
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mt: 4,
        }}
      >
        <TokenLogo
          address={quoteToken.address}
          width={16}
          height={16}
          chainId={quoteToken.chainId}
          url={quoteToken.logoURI}
          noShowChain
          marginRight={8}
        />
        {formatReadableNumber({
          input: quoteReserve,
        })}
        &nbsp;
        <Box
          sx={{
            color: 'text.secondary',
          }}
        >
          {quoteToken.symbol}&nbsp;
          {loading ? '' : `${quotePercentage}%`}
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: 'text.secondary',
          mt: 12,
          typography: 'h6',
        }}
      >
        {activePlatform?.platformID === LpTokenPlatformID.pancakeV2 &&
          t`Created by ${truncatePoolAddress(
            '0xca143ce32fe78f1f7019d7d551a6402fc5350c73',
          )}`}
        {creator && t`"Created by ${truncatePoolAddress(creator)}`}
        {createdAtTimestamp && (
          <Box>
            {dayjs(Number(`${createdAtTimestamp}000`)).format('YYYY/MM/DD')}
          </Box>
        )}
      </Box>
      {children}
    </Box>
  );
}
