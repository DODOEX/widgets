import {
  Box,
  Button,
  ButtonBase,
  TabPanel,
  Tabs,
  TabsGroup,
  Tooltip,
  useTheme,
} from '@dodoex/components';
import { Plus as PlusIcon } from '@dodoex/icons';
import { Trans, t } from '@lingui/macro';
import { useWeb3React } from '@web3-react/core';
import React from 'react';
import { HowItWorks } from '../../../components/HowItWorks';
import { useUserOptions } from '../../../components/UserOptionsProvider';
import WidgetContainer from '../../../components/WidgetContainer';
import { useWidgetDevice } from '../../../hooks/style/useWidgetDevice';
import { useRouterStore } from '../../../router';
import { Page, PageType } from '../../../router/types';
import { AMMV3PositionsView } from '../AMMV3/AMMV3PositionsView';
import { FeeAmount } from '../AMMV3/sdks/v3-sdk';
import PoolOperateDialog, {
  PoolOperate,
  PoolOperateProps,
} from '../PoolOperate';
import AddLiquidityList from './AddLiquidity';
import { usePoolListFilterChainId } from './hooks/usePoolListFilterChainId';
import { PoolTab, usePoolListTabs } from './hooks/usePoolListTabs';
import MyCreated from './MyCreated';
import MyLiquidity from './MyLiquidity';
import { ReactComponent as LeftImage } from './pool-left.svg';

function TabPanelFlexCol({ sx, ...props }: Parameters<typeof TabPanel>[0]) {
  return (
    <TabPanel
      {...props}
      sx={{
        ...sx,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    />
  );
}

function CreateItem({
  onClick,
  title,
  desc,
}: {
  onClick: () => void;
  title: React.ReactNode;
  desc: React.ReactNode;
}) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        px: 16,
        py: 8,
      }}
    >
      <ButtonBase
        onClick={onClick}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
          p: 8,
          borderRadius: 8,
          '&:hover': {
            backgroundColor: theme.palette.background.tag,
          },
        }}
      >
        <Box
          sx={{
            typography: 'body1',
            fontWeight: 600,
          }}
        >
          {title}
        </Box>
        <Box
          sx={{
            typography: 'h6',
            fontWeight: 500,
            color: theme.palette.text.secondary,
          }}
        >
          {desc}
        </Box>
      </ButtonBase>
    </Box>
  );
}

