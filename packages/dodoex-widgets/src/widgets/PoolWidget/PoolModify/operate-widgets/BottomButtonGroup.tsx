import { ChainId } from '@dodoex/api';
import { useTheme, Button, Box } from '@dodoex/components';
import { t, Trans } from '@lingui/macro';
import { useQuery } from '@tanstack/react-query';
import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js';
import React from 'react';
import NeedConnectButton from '../../../../components/ConnectWallet/NeedConnectButton';
import TokenStatusButton from '../../../../components/TokenStatusButton';
import { useWidgetDevice } from '../../../../hooks/style/useWidgetDevice';
import { useTokenStatus } from '../../../../hooks/Token/useTokenStatus';
import { useRouterStore } from '../../../../router';
import { PageType } from '../../../../router/types';
import { useModifyDppPool } from '../../hooks/contract/useModifyDppPool';
import { usePoolDetail } from '../../hooks/usePoolDetail';
import ConfirmInfoDialog from '../../PoolCreate/components/ConfirmInfoDialog';
import { StateProps } from '../../PoolCreate/reducer';
import {
  DEFAULT_SLIPPAGE_COEFFICIENT,
  MAX_FEE_RATE,
  MAX_INIT_PRICE,
} from '../../PoolCreate/utils';
import { PoolTab } from '../../PoolList/hooks/usePoolListTabs';
import { poolApi } from '../../utils';

function NextButton({
  disabled,
  chainId,
  baseStatus,
  quoteStatus,
  onClick,
}: {
  disabled: boolean;
  chainId: ChainId | undefined;
  baseStatus: ReturnType<typeof useTokenStatus>;
  quoteStatus: ReturnType<typeof useTokenStatus>;
  onClick: () => void;
}) {
  const { account } = useWeb3React();

  if (!account) {
    return (
      <NeedConnectButton
        chainId={chainId}
        variant={Button.Variant.contained}
        fullWidth
        includeButton
      />
    );
  }

  if (
    baseStatus.needShowTokenStatusButton ||
    quoteStatus.needShowTokenStatusButton
  ) {
    return (
      <TokenStatusButton
        status={baseStatus.needShowTokenStatusButton ? baseStatus : quoteStatus}
        buttonProps={{
          variant: Button.Variant.contained,
          fullWidth: true,
        }}
      />
    );
  }

  return (
    <Button
      variant={Button.Variant.contained}
      fullWidth
      disabled={disabled}
      onClick={() => onClick()}
    >
      <Trans>Confirm</Trans>
    </Button>
  );
}

export function BottomButtonGroup({
  state,
  pool,
  loading,
}: {
  state: StateProps;
  pool?: ReturnType<typeof usePoolDetail>['poolDetail'];
  loading: boolean;
}) {
  const {
    baseToken,
    quoteToken,
    baseAmount,
    quoteAmount,
    initPrice,
    slippageCoefficient,
    feeRate,
  } = state;
  const pmmStateQuery = useQuery(
    poolApi.getPMMStateQuery(
      pool?.chainId,
      pool?.address,
      pool?.type,
      pool?.baseToken?.decimals,
      pool?.quoteToken?.decimals,
    ),
  );
  const theme = useTheme();
  const { isMobile } = useWidgetDevice();
  const { account } = useWeb3React();
  const router = useRouterStore();

  const [confirmModalVisible, setConfirmModalVisible] = React.useState(false);
  // Editing the dpp pool actually edits baseReserve and quoteReserve. The number of input boxes includes the reserve of the pool itself.
  // If the quantity increases, the increased quantity will be deducted from the user's balance. If the quantity decreases, the reduced quantity will be deducted from the pool.
  // So need to use the input value minus reserve to calculate the number of approvals required
  const baseAmountChange =
    pmmStateQuery.data && baseAmount
      ? new BigNumber(baseAmount).minus(pmmStateQuery.data.baseReserve)
      : undefined;
  const quoteAmountChange =
    pmmStateQuery.data && quoteAmount
      ? new BigNumber(quoteAmount).minus(pmmStateQuery.data.quoteReserve)
      : undefined;
  const isRemove = baseAmountChange?.lt(0);

  const baseStatus = useTokenStatus(baseToken, {
    amount: baseAmountChange,
  });
  const quoteStatus = useTokenStatus(quoteToken, {
    amount: quoteAmountChange,
  });

  // amount can be 0, that is, all is extracted
  let disabled =
    !pool ||
    loading ||
    !baseAmount ||
    Number(baseAmount) < 0 ||
    !quoteAmount ||
    Number(quoteAmount) < 0;
  if (!disabled && quoteToken) {
    const initPriceBN = new BigNumber(initPrice);
    const decimalsLimit = Math.min(quoteToken.decimals, 16);
    if (
      !initPrice ||
      initPriceBN.isNaN() ||
      initPriceBN.lt(`1e-${decimalsLimit}`) ||
      initPriceBN.gt(MAX_INIT_PRICE)
    ) {
      disabled = true;
    }

    const slippageCoefficientBN = new BigNumber(slippageCoefficient);
    if (
      !slippageCoefficient ||
      slippageCoefficientBN.isNaN() ||
      slippageCoefficientBN.lt(0) ||
      slippageCoefficientBN.gt(DEFAULT_SLIPPAGE_COEFFICIENT)
    ) {
      disabled = true;
    }

    const feeRateBN = new BigNumber(feeRate);
    if (
      !feeRate ||
      feeRateBN.isNaN() ||
      feeRateBN.lt(0) ||
      feeRateBN.gt(MAX_FEE_RATE)
    ) {
      disabled = true;
    }
  }

  const { modifyDPPMutation } = useModifyDppPool({
    pool: pool || undefined,
  });

  return (
    <>
      <Box
        sx={{
          position: 'sticky',
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: theme.palette.background.paperContrast,
          px: 20,
          py: 20,
          ...(isMobile
            ? {}
            : {
                position: 'static',
                backgroundColor: 'transparent',
                py: 0,
              }),
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        {isMobile && !!account && (
          <Button
            variant={Button.Variant.second}
            fullWidth
            onClick={() => {
              router.back();
            }}
          >
            <Trans>Cancel</Trans>
          </Button>
        )}
        <NextButton
          disabled={disabled}
          chainId={pool?.chainId}
          baseStatus={baseStatus}
          quoteStatus={quoteStatus}
          onClick={() => setConfirmModalVisible(true)}
        />
      </Box>

      <ConfirmInfoDialog
        on={confirmModalVisible}
        onClose={() => setConfirmModalVisible(false)}
        state={state}
        isModify
        loading={modifyDPPMutation.isPending}
        onConfirm={() => {
          modifyDPPMutation.mutate({
            txTitle: t`Set pool parameters`,
            baseAmount: baseAmountChange?.toString() ?? '',
            quoteAmount: quoteAmountChange?.toString() ?? '',
            isRemove,
            feeRate: state.feeRate,
            initPrice: state.initPrice,
            slippageCoefficient: state.slippageCoefficient,
            submittedBack: () => {
              setConfirmModalVisible(false);
              router.push({
                type: PageType.Pool,
                params: {
                  tab: PoolTab.myCreated,
                },
              });
            },
          });
        }}
      />
    </>
  );
}
