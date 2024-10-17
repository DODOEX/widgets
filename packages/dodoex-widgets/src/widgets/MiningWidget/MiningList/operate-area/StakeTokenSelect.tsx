import { Box, BoxProps, useTheme } from '@dodoex/components';
import { Dispatch, SetStateAction } from 'react';
import { TokenLogoPair } from '../../../../components/TokenLogoPair';
import {
  MiningStakeTokenWithAmountI,
  OperateDataProps,
  TabMiningI,
} from '../../types';
import { GetLpLink } from './GetLpLink';
import { getOptTokenPairs, getOptTokenSymbol } from './utils';

function StakeTokenSelectItem({
  selected,
  onClick,
  operateType,
  sx,
  goLpLink,
  token,
  customChainId,
}: {
  selected: boolean;
  onClick: () => void;
  sx?: BoxProps['sx'];
  goLpLink: (() => Promise<void>) | undefined;
  token: MiningStakeTokenWithAmountI;
  customChainId?: number;
} & Pick<OperateDataProps, 'operateType'>) {
  const theme = useTheme();

  const tokenSymbol = `${token.symbol ?? '-'} LP`;
  return (
    <Box
      sx={{
        px: 20,
        py: 12,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: 'pointer',
        ...sx,
      }}
      onClick={onClick}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <TokenLogoPair
          width={operateType === 'stake' && goLpLink ? 28 : 24}
          tokens={[
            {
              address: token.address,
              logoURI: token.logoImg,
            },
          ]}
          chainId={customChainId}
        />

        <Box
          sx={{
            ml: 8,
          }}
        >
          <Box
            sx={{
              typography: 'body1',
              color: theme.palette.text.primary,
              fontWeight: 600,
            }}
          >
            {tokenSymbol}
          </Box>
          {operateType === 'stake' && goLpLink && (
            <GetLpLink tokenSymbol={tokenSymbol} goLpLink={goLpLink} />
          )}
        </Box>
      </Box>

      <Box
        sx={{
          color: selected
            ? theme.palette.success.main
            : theme.palette.text.secondary,
        }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <rect
            x="0.5"
            y="0.5"
            width="17"
            height="17"
            rx="8.5"
            stroke="currentColor"
          />
          {selected && (
            <rect
              x="4.5"
              y="4.5"
              width="9"
              height="9"
              rx="4.5"
              fill="currentColor"
              stroke="currentColor"
            />
          )}
        </svg>
      </Box>
    </Box>
  );
}

export function StakeTokenSelect({
  type,
  operateType,
  stakedTokenWithAmountList,
  selectedStakeTokenIndex,
  setSelectedStakeTokenIndex,
  goLpLink,
  miningMinings,
  customChainId,
}: {
  type: TabMiningI['type'];
  selectedStakeTokenIndex: 0 | 1;
  setSelectedStakeTokenIndex: Dispatch<SetStateAction<0 | 1>>;
  goLpLink: (() => Promise<void>) | undefined;
  miningMinings: TabMiningI['miningMinings'];
  customChainId?: number;
} & Pick<OperateDataProps, 'operateType' | 'stakedTokenWithAmountList'>) {
  const theme = useTheme();

  if (miningMinings.length === 1) {
    if (operateType === 'unstake' || operateType === 'claim') {
      return null;
    }

    const tokenSymbol = getOptTokenSymbol({
      stakedTokenList: stakedTokenWithAmountList,
      type,
      selectedStakeTokenIndex,
    });
    const tokenPairs = getOptTokenPairs({
      stakedTokenList: stakedTokenWithAmountList,
      type,
      selectedStakeTokenIndex,
    });
    return (
      <Box
        sx={{
          mt: 20,
          borderColor: theme.palette.divider,
          borderWidth: 1,
          borderStyle: 'solid',
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 20,
          py: 16,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {type === 'vdodo' ? null : (
            <TokenLogoPair
              width={tokenPairs.length > 1 ? 20 : 28}
              tokens={tokenPairs}
              chainId={customChainId}
            />
          )}
          <Box
            sx={{
              ml: 8,
              typography: 'body1',
              color: theme.palette.text.primary,
              fontWeight: 600,
            }}
          >
            {tokenSymbol}
          </Box>
        </Box>

        {goLpLink && (
          <GetLpLink tokenSymbol={tokenSymbol} goLpLink={goLpLink} />
        )}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        mt: 20,
        borderColor: theme.palette.divider,
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: 12,
      }}
    >
      {stakedTokenWithAmountList.map((token, index) => {
        return (
          <StakeTokenSelectItem
            key={token.address ?? index}
            operateType={operateType}
            token={token}
            selected={selectedStakeTokenIndex === index}
            onClick={() => {
              setSelectedStakeTokenIndex(index as 0 | 1);
            }}
            goLpLink={goLpLink}
            customChainId={customChainId}
            sx={
              index === 1
                ? {
                    borderTopColor: theme.palette.divider,
                    borderTopWidth: 1,
                    borderTopStyle: 'solid',
                  }
                : undefined
            }
          />
        );
      })}
    </Box>
  );
}
