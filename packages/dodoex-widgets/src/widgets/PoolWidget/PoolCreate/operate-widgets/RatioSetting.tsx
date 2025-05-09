import { Button, alpha, Box, useTheme } from '@dodoex/components';
import { Warn } from '@dodoex/icons';
import { Trans } from '@lingui/macro';
import BigNumber from 'bignumber.js';
import { Dispatch, useMemo } from 'react';
import { NumberInput } from '../../../../components/Swap/components/TokenCard/NumberInput';
import { formatPercentageNumber } from '../../../../utils/formatter';
import { Actions, StateProps, Types } from '../reducer';
import {
  computePeggedRecommendRatio,
  PEGGED_MINIMUM_LOST_RATIO,
} from '../utils';
import { SettingItemWrapper } from './widgets';

function RatioInput({
  title,
  value,
  onChange,
}: {
  title: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: '50%',
        display: 'flex',
        alignItems: 'center',
        px: 15,
        py: 7,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: theme.palette.border.main,
        borderRadius: 8,
        backgroundColor: theme.palette.background.cardInput,
      }}
    >
      <Box
        sx={{
          color: theme.palette.text.primary,
          typography: 'body1',
          fontWeight: 500,
          flexShrink: 0,
        }}
      >
        {title}
      </Box>
      <NumberInput
        value={value}
        onChange={onChange}
        suffix="%"
        placeholder="0"
        sx={{
          backgroundColor: 'background.cardInput',
          mt: 0,
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          typography: 'h5',
          lineHeight: '32px',
          color: theme.palette.text.disabled,
          '& input': {
            textAlign: 'right',
            py: 0,
            px: 8,
            color: theme.palette.text.primary,
            '&::placeholder': {
              opacity: 1,
              color: theme.palette.text.disabled,
              fontWeight: 600,
              typography: 'h5',
              lineHeight: 1,
              position: 'relative',
            },
          },
        }}
      />
    </Box>
  );
}

export interface RatioSettingProps {
  baseToken: StateProps['baseToken'];
  quoteToken: StateProps['quoteToken'];
  initPrice: StateProps['initPrice'];
  peggedBaseTokenRatio: StateProps['peggedBaseTokenRatio'];
  peggedQuoteTokenRatio: StateProps['peggedQuoteTokenRatio'];
  baseAmount: StateProps['baseAmount'];
  quoteAmount: StateProps['quoteAmount'];
  dispatch: Dispatch<Actions>;
}

