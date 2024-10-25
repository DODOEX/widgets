import { MiningStatusE } from '@dodoex/api';
import {
  Box,
  ButtonBase,
  Tab,
  Tabs,
  TabsGroup,
  useTheme,
} from '@dodoex/components';
import { t } from '@lingui/macro';
import BigNumber from 'bignumber.js';
import { Dispatch, Fragment, SetStateAction, useMemo, useState } from 'react';
import { AddressWithLinkAndCopy } from '../../../components/AddressWithLinkAndCopy';
import TokenLogoSimple from '../../../components/TokenLogoSimple';
import { useWidgetDevice } from '../../../hooks/style/useWidgetDevice';
import { formatShortNumber, openEtherscanPage } from '../../../utils';
import { APRSection } from '../MiningList/components/APRSection';
import GoBack from '../MiningList/components/GoBack';
import { MiningTitle } from '../MiningList/components/MiningTitle';
import {
  MiningMiningI,
  MiningRewardTokenWithAprI,
  MiningStakeTokenWithAmountI,
  OperateType,
  TabMiningI,
} from '../types';
import { ReactComponent as LinkIcon } from './link.svg';
import { RewardCard } from './RewardCard';
import { CardWrapper, InnerCardWrapper, Item, OperateButton } from './widgets';

export function MiningInfo({
  status,
  stakedTokenList,
  onClose,
  onClick,
  setShareModalVisible,
  totalAprList,
  miningItem,
  rewardTokenWithAprListArray,
}: {
  stakedTokenList: Array<MiningStakeTokenWithAmountI>;
  onClose: () => void;
  onClick: (type: OperateType) => void;
  setShareModalVisible: Dispatch<SetStateAction<boolean>>;
  status: MiningStatusE;
  totalAprList: (BigNumber | undefined)[];
  miningItem: TabMiningI;
  rewardTokenWithAprListArray: MiningRewardTokenWithAprI[][];
}) {
  const theme = useTheme();
  const { isMobile } = useWidgetDevice();

  const {
    version,
    type,
    stakeTokenAddress,
    miningMinings,
    chainId,
    name,
    isGSP,
  } = miningItem;

  const [selectedStakeTokenIndex, setSelectedStakeTokenIndex] = useState<0 | 1>(
    0,
  );

  const rewardTokenWithAprList =
    rewardTokenWithAprListArray[selectedStakeTokenIndex];
  const miningMining = miningMinings[selectedStakeTokenIndex] as MiningMiningI;

  const tabItems = useMemo(() => {
    if (type === 'dvm' || type === 'lptoken') {
      return [
        {
          key: 0,
          value:
            stakedTokenList[0] && stakedTokenList[1]
              ? `${stakedTokenList[0].symbol}-${stakedTokenList[1].symbol} LP`
              : '- LP',
        },
      ];
    }
    return stakedTokenList.map((t, index) => ({
      key: index,
      value: `${t.symbol ?? '-'} LP`,
    }));
  }, [stakedTokenList, type]);

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mx: 20,
          [theme.breakpoints.up('tablet')]: {
            mx: 0,
          },
        }}
      >
        <GoBack onClick={onClose} />
        {isMobile && isGSP && null}
      </Box>

      {isMobile ? (
        <Box
          sx={{
            mt: 20,
            mx: 20,
          }}
        >
          <MiningTitle
            chainId={chainId}
            size="medium"
            title={name}
            titleTypography="h4"
            tokenPairs={stakedTokenList}
            type={type}
            setShareModalVisible={setShareModalVisible}
            stakeTokenAddress={stakeTokenAddress}
            miningContractAddress={miningMining.miningContractAddress}
          />
          <Box
            sx={{
              mt: 12,
              typography: 'body2',
              fontWeight: 500,
              color: theme.palette.text.secondary,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {totalAprList.map((apr, index) => {
              let labelSuffix: string | undefined;
              if (type === 'classical') {
                const { baseToken, quoteToken } = miningItem;
                labelSuffix =
                  index === 0 ? baseToken.symbol : quoteToken.symbol;
              }
              return (
                <Fragment key={index}>
                  {index > 0 && (
                    <Box
                      sx={{
                        width: '1px',
                        height: 8,
                        backgroundColor: theme.palette.border.main,
                        mx: 8,
                      }}
                    />
                  )}
                  {t`APR`}
                  {labelSuffix && `(${labelSuffix})`}
                  <Box
                    component="span"
                    sx={{
                      ml: 4,
                      color: theme.palette.success.main,
                    }}
                  >
                    <APRSection apr={apr} size="small" />
                  </Box>
                </Fragment>
              );
            })}
          </Box>
        </Box>
      ) : (
        <CardWrapper
          sx={{
            mt: 28,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <MiningTitle
            chainId={chainId}
            size="medium"
            title={name}
            titleTypography="h4"
            tokenPairs={stakedTokenList}
            type={type}
            setShareModalVisible={setShareModalVisible}
            stakeTokenAddress={stakeTokenAddress}
            miningContractAddress={miningMining.miningContractAddress}
          />

          {totalAprList.map((apr, index) => {
            let labelSuffix: string | undefined;
            if (type === 'classical') {
              const { baseToken, quoteToken } = miningItem;
              labelSuffix = index === 0 ? baseToken.symbol : quoteToken.symbol;
            }
            return (
              <Box
                key={index}
                sx={{
                  ml: index === 0 ? 'auto' : 48,
                }}
              >
                <Box
                  sx={{
                    color: theme.palette.success.main,
                    typography: 'h4',
                    fontWeight: 600,
                    textAlign: 'right',
                  }}
                >
                  <APRSection apr={apr} size="large" />
                </Box>
                <Box
                  sx={{
                    mt: 4,
                    color: theme.palette.text.secondary,
                    typography: 'body2',
                    textAlign: 'right',
                  }}
                >
                  {t`APR`}
                  {labelSuffix && `(${labelSuffix})`}
                </Box>
              </Box>
            );
          })}
        </CardWrapper>
      )}

      <Box
        sx={{
          mt: 12,
          px: 20,
          py: 20,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          gap: 12,
          backgroundColor: theme.palette.background.paper,
          [theme.breakpoints.up('tablet')]: {
            flexDirection: 'row',
            px: 0,
            py: 0,
            backgroundColor: 'unset',
          },
        }}
      >
        <InnerCardWrapper>
          <Item title={t`Liquidity Pool`}>
            <AddressWithLinkAndCopy
              address={stakeTokenAddress}
              customChainId={chainId}
              showCopy
              truncate
              iconSpace={6}
              iconSize={14}
            />
          </Item>
          <Item title={t`Mining Pool`}>
            <AddressWithLinkAndCopy
              key={miningMining.miningContractAddress}
              address={miningMining.miningContractAddress ?? '-'}
              customChainId={chainId}
              showCopy
              truncate
              iconSpace={6}
              iconSize={14}
            />
          </Item>
        </InnerCardWrapper>

        <InnerCardWrapper>
          {stakedTokenList.map((rt, index) => {
            return (
              <Item
                title={rt.symbol ?? '-'}
                key={rt.address ?? index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                {type === 'vdodo' ? null : (
                  <TokenLogoSimple
                    address={rt.address}
                    marginRight={0}
                    width={22}
                    height={22}
                    url={''}
                  />
                )}

                <Box
                  sx={{
                    typography: 'body1',
                    color: theme.palette.text.primary,
                    fontWeight: 600,
                  }}
                >
                  {formatShortNumber(rt.valueLockedAmount)}
                </Box>
                <Box
                  component={ButtonBase}
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    color: theme.palette.text.secondary,
                    width: 14,
                    height: 14,
                    '&:hover': {
                      color: theme.palette.text.primary,
                    },
                  }}
                  onClick={() => {
                    openEtherscanPage(`address/${rt.address}`, chainId);
                  }}
                >
                  <LinkIcon />
                </Box>
              </Item>
            );
          })}
        </InnerCardWrapper>
      </Box>

      <CardWrapper
        sx={{
          mt: 12,
          pt: 0,
          [theme.breakpoints.down('tablet')]: {
            pt: 0,
            borderRadius: 0,
            width: '100%',
            mb: 52,
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottomStyle: 'solid',
            borderBottomColor: theme.palette.border.main,
            borderBottomWidth: 1,
          }}
        >
          <Tabs
            value={selectedStakeTokenIndex}
            onChange={(_, v) =>
              setSelectedStakeTokenIndex(v as typeof selectedStakeTokenIndex)
            }
            sx={{
              border: 'none',
              '& .MuiTabs-indicator': {
                ml: 0,
                mb: 1,
                height: 3,
              },
            }}
          >
            <TabsGroup
              tabs={tabItems}
              variant="default"
              tabsListSx={{
                justifyContent: 'space-between',
                ...(isMobile
                  ? {
                      mb: 16,
                    }
                  : {
                      borderBottomWidth: 0,
                    }),
              }}
              tabSx={
                isMobile
                  ? undefined
                  : {
                      mb: 0,
                    }
              }
            />
          </Tabs>
          {/* <RewardsUpdateTip /> */}
        </Box>

        <Box
          sx={{
            mt: 16,
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          {rewardTokenWithAprList.map((rewardToken, index) => {
            return (
              <RewardCard
                key={rewardToken.address}
                index={index}
                rewardToken={rewardToken}
                miningContractAddress={miningMining.miningContractAddress}
                chainId={chainId}
                version={version}
                rewardUpdateHistoryList={[]}
              />
            );
          })}
        </Box>
      </CardWrapper>

      {isMobile && (
        <Box
          sx={{
            mt: 20,
            p: 20,
            backgroundColor: theme.palette.background.paperContrast,
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <OperateButton
            onClick={() => onClick('stake')}
            disabled={status === MiningStatusE.ended}
            sx={{
              color:
                theme.palette.mode === 'light'
                  ? theme.palette.text.primary
                  : theme.palette.primary.contrastText,
              backgroundColor: theme.palette.secondary.main,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M12.6668 8.66683H8.66683V12.6668H7.3335V8.66683H3.3335V7.3335H7.3335V3.3335H8.66683V7.3335H12.6668V8.66683Z"
                fill="currentColor"
              />
            </svg>
            {t`Stake`}
          </OperateButton>
          <Box
            sx={{
              width: 4,
              flexGrow: 0,
              flexShrink: 0,
            }}
          />
          <OperateButton onClick={() => onClick('unstake')}>
            <svg width="17" height="16" viewBox="0 0 17 16" fill="none">
              <path
                d="M13.1668 8.66683H3.8335V7.3335H13.1668V8.66683Z"
                fill="currentColor"
              />
            </svg>

            {t`Unstake`}
          </OperateButton>
          <Box
            sx={{
              width: 4,
              flexGrow: 0,
              flexShrink: 0,
            }}
          />
          <OperateButton onClick={() => onClick('claim')}>
            {t`Claim`}
          </OperateButton>
        </Box>
      )}
    </>
  );
}
