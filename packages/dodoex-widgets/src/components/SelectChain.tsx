import { ButtonBase, Box, BoxProps, useTheme } from '@dodoex/components';
import { CaretUp } from '@dodoex/icons';
import { t, Trans } from '@lingui/macro';
import React from 'react';
import { useChainList } from '../hooks/Chain/useChainList';
import Dialog from './Swap/components/Dialog';
import { ReactComponent as IconAllChains } from '../assets/icon-all-chains.svg';
import { useLingui } from '@lingui/react';
import { ChainListItem } from '../constants/chainList';
import { useWidgetDevice } from '../hooks/style/useWidgetDevice';
import Select from './Select';
import { ChainId } from '@dodoex/api';

function ChainItem({
  isMobileStyle,
  chain,
  isLastItem,
  logoWidth,
  mobileLogoWidth,
  sx,
}: {
  chain?: Omit<ChainListItem, 'chainId'> & {
    chainId: number;
  };
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
  valueOnlyIcon,
  sx,
}: {
  chainId: number | undefined;
  setChainId: (chainId: number | undefined) => void;
  logoWidth?: number;
  mobileLogoWidth?: number;
  mainLogoWidth?: number;
  mainMobileLogoWidth?: number;
  notShowAllChain?: boolean;
  valueOnlyIcon?: boolean;
  sx?: BoxProps['sx'];
}) {
  const chainList = useChainList();
  const [isDialogVisible, setIsDialogVisible] = React.useState<boolean>(false);
  const { isMobile } = useWidgetDevice();
  const { i18n } = useLingui();

  const renderValue = React.useCallback(() => {
    const activeChainItem =
      chainId === undefined
        ? chainList[0]
        : chainList.find((chain) => chain.chainId === chainId);

    if (valueOnlyIcon) {
      if (chainId === undefined || !activeChainItem) {
        return '';
      }
      const size = isMobile ? mobileLogoWidth : mainLogoWidth;
      return (
        <Box
          component={activeChainItem?.logo}
          sx={{
            width: size,
            height: size,
          }}
        />
      );
    }
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
    if (!activeChainItem) return null;
    return (
      <ChainItem
        isMobileStyle={isMobile}
        chain={activeChainItem}
        logoWidth={mainLogoWidth}
        mobileLogoWidth={mainMobileLogoWidth}
      />
    );
  }, [chainId, chainList, notShowAllChain, valueOnlyIcon, isMobile, i18n._]);

  const options = React.useMemo(() => {
    const res = [] as Array<{
      key: ChainId | typeof allChainKey;
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

  if (!isMobile) {
    return (
      <Select<ChainId | typeof allChainKey>
        value={chainId ?? allChainKey}
        onChange={(v) => {
          // If a new value is passed, the key does not yet exist in options. There is no need to call onChange and return null.
          if (!options.some((item) => String(item.key) === String(v))) return;

          if (v === allChainKey) {
            setChainId(undefined);
          } else {
            setChainId(v);
          }
        }}
        placeholder={t`Select Network`}
        options={options}
        valueOnlyIcon={valueOnlyIcon}
        sx={{
          height: 32,
          fontWeight: 600,
          typography: 'body2',
          backgroundColor: 'background.tag',
          color: 'text.primary',
          ...sx,
        }}
      />
    );
  }

  return (
    <>
      <Box
        component={ButtonBase}
        onClick={() => setIsDialogVisible(true)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'background.tag',
          color: 'text.primary',
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
        modal
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