export const RatioSetting = ({
  baseToken,
  quoteToken,
  initPrice,
  peggedBaseTokenRatio,
  peggedQuoteTokenRatio,
  baseAmount,
  quoteAmount,
  dispatch,
}: RatioSettingProps) => {
  const theme = useTheme();

  const [recommendBaseRatio, recommendQuoteRatio] = useMemo(() => {
    const { base, quote } = computePeggedRecommendRatio({
      initPrice,
    });
    return [
      base ? base.multipliedBy(100).toString() : null,
      quote ? quote.multipliedBy(100).toString() : null,
    ];
  }, [initPrice]);

  const isDefaultInput =
    peggedBaseTokenRatio === '' && peggedQuoteTokenRatio === '';

  const [lostRatioBN, lostRatio] = useMemo(() => {
    /**
        // Round down when withdrawing. Therefore, never be a situation occuring balance is 0 but totalsupply is not 0
        // But May Happen，reserve >0 But totalSupply = 0
        if (totalSupply == 0) {
            // case 1. initial supply
            require(quoteBalance > 0, "ZERO_QUOTE_AMOUNT");
            // The shares will be minted to user
            shares = quoteBalance < DecimalMath.mulFloor(baseBalance, _I_)
                ? DecimalMath.divFloor(quoteBalance, _I_)
                : baseBalance;
            // The target will be updated
            _BASE_TARGET_ = uint112(shares);
            _QUOTE_TARGET_ = uint112(DecimalMath.mulFloor(shares, _I_));
            require(_QUOTE_TARGET_ > 0, "QUOTE_TARGET_IS_ZERO");
            // Lock 1001 shares permanently in first deposit 
            require(shares > 2001, "MINT_AMOUNT_NOT_ENOUGH");
            _mint(address(0), 1001);
            shares -= 1001;
        } else if (baseReserve > 0 && quoteReserve > 0) {
            // case 2. normal case
            uint256 baseInputRatio = DecimalMath.divFloor(baseInput, baseReserve);
            uint256 quoteInputRatio = DecimalMath.divFloor(quoteInput, quoteReserve);
            uint256 mintRatio = quoteInputRatio < baseInputRatio ? quoteInputRatio : baseInputRatio;
            // The shares will be minted to user
            shares = DecimalMath.mulFloor(totalSupply, mintRatio);

            // The target will be updated
            _BASE_TARGET_ = uint112(uint256(_BASE_TARGET_) + (DecimalMath.mulFloor(uint256(_BASE_TARGET_), mintRatio)));
            _QUOTE_TARGET_ = uint112(uint256(_QUOTE_TARGET_) + (DecimalMath.mulFloor(uint256(_QUOTE_TARGET_), mintRatio)));
        }
        // The shares will be minted to user
        // The reserve will be updated
        _mint(to, shares);
     */
    const baseTokenDecimals = baseToken?.decimals ?? 0;
    const quoteTokenDecimals = quoteToken?.decimals ?? 0;
    const baseBalance = new BigNumber(baseAmount)
      .dp(baseTokenDecimals, BigNumber.ROUND_DOWN)
      .multipliedBy(`1e${baseTokenDecimals}`);
    const quoteBalance = new BigNumber(quoteAmount)
      .dp(quoteTokenDecimals, BigNumber.ROUND_DOWN)
      .multipliedBy(`1e${quoteTokenDecimals}`);
    const _I_ = new BigNumber(initPrice)
      .multipliedBy(`1e${18 - baseTokenDecimals + quoteTokenDecimals}`)
      .dp(0, BigNumber.ROUND_DOWN);
    const shares = quoteBalance.lt(baseBalance.multipliedBy(_I_).div(1e18))
      ? quoteBalance.multipliedBy(1e18).div(_I_)
      : baseBalance;
    const burn = new BigNumber(1001);

    if (burn.gt(shares)) {
      return [new BigNumber(1), '100%'];
    }

    const ratio = burn.dividedBy(shares);
    return [ratio, formatPercentageNumber({ input: ratio })];
  }, [
    baseAmount,
    baseToken?.decimals,
    initPrice,
    quoteAmount,
    quoteToken?.decimals,
  ]);

  const isRecommendRatio = useMemo(() => {
    if (lostRatioBN.lte(PEGGED_MINIMUM_LOST_RATIO)) {
      return true;
    }
    return (
      recommendBaseRatio != null &&
      peggedBaseTokenRatio === recommendBaseRatio &&
      recommendQuoteRatio != null &&
      peggedQuoteTokenRatio === recommendQuoteRatio
    );
  }, [
    lostRatioBN,
    peggedBaseTokenRatio,
    peggedQuoteTokenRatio,
    recommendBaseRatio,
    recommendQuoteRatio,
  ]);

  const recommendRatioText = `${baseToken?.symbol}:${quoteToken?.symbol}=${recommendBaseRatio}%:${recommendQuoteRatio}%`;

  return (
    <SettingItemWrapper title={<Trans>Ratio Settings</Trans>}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
        }}
      >
        <RatioInput
          title={baseToken?.symbol ?? ''}
          value={peggedBaseTokenRatio}
          onChange={(v) => {
            dispatch({
              type: Types.UpdatePeggedBaseTokenRatio,
              payload: v,
            });
          }}
        />

        <Box
          sx={{
            color: theme.palette.text.primary,
            typography: 'body2',
            fontWeight: 500,
            width: 14,
            flexShrink: 0,
            flexGrow: 0,
            textAlign: 'center',
          }}
        >
          :
        </Box>

        <RatioInput
          title={quoteToken?.symbol ?? ''}
          value={peggedQuoteTokenRatio}
          onChange={(v) => {
            dispatch({
              type: Types.UpdatePeggedQuoteTokenRatio,
              payload: v,
            });
          }}
        />
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 20,
          px: 19,
          pt: 19,
          pb: 11,
          borderRadius: 16,
          borderWidth: 1,
          borderColor:
            isRecommendRatio || isDefaultInput
              ? theme.palette.border.main
              : 'transparent',
          borderStyle: 'solid',
          backgroundColor:
            isRecommendRatio || isDefaultInput
              ? theme.palette.background.paper
              : alpha(theme.palette.warning.main, 0.1),
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
          }}
        >
          {isDefaultInput ? null : (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                color: isRecommendRatio
                  ? theme.palette.text.primary
                  : theme.palette.warning.main,
                typography: 'body1',
                fontWeight: 600,
              }}
            >
              {isRecommendRatio ? null : <Warn />}
              <Trans>Liquidity Burn Ratio</Trans>:&nbsp;
              {lostRatio}
            </Box>
          )}

          <Box
            sx={{
              color: theme.palette.text.secondary,
              typography: 'h6',
              textAlign: 'center',
              '&>strong': {
                color: isRecommendRatio
                  ? theme.palette.text.primary
                  : theme.palette.warning.main,
              },
            }}
          >
            {isDefaultInput ? (
              <Trans>
                The closer the provided asset ratio is to the recommended ratio
                ({recommendRatioText}), the smaller the portion burned.
              </Trans>
            ) : (
              <Trans>
                <strong>{lostRatio}</strong> of the initial liquidity you
                provide will be burned. <br />
                The closer the provided asset ratio is to the recommended ratio
                ({recommendRatioText}), the smaller the portion burned.
              </Trans>
            )}
          </Box>
        </Box>

        {isDefaultInput || !isRecommendRatio ? (
          <Button
            variant={Button.Variant.outlined}
            fullWidth
            size={Button.Size.small}
            onClick={() => {
              dispatch({
                type: Types.UpdatePeggedBaseTokenRatio,
                payload: recommendBaseRatio != null ? recommendBaseRatio : '',
              });
            }}
            sx={{
              border: `solid 1px ${theme.palette.text.primary}`,
              color: theme.palette.text.primary,
              '&:hover': {
                background: alpha(theme.palette.text.primary, 0.1),
              },
            }}
          >
            <Trans>Use the recommended ratio</Trans>
          </Button>
        ) : null}
      </Box>
    </SettingItemWrapper>
  );
};
