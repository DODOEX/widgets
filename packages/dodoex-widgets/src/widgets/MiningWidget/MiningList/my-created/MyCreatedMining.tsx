import { useTheme } from '@dodoex/components';
import { useLingui } from '@lingui/react';
import { useContext, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import TokenLogo from '../../../../components/TokenLogo';
import { useWidgetDevice } from '../../../../hooks/style/useWidgetDevice';
import { useMyCreatedMiningList } from '../../hooks/useMyCreatedMiningList';
import { MiningERC20TokenI, MyCreatedMiningI } from '../../types';
import { ManageButtonList } from '../components/ManageButtonList';
import { MiningCardLayout } from '../components/MiningCardLayout';
import { MiningTags } from '../components/MiningTags';
import { MiningTitle } from '../components/MiningTitle';
import { TextAndDesc } from '../components/widgets';
import { MiningContext } from '../contexts';
import { EARN_MINING_CREATE_AREA, getDetailWrapperEle } from '../utils';
import { OperateArea } from './OperateArea';

export function MyCreatedMining({
  miningItem,
  refetch,
}: {
  miningItem: MyCreatedMiningI;
  refetch: ReturnType<typeof useMyCreatedMiningList>['refetch'];
}) {
  const {
    chainId,
    type,
    name,
    lpToken,
    token,
    rewardTokenList,
    miningContractAddress,
    id,
    status,
    apy,
    participantsNum,
  } = miningItem;

  const { operateId, setOperateId, setViewType } = useContext(MiningContext);

  const theme = useTheme();
  const { i18n } = useLingui();
  const { isMobile } = useWidgetDevice();

  const [shareModalVisible, setShareModalVisible] = useState(false);

  const tokenPairs = useMemo<Array<MiningERC20TokenI>>(() => {
    if (type === 'single') {
      return [token];
    }
    return [lpToken.baseToken, lpToken.quoteToken];
  }, [lpToken.baseToken, lpToken.quoteToken, token, type]);

  const stakeTokenAddress = type === 'lptoken' ? lpToken.id : token.address;
  const operateAreaEle = document.getElementById(
    EARN_MINING_CREATE_AREA,
  ) as HTMLElement;
  const detailEle = getDetailWrapperEle();
  return (
    <>
      <MiningCardLayout
        headerLeft={
          <MiningTitle
            chainId={chainId}
            size="small"
            title={name}
            titleTypography="body2"
            tokenPairs={tokenPairs}
            type={type}
            address={miningContractAddress}
            stakeTokenAddress={stakeTokenAddress}
            miningContractAddress={miningContractAddress}
          />
        }
        headerRight={<MiningTags type={status} />}
        footer={
          <ManageButtonList
            chainId={chainId}
            operating={operateId === id}
            onClick={() => {
              if (isMobile) {
                setViewType('view');
                window.scrollTo({
                  top: 0,
                });
              }
              setOperateId(id);
            }}
            stakeTokenAddress={stakeTokenAddress}
            miningContractAddress={miningContractAddress}
          />
        }
      >
        <TextAndDesc
          text={
            <>
              {rewardTokenList.map((rewardToken) => {
                if (!token) {
                  return null;
                }
                return (
                  <TokenLogo
                    key={rewardToken.address}
                    address={rewardToken.address}
                    width={20}
                    height={20}
                    chainId={chainId}
                    url={rewardToken.logoImg}
                    noShowChain
                    marginRight={4}
                  />
                );
              })}
            </>
          }
          sx={{
            pr: 28,
            minWidth: 37,
            position: 'relative',
            '&:after': {
              position: 'absolute',
              content: '""',
              top: 8,
              right: 0,
              height: 24,
              width: '1px',
              backgroundColor: theme.palette.border.main,
            },
          }}
        >
          {i18n._('Rewards')}
        </TextAndDesc>

        <TextAndDesc
          text={participantsNum ?? '-'}
          sx={{
            pl: 28,
          }}
        >
          {i18n._('Users')}
        </TextAndDesc>
      </MiningCardLayout>

      {operateId === id &&
        createPortal(
          <OperateArea
            onClose={() => {
              if (isMobile) {
                setViewType(null);
              }
              setOperateId(null);
            }}
            setShareModalVisible={setShareModalVisible}
            miningItem={miningItem}
            tokenPairs={tokenPairs}
            refetch={refetch}
          />,
          isMobile ? detailEle : operateAreaEle,
        )}
    </>
  );
}
