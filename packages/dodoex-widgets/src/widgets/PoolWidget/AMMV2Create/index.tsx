import { Box, Button } from '@dodoex/components';
import { ArrowBack } from '@dodoex/icons';
import { Trans } from '@lingui/macro';
import WidgetContainer from '../../../components/WidgetContainer';
import { CreateItem } from './CreateItem';
import TokenSelect from '../../../components/TokenSelect';
import FeeEdit from './FeeEdit';
import React from 'react';
import { useWidgetDevice } from '../../../hooks/style/useWidgetDevice';
import { TokenCard } from '../../../components/Swap/components/TokenCard';
import { TokenInfo } from '../../../hooks/Token';
import { SwitchBox } from '../../../components/Swap/components/SwitchBox';
import Ratio from './Ratio';
import Setting from './Setting';
import { useUniV2CreatePairs } from '../hooks/useUniV2CreatePairs';
import { useUserOptions } from '../../../components/UserOptionsProvider';
import { usePrevious } from '../../MiningWidget/hooks/usePrevious';
import { formatPercentageNumber, formatReadableNumber } from '../../../utils';
import BigNumber from 'bignumber.js';
import {
  AUTO_AMM_V2_LIQUIDITY_SLIPPAGE_PROTECTION,
  AUTO_SWAP_SLIPPAGE_PROTECTION,
} from '../../../constants/pool';
import ConfirmDialog from './ConfirmDialog';
import NeedConnectButton from '../../../components/ConnectWallet/NeedConnectButton';
import { useTokenStatus } from '../../../hooks/Token/useTokenStatus';
import TokenPairStatusButton from '../../../components/TokenPairStatusButton';
import { ChainId, contractConfig } from '@dodoex/api';
import GoBack from '../../../components/GoBack';
import { PageType, useRouterStore } from '../../../router';
import MyLiquidity from './MyLiqidity';
import { useAMMV2AddLiquidity } from '../hooks/useAMMV2AddLiquidity';
import { PoolTab } from '../PoolList/hooks/usePoolListTabs';
import { getUniswapV2Router02ContractAddressByChainId } from '@dodoex/dodo-contract-request';

