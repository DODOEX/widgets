import { Box, useTheme } from '@dodoex/components';
import { Error } from '@dodoex/icons';
import { t } from '@lingui/macro';
import BigNumber from 'bignumber.js';
import { useMemo, useReducer, useState } from 'react';
import Dialog from '../../../components/Dialog';
import { CardPlusConnected } from '../../../components/Swap/components/TokenCard';
import { useWalletInfo } from '../../../hooks/ConnectWallet/useWalletInfo';
import { useWidgetDevice } from '../../../hooks/style/useWidgetDevice';
import { TokenInfo } from '../../../hooks/Token';
import { useTokenStatus } from '../../../hooks/Token/useTokenStatus';
import SlippageSetting, {
  useSlipper,
} from '../PoolOperate/components/SlippageSetting';
import { Buttons } from './components/Buttons';
import { CurrencyInputPanel } from './components/CurrencyInputPanel';
import { DynamicSection } from './components/widgets';
import { useDerivedPositionInfo } from './hooks/useDerivedPositionInfo';
import { useV3DerivedMintInfo } from './hooks/useV3DerivedMintInfo';
import { useV3MintActionHandlers } from './hooks/useV3MintActionHandlers';
import { useV3PositionFromTokenId } from './hooks/useV3Positions';
import { reducer } from './reducer';
import {
  ChainId,
  Currency,
  CurrencyAmount,
  NONFUNGIBLE_POSITION_MANAGER_ADDRESSES,
} from './sdks/sdk-core';
import { FeeAmount } from './sdks/v3-sdk';
import { Field } from './types';
import { buildCurrency, convertBackToTokenInfo } from './utils';
import { maxAmountSpend } from './utils/maxAmountSpend';

export interface AMMV3PositionManageProps {
  chainId: ChainId;
  baseToken: TokenInfo;
  quoteToken: TokenInfo;
  feeAmount: FeeAmount;
  tokenId: string;
  onClose: (() => void) | undefined;
}

