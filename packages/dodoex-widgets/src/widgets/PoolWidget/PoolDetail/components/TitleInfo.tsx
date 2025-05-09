import {
  alpha,
  Box,
  ButtonBase,
  LoadingSkeleton,
  Skeleton,
  Tooltip,
  useTheme,
} from '@dodoex/components';
import { t, Trans } from '@lingui/macro';
import React from 'react';
import { AddressWithLinkAndCopy } from '../../../../components/AddressWithLinkAndCopy';
import { TokenLogoPair } from '../../../../components/TokenLogoPair';
import { useWalletInfo } from '../../../../hooks/ConnectWallet/useWalletInfo';
import { useWidgetDevice } from '../../../../hooks/style/useWidgetDevice';
import { useRouterStore } from '../../../../router';
import { PageType } from '../../../../router/types';
import { usePoolDetail } from '../../hooks/usePoolDetail';
import LiquidityLpPartnerReward from '../../../../components/LiquidityLpPartnerReward';
import { useUserOptions } from '../../../../components/UserOptionsProvider';
import { PoolApi } from '@dodoex/api';

export default function TitleInfo({
  poolDetail,
  loading,
}: {
  poolDetail?: ReturnType<typeof usePoolDetail>['poolDetail'];
  loading: boolean;
}) {
  const { address } = poolDetail ?? {};
  const theme = useTheme();
  const router = useRouterStore();
  const { account } = useWalletInfo();
  const { isMobile } = useWidgetDevice();
  const canEdit =
    account &&
    poolDetail?.type === 'DPP' &&
    poolDetail?.owner?.toLocaleLowerCase() === account.toLocaleLowerCase();
  const { supportAMMV2, onSharePool } = useUserOptions();

  return (
    <Box
      sx={{
        ...(isMobile
          ? {
              pt: 24,
            }
          : {
              pt: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }),
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {poolDetail?.baseToken ? (
          <TokenLogoPair
            tokens={[poolDetail.baseToken, poolDetail.quoteToken]}
            chainId={poolDetail.chainId}
            width={36}
            mr={8}
          />
        ) : (
          <Skeleton
            variant="circular"
            sx={{
              width: 36,
              height: 36,
              mr: 8,
            }}
          />
        )}
        <Box>
          <Box
            sx={{
              typography: 'h4',
            }}
          >
            {poolDetail?.baseToken
              ? `${poolDetail.baseToken?.symbol} / ${poolDetail.quoteToken?.symbol}`
              : '-'}
            {supportAMMV2 && (
              <Box
                component="span"
                sx={{
                  position: 'relative',
                  top: -4,
                  ml: 4,
                  px: 4,
                  py: 2,
                  borderRadius: 4,
                  fontSize: 10,
                  lineHeight: 1,
                  fontWeight: 600,
                  backgroundColor: alpha(theme.palette.purple.main, 0.1),
                  color: theme.palette.purple.main,
                }}
              >
                PMM
              </Box>
            )}

            <LiquidityLpPartnerReward
              address={address}
              chainId={poolDetail?.chainId}
              hideName={isMobile}
              sx={{
                display: 'inline-flex',
                ml: 8,
              }}
            />
            {canEdit && !isMobile ? (
              <Box
                component={ButtonBase}
                sx={{
                  typography: 'h6',
                  px: 8,
                  py: 2,
                  ml: 8,
                  borderStyle: 'solid',
                  borderWidth: 1,
                  borderRadius: 4,
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  whiteSpace: 'nowrap',
                  '&:hover': {
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                  },
                }}
                onClick={() => {
                  router.push({
                    type: PageType.ModifyPool,
                    params: {
                      address: poolDetail?.address,
                      chainId: poolDetail?.chainId,
                    },
                  });
                }}
              >
                <Trans>Edit</Trans>
              </Box>
            ) : (
              ''
            )}
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mr: 12,
            }}
          >
            <AddressWithLinkAndCopy
              address={address ?? ''}
              truncate
              showCopy
              iconDarkHover
              data-key="link"
              sx={{
                typography: 'body2',
                color: 'text.secondary',
              }}
              iconSize={14}
              iconSpace={6}
              customChainId={poolDetail?.chainId}
              onShareClick={
                onSharePool && poolDetail
                  ? () =>
                      onSharePool({
                        chainId: poolDetail.chainId,
                        baseToken: poolDetail.baseToken,
                        quoteToken: poolDetail.quoteToken,
                        poolId: address ?? '',
                        apy: poolDetail.apy,
                        isSingle: PoolApi.utils.singleSideLp(poolDetail.type),
                      })
                  : undefined
              }
            />
          </Box>
        </Box>
      </Box>

      <Box
        sx={
          isMobile
            ? {
                display: 'flex',
                alignItems: 'center',
                mt: 24,
              }
            : {
                textAlign: 'right',
              }
        }
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            color: 'success.main',
            typography: 'h4',
          }}
        >
          {poolDetail?.miningAddress ? (
            <Tooltip title={t`Add liquidity to obtain LP tokens for mining`}>
              <span>✨ </span>
            </Tooltip>
          ) : (
            ''
          )}
          <LoadingSkeleton
            loading={loading}
            loadingSx={{
              width: 100,
            }}
          >
            {poolDetail?.baseApy ?? '0%'}
          </LoadingSkeleton>
          {poolDetail?.quoteApy ? `/${poolDetail?.quoteApy}` : ''}
        </Box>
        <Box
          sx={{
            typography: 'body2',
            ...(isMobile
              ? {
                  ml: 4,
                }
              : {}),
          }}
        >
          <Trans>APY</Trans>
        </Box>
      </Box>
    </Box>
  );
}
