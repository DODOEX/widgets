import { Box } from '@dodoex/components';
import React from 'react';
import { TokenCard } from '../../../components/Swap/components/TokenCard';

export function AddPoolOperate({
  refetch,
  submittedBack: submittedBackProps,
  onlyShowSide,
}: {
  refetch?: () => void;
  submittedBack?: () => void;
  onlyShowSide?: 'base' | 'quote';
}) {
  return (
    <>
      <Box
        sx={{
          px: 20,
        }}
      >
        <Box
          sx={{
            pt: 20,
          }}
        >
          {onlyShowSide === 'quote' ? (
            ''
          ) : (
            <TokenInputDialogCard
              value={baseAmount}
              // 合约上会根据池子状态计算amount，会有偶发的精度误差，导致和params.value不想等被revert，这个问题没办法解决.所以暂时关闭切换入口
              // onSwitchEtherToken={
              //   pool?.poolType === 'DPP'
              //     ? undefined
              //     : baseTokenShow.onSwitchEtherToken
              // }
              check
              readOnly={loadingPool || !canOperate}
              setStatus={setBaseInputStatus}
              onChange={handleChangeBaseAmount}
              token={baseTokenShow.token ?? null}
              tokenLoading={loadingPool}
            />
          )}
          {onlyShowSide ? '' : <CardPlus />}
          {onlyShowSide === 'base' ? (
            ''
          ) : (
            <TokenCard
              check
              readOnly={loadingPool || pool?.isSellPool || !canOperate}
              // 合约上会根据池子状态计算amount，会有偶发的精度误差，导致和params.value不想等被revert，这个问题没办法解决.所以暂时关闭切换入口
              // onSwitchEtherToken={
              //   pool?.poolType === 'DPP'
              //     ? undefined
              //     : quoteTokenShow.onSwitchEtherToken
              // }
              value={quoteAmount}
              setStatus={setQuoteInputStatus}
              onChange={handleChangeQuoteAmount}
              token={quoteTokenShow.token ?? null}
              tokenLoading={loadingPool}
            />
          )}
          <LoadingSkeleton loading={loadingPool}>
            <SlippageSetting
              value={slipper}
              onChange={setSlipper}
              disabled={!canOperate}
            />
            <Ratio
              operateLq={pool as OperatePool}
              active={dataUpdateActive}
              addPortion={addPortion}
              midPrice={midPrice}
              refetch={
                refetch
                  ? () => {
                      setDataUpdateActive(true);
                      refetch();
                    }
                  : undefined
              }
            />
          </LoadingSkeleton>
        </Box>
      </Box>

      <Footer
        baseInputStatus={baseInputStatus}
        quoteInputStatus={quoteInputStatus}
        disabled={disabled}
        lqAndDodoCompare={lqAndDodoCompare}
        midPrice={midPrice}
        isShowCompare={isShowCompare}
        isWarnCompare={isWarnCompare}
        pool={pool}
        submitBtnText={submitBtnText}
        hasFeeTokenSymbol=""
        onSubmit={() => {
          if (disabled) return;
          if (isWarnCompare) {
            setShowCompareConfirm(true);
            return;
          }
          submitLq();
        }}
      />
      <Confirm
        on={showCompareConfirm}
        onClose={() => setShowCompareConfirm(false)}
        title={t('liquidity.operate.compare-price.confirm.title') as string}
        onConfirm={submitLq}
      >
        <Box>
          <Box>
            {t('liquidity.operate.compare-price.confirm.msg1', {
              percentage: lqAndDodoCompareText,
            })}
          </Box>
          <Box>{t('liquidity.operate.compare-price.confirm.msg2')}</Box>
        </Box>
      </Confirm>
    </>
  );
}