export const AMMV3PositionManage = ({
  chainId,
  baseToken,
  quoteToken,
  feeAmount,
  tokenId,
  onClose,
}: AMMV3PositionManageProps) => {
  const { isMobile } = useWidgetDevice();
  const theme = useTheme();

  const { account } = useWalletInfo();

  const { position: existingPositionDetails, loading: positionLoading } =
    useV3PositionFromTokenId(tokenId, chainId);
  const hasExistingPosition = !!existingPositionDetails && !positionLoading;
  const { position: existingPosition } = useDerivedPositionInfo(
    existingPositionDetails,
    baseToken,
    quoteToken,
  );

  const [state, dispatch] = useReducer<typeof reducer>(reducer, {
    baseToken: buildCurrency(baseToken),
    quoteToken: buildCurrency(quoteToken),
    feeAmount,
    independentField: Field.CURRENCY_A,
    typedValue: '',
    startPriceTypedValue: '',
    leftRangeTypedValue: '',
    rightRangeTypedValue: '',
  });

  const { independentField, typedValue, startPriceTypedValue } = state;

  const {
    pool,
    ticks,
    dependentField,
    price,
    pricesAtTicks,
    pricesAtLimit,
    parsedAmounts,
    currencyBalances,
    position,
    noLiquidity,
    currencies,
    errorMessage,
    invalidPool,
    invalidRange,
    outOfRange,
    depositADisabled,
    depositBDisabled,
    invertPrice,
    ticksAtLimit,
    isTaxed,
  } = useV3DerivedMintInfo({ state, existingPosition });

  const formattedPrice = useMemo(() => {
    return (invertPrice ? price?.invert() : price)?.toSignificant();
  }, [invertPrice, price]);

  const {
    onFieldAInput,
    onFieldBInput,
    onLeftRangeInput,
    onRightRangeInput,
    onStartPriceInput,
  } = useV3MintActionHandlers({ noLiquidity, dispatch });

  const { slipper, setSlipper, slipperValue, resetSlipper } = useSlipper({
    address: undefined,
  });

  const isValid = !errorMessage && !invalidRange;

  // modal and loading
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false); // clicked confirm

  // get formatted amounts
  const formattedAmounts = useMemo(() => {
    return {
      [independentField]: typedValue,
      [dependentField]: parsedAmounts[dependentField]?.toSignificant(6) ?? '',
    };
  }, [dependentField, independentField, parsedAmounts, typedValue]);

  // get the max amounts user can add
  const maxAmounts: { [field in Field]?: CurrencyAmount<Currency> } =
    useMemo(() => {
      return [Field.CURRENCY_A, Field.CURRENCY_B].reduce(
        (accumulator, field) => {
          return {
            ...accumulator,
            [field]: maxAmountSpend(currencyBalances[field]),
          };
        },
        {},
      );
    }, [currencyBalances]);

  const approvalA = useTokenStatus(
    convertBackToTokenInfo(parsedAmounts[Field.CURRENCY_A]?.currency),
    {
      contractAddress: NONFUNGIBLE_POSITION_MANAGER_ADDRESSES[chainId],
      overrideBalance: currencyBalances[Field.CURRENCY_A]
        ? new BigNumber(currencyBalances[Field.CURRENCY_A].toSignificant())
        : undefined,
      amount: parsedAmounts[Field.CURRENCY_A]
        ? new BigNumber(parsedAmounts[Field.CURRENCY_A].toSignificant())
        : undefined,
    },
  );
  const approvalB = useTokenStatus(
    convertBackToTokenInfo(parsedAmounts[Field.CURRENCY_B]?.currency),
    {
      contractAddress: NONFUNGIBLE_POSITION_MANAGER_ADDRESSES[chainId],
      overrideBalance: currencyBalances[Field.CURRENCY_B]
        ? new BigNumber(currencyBalances[Field.CURRENCY_B].toSignificant())
        : undefined,
      amount: parsedAmounts[Field.CURRENCY_B]
        ? new BigNumber(parsedAmounts[Field.CURRENCY_B].toSignificant())
        : undefined,
    },
  );

  const content = useMemo(() => {
    return (
      <Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            px: 20,
            py: 24,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Box
            sx={{
              typography: 'body1',
              fontWeight: 600,
              color: theme.palette.text.primary,
            }}
          >
            {t`Add liquidity`}
          </Box>

          {onClose ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: 24,
                height: 24,
                borderRadius: '50%',
                borderWidth: 1,
                color: 'text.secondary',
                cursor: 'pointer',
              }}
            >
              <Box
                component={Error}
                sx={{
                  width: 16,
                  height: 16,
                }}
                onClick={() => {
                  onClose();
                }}
              />
            </Box>
          ) : undefined}
        </Box>

        <Box
          sx={{
            p: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          <DynamicSection
            disabled={
              invalidPool ||
              invalidRange ||
              (noLiquidity && !startPriceTypedValue)
            }
          >
            <Box
              sx={{
                typography: 'body1',
                fontWeight: 600,
                color: theme.palette.text.secondary,
                textAlign: 'left',
              }}
            >
              {t`Add more liquidity`}
            </Box>
            <Box>
              <CurrencyInputPanel
                value={formattedAmounts[Field.CURRENCY_A]}
                onUserInput={onFieldAInput}
                maxAmount={maxAmounts[Field.CURRENCY_A]}
                balance={currencyBalances[Field.CURRENCY_A]}
                currency={currencies[Field.CURRENCY_A] ?? null}
                locked={depositADisabled}
              />
              <CardPlusConnected />
              <CurrencyInputPanel
                value={formattedAmounts[Field.CURRENCY_B]}
                onUserInput={onFieldBInput}
                maxAmount={maxAmounts[Field.CURRENCY_B]}
                balance={currencyBalances[Field.CURRENCY_B]}
                currency={currencies[Field.CURRENCY_B] ?? null}
                locked={depositBDisabled}
              />
            </Box>
            <SlippageSetting
              value={slipper}
              onChange={setSlipper}
              disabled={false}
            />
          </DynamicSection>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            px: 20,
            py: 16,
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16,
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Buttons
            chainId={chainId}
            approvalA={approvalA}
            approvalB={approvalB}
            parsedAmounts={parsedAmounts}
            isValid={isValid}
            depositADisabled={depositADisabled}
            depositBDisabled={depositBDisabled}
            errorMessage={errorMessage}
            setShowConfirm={setShowConfirm}
          />
        </Box>
      </Box>
    );
  }, [
    approvalA,
    approvalB,
    chainId,
    currencies,
    currencyBalances,
    depositADisabled,
    depositBDisabled,
    errorMessage,
    formattedAmounts,
    invalidPool,
    invalidRange,
    isValid,
    maxAmounts,
    noLiquidity,
    onClose,
    onFieldAInput,
    onFieldBInput,
    parsedAmounts,
    setSlipper,
    slipper,
    startPriceTypedValue,
    theme.palette.background.paper,
    theme.palette.text.primary,
    theme.palette.text.secondary,
  ]);

  if (isMobile) {
    return (
      <Dialog
        open={baseToken != null && quoteToken != null}
        onClose={onClose}
        scope={!isMobile}
        modal={undefined}
        id="pool-operate"
      >
        {content}
      </Dialog>
    );
  }

  return content;
};
