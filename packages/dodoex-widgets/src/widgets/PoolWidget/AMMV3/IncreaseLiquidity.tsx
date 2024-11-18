import { useTheme } from '@emotion/react';
import { useWalletInfo } from '../../../hooks/ConnectWallet/useWalletInfo';
import useDefaultTokens from '../PoolCreate/hooks/useDefaultTokens';
import { useV3NFTPositionManagerContract } from './hooks/useContract';
import { useV3PositionFromTokenId } from './hooks/useV3Positions';
import BigNumber from 'bignumber.js';
import { useDerivedPositionInfo } from './hooks/useDerivedPositionInfo';
import { FeeAmount } from './sdks/v3-sdk/constants';
import { useCurrency } from './hooks/Tokens';

export default function IncreaseLiquidity({
  currencyIdA,
  currencyIdB,
  feeAmount: feeAmountFromUrl,
  tokenId,
}: {
  currencyIdA?: string;
  currencyIdB?: string;
  feeAmount?: string;
  tokenId?: string;
}) {
  const { defaultBaseToken, defaultQuoteToken } = useDefaultTokens();
  const { chainId, account } = useWalletInfo();
  const theme = useTheme();

  const positionManager = useV3NFTPositionManagerContract(chainId);

  // check for existing position if tokenId in url
  const { position: existingPositionDetails, loading: positionLoading } =
    useV3PositionFromTokenId(
      tokenId ? new BigNumber(tokenId) : undefined,
      chainId,
    );
  const hasExistingPosition = !!existingPositionDetails && !positionLoading;
  const { position: existingPosition } = useDerivedPositionInfo(
    existingPositionDetails,
  );

  // fee selection from url
  const feeAmount: FeeAmount | undefined =
    feeAmountFromUrl &&
    Object.values(FeeAmount).includes(parseFloat(feeAmountFromUrl))
      ? parseFloat(feeAmountFromUrl)
      : undefined;

  const baseCurrency = useCurrency(currencyIdA);
  const currencyB = useCurrency(currencyIdB);
}
