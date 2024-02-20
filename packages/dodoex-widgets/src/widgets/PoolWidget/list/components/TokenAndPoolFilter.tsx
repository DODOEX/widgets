import { BaseButton, Box, BoxProps } from '@dodoex/components';
import React from 'react';
import { TokenInfo } from '../../../../hooks/Token';
import { Search } from '@dodoex/icons';
import { t, Trans } from '@lingui/macro';
import { TokenPickerDialog } from '../../../../components/Swap/components/TokenCard/TokenPickerDialog';

export default function TokenAndPoolFilter({
  sx,
  value,
  onChange,
  searchAddress,
}: {
  sx?: BoxProps['sx'];
  value: Array<TokenInfo>;
  onChange: (v: Array<TokenInfo>) => void;
  searchAddress: (
    address: string,
    onClose: () => void,
  ) => Promise<JSX.Element | null>;
}) {
  const [showPicker, setShowPicker] = React.useState(false);
  return (
    <>
      <Box
        component={BaseButton}
        sx={{
          typography: 'body2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          px: 12,
          height: 32,
          backgroundColor: 'hover.default',
          color: 'text.secondary',
          borderRadius: 8,
          fontWeight: 600,
          ...sx,
        }}
        onClick={() => setShowPicker(true)}
      >
        <Box
          component={Search}
          sx={{
            width: 16,
            height: 16,
            mr: 8,
            flexShrink: 0,
          }}
        />
        <Trans>Search</Trans>
      </Box>
      {/* Token Picker */}
      <TokenPickerDialog
        value={value}
        open={showPicker}
        multiple
        title={<Trans>Select a liquidity pool</Trans>}
        searchPlaceholder={t`Search by token or pool address`}
        onClose={() => {
          setShowPicker(false);
        }}
        onTokenChange={(newToken) => {
          if (Array.isArray(newToken)) {
            if (newToken.length > 2) {
              const newTokenResult = [newToken[0], newToken[2]];
              onChange(newTokenResult);
            } else {
              onChange(newToken);
            }
            setShowPicker(false);
          }
        }}
        searchOtherAddress={(address: string) => {
          return searchAddress(address, () => setShowPicker(false));
        }}
      />
    </>
  );
}
