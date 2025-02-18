import { ChainId } from '@dodoex/api';
import { Box, Button } from '@dodoex/components';
import { ArrowBack } from '@dodoex/icons';
import { Trans } from '@lingui/macro';
import BigNumber from 'bignumber.js';
import React from 'react';
import NeedConnectButton from '../../../components/ConnectWallet/NeedConnectButton';
import GoBack from '../../../components/GoBack';
import { SwitchBox } from '../../../components/Swap/components/SwitchBox';
import { TokenCard } from '../../../components/Swap/components/TokenCard';
import TokenPairStatusButton from '../../../components/TokenPairStatusButton';
import TokenSelect from '../../../components/TokenSelect';
import { useUserOptions } from '../../../components/UserOptionsProvider';
import WidgetContainer from '../../../components/WidgetContainer';
import {
  AUTO_AMM_V2_LIQUIDITY_SLIPPAGE_PROTECTION,
  AUTO_SWAP_SLIPPAGE_PROTECTION,
} from '../../../constants/pool';
import { CREATE_CPMM_CONFIG } from '../../../hooks/raydium-sdk-V2/common/programId';
import { useWidgetDevice } from '../../../hooks/style/useWidgetDevice';
import { TokenInfo } from '../../../hooks/Token';
import { useTokenStatus } from '../../../hooks/Token/useTokenStatus';
import { PageType, useRouterStore } from '../../../router';
import { formatPercentageNumber } from '../../../utils';
import { usePrevious } from '../../MiningWidget/hooks/usePrevious';
import { useAMMV2AddLiquidity } from '../hooks/useAMMV2AddLiquidity';
import { useUniV2CreatePairs } from '../hooks/useUniV2CreatePairs';
import { PoolTab } from '../PoolList/hooks/usePoolListTabs';
import ConfirmDialog from './ConfirmDialog';
import { CreateItem } from './CreateItem';
import FeeEdit from './FeeEdit';
import MyLiquidity from './MyLiqidity';
import Ratio from './Ratio';
import Setting from './Setting';

export default function AMMV2Create() {
  const [feeIndex, setFeeIndex] = React.useState(0);

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
    poolKeys,
    poolInfo,
    pairAddress,
    price,
    isInvalidPair,
    invertedPrice,
    poolInfoLoading,
    lpBalanceLoading,
    lpBalance,
    lpBalancePercentage,
    lpToAmountA,
    lpToAmountB,
    liquidityMinted,
    pairMintAAmount,
    pairMintBAmount,
    isExists,
  } = useUniV2CreatePairs({
    baseToken,
    quoteToken,
    baseAmount,
    quoteAmount,
    feeIndex,
    slippage: slippageNumber,
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

  const baseTokenStatus = useTokenStatus(baseToken, {
    amount: baseAmount,
  });
  const quoteTokenStatus = useTokenStatus(quoteToken, {
    amount: quoteAmount,
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
    pairMintAAmount,
    pairMintBAmount,
    isExists,
    poolKeys,
    poolInfo,
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
            isExists={isExists}
            poolInfo={poolInfo}
            poolInfoLoading={poolInfoLoading}
            lpBalanceLoading={lpBalanceLoading}
            lpBalance={lpBalance}
            lpBalancePercentage={lpBalancePercentage}
            lpToAmountA={lpToAmountA}
            lpToAmountB={lpToAmountB}
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
              feeIndex={feeIndex}
              onChange={setFeeIndex}
              feeList={CREATE_CPMM_CONFIG}
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
                loading={poolInfoLoading}
                midPrice={price}
                lpBalancePercentage={isExists ? lpBalancePercentage : 100}
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
                  </b>
                  &nbsp;
                  <Trans>
                    By adding liquidity you’ll earn&nbsp;
                    <b>
                      {formatPercentageNumber({
                        input:
                          CREATE_CPMM_CONFIG[feeIndex].tradeFeeRate / 10000,
                      })}
                    </b>
                    &nbsp; of all trades on this pair proportional to your share
                    of the pool. Fees are added to the pool, accrue in real time
                    and can be claimed by withdrawing your liquidity.
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
                  feeIndex == null
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
        pairMintAAmount={pairMintAAmount}
        quoteToken={quoteToken}
        pairMintBAmount={pairMintBAmount}
        feeIndex={feeIndex}
        price={price}
        lpAmount={liquidityMinted}
        lpBalancePercentage={isExists ? lpBalancePercentage : 100}
        pairAddress={pairAddress}
        createMutation={createMutation}
      />
    </WidgetContainer>
  );
}