export default function PoolList({
  params,
}: {
  params?: Page<PageType.Pool>['params'];
}) {
  const theme = useTheme();
  const { isMobile } = useWidgetDevice();
  const noDocumentLink = useUserOptions((state) => state.noDocumentLink);
  const { supportAMMV2, supportAMMV3 } = useUserOptions();
  const scrollParentRef = React.useRef<HTMLDivElement>(null);
  const { account } = useWeb3React();
  const { poolTab, tabs, handleChangePoolTab } = usePoolListTabs({
    account,
    paramsTab: params?.tab,
  });
  const { activeChainId, filterChainIds, handleChangeActiveChainId } =
    usePoolListFilterChainId();

  const [operatePool, setOperatePool] =
    React.useState<Partial<PoolOperateProps> | null>(null);

  return (
    <WidgetContainer
      sx={{
        ...(isMobile
          ? {
              p: 20,
            }
          : {
              display: 'flex',
              gap: 12,
              flex: 1,
            }),
      }}
      ref={scrollParentRef}
    >
      <Tabs
        value={poolTab}
        onChange={(_, value) => {
          handleChangePoolTab(value as PoolTab);
        }}
        sx={
          isMobile
            ? {}
            : {
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 16,
                backgroundColor: 'background.paper',
                flex: 1,
                overflow: 'hidden',
                height: 'max-content',
                maxHeight: '100%',
              }
        }
      >
        <Box
          sx={
            isMobile
              ? {}
              : {
                  display: 'flex',
                  justifyContent: 'space-between',
                  p: 20,
                  borderBottomWidth: 1,
                }
          }
        >
          <TabsGroup
            tabs={tabs}
            variant="rounded"
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
          {supportAMMV2 || supportAMMV3 ? (
            <Tooltip
              arrow={false}
              leaveDelay={300}
              placement={isMobile ? 'bottom' : 'bottom-end'}
              sx={{
                p: 0,
              }}
              title={
                <Box>
                  <CreateItem
                    onClick={() => {
                      useRouterStore.getState().push({
                        type: PageType.CreatePool,
                      });
                    }}
                    title={<Trans>PMM Pool</Trans>}
                    desc={<Trans>Description of this type of pool</Trans>}
                  />
                  {supportAMMV2 && (
                    <CreateItem
                      onClick={() => {
                        useRouterStore.getState().push({
                          type: PageType.createPoolAMMV2,
                        });
                      }}
                      title={<Trans>AMM V2 Position</Trans>}
                      desc={<Trans>Description of this type of pool</Trans>}
                    />
                  )}
                  {supportAMMV3 && (
                    <CreateItem
                      onClick={() => {
                        useRouterStore.getState().push({
                          type: PageType.createPoolAMMV3,
                        });
                      }}
                      title={<Trans>AMM V3 Position</Trans>}
                      desc={<Trans>Description of this type of pool</Trans>}
                    />
                  )}
                </Box>
              }
            >
              <Box
                sx={{
                  width: isMobile ? '100%' : 'auto',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  pl: 8,
                  pr: 16,
                  py: 7,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: theme.palette.text.primary,
                  typography: 'body1',
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: theme.palette.background.tag,
                  },
                }}
              >
                <Box component={PlusIcon} />
                <Trans>Create Pool</Trans>
              </Box>
            </Tooltip>
          ) : (
            <Button
              variant={Button.Variant.outlined}
              fullWidth={isMobile}
              onClick={() => {
                useRouterStore.getState().push({
                  type: PageType.CreatePool,
                });
              }}
              sx={{
                height: 40,
              }}
            >
              <Box
                component={PlusIcon}
                sx={{
                  mr: 4,
                }}
              />
              <Trans>Create Pool</Trans>
            </Button>
          )}
        </Box>
        <TabPanelFlexCol
          value={PoolTab.addLiquidity}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <AddLiquidityList
            account={account}
            filterChainIds={filterChainIds}
            scrollParentRef={scrollParentRef}
            activeChainId={activeChainId}
            handleChangeActiveChainId={handleChangeActiveChainId}
            operatePool={operatePool}
            setOperatePool={setOperatePool}
          />
        </TabPanelFlexCol>
        <TabPanelFlexCol value={PoolTab.myLiquidity}>
          <MyLiquidity
            account={account}
            filterChainIds={filterChainIds}
            activeChainId={activeChainId}
            handleChangeActiveChainId={handleChangeActiveChainId}
            operatePool={operatePool}
            setOperatePool={setOperatePool}
          />
        </TabPanelFlexCol>
        <TabPanelFlexCol value={PoolTab.myCreated}>
          <MyCreated
            account={account}
            filterChainIds={filterChainIds}
            activeChainId={activeChainId}
            handleChangeActiveChainId={handleChangeActiveChainId}
            operatePool={operatePool}
            setOperatePool={setOperatePool}
          />
        </TabPanelFlexCol>
      </Tabs>
      <Box
        sx={{
          position: 'relative',
          width: noDocumentLink && !operatePool ? 'auto' : 375,
        }}
      >
        {!noDocumentLink && (
          <HowItWorks
            title={t`Liquidity`}
            desc={t`Classical AMM-like pool. Suitable for most assets.`}
            linkTo="https://docs.dodoex.io/product/tutorial/how-to-provide-liquidity"
            LeftImage={LeftImage}
          />
        )}
        {operatePool?.pool?.type === 'AMMV3' && operatePool.chainId ? (
          <AMMV3PositionsView
            account={account}
            chainId={operatePool.chainId}
            baseToken={operatePool.pool.baseToken}
            quoteToken={operatePool.pool.quoteToken}
            feeAmount={FeeAmount.HIGH}
            onClose={() => setOperatePool(null)}
          />
        ) : isMobile ? (
          <PoolOperateDialog
            account={account}
            onClose={() => setOperatePool(null)}
            modal={isMobile}
            {...operatePool}
          />
        ) : (
          !!operatePool && (
            <PoolOperate
              account={account}
              onClose={() => setOperatePool(null)}
              {...operatePool}
              sx={{
                width: 375,
                height: 'max-content',
                backgroundColor: 'background.paper',
                borderRadius: 16,
                overflow: 'hidden',
              }}
            />
          )
        )}
      </Box>
    </WidgetContainer>
  );
}
