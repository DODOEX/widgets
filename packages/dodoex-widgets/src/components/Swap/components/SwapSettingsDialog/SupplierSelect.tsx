import { Box, Button, ButtonBase, useTheme } from '@dodoex/components';
import { Dispatch, SetStateAction, useCallback, useState } from 'react';
import { usePrivacySwapStatus } from '../../../../hooks/Swap/usePrivacySwapStatus';
import { useSwitchToSupplierChain } from '../../../../hooks/Swap/useSwitchToSupplierChain';

function SupplierItem({
  selected,
  name,
  logo,
  onClick,
}: {
  selected: boolean;
  name: string;
  logo: string;
  onClick: () => void;
}) {
  const theme = useTheme();

  return (
    <Box
      component={ButtonBase}
      onClick={onClick}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 20,
        py: 19,
        mt: 16,
        mx: 8,
        width: 'calc(33.33% - 8px - 8px)',
        borderRadius: 8,
        backgroundColor: theme.palette.background.paperContrast,
        borderColor: selected
          ? theme.palette.secondary.main
          : theme.palette.background.paperContrast,
        borderWidth: 1,
        borderStyle: 'solid',
        '&:hover': {
          borderColor: theme.palette.secondary.main,
        },
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <img src={logo} alt={name} style={{ height: 40, width: 40 }} />
      <Box
        sx={{
          color: theme.palette.text.primary,
          typography: 'body2',
          fontWeight: 600,
        }}
      >
        {name}
      </Box>
      {selected && (
        <Box
          sx={{
            right: 0,
            top: 0,
            position: 'absolute',
            width: 32,
            height: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.palette.secondary.main,
            borderRadius: '0px 0px 0px 8px',
          }}
        >
          <svg
            width="16"
            height="17"
            viewBox="0 0 16 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.8709 3.16663L5.03682 10.0007L2.35089 7.32514L0.888672 8.78737L5.03682 12.9355L13.3331 4.63922L11.8709 3.16663Z"
              fill={theme.palette.secondary.contrastText}
            />
          </svg>
        </Box>
      )}
    </Box>
  );
}

export function SupplierSelect({
  privacySwapSupplierEndpoints,
  endpointStatusMap,
  refetchEndpointStatus,
  setIsSelectSupplierMode,
}: Pick<
  ReturnType<typeof usePrivacySwapStatus>,
  | 'endpointStatusMap'
  | 'privacySwapSupplierEndpoints'
  | 'privacySwapEnable'
  | 'privacySwapEnableAble'
  | 'refetchEndpointStatus'
> & {
  setIsSelectSupplierMode: Dispatch<SetStateAction<boolean>>;
}) {
  const theme = useTheme();

  const [selectedSupplierKey, setSelectedSupplierKey] = useState<string | null>(
    privacySwapSupplierEndpoints?.[0]?.key ?? null,
  );

  const [prevEndpointStatusMap, setPrevEndpointStatusMap] =
    useState(endpointStatusMap);
  if (prevEndpointStatusMap !== endpointStatusMap) {
    setPrevEndpointStatusMap(endpointStatusMap);
    Array.from(endpointStatusMap.entries()).forEach(([key, value]) => {
      if (value) {
        setSelectedSupplierKey(key);
      }
    });
  }

  const selectedSupplier = selectedSupplierKey
    ? privacySwapSupplierEndpoints?.find(
        (item) => item.key === selectedSupplierKey,
      )
    : undefined;
  const enableButtonDisabled =
    !selectedSupplierKey || endpointStatusMap.get(selectedSupplierKey);

  const successCallback = useCallback(() => {
    refetchEndpointStatus();
    setIsSelectSupplierMode(false);
  }, [refetchEndpointStatus, setIsSelectSupplierMode]);

  const { switchTo } = useSwitchToSupplierChain({
    successCallback,
    selectedSupplier,
  });

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'stretch',
        flexDirection: 'column',
        minHeight: '100%',
      }}
    >
      <Box
        sx={{
          mt: 20,
          pt: 12,
          display: 'flex',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          mx: -8,
        }}
      >
        {privacySwapSupplierEndpoints?.map((item, index) => {
          const selected = selectedSupplierKey === item.key;
          return (
            <SupplierItem
              key={index}
              selected={selected}
              name={item.name}
              logo={item.logo}
              onClick={() => setSelectedSupplierKey(item.key)}
            />
          );
        })}
      </Box>

      <Box
        sx={{
          mt: 24,
          width: '100%',
          height: '1px',
          flexShrink: 0,
          flexGrow: 0,
          backgroundColor: theme.palette.border.main,
        }}
      />

      <Box
        sx={{
          mt: 24,
          mb: 24,
          typography: 'body2',
          fontWeight: 500,
          color: theme.palette.text.secondary,
        }}
      >
        <Box>
          *Choose your privacy transaction server. Later, a new network will be
          added to your wallet, and transactions submitted under this network
          can only be seen by the privacy transaction server. The server will
          protect you from the impact of MEV. You can also disable the privacy
          transaction by switching back to the original network.
        </Box>
        {selectedSupplier && (
          <Box
            sx={{
              color: theme.palette.primary.main,
            }}
            component="a"
            href={selectedSupplier?.docUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn more&gt;
          </Box>
        )}
      </Box>

      <Button
        size={Button.Size.big}
        variant={Button.Variant.contained}
        fullWidth
        sx={{
          marginTop: 'auto',
          flexShrink: 0,
          flexGrow: 0,
        }}
        disabled={enableButtonDisabled}
        onClick={switchTo}
      >
        Enable Privacy Swap
      </Button>

      <Box
        sx={{
          height: 28,
          width: '100%',
        }}
      />
    </Box>
  );
}
