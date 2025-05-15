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
import { PoolOperateProps } from '../Ve33V2PoolOperate';
import Ve33V3AddLiquidity from './Ve33V3AddLiquidity';
import { getFetchVE33NonfungiblePositionManagerBalanceOfQueryOptions } from '@dodoex/dodo-contract-request';
import { useQuery } from '@tanstack/react-query';

export default function Ve33V3PoolOperateDialog({
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
      <Ve33V3PoolOperate {...props} />
    </Dialog>
  );
}

export function Ve33V3PoolOperate({
  sx,
  pool,
  operate,
  account,
  errorRefetch,
  submittedBack,
  onClose,
}: PoolOperateProps) {
  const chainId = pool?.chainId;

  const balanceQuery = useQuery(
    getFetchVE33NonfungiblePositionManagerBalanceOfQueryOptions(
      chainId,
      account,
    ),
  );

  return (
    <Box sx={sx}>
      {!pool || chainId === undefined || errorRefetch ? (
        <FailedList
          refresh={() => {
            // if (balanceInfo.userLpToTokenBalanceErrorRefetch) {
            //   balanceInfo.userLpToTokenBalanceErrorRefetch();
            // }
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
        <Box>
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
              <Trans>My Position</Trans>
            </Box>
            <Box
              sx={{
                mt: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontWeight: 600,
              }}
            >
              <LoadingSkeleton
                loading={balanceQuery.isLoading}
                loadingProps={{ width: 100 }}
              >
                {t`${balanceQuery.data?.toString() ?? 0} Position`}
              </LoadingSkeleton>
              <HoverOpacity
                sx={{
                  typography: 'bordy2',
                  cursor: 'pointer',
                }}
              >
                <Trans>Details</Trans>
                {'>'}
              </HoverOpacity>
            </Box>
          </Box>
          <Box
            sx={{
              mt: 20,
              px: 20,
            }}
          >
            <Ve33V3AddLiquidity pool={pool} />
          </Box>
        </Box>
      )}
    </Box>
  );
}
