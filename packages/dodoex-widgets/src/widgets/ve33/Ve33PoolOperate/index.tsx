import {
  Tabs,
  TabPanel,
  TabsButtonGroup,
  Box,
  HoverOpacity,
  Tooltip,
  LoadingSkeleton,
} from '@dodoex/components';
import { FailedList } from '../../../components/List/FailedList';
import { AddPoolOperate } from './AddPoolOperate';
import { RemovePoolOperate } from './RemovePoolOperate';
import { OperateTypeE, Ve33PoolInfoI } from '../types';
import { useLingui } from '@lingui/react';
import { DetailBorder, Error } from '@dodoex/icons';
import React from 'react';
import { t, Trans } from '@lingui/macro';
import { useWidgetDevice } from '../../../hooks/style/useWidgetDevice';
import Dialog from '../../../components/Dialog';
import { BoxProps } from '@dodoex/components';
import { TokenLogoPair } from '../../../components/TokenLogoPair';
import { PoolTypeTag } from '../components/PoolTypeTag';
import { AddressWithLinkAndCopy } from '../../../components/AddressWithLinkAndCopy';
import TokenItem from '../../../components/Token/TokenItem';
import { formatTokenAmountNumber } from '../../../utils';
import { useVe33V2BalanceInfo } from './hooks/useVe33V2BalanceInfo';

export interface PoolOperateProps {
  sx?: BoxProps['sx'];
  pool?: Ve33PoolInfoI;
  account?: string;
  operate?: OperateTypeE;
  errorRefetch?: () => void;
  submittedBack?: () => void;
  onClose?: () => void;
}

export default function PoolOperateDialog({
  modal,
  ...props
}: PoolOperateProps & {
  modal?: boolean;
}) {
  const { isMobile } = useWidgetDevice();

  return (
    <Dialog
      open={!!props.pool}
      onClose={props.onClose}
      scope={!isMobile}
      modal={modal}
      id="pool-operate"
    >
      <PoolOperate {...props} />
    </Dialog>
  );
}

