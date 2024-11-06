import { Box, BoxProps, useTheme } from '@dodoex/components';
import { useLingui } from '@lingui/react';
import BigNumber from 'bignumber.js';
import { JSXElementConstructor, ReactElement, SetStateAction } from 'react';
import { AddressWithLinkAndCopy } from '../../../../components/AddressWithLinkAndCopy';
import { TokenLogoPair } from '../../../../components/TokenLogoPair';
import { MiningERC20TokenI, TabMiningI } from '../../types';
import { formatApr, generateMiningDetailUrl } from '../utils';
import { ShareModeSelect } from './ShareModeSelect';
import { TokenAmountPopover } from './TokenAmountPopover';

export function MiningTitle({
  chainId,
  size,
  tokenPairs,
  title,
  titleTypography,
  wrappingLines,
  type,
  rewardTokenList,
  rewardTokenTrigger,
  minRewardPopoverWidth,
  setShareModalVisible,
  address,
  sx,
  showChainLogo = true,
  stakeTokenAddress,
  miningContractAddress,
}: {
  chainId: number;
  size: 'small' | 'medium';
  tokenPairs: Array<MiningERC20TokenI>;
  title?: string;
  titleTypography: BoxProps['typography'];
  /** title 换行 */
  wrappingLines?: boolean;
  type: TabMiningI['type'];
  rewardTokenList?: {
    /** 奖励代币合约地址前面的 symbol */
    symbolEle: JSX.Element | string | undefined;
    /** 奖励代币合约地址 */
    address: string | undefined;
    apr?: BigNumber;
    logoImg: string | undefined;
  }[];
  rewardTokenTrigger?: ReactElement<any, string | JSXElementConstructor<any>>;
  minRewardPopoverWidth?: string;
  setShareModalVisible?: React.Dispatch<SetStateAction<boolean>>;
  address?: string;
  sx?: BoxProps['sx'];
  showChainLogo?: boolean;
  stakeTokenAddress: string | undefined;
  miningContractAddress: string | undefined;
}) {
  const theme = useTheme();
  const { i18n } = useLingui();

  return (
    <Box
      sx={{
        display: wrappingLines ? 'block' : 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        ...sx,
      }}
    >
      {type === 'vdodo' ? null : (
        <TokenLogoPair
          width={size === 'small' ? 24 : 36}
          tokens={tokenPairs.map((t) => ({ ...t, logoUrl: t.logoImg }))}
          gap={size === 'small' ? -6 : -8}
          chainId={chainId}
          mr={wrappingLines ? 0 : 8 + 6}
          showChainLogo={showChainLogo}
        />
      )}

      <Box
        sx={{
          ml: 0,
        }}
      >
        <Box
          sx={{
            color: theme.palette.text.primary,
            typography: titleTypography,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            overflow: 'hidden',
          }}
        >
          {title ?? '-'}
          {setShareModalVisible && (
            <ShareModeSelect
              shareUrl={generateMiningDetailUrl({
                chainId,
                miningContractAddress,
                stakeTokenAddress,
              })}
              sx={{
                ml: size === 'small' ? 2 : 4,
                width: size === 'small' ? 14 : 24,
                height: size === 'small' ? 14 : 24,
                cursor: 'pointer',
                color: theme.palette.text.primary,
                '&:hover': {
                  color: theme.palette.text.primary,
                },
              }}
            />
          )}
        </Box>

        {rewardTokenList && rewardTokenTrigger && (
          <Box
            sx={{
              mt: 0,
              typography: 'h6',
              color: theme.palette.text.secondary,
              display: 'flex',
              alignItems: 'center',
              height: 17,
            }}
          >
            {i18n._('Rewards')}:&nbsp;
            <TokenAmountPopover
              trigger={rewardTokenTrigger}
              tokenList={rewardTokenList.map(
                ({ symbolEle, address, apr, logoImg }) => ({
                  symbolEle,
                  address,
                  logoImg,
                  rightContent: `${formatApr(apr)} APR`,
                }),
              )}
              minWidth={minRewardPopoverWidth}
              sx={{
                typography: 'h6',
              }}
            />
          </Box>
        )}

        {address && (
          <AddressWithLinkAndCopy
            size="small"
            truncate
            showCopy
            address={address}
            iconSpace={2}
            sx={{
              color: theme.palette.text.secondary,
              typography: 'h6',
            }}
            customChainId={chainId}
          />
        )}
      </Box>
    </Box>
  );
}