export default function AMMV2Create() {
  const [fee, setFee] = React.useState(0.003);
  const feeList = [0.0001, 0.0005, 0.003];
  const [baseToken, setBaseToken] = React.useState<TokenInfo>();
  const [quoteToken, setQuoteToken] = React.useState<TokenInfo>();
  const [baseAmount, setBaseAmount] = React.useState('');
  const [quoteAmount, setQuoteAmount] = React.useState('');
  const switchTokens = () => {
    setBaseToken(quoteToken);
    setQuoteToken(baseToken);
    setBaseAmount('');
    setQuoteAmount('');
  };
  const [slippage, setSlippage] = React.useState<
    number | typeof AUTO_SWAP_SLIPPAGE_PROTECTION
  >(AUTO_SWAP_SLIPPAGE_PROTECTION);
  const slippageNumber =
    slippage === AUTO_SWAP_SLIPPAGE_PROTECTION
      ? new BigNumber(AUTO_AMM_V2_LIQUIDITY_SLIPPAGE_PROTECTION)
          .div(100)
          .toNumber()
      : slippage;

  const { isMobile } = useWidgetDevice();
  const { onlyChainId } = useUserOptions();
  const chainId: ChainId | undefined = React.useMemo(
    () => onlyChainId || baseToken?.chainId || quoteToken?.chainId,
    [onlyChainId, baseToken, quoteToken],
  );
  const {
    pairAddress,
    pair,
    price,
    isInvalidPair,
    invertedPrice,
    priceLoading,
    liquidityMinted,
    shareOfPool,
    isExists,
  } = useUniV2CreatePairs({
    baseToken,
    quoteToken,
    baseAmount,
    quoteAmount,
    fee,
  });
  const lastPrice = usePrevious(price);
  if (price && baseAmount && !price.isEqualTo(lastPrice ?? 0) && isExists) {
    const newQuoteAmount = price
      .times(baseAmount)
      .dp(quoteToken?.decimals ?? 18);
    if (!newQuoteAmount.isEqualTo(quoteAmount)) {
      setQuoteAmount(newQuoteAmount.toString());
    }
  }
  const handleChangeBaseAmount = (value: string) => {
    setBaseAmount(value);
    const valueNumber = Number(value);
    if (isExists && price && valueNumber) {
      setQuoteAmount(
        price
          .times(value)
          .dp(quoteToken?.decimals ?? 18)
          .toString(),
      );
    }
  };
  const handleChangeQuoteAmount = (value: string) => {
    setQuoteAmount(value);
    const valueNumber = Number(value);
    if (isExists) {
      if (invertedPrice && valueNumber) {
        setBaseAmount(
          invertedPrice
            .times(value)
            .dp(baseToken?.decimals ?? 18)
            .toString(),
        );
      }
    }
  };
  const proxyContract = chainId
    ? getUniswapV2Router02ContractAddressByChainId(chainId)
    : undefined;
  const baseTokenStatus = useTokenStatus(baseToken, {
    amount: baseAmount,
    contractAddress: proxyContract,
  });
  const quoteTokenStatus = useTokenStatus(quoteToken, {
    amount: quoteAmount,
    contractAddress: proxyContract,
  });

  const [showConfirm, setShowConfirm] = React.useState(false);

  const needToken = !baseToken || !quoteToken;

  const back = () => {
    useRouterStore.getState().push({
      type: PageType.Pool,
    });
  };

  const createMutation = useAMMV2AddLiquidity({
    baseToken,
    quoteToken,
    baseAmount,
    quoteAmount,
    fee,
    isExists,
    slippage: slippageNumber,
    successBack: () => {
      useRouterStore.getState().push({
        type: PageType.Pool,
        params: {
          tab: PoolTab.myLiquidity,
        },
      });
    },
  });

  return (
    <WidgetContainer>
      <Box
        sx={{
          mx: 'auto',
          borderRadius: isMobile ? 0 : 16,
          backgroundColor: 'background.paper',
          width: isMobile ? '100%' : 600,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {isMobile ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 20,
              pb: 0,
            }}
          >
            <GoBack onClick={back} />
          </Box>
        ) : (
          <Box
            sx={{
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              px: 20,
              py: 24,
              typography: 'caption',
            }}
          >
            <Box
              component={ArrowBack}
              sx={{
                position: 'absolute',
                left: 20,
                cursor: 'pointer',
              }}
              onClick={back}
            />
            <Trans>Add liquidity</Trans>
          </Box>
        )}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
            pt: 24,
            px: 20,
            pb: 20,
          }}
        >
          <MyLiquidity
            pair={pair}
            pairAddress={pairAddress}
            isExists={isExists}
          />
          <CreateItem title={<Trans>Select pair</Trans>}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: isMobile
                  ? 'repeat(1, 1fr)'
                  : 'repeat(2, 1fr)',
                gap: 12,
              }}
            >
              <TokenSelect
                border
                highlightDefault
                chainId={chainId}
                token={baseToken}
                onTokenChange={(token, isOccupied) => {
                  if (isOccupied) {
                    switchTokens();
                  } else {
                    setBaseToken(token);
                    setBaseAmount('');
                  }
                }}
                occupiedToken={quoteToken}
              />
              <TokenSelect
                border
                highlightDefault
                chainId={chainId}
                token={quoteToken}
                onTokenChange={(token, isOccupied) => {
                  if (isOccupied) {
                    setBaseToken(quoteToken);
                    setQuoteToken(baseToken);
                  } else {
                    setQuoteToken(token);
                    setQuoteAmount('');
                  }
                }}
                occupiedToken={baseToken}
              />
            </Box>
            <FeeEdit
              fee={fee}
              onChange={setFee}
              feeList={feeList}
              hasCustom
              disabled={needToken}
            />
          </CreateItem>
          <CreateItem
            title={<Trans>Deposit amounts</Trans>}
            disabled={needToken}
          >
            <Box>
              <TokenCard
                sx={{ mb: 4, pb: 28, minHeight: 'auto' }}
                token={baseToken}
                amt={baseAmount}
                defaultLoadBalance
                onInputChange={handleChangeBaseAmount}
                showMaxBtn
                occupiedAddrs={[quoteToken?.address ?? '']}
                occupiedChainId={quoteToken?.chainId}
                notTokenPickerModal
                showPercentage
                readOnly={needToken}
              />
              <SwitchBox plus />
              <TokenCard
                sx={{ pb: 20, minHeight: 'auto' }}
                token={quoteToken}
                amt={quoteAmount}
                defaultLoadBalance
                onInputChange={handleChangeQuoteAmount}
                showMaxBtn
                occupiedAddrs={[baseToken?.address ?? '']}
                occupiedChainId={baseToken?.chainId}
                notTokenPickerModal
                showPercentage
                readOnly={needToken}
              />
              <Setting
                slippage={slippage}
                onChangeSlippage={setSlippage}
                disabled={needToken}
                sx={{
                  mt: 8,
                }}
              />
              <Ratio
                baseToken={baseToken}
                quoteToken={quoteToken}
                loading={priceLoading}
                midPrice={price}
                shareOfPool={shareOfPool}
              />
              {!!isExists && (
                <Box
                  sx={{
                    mt: 20,
                    p: 20,
                    borderRadius: 16,
                    backgroundColor: 'background.paperContrast',
                    typography: 'h6',
                    textAlign: 'center',
                    '& > b': {
                      fontWeight: 600,
                      color: 'primary.main',
                    },
                  }}
                >
                  🌟
                  <b>
                    <Trans>Tips:</Trans>
                  </b>{' '}
                  <Trans>
                    By adding liquidity you’ll earn{' '}
                    <b>{formatPercentageNumber({ input: fee })}</b> of all
                    trades on this pair proportional to your share of the pool.
                    Fees are added to the pool, accrue in real time and can be
                    claimed by withdrawing your liquidity.
                  </Trans>
                </Box>
              )}
            </Box>
          </CreateItem>
        </Box>
        <Box
          sx={{
            py: 16,
            px: 20,
            borderTopWidth: 1,
          }}
        >
          <NeedConnectButton
            fullWidth
            includeButton
            size={Button.Size.big}
            disabled={needToken}
            chainId={chainId}
          >
            <TokenPairStatusButton
              statuses={[baseTokenStatus, quoteTokenStatus]}
              buttonProps={{
                size: Button.Size.big,
              }}
            >
              <Button
                fullWidth
                size={Button.Size.big}
                disabled={
                  !baseToken ||
                  !quoteToken ||
                  !baseAmount ||
                  !quoteAmount ||
                  !!isInvalidPair ||
                  !fee
                }
                onClick={() => setShowConfirm(true)}
              >
                {isInvalidPair ? (
                  <Trans>Invalid pair</Trans>
                ) : (
                  <Trans>Supply</Trans>
                )}
              </Button>
            </TokenPairStatusButton>
          </NeedConnectButton>
        </Box>
      </Box>
      <ConfirmDialog
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        slippage={slippageNumber}
        baseToken={baseToken}
        baseAmount={baseAmount}
        quoteToken={quoteToken}
        quoteAmount={quoteAmount}
        fee={fee}
        price={price}
        lpAmount={liquidityMinted}
        shareOfPool={shareOfPool}
        pairAddress={pairAddress}
        createMutation={createMutation}
      />
    </WidgetContainer>
  );
}
