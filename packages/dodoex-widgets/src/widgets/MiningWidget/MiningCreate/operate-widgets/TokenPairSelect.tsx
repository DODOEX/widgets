import {
  Box,
  ButtonBase,
  HoverOpacity,
  Input,
  Select,
  alpha,
  useTheme,
} from '@dodoex/components';
import { t } from '@lingui/macro';
import { useState } from 'react';
import { useWalletInfo } from '../../../../hooks/ConnectWallet/useWalletInfo';
import { DexConfigI } from '../../types';
import PoolCard from '../components/PoolCard';
import PoolPicker from '../components/PoolPicker';
import { Actions, StateProps, Types } from '../hooks/reducers';
import { ReactComponent as DeleteIcon } from './delete.svg';
import { DexKey, useDexList } from '../hooks/useDexList';

export function TokenPairSelect({
  state,
  dispatch,
  platform,
  setPlatform,
  activePlatform,
  handleGotoCreatePool,
}: {
  state: StateProps;
  dispatch: React.Dispatch<Actions>;
  platform: DexKey;
  setPlatform: React.Dispatch<React.SetStateAction<DexKey>>;
  activePlatform: DexConfigI | null;
  handleGotoCreatePool?: () => void;
}) {
  const theme = useTheme();

  const { account, chainId } = useWalletInfo();

  const [showPoolPicker, setShowPoolPicker] = useState(false);

  const { dexListObj, getChainDexList } = useDexList();
  const dexList = getChainDexList(chainId, true);
  return (
    <>
      <Box
        sx={{
          px: 20,
        }}
      >
        <Box>
          <Box
            sx={{
              mb: 12,
            }}
          >
            {t`Select Platform`}
          </Box>
          <Select
            value={platform}
            options={dexList}
            fullWidth
            onChange={(event, selectVal) => {
              setPlatform(selectVal as DexKey);
              if (state.pool) {
                dispatch({
                  type: Types.updatePool,
                  payload: undefined,
                });
              }
            }}
            sx={{
              height: 48,
              px: 20,
              py: 12,
              width: '100%',
            }}
            renderValue={(v) => {
              if (!v?.value) {
                return null;
              }
              const { Icon, name } = dexListObj[v.value];
              return (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <Icon
                    style={{
                      width: 24,
                      height: 24,
                    }}
                  />
                  {name}
                </Box>
              );
            }}
          />
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 12,
            mt: 20,
          }}
        >
          <Box>{t`Select Pool`}</Box>
          <HoverOpacity weak color={theme.palette.primary.main}>
            <Box
              component={ButtonBase}
              sx={{
                typography: 'h6',
                fontWeight: 600,
              }}
              onClick={() => handleGotoCreatePool?.()}
            >
              {t`No pools yet? Create one!`}&gt;
            </Box>
          </HoverOpacity>
        </Box>
        {state.pool ? (
          <PoolCard
            {...state.pool}
            activePlatform={activePlatform}
            onClick={() => {
              setShowPoolPicker(true);
            }}
          >
            <HoverOpacity
              weak
              component={DeleteIcon}
              sx={{
                position: 'absolute',
                top: 22,
                right: 22,
                cursor: 'pointer',
              }}
              onClick={(evt) => {
                evt.stopPropagation();
                dispatch({
                  type: Types.updatePool,
                  payload: undefined,
                });
              }}
            />
          </PoolCard>
        ) : (
          <Input
            height={48}
            fullWidth
            readOnly
            value={state.pool ? ' ' : ''}
            onClick={() => {
              setShowPoolPicker(true);
            }}
            placeholder={t`SELECT`}
            sx={{
              cursor: 'pointer',
              '&:hover': {
                '.select-pool-suffix': {
                  borderTopColor: alpha(theme.palette.text.primary, 0.5),
                },
              },
            }}
            inputSx={{
              cursor: 'pointer',
            }}
            suffix={
              <Box
                className="select-pool-suffix"
                sx={{
                  display: 'inline-block',
                  borderStyle: 'solid',
                  borderWidth: '6px 4px 0 4px',
                  borderColor: 'transparent',
                  borderTopColor: 'text.primary',
                }}
              />
            }
          />
        )}
      </Box>

      <PoolPicker
        on={showPoolPicker}
        onClose={() => setShowPoolPicker(false)}
        platform={platform}
        onConfirm={(pool) => {
          dispatch({
            type: Types.updatePool,
            payload: pool,
          });
        }}
        handleGotoCreatePool={handleGotoCreatePool}
      />
    </>
  );
}
