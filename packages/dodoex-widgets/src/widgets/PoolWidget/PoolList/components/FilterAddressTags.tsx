import { Box, BoxProps } from '@dodoex/components';
import { Error } from '@dodoex/icons';
import { TokenLogoPair } from '../../../../components/TokenLogoPair';
import {
  convertLiquidityTokenToTokenInfo,
  FetchLiquidityListLqList,
} from '../../utils';

export default function FilterAddressTags({
  lqList,
  onDeleteTag,
  sx,
}: {
  lqList: FetchLiquidityListLqList;
  onDeleteTag: () => void;
  sx?: BoxProps['sx'];
}) {
  if (!lqList?.length) return null;
  if (!lqList[0]?.pair) return null;
  const { pair } = lqList[0];
  const baseToken = convertLiquidityTokenToTokenInfo(
    pair.baseToken,
    pair.chainId,
  );
  const quoteToken = convertLiquidityTokenToTokenInfo(
    pair.quoteToken,
    pair.chainId,
  );
  if (!baseToken || !quoteToken) return null;
  return (
    <Box
      sx={{
        typography: 'body2',
        display: 'inline-flex',
        alignItems: 'center',
        px: 8,
        mr: 8,
        borderRadius: 12,
        fontWeight: 600,
        height: 24,
        backgroundColor: 'hover.default',
        color: 'primary.contrastText',
        ...sx,
      }}
    >
      {baseToken.symbol}+{quoteToken.symbol}
      <Box
        component={Error}
        sx={{
          ml: 4,
          width: 16,
          height: 16,
          cursor: 'pointer',
          color: 'text.secondary',
          position: 'relative',
          top: 1.5,
        }}
        onClick={(e) => { 
          e.stopPropagation();
          e.preventDefault();
          onDeleteTag()
        }}
      />
    </Box>
  );
}
