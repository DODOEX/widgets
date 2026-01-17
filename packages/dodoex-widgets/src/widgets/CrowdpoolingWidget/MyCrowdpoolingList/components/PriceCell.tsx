import { Box } from '@dodoex/components';
import BigNumber from 'bignumber.js';
import { TokenInfo } from '../../../../hooks/Token';
import { formatTokenAmountNumber } from '../../../../utils';

interface PriceCellProps {
  price: BigNumber | string;
  baseToken: TokenInfo;
  quoteToken: TokenInfo;
}

export function PriceCell({ price, baseToken, quoteToken }: PriceCellProps) {
  return (
    <Box
      sx={{
        typography: 'body1',
        minWidth: 140,
      }}
    >
      1 {baseToken.symbol} ={' '}
      {formatTokenAmountNumber({ input: price, decimals: quoteToken.decimals })}{' '}
      {quoteToken.symbol}
    </Box>
  );
}