export function PoolOperate({
  sx,
  pool,
  operate,
  account,
  errorRefetch,
  submittedBack,
  onClose,
}: PoolOperateProps) {
  const { operateTab, operateTabs, handleChangeTab } =
    usePoolOperateTabs(operate);
  const chainId = pool?.chainId;

  const balanceInfo = useVe33V2BalanceInfo({
    pool,
    account,
  });

  return (
    <Box sx={sx}>
      {!pool ||
      chainId === undefined ||
      balanceInfo.userLpToTokenBalanceErrorRefetch ||
      errorRefetch ? (
        <FailedList
          refresh={() => {
            if (balanceInfo.userLpToTokenBalanceErrorRefetch) {
              balanceInfo.userLpToTokenBalanceErrorRefetch();
            }
            if (errorRefetch) {
              errorRefetch();
            }
          }}
          sx={{
            my: 40,
            height: '100%',
          }}
        />
      ) : (
        <Tabs
          value={operateTab}
          onChange={(_, value) => {
            handleChangeTab(value as OperateTypeE);
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              p: 20,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <TokenLogoPair
                chainId={chainId}
                tokens={[pool.baseToken, pool.quoteToken]}
                width={28}
                height={28}
              />
              <Box>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <Box
                    sx={{
                      fontWeight: 600,
                    }}
                  >
                    {pool.baseToken.symbol}/{pool.quoteToken.symbol}
                  </Box>
                  <PoolTypeTag
                    type={pool.type}
                    stable={pool.stable}
                    fee={pool.fee}
                  />
                </Box>
                <AddressWithLinkAndCopy
                  address={pool.id}
                  customChainId={chainId}
                  truncate
                  showCopy
                  iconSize={14}
                  iconSpace={4}
                  sx={{
                    mt: 2,
                    typography: 'h6',
                  }}
                >
                  <Tooltip
                    sx={{
                      width: 240,
                    }}
                    title={
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 8,
                          typography: 'h6',
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          <Trans>Pool Adress</Trans>
                          <AddressWithLinkAndCopy
                            address={pool.id}
                            iconSize={14}
                            iconSpace={4}
                            truncate
                            disabledAddress
                            disabledAddressIcon
                            showCopy
                            sx={{
                              typography: 'h6',
                            }}
                          />
                        </Box>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          <Trans>Gauge Adress</Trans>
                          <AddressWithLinkAndCopy
                            address={pool.gaugeAddress}
                            iconSize={14}
                            iconSpace={4}
                            truncate
                            disabledAddress
                            disabledAddressIcon
                            showCopy
                            sx={{
                              typography: 'h6',
                            }}
                          />
                        </Box>
                      </Box>
                    }
                  >
                    <HoverOpacity sx={{ ml: 4, cursor: 'pointer' }}>
                      <Box
                        component={DetailBorder}
                        sx={{
                          width: 14,
                          height: 14,
                        }}
                      />
                    </HoverOpacity>
                  </Tooltip>
                </AddressWithLinkAndCopy>
              </Box>
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
                  borderStyle: 'solid',
                  borderColor: 'divider',
                  color: 'text.secondary',
                  cursor: 'pointer',
                  '&:hover': {
                    color: 'text.primary',
                  },
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
              mx: 20,
              px: 20,
              py: 12,
              borderWidth: 1,
              borderStyle: 'solid',
              borderColor: 'border.main',
              borderRadius: 8,
            }}
          >
            <Box
              sx={{
                typography: 'h6',
                color: 'text.secondary',
              }}
            >
              <Trans>My Liquidity</Trans>
            </Box>
            <Box
              sx={{
                mt: 12,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                fontWeight: 600,
              }}
            >
              <TokenLogoPair
                chainId={chainId}
                tokens={[pool.baseToken, pool.quoteToken]}
                width={20}
                height={20}
              />
              <LoadingSkeleton
                loading={balanceInfo.userLpQuery.isLoading}
                loadingSx={{
                  width: 50,
                }}
                component="span"
              >
                {formatTokenAmountNumber({
                  input: balanceInfo.userLp,
                  decimals: 18,
                })}
              </LoadingSkeleton>
              {`${pool.baseToken.symbol}/${pool.quoteToken.symbol}`}
              <Tooltip
                sx={{
                  width: 240,
                }}
                title={
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 20,
                      typography: 'body2',
                      color: 'text.primary',
                      fontWeight: 600,
                    }}
                  >
                    <TokenItem
                      chainId={chainId}
                      address={pool.baseToken.address}
                      showName={pool.baseToken.symbol}
                      size={14}
                      offset={4}
                      rightContent={
                        <LoadingSkeleton
                          loading={balanceInfo.userLpToTokenBalanceLoading}
                        >
                          {formatTokenAmountNumber({
                            input: balanceInfo.userLpToToken0,
                            decimals: pool.baseToken.decimals,
                          })}
                        </LoadingSkeleton>
                      }
                    />
                    <TokenItem
                      chainId={chainId}
                      address={pool.quoteToken.address}
                      showName={pool.quoteToken.symbol}
                      size={14}
                      offset={4}
                      rightContent={
                        <LoadingSkeleton
                          loading={balanceInfo.userLpToTokenBalanceLoading}
                        >
                          {formatTokenAmountNumber({
                            input: balanceInfo.userLpToToken1,
                            decimals: pool.quoteToken.decimals,
                          })}
                        </LoadingSkeleton>
                      }
                    />
                  </Box>
                }
              >
                <HoverOpacity
                  sx={{
                    display: 'flex',
                    cursor: 'pointer',
                    width: 16,
                    height: 16,
                    '& > svg': {
                      width: '100%',
                      height: '100%',
                    },
                  }}
                >
                  <DetailBorder />
                </HoverOpacity>
              </Tooltip>
            </Box>
          </Box>
          <TabsButtonGroup
            tabs={operateTabs}
            variant="inPaper"
            tabsListSx={{
              mt: 16,
              mx: 20,
            }}
          />
          <TabPanel value={OperateTypeE.Add}>
            <AddPoolOperate pool={pool} submittedBack={submittedBack} />
          </TabPanel>
          <TabPanel value={OperateTypeE.Remove}>
            <RemovePoolOperate pool={pool} submittedBack={submittedBack} />
          </TabPanel>
        </Tabs>
      )}
    </Box>
  );
}

export function usePoolOperateTabs(defaultValue = OperateTypeE.Add) {
  const { i18n } = useLingui();
  const [operateTab, setOperateTab] = React.useState(defaultValue);
  const operateTabs = React.useMemo(
    () => [
      { key: OperateTypeE.Add, value: t`Add` },
      { key: OperateTypeE.Remove, value: t`Remove` },
    ],
    [i18n._],
  );

  const handleChangeTab = (poolTab: OperateTypeE) => {
    setOperateTab(poolTab);
  };

  React.useEffect(() => {
    setOperateTab(defaultValue);
  }, [defaultValue]);

  return {
    operateTab,
    operateTabs,
    handleChangeTab,
  };
}
