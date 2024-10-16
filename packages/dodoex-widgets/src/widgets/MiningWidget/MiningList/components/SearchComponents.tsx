import { Box, ButtonBase, SearchInput, useTheme } from '@dodoex/components';
import { Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { DebouncedFunc } from 'lodash';
import { Dispatch, SetStateAction, useState } from 'react';
import SelectChain from '../../../../components/SelectChain';
import { TokenPickerDialog } from '../../../../components/Swap/components/TokenCard/TokenPickerDialog';
import TokenLogoSimple from '../../../../components/TokenLogoSimple';
import { useUserOptions } from '../../../../components/UserOptionsProvider';
import { TokenInfo } from '../../../../hooks/Token/type';
import { MiningTabType, MiningTopTabType } from '../../types';
import { MiningStatusTabSelect } from './MiningStatusTabSelect';

export interface SearchComponentsProps {
  activeTopTab: MiningTopTabType;
  activeTab: MiningTabType;
  activeChainId: number | undefined;
  searchText: string;

  setActiveTab: Dispatch<SetStateAction<MiningTabType>>;
  setActiveChainId: Dispatch<SetStateAction<number | undefined>>;
  setSearchText: Dispatch<SetStateAction<string>>;
  debouncedUpdateSearchText: DebouncedFunc<(v: string) => void>;
  setOperateId: Dispatch<SetStateAction<string | null>>;
}

export const SearchComponents = ({
  activeTopTab,
  activeTab,
  activeChainId,
  searchText,
  debouncedUpdateSearchText,
  setActiveTab,
  setActiveChainId,
  setSearchText,
  setOperateId,
}: SearchComponentsProps) => {
  const theme = useTheme();
  const { i18n } = useLingui();
  const { onlyChainId } = useUserOptions();

  const [tokenPickerVisible, setTokenPickerVisible] = useState(false);
  const [selectedToken, setSelectedToken] = useState<TokenInfo>();

  return (
    <>
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          flexWrap: 'wrap',
          mt: activeTopTab === null ? 0 : -18,
          mx: 20,
          pt: 16,
          gap: 8,
          [theme.breakpoints.up('tablet')]: {
            justifyContent: 'space-between',
            mt: 0,
            mx: 0,
            pt: 0,
          },
        }}
      >
        {!onlyChainId && (
          <SelectChain
            chainId={activeChainId}
            setChainId={(v) => {
              if (v !== activeChainId) {
                setOperateId(null);
              }
              setActiveChainId(v);
              if (v !== selectedToken?.chainId) {
                setSelectedToken(undefined);
                setSearchText('');
                debouncedUpdateSearchText('');
              }
            }}
          />
        )}

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            [theme.breakpoints.up('tablet')]: {},
          }}
        >
          <Box
            component={ButtonBase}
            sx={{
              display: 'flex',
              alignItems: 'center',
              py: 4,
              px: 8,
              gap: 4,
              color: theme.palette.text.primary,
              '&:hover': {
                color: theme.palette.text.secondary,
              },
              borderRadius: selectedToken ? '8px 0px 0px 8px' : 8,
              backgroundColor: theme.palette.background.tag,
            }}
            onClick={() => setTokenPickerVisible(true)}
          >
            <Box
              sx={{
                color: theme.palette.text.primary,
                typography: 'body2',
                fontWeight: 600,
              }}
            >
              <Trans>Token</Trans>
            </Box>

            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="24px/Light">
                <path
                  id="&#228;&#184;&#137;&#232;&#167;&#146;&#229;&#189;&#162;"
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 16L16 10H8L12 16Z"
                  fill="currentColor"
                />
              </g>
            </svg>
          </Box>

          {selectedToken && (
            <Box
              sx={{
                py: 6,
                px: 8,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                borderRadius: '0px 8px 8px 0px',
                backgroundColor: theme.palette.background.tag,
              }}
            >
              <TokenLogoSimple
                address={selectedToken.address}
                url={selectedToken.logoURI ?? ''}
                width={20}
                height={20}
              />
              <Box
                component={ButtonBase}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  color: theme.palette.text.secondary,
                  '&:hover': {
                    color: theme.palette.text.primary,
                  },
                }}
                onClick={() => {
                  setSelectedToken(undefined);
                  setSearchText('');
                  debouncedUpdateSearchText('');
                }}
              >
                <Box
                  sx={{
                    color: theme.palette.text.primary,
                    typography: 'body2',
                    fontWeight: 600,
                  }}
                >
                  {selectedToken?.symbol}
                </Box>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.2784 3.81802L8.0964 7L11.2784 10.182L10.2177 11.2426L7.03574 8.06066L3.85376 11.2426L2.7931 10.182L5.97508 7L2.7931 3.81802L3.85376 2.75736L7.03574 5.93934L10.2177 2.75736L11.2784 3.81802Z"
                    fill="currentColor"
                  />
                </svg>
              </Box>
            </Box>
          )}
        </Box>

        <SearchInput
          height={32}
          value={searchText}
          onChange={(evt: any) => {
            const v = evt.target.value;
            setSearchText(v);
            debouncedUpdateSearchText(v);
            setSelectedToken(undefined);
          }}
          clearValue={() => {
            setSearchText('');
            debouncedUpdateSearchText('');
            setSelectedToken(undefined);
          }}
          placeholder={i18n._(`Search by address`)}
          sx={{
            mb: 0,
          }}
        />

        {activeTopTab === 'created' ? (
          <Box
            sx={{
              ml: 'auto',
            }}
          />
        ) : (
          <MiningStatusTabSelect
            value={activeTab}
            onChange={(value) => {
              if (value !== activeTab) {
                setOperateId(null);
              }
              setActiveTab(value);
            }}
          />
        )}
      </Box>

      <TokenPickerDialog
        value={selectedToken}
        open={tokenPickerVisible}
        onClose={() => {
          setTokenPickerVisible(false);
        }}
        onTokenChange={(token) => {
          if (Array.isArray(token)) {
            return;
          }
          if (!token.chainId) {
            return;
          }
          setSelectedToken(token);
          setTokenPickerVisible(false);
          setActiveChainId(token.chainId);
          setSearchText(token.address);
          debouncedUpdateSearchText(token.address);
        }}
        modal
      />
    </>
  );
};
