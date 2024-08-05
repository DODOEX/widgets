import { ButtonBase, Box, BoxProps, useTheme } from '@dodoex/components';
import { CaretUp } from '@dodoex/icons';
import { t, Trans } from '@lingui/macro';
import React from 'react';
import { useChainList } from '../hooks/Chain/useChainList';
import Dialog from './Swap/components/Dialog';
import { ReactComponent as IconAllChains } from '../assets/icon-all-chains.svg';
import { useLingui } from '@lingui/react';
import { ChainListItem } from '../constants/chainList';

function ChainItem({
  isMobileStyle,
  chain,
  isLastItem,
  logoWidth,
  mobileLogoWidth,
  sx,
}: {
  chain?: ChainListItem;
  isLastItem?: boolean;
  isMobileStyle?: boolean;
  logoWidth?: number;
  mobileLogoWidth?: number;
  sx?: BoxProps['sx'];
}) {
  const theme = useTheme();
  return isMobileStyle ? (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        py: 18,
        borderTop: `1px solid ${theme.palette.border.main}`,
        borderBottom: isLastItem
          ? `1px solid ${theme.palette.border.main}`
          : 'none',
        ...sx,
      }}
    >
      <Box
        component={chain?.logo}
        sx={{
          width: mobileLogoWidth,
          height: mobileLogoWidth,
        }}
      />
      <Box
        component="span"
        className="name"
        sx={{
          marginLeft: 8,
        }}
      >
        {chain?.name}
      </Box>
    </Box>
  ) : (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Box
        component={chain?.logo}
        sx={{
          width: logoWidth,
          height: logoWidth,
        }}
      />
      <Box
        component="span"
        className="name"
        sx={{
          marginLeft: 8,
        }}
      >
        {chain?.name}
      </Box>
    </Box>
  );
}

const allChainKey = -1;

export default function SelectChain({
  chainId,
  setChainId,
  logoWidth = 24,
  mobileLogoWidth = 32,
  mainLogoWidth = 24,
  mainMobileLogoWidth = 18,
  notShowAllChain,
  sx,
}: {
  chainId: number | undefined;
  setChainId: (chainId: number | undefined) => void;
  logoWidth?: number;
  mobileLogoWidth?: number;
  mainLogoWidth?: number;
  mainMobileLogoWidth?: number;
  notShowAllChain?: boolean;
  sx?: BoxProps['sx'];
}) {
  const chainList = useChainList();
  const [isDialogVisible, setIsDialogVisible] = React.useState<boolean>(false);
  const isMobile = true;
  const { i18n } = useLingui();

  const renderValue = React.useCallback(() => {
    if (chainId === undefined && !notShowAllChain) {
      return (
        <ChainItem
          isMobileStyle={isMobile}
          chain={{
            chainId: allChainKey,
            logo: IconAllChains,
            name: t`All chains`,
          }}
          logoWidth={mainLogoWidth}
          mobileLogoWidth={mainMobileLogoWidth}
          sx={{
            border: 'none',
          }}
        />
      );
    }
    const activeChainItem =
      chainId === undefined
        ? chainList[0]
        : chainList.find((chain) => chain.chainId === chainId);
    if (!activeChainItem) return null;
    return (
      <ChainItem
        isMobileStyle={isMobile}
        chain={activeChainItem}
        logoWidth={mainLogoWidth}
        mobileLogoWidth={mainMobileLogoWidth}
      />
    );
  }, [chainId, chainList, notShowAllChain, i18n._]);

  const options = React.useMemo(() => {
    const res = [] as Array<{
      key: number | string;
      value: string | React.ReactNode;
    }>;
    if (!notShowAllChain) {
      res.push({
        key: allChainKey,
        value: (
          <ChainItem
            isMobileStyle={isMobile}
            chain={{
              chainId: allChainKey,
              logo: IconAllChains,
              name: t`All chains`,
            }}
            logoWidth={logoWidth}
            mobileLogoWidth={mobileLogoWidth}
          />
        ),
      });
    }
    chainList.forEach((chain, index) => {
      res.push({
        key: chain.chainId,
        value: (
          <ChainItem
            isLastItem={index === chainList.length - 1}
            isMobileStyle={isMobile}
            chain={chain}
            logoWidth={logoWidth}
            mobileLogoWidth={mobileLogoWidth}
          />
        ),
      });
    });
    return res;
  }, [isMobile, logoWidth, mobileLogoWidth, chainList, notShowAllChain]);

  return (
    <>
      <Box
        component={ButtonBase}
        onClick={() => setIsDialogVisible(true)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'background.tag',
          borderRadius: 8,
          border: 'none',
          px: 8,
          height: 32,
          fontWeight: 600,
          typography: 'body2',
          ...sx,
        }}
      >
        <Box sx={{ pr: 5 }}>{renderValue()}</Box>
        <Box
          component={CaretUp}
          sx={{
            width: 12,
            height: 12,
            transform: `rotate(180deg)`,
          }}
        />
      </Box>
      <Dialog
        open={isDialogVisible}
        title={<Trans>Select Network</Trans>}
        onClose={() => setIsDialogVisible(false)}
        id="select-chain"
      >
        <Box sx={{ mb: 20 }}>
          {options.map((item) => (
            <Box
              key={item.key}
              onClick={() => {
                const value = item.key;
                if (value === allChainKey) {
                  setChainId(undefined);
                } else {
                  setChainId(Number(value));
                }
                setIsDialogVisible(false);
              }}
              sx={{
                position: 'relative',
                px: 20,
                '&:active': {
                  backgroundColor: 'hover.default',
                },
                '&:hover': {
                  backgroundColor: 'hover.default',
                },
                cursor: 'pointer',
              }}
            >
              {item.value}
              {(chainId ? item.key === chainId : item.key === allChainKey) && (
                <Box
                  sx={{
                    position: 'absolute',
                    left: 0,
                    top: 24,
                    height: 20,
                    width: 2,
                    backgroundColor: 'text.primary',
                  }}
                />
              )}
            </Box>
          ))}
        </Box>
      </Dialog>
    </>
  );
}
