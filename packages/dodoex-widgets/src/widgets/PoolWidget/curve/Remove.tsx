import { Box, Button, ButtonBase, useTheme } from '@dodoex/components';
import { OperateButtonContainer } from './components/OperateButtonContainer';
import { OperateCurvePoolT } from './types';
import { SlippageBonus } from './components/SlippageBonus';
import SlippageSetting, {
  useSlipper,
} from '../PoolOperate/components/SlippageSetting';
import { NumberInput } from '../../../components/Swap/components/TokenCard/NumberInput';
import { useLpTokenBalances } from './hooks/useLpTokenBalances';
import { useWalletInfo } from '../../../hooks/ConnectWallet/useWalletInfo';
import { useEffect, useState } from 'react';
import { BigNumber } from 'bignumber.js';
import { formatTokenAmountNumber } from '../../../utils/formatter';
import TokenLogo from '../../../components/TokenLogo';

function RadioButton({
  disabled,
  selected,
  onClick,
  children,
  iconVisible,
}: {
  disabled: boolean;
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  iconVisible: boolean;
}) {
  const theme = useTheme();

  const iconColor = selected
    ? theme.palette.success.main
    : theme.palette.text.secondary;
  return (
    <Box
      component={ButtonBase}
      disabled={disabled}
      onClick={onClick}
      sx={{
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}
    >
      {iconVisible && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="19"
          viewBox="0 0 18 19"
          fill="none"
        >
          {selected ? (
            <>
              <rect
                x="0.5"
                y="1"
                width="17"
                height="17"
                rx="8.5"
                stroke={iconColor}
              />
              <rect
                x="4.5"
                y="5"
                width="9"
                height="9"
                rx="4.5"
                fill={iconColor}
                stroke={iconColor}
              />
            </>
          ) : (
            <rect
              x="0.5"
              y="1"
              width="17"
              height="17"
              rx="8.5"
              stroke={iconColor}
            />
          )}
        </svg>
      )}

      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          typography: 'body2',
          fontWeight: 500,
          lineHeight: '19px',
          color: theme.palette.text.primary,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

export interface RemoveProps {
  operateCurvePool: OperateCurvePoolT;
}

export const Remove = ({ operateCurvePool }: RemoveProps) => {
  const theme = useTheme();
  const { account } = useWalletInfo();

  const [inputValue, setInputValue] = useState('');
  const [withdrawType, setWithdrawType] = useState<
    'oneCoin' | 'balanced' | 'custom'
  >('balanced');

  const firstCoin = operateCurvePool.pool.coins[0];
  const [selectedOneCoin, setSelectedOneCoin] = useState<string | null>(
    firstCoin?.address || null,
  );
  const [prevSelectedOneCoin, setPrevSelectedOneCoin] = useState<string | null>(
    firstCoin?.address || null,
  );
  if (firstCoin.address !== prevSelectedOneCoin) {
    setSelectedOneCoin(firstCoin.address);
    setPrevSelectedOneCoin(firstCoin.address);
  }

  const [tokenInputs, setTokenInputs] = useState<Record<string, string>>({});

  const { slipper, setSlipper, slipperValue, resetSlipper } = useSlipper({
    address: operateCurvePool.pool.address,
  });

  const {
    lpTokenTotalSupply,
    tokenBalances,
    lpTokenBalance,
    userTokenBalances,
  } = useLpTokenBalances({
    pool: operateCurvePool.pool,
    account,
  });

  useEffect(() => {
    const initialInputs: Record<string, string> = {};
    operateCurvePool.pool.coins.forEach((coin) => {
      initialInputs[coin.address] = '';
    });
    setTokenInputs(initialInputs);
  }, [operateCurvePool.pool.coins]);

  const handleInputChange = (coinAddress: string, value: string) => {
    setTokenInputs((prev) => ({
      ...prev,
      [coinAddress]: value,
    }));
  };

  return (
    <>
      <Box
        sx={{
          pb: 100,
          px: 20,
          pt: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          [theme.breakpoints.up('tablet')]: {
            pb: 20,
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            gap: 8,
          }}
        >
          <Box
            sx={{
              px: 20,
              py: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              borderRadius: 16,
              backgroundColor: theme.palette.background.cardInput,
            }}
          >
            <Box>
              <Box
                sx={{
                  typography: 'body1',
                  fontWeight: 600,
                  lineHeight: '22px',
                  color: theme.palette.text.primary,
                }}
              >
                LP Tokens
              </Box>
              <Box
                component={ButtonBase}
                onClick={() => {
                  if (!lpTokenBalance) {
                    return;
                  }

                  setInputValue(
                    lpTokenBalance
                      .dp(operateCurvePool.pool.decimals, BigNumber.ROUND_DOWN)
                      .toString(),
                  );
                }}
                sx={{
                  mt: 4,
                  typography: 'h6',
                  fontWeight: 500,
                  lineHeight: '16px',
                  color: theme.palette.text.secondary,
                  '&:hover': {
                    color: theme.palette.text.primary,
                  },
                }}
              >
                Balance:&nbsp;
                {lpTokenBalance
                  ? formatTokenAmountNumber({
                      input: lpTokenBalance,
                      decimals: operateCurvePool.pool.decimals,
                    })
                  : '-'}
              </Box>
            </Box>

            <NumberInput
              value={inputValue}
              onChange={(v) => {
                setInputValue(v);
              }}
              decimals={operateCurvePool.pool.decimals}
              typography="h4"
              sx={{
                mt: 0,
                '& input': {
                  fontSize: 24,
                  typography: 'h4',
                  lineHeight: '33px',
                  fontWeight: 600,
                  textAlign: 'right',
                  border: 'none',
                  outline: 'none',
                  padding: 0,
                  color: 'text.primary',
                  '&::placeholder': {
                    fontSize: 24,
                    typography: 'h4',
                    lineHeight: '33px',
                    fontWeight: 600,
                    color: 'text.disabled',
                  },
                },
              }}
            />
          </Box>

          <Box
            sx={{
              p: 12,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'stretch',
              gap: 20,
              borderRadius: 8,
              border: `1px solid ${theme.palette.border.main}`,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <RadioButton
                iconVisible
                disabled={false}
                selected={withdrawType === 'oneCoin'}
                onClick={() => {
                  setWithdrawType('oneCoin');
                }}
              >
                One coin
              </RadioButton>
              <RadioButton
                iconVisible
                disabled={false}
                selected={withdrawType === 'balanced'}
                onClick={() => {
                  setWithdrawType('balanced');
                }}
              >
                Balanced
              </RadioButton>
              <RadioButton
                iconVisible
                disabled={false}
                selected={withdrawType === 'custom'}
                onClick={() => {
                  setWithdrawType('custom');
                }}
              >
                Custom
              </RadioButton>
            </Box>

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}
            >
              {operateCurvePool.pool.coins.map((coin) => {
                return (
                  <RadioButton
                    iconVisible={
                      withdrawType === 'oneCoin' || withdrawType === 'balanced'
                    }
                    key={coin.address}
                    disabled={false}
                    selected={
                      withdrawType === 'oneCoin'
                        ? selectedOneCoin === coin.address
                        : true
                    }
                    onClick={() => {
                      if (withdrawType === 'oneCoin') {
                        setSelectedOneCoin(coin.address);
                      }
                    }}
                  >
                    <TokenLogo
                      width={24}
                      height={24}
                      address={coin.address}
                      chainId={coin.chainId}
                      noShowChain
                      noBorder
                      marginRight={0}
                    />
                    <Box
                      sx={{
                        typography: 'body1',
                        fontWeight: 600,
                        lineHeight: '22px',
                        color: theme.palette.text.primary,
                      }}
                    >
                      {coin.symbol}
                    </Box>
                    {(withdrawType === 'oneCoin' ||
                      withdrawType === 'balanced') && (
                      <Box
                        sx={{
                          ml: 'auto',
                          typography: 'body1',
                          fontWeight: 600,
                          lineHeight: '22px',
                          color: theme.palette.text.primary,
                        }}
                      >
                        0.123
                      </Box>
                    )}
                    {withdrawType === 'custom' && (
                      <Box
                        sx={{
                          ml: 'auto',
                        }}
                      >
                        <NumberInput
                          value={tokenInputs[coin.address] || ''}
                          onChange={(v) => {
                            handleInputChange(coin.address, v);
                          }}
                          decimals={coin.decimals}
                          sx={{
                            mt: 0,
                            '& input': {
                              fontSize: 16,
                              typography: 'body1',
                              lineHeight: '22px',
                              fontWeight: 600,
                              textAlign: 'right',
                              border: `1px solid ${theme.palette.border.main}`,
                              borderRadius: 8,
                              outline: 'none',
                              padding: 0,
                              color: 'text.primary',
                              height: 38,
                              width: 160,
                              px: 12,
                              '&::placeholder': {
                                fontSize: 16,
                                typography: 'body1',
                                lineHeight: '22px',
                                fontWeight: 600,
                                color: 'text.disabled',
                              },
                            },
                          }}
                        />
                      </Box>
                    )}
                  </RadioButton>
                );
              })}
            </Box>
          </Box>

          <SlippageSetting
            value={slipper}
            onChange={setSlipper}
            sx={
              {
                // width: 'auto',
                // display: 'inline-flex',
                // ml: 0,
              }
            }
          />
        </Box>

        <SlippageBonus />
      </Box>

      <OperateButtonContainer>
        <Button
          fullWidth
          disabled={false}
          isLoading={false}
          onClick={() => {
            //
          }}
        >
          Remove
        </Button>
      </OperateButtonContainer>
    </>
  );
};
