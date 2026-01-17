import { alpha, Box, useTheme } from '@dodoex/components';
import { t, Trans } from '@lingui/macro';
import React, { useEffect, useState } from 'react';
import { useRouterStore } from '../../../router';
import { Page, PageType } from '../../../router/types';
import GoBack from '../../../components/GoBack';
import WidgetContainer from '../../../components/WidgetContainer';
import { useWalletInfo } from '../../../hooks/ConnectWallet/useWalletInfo';
import { useWidgetDevice } from '../../../hooks/style/useWidgetDevice';
import { useCPDetail } from './hooks/useCPDetail';
import { BaseInfo } from './components/BaseInfo';
import { TokenInfo } from './components/TokenInfo';
import { CrowdpoolingInfo } from './components/CrowdpoolingInfo';
import { ActionCard } from './components/ActionCard';
import Confirm from '../../../components/Confirm';
import { useCPDynamicStatus } from './hooks/useCPDynamicStatus';
import ProjectInfo from './components/ProjectInfo';
import RiskDialog from '../../../components/RiskDialog';
import { RiskOncePageLocalStorageKey } from '../../../constants/localstorage';
import { useUserOptions } from '../../../components/UserOptionsProvider';
import { useGetCPIntro } from '../CrowdpoolingCreate/hooks/useGetCPIntro';

export default function CrowdpoolingDetail({
  params,
}: {
  params?: Page<PageType.CrowdpoolingDetail>['params'];
}) {
  const router = useRouterStore();
  const theme = useTheme();
  const { isMobile } = useWidgetDevice();
  const { dappMetadata } = useUserOptions();
  const { account, queryChainId } = useWalletInfo();

  const address = params?.address || '';
  const chainId = params?.chainId ?? queryChainId;

  const [noResultModalVisible, setNoResultModalVisible] = useState<
    'inital' | 'open' | 'close'
  >('inital');

  const { detail, loading, error, refetch } = useCPDetail({
    id: address,
    chainId,
    account,
  });

  const isSettled = detail?.settled;

  const { status } = useCPDynamicStatus({
    cp: detail,
    isSettled,
  });
  const fetchIntro = useGetCPIntro(detail?.chainId, detail?.id || '');

  // Handle not found
  useEffect(() => {
    if (!loading && !detail && !error) {
      setNoResultModalVisible('open');
    }
  }, [loading, detail, error]);

  const handleGotoList = () => {
    router.push({
      type: PageType.CrowdpoolingList,
    });
  };

  return (
    <WidgetContainer
      sx={{
        position: 'relative',
      }}
    >
      {/* Header */}

      <GoBack
        onClick={handleGotoList}
        sx={{
          ...(isMobile
            ? {
                position: 'absolute',
                top: 14,
                left: 20,
                zIndex: 1,
                color: alpha(
                  fetchIntro.data?.coverImg
                    ? theme.palette.primary.contrastText
                    : theme.palette.text.primary,
                  0.5,
                ),
              }
            : undefined),
        }}
      />

      {/* Main Content */}
      <Box
        sx={{
          display: 'flex',
          gap: 12,
          mt: {
            mobile: 0,
            tablet: 20,
          },
          pb: 20,
          flexDirection: {
            mobile: 'column-reverse',
            tablet: 'row',
          },
        }}
      >
        {/* Left Section */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            flex: 1,
            px: {
              mobile: 20,
              tablet: 0,
            },
          }}
        >
          {!isMobile && <ProjectInfo detail={detail} />}

          <BaseInfo detail={detail} />
          <TokenInfo detail={detail} />
          <CrowdpoolingInfo detail={detail} />
        </Box>

        {/* Right Section - Action Card */}
        <Box
          sx={
            !isMobile
              ? {
                  width: 360,
                  flexShrink: 0,
                }
              : {
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 28,
                }
          }
        >
          {isMobile && <ProjectInfo detail={detail} />}
          {isMobile ? (
            <Box
              sx={{
                px: 20,
              }}
            >
              <ActionCard detail={detail} status={status} refetch={refetch} />
            </Box>
          ) : (
            <ActionCard detail={detail} status={status} refetch={refetch} />
          )}
        </Box>
      </Box>

      <Confirm
        open={noResultModalVisible === 'open'}
        title={<Trans>Crowdpooling not found</Trans>}
        singleBtn
        onClose={() => setNoResultModalVisible('close')}
        onConfirm={() => setNoResultModalVisible('close')}
        modal
      />
      <RiskDialog
        type={RiskOncePageLocalStorageKey.CPJoinDetail}
        suffix={address}
        alertContent={t`Please double check that you have the correct token contract address. Note that malicious actors can create tokens that claim to represent other projects with the same names and you may incur significant losses by trading these fake tokens.
Cryptocurrencies are a high-risk asset class, so please always proceed with caution and beware of various risks. Participation in Crowdpooling is NOT risk-free. ${dappMetadata?.name || 'DEX'} is not liable and will not be offering compensations for any asset losses caused by factors such as project mismanagement, arbitrary and/or malicious token minting, and secondary market manipulation.`}
      />
    </WidgetContainer>
  );
}
