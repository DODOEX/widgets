import {
  Box,
  BoxProps,
  HoverOpacity,
  HoverAddBackground,
  HoverAddUnderLine,
  useTheme,
  ButtonBase,
} from '@dodoex/components';
import { ArrowRight, ArrowTopRightBorder } from '@dodoex/icons';
import { useWeb3React } from '@web3-react/core';
import { ChainId } from '@dodoex/api';
import { getEtherscanPage, truncatePoolAddress } from '../utils';
import { CopyTooltipToast } from './CopyTooltipToast';

interface AddressTextProps {
  sx?: BoxProps['sx'];
  truncate?: boolean;
  address: string;
  disabledAddress?: boolean;
  addressHoverColor?: string;
  addressHoverShowIcon?: boolean;
  handleOpen?: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    type: 'address' | 'icon',
  ) => void;
}

interface Props extends AddressTextProps {
  showCopy?: boolean;
  size?: 'small' | 'medium' | 'big';
  newTab?: boolean;
  iconSize?: number;
  iconSpace?: number;
  iconDarkHover?: boolean;
  customChainId?: number;
  onAddressClick?: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => void;
}

function AddressText({
  truncate,
  address,
  disabledAddress,
  sx,
  handleOpen,
  addressHoverColor,
  addressHoverShowIcon,
}: AddressTextProps & {
  typography?: string;
  domain?: string;
}) {
  if (disabledAddress) {
    return <Box>{truncate ? truncatePoolAddress(address) : address}</Box>;
  }
  return (
    <HoverAddUnderLine
      lineSx={{
        bottom: -1,
      }}
      // @ts-ignore
      lineColor={addressHoverColor ?? (sx?.color || '')}
      hoverSx={{
        color: 'addressHoverColor',
        '& svg': {
          display: 'inline-block',
        },
      }}
      className="truncate-address-link"
    >
      <Box
        onClick={(evt) => {
          handleOpen?.(evt, 'address');
        }}
        sx={{
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
        }}
      >
        {truncate ? truncatePoolAddress(address) : address}
        {addressHoverShowIcon ? (
          <Box
            component={ArrowRight}
            sx={{
              display: 'none',
              width: 14,
              height: 14,
            }}
          />
        ) : (
          ''
        )}
      </Box>
    </HoverAddUnderLine>
  );
}

export function AddressWithLinkAndCopy({
  address,
  truncate,
  showCopy,
  size = 'medium',
  iconSize,
  iconSpace: iconSpaceProps,
  sx,
  iconDarkHover,
  disabledAddress,
  addressHoverColor,
  addressHoverShowIcon,
  customChainId,
  handleOpen,
  onAddressClick,
}: Props) {
  const theme = useTheme();

  const isBig = size === 'big';
  const isMedium = size === 'medium';

  const IconHoverBox = iconDarkHover ? HoverAddBackground : HoverOpacity;
  const getIconSpace = (isMediumRes?: boolean) => {
    let iconSpace = isMediumRes ? 12 : 8;
    if (iconSpaceProps) {
      iconSpace = iconSpaceProps;
    }
    if (iconDarkHover) {
      iconSpace -= 3;
    }
    return iconSpace;
  };
  // eslint-disable-next-line no-nested-ternary
  const typography = isBig ? 'h5' : isMedium ? 'body1' : 'body2';
  const { chainId: currentChainId } = useWeb3React();
  const chainId = customChainId ?? currentChainId;

  const handleOpenResult: AddressTextProps['handleOpen'] = (evt, type) => {
    if (handleOpen) {
      handleOpen(evt, type);
      return;
    }
    if (chainId) {
      evt.stopPropagation();
      window.open(getEtherscanPage(chainId as ChainId, address, 'address'));
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        typography,
        color: theme.palette.text.primary,
        lineHeight: 'normal',
        ...(sx || {}),
      }}
    >
      <AddressText
        truncate={truncate}
        address={address}
        disabledAddress={disabledAddress}
        sx={sx}
        typography={typography}
        handleOpen={onAddressClick ?? handleOpenResult}
        addressHoverColor={addressHoverColor}
        addressHoverShowIcon={addressHoverShowIcon}
      />

      <IconHoverBox
        sx={{
          display: 'inline-flex',
          ml: getIconSpace(isMedium),
          cursor: 'pointer',
        }}
        onClick={(evt) => {
          handleOpenResult(evt, 'icon');
        }}
      >
        <Box
          component={ArrowTopRightBorder}
          sx={{
            width: iconSize || (isMedium ? 16 : 14),
            height: iconSize || (isMedium ? 16 : 14),
          }}
        />
      </IconHoverBox>

      {showCopy ? (
        <CopyTooltipToast
          size={iconSize || (isMedium ? 16 : 14)}
          copyText={address}
          componentProps={{
            component: IconHoverBox,
            sx: {
              ml: getIconSpace(isMedium),
            },
          }}
        />
      ) : null}
    </Box>
  );
}
