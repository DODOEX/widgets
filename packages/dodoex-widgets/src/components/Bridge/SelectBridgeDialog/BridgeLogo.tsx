import { Box, BoxProps } from '@dodoex/components';
import { BridgeStep } from '../../../hooks/Bridge/useFetchRoutePriceBridge';
import { productList } from './productList';

export function BridgeLogo({
  size = 'medium',
  toolDetails,
  nameMarginLeft = 4,
  logoMarginLeft = 0,
  nameSx,
}: {
  size: 'small' | 'medium' | 'large';
  toolDetails: BridgeStep['toolDetails'] | null | undefined;
  nameMarginLeft?: number;
  logoMarginLeft?: number;
  nameSx?: BoxProps['sx'];
}) {
  if (!toolDetails || !toolDetails.logoURI || !toolDetails.name) {
    return null;
  }

  const { logoURI, name } = toolDetails;

  const productDetail = productList.find((i) => i.id === name);

  return (
    <Box
      component={productDetail?.logoURI}
      style={{
        marginLeft: logoMarginLeft,
        width: size === 'large' ? 24 : 16,
        height: size === 'large' ? 24 : 16,
      }}
    />
  );
}
