import {
  Box,
  ButtonBase,
  TabPanel,
  Tabs,
  TabsButtonGroup,
  Tooltip,
  useTheme,
} from '@dodoex/components';
import { Error } from '@dodoex/icons';
import { useState } from 'react';
import { AddressWithLinkAndCopy } from '../../../components/AddressWithLinkAndCopy';
import TokenLogo from '../../../components/TokenLogo';
import { useWalletInfo } from '../../../hooks/ConnectWallet/useWalletInfo';
import { PageType, useRouterStore } from '../../../router';
import { formatTokenAmountNumber } from '../../../utils';
import { OperateTab } from '../PoolOperate/hooks/usePoolOperateTabs';
import { Add } from './Add';
import { useLpTokenBalances } from './hooks/useLpTokenBalances';
import { Remove } from './Remove';
import { OperateCurvePoolT } from './types';

export interface AddOrRemoveProps {
  onClose?: () => void;
  poolDetailBtnVisible?: boolean;

  operateCurvePool: OperateCurvePoolT;
}

export const AddOrRemove = ({
  onClose,
  poolDetailBtnVisible = true,
  operateCurvePool,
}: AddOrRemoveProps) => {
  const theme = useTheme();
  const { account } = useWalletInfo();

  const [operateTab, setOperateTab] = useState(operateCurvePool.type);

  const [prevOperateTab, setPrevOperateTab] = useState(operateCurvePool.type);
  if (prevOperateTab !== operateCurvePool.type) {
    setPrevOperateTab(operateCurvePool.type);
    setOperateTab(operateCurvePool.type);
  }

  const { lpTokenBalance, userTokenBalances } = useLpTokenBalances({
    pool: operateCurvePool.pool,
    account,
  });

  return (
    <>
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          px: 20,
          pt: 20,
        }}
      >
        {onClose && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              borderBottom: '1px solid',
              borderColor: theme.palette.border.main,
            }}
          >
            <Box
              sx={{
                typography: 'body1',
                fontWeight: 600,
                lineHeight: '22px',
                pb: 17,
              }}
            >
              Liquidity
            </Box>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: 24,
                height: 24,
                borderRadius: '50%',
                borderWidth: 1,
                borderStyle: 'solid',
                borderColor: 'border.main',
                color: 'text.secondary',
                '&:hover': {
                  color: 'text.primary',
                },
              }}
              onClick={onClose}
              component={ButtonBase}
            >
              <Box
                component={Error}
                sx={{
                  width: 16,
                  height: 16,
                }}
              />
            </Box>
          </Box>
        )}

        <Box>
          {poolDetailBtnVisible && (
            <Box
              sx={{
                px: 20,
                py: 12,
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
                borderStyle: 'solid',
                borderColor: 'border.main',
                borderWidth: 1,
                borderBottom: 'none',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Box>
                <Box
                  sx={{
                    typography: 'body2',
                    fontWeight: 600,
                    lineHeight: '19px',
                    color: 'text.primary',
                  }}
                >
                  {operateCurvePool.pool.name}
                </Box>
                <AddressWithLinkAndCopy
                  address={operateCurvePool.pool.address}
                  customChainId={operateCurvePool.pool.chainId}
                  truncate
                  showCopy
                  iconDarkHover
                  iconSize={14}
                  iconSpace={4}
                  sx={{
                    typography: 'h6',
                    color: 'text.secondary',
                  }}
                />
              </Box>

              <Box
                component={ButtonBase}
                onClick={() => {
                  useRouterStore.getState().push({
                    type: PageType.CurvePoolDetail,
                    params: {
                      address: operateCurvePool.pool.address,
                      chainId: operateCurvePool.pool.chainId,
                    },
                  });
                }}
                sx={{
                  display: 'flex',
                  alignItems: 'center',

                  color: 'text.secondary',
                  '&:hover': {
                    color: 'text.primary',
                  },
                }}
              >
                <Box
                  sx={{
                    typography: 'body2',
                    fontWeight: 500,
                    lineHeight: '19px',
                  }}
                >
                  details
                </Box>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="19"
                  viewBox="0 0 18 19"
                  fill="none"
                >
                  <path
                    d="M7.49988 5L6.44238 6.0575L9.87738 9.5L6.44238 12.9425L7.49988 14L11.9999 9.5L7.49988 5Z"
                    fill="currentColor"
                  />
                </svg>
              </Box>
            </Box>
          )}

          <Box
            sx={{
              px: 20,
              py: 12,
              borderTopLeftRadius: poolDetailBtnVisible ? 0 : 8,
              borderTopRightRadius: poolDetailBtnVisible ? 0 : 8,
              borderBottomLeftRadius: 8,
              borderBottomRightRadius: 8,
              borderStyle: 'solid',
              borderColor: 'border.main',
              borderWidth: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: 12,
            }}
          >
            <Box
              sx={{
                typography: 'h6',
                fontWeight: 500,
                lineHeight: '16px',
                color: 'text.secondary',
              }}
            >
              My LP tokens
            </Box>
            <Tooltip
              title={
                <Box
                  sx={{
                    m: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 20,
                    minWidth: 216,
                  }}
                >
                  {userTokenBalances?.map((balance, index) => {
                    const coin = operateCurvePool.pool.coins[index];
                    return (
                      <Box
                        key={index}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                          typography: 'body2',
                          fontWeight: 600,
                          lineHeight: '14px',
                        }}
                      >
                        <TokenLogo
                          width={14}
                          height={14}
                          address={coin.address}
                          chainId={coin.chainId}
                          noShowChain
                          noBorder
                          marginRight={0}
                        />
                        <Box>{coin.symbol}</Box>
                        <Box
                          sx={{
                            ml: 'auto',
                          }}
                        >
                          {formatTokenAmountNumber({
                            input: balance,
                            decimals: coin.decimals,
                          })}
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              }
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <Box
                  sx={{
                    typography: 'body1',
                    fontWeight: 500,
                    lineHeight: '22px',
                    color: theme.palette.text.primary,
                  }}
                >
                  {formatTokenAmountNumber({
                    input: lpTokenBalance,
                    decimals: operateCurvePool.pool.decimals,
                  })}
                </Box>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8.00016 1.33325C4.32016 1.33325 1.3335 4.31992 1.3335 7.99992C1.3335 11.6799 4.32016 14.6666 8.00016 14.6666C11.6802 14.6666 14.6668 11.6799 14.6668 7.99992C14.6668 4.31992 11.6802 1.33325 8.00016 1.33325ZM7.3335 4.66658V5.99992H8.66683V4.66658H7.3335ZM7.3335 7.33325V11.3333H8.66683V7.33325H7.3335ZM2.66683 7.99992C2.66683 10.9399 5.06016 13.3333 8.00016 13.3333C10.9402 13.3333 13.3335 10.9399 13.3335 7.99992C13.3335 5.05992 10.9402 2.66659 8.00016 2.66659C5.06016 2.66659 2.66683 5.05992 2.66683 7.99992Z"
                    fill={theme.palette.text.secondary}
                  />
                </svg>
              </Box>
            </Tooltip>
          </Box>
        </Box>
      </Box>

      <Tabs
        value={operateTab}
        onChange={(_, value) => {
          setOperateTab(value as OperateTab);
        }}
      >
        <TabsButtonGroup
          tabs={[
            { key: OperateTab.Add, value: 'Add' },
            { key: OperateTab.Remove, value: 'Remove' },
          ]}
          variant="inPaper"
          tabsListSx={{
            mt: 16,
            mx: 20,
          }}
        />

        <TabPanel value={OperateTab.Add}>
          <Add operateCurvePool={operateCurvePool} />
        </TabPanel>
        <TabPanel value={OperateTab.Remove}>
          <Remove operateCurvePool={operateCurvePool} />
        </TabPanel>
      </Tabs>
    </>
  );
};
