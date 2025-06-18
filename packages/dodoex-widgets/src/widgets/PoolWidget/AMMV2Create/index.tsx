import { ChainId } from '@dodoex/api';
import { Box, Button, useTheme } from '@dodoex/components';
import {
  getUniswapV2Router02ContractAddressByChainId,
  getUniswapV2Router02FixedFeeContractAddressByChainId,
} from '@dodoex/dodo-contract-request';
import { Trans } from '@lingui/macro';
import BigNumber from 'bignumber.js';
import React, { useEffect } from 'react';
import NeedConnectButton from '../../../components/ConnectWallet/NeedConnectButton';
import SquaredGoBack from '../../../components/SquaredGoBack';
import {
  CardPlus,
  TokenCard,
} from '../../../components/Swap/components/TokenCard';
import TokenPairStatusButton from '../../../components/TokenPairStatusButton';
import TokenSelect from '../../../components/TokenSelect';
import { useUserOptions } from '../../../components/UserOptionsProvider';
import WidgetContainer from '../../../components/WidgetContainer';
import {
  AUTO_AMM_V2_LIQUIDITY_SLIPPAGE_PROTECTION,
  AUTO_SWAP_SLIPPAGE_PROTECTION,
} from '../../../constants/pool';
import { useWidgetDevice } from '../../../hooks/style/useWidgetDevice';
import { TokenInfo } from '../../../hooks/Token';
import { useTokenStatus } from '../../../hooks/Token/useTokenStatus';
import { PageType, useRouterStore } from '../../../router';
import { formatPercentageNumber } from '../../../utils';
import { usePrevious } from '../../MiningWidget/hooks/usePrevious';
import { useAMMV2AddLiquidity } from '../hooks/useAMMV2AddLiquidity';
import { useUniV2CreatePairs } from '../hooks/useUniV2CreatePairs';
import { PoolTypeTag } from '../PoolList/components/tags';
import { PoolTab } from '../PoolList/hooks/usePoolListTabs';
import { getIsAMMV2DynamicFeeContractByChainId } from '../utils';
import ConfirmDialog from './ConfirmDialog';
import { CreateItem } from './CreateItem';
import FeeEdit from './FeeEdit';
import MyLiquidity from './MyLiqidity';
import Ratio from './Ratio';
import Setting from './Setting';

export default function AMMV2Create() {
  const theme = useTheme();

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
    ? getUniswapV2Router02ContractAddressByChainId(chainId) ||
      getUniswapV2Router02FixedFeeContractAddressByChainId(chainId)
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

  useEffect(() => {
    console.error('createMutation.error', createMutation.error);
  }, [createMutation.error]);

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          mx: 16,
          pb: 20,
          borderBottomWidth: 1,
          borderBottomStyle: 'solid',
          borderBottomColor: 'border.main',
          mb: 20,
          [theme.breakpoints.up('tablet')]: {
            width: 600,
            mx: 'auto',
          },
        }}
      >
        <SquaredGoBack onClick={back} />

        <Box
          sx={{
            typography: 'caption',
            fontWeight: 600,
            color: 'text.primary',
            mr: 'auto',
          }}
        >
          <Trans>Add liquidity</Trans>
        </Box>

        <PoolTypeTag poolType="AMM V2" />
      </Box>

      <Box
        sx={{
          pt: 20,
          px: 16,
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: theme.palette.background.paper,
          borderRadius: 16,
          [theme.breakpoints.up('tablet')]: {
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: 'border.main',
            px: 0,
            mx: 'auto',
            width: 600,
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
            [theme.breakpoints.up('tablet')]: {
              pt: 20,
              px: 20,
              pb: 20,
            },
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
            {(!chainId || getIsAMMV2DynamicFeeContractByChainId(chainId)) && (
              <FeeEdit
                fee={fee}
                onChange={setFee}
                feeList={feeList}
                hasCustom
                disabled={needToken}
              />
            )}
          </CreateItem>
          <CreateItem
            title={<Trans>Deposit amounts</Trans>}
            disabled={needToken}
          >
            <Box>
              <TokenCard
                sx={{
                  mb: 4,
                  pb: 28,
                  minHeight: 'auto',
                  backgroundColor: 'background.cardInput',
                  padding: theme.spacing(20, 20, 28),
                }}
                inputSx={{
                  backgroundColor: 'background.cardInput',
                }}
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
              <CardPlus />
              <TokenCard
                sx={{
                  pb: 20,
                  minHeight: 'auto',
                  backgroundColor: 'background.cardInput',
                  padding: theme.spacing(20, 20, 20),
                }}
                inputSx={{
                  backgroundColor: 'background.cardInput',
                }}
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
            mt: 20,
            py: 16,
            [theme.breakpoints.up('tablet')]: {
              px: 20,
            },
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
      </Box>
    </>
  );
}
