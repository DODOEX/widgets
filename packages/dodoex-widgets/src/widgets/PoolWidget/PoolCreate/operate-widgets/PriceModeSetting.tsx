import { Box, useTheme } from '@dodoex/components';
import { Dispatch } from 'react';
import RadioButton from '../components/RadioButton';
import { useVersionList } from '../hooks/useVersionList';
import { Actions, StateProps, Types } from '../reducer';
import { computeInitPriceText } from '../utils';

export function PriceModeSetting({
  selectedVersion,
  selectedSubPeggedVersion,
  baseToken,
  quoteToken,
  initPrice,
  dispatch,
}: {
  selectedVersion: StateProps['selectedVersion'];
  selectedSubPeggedVersion: StateProps['selectedSubPeggedVersion'];
  baseToken: StateProps['baseToken'];
  quoteToken: StateProps['quoteToken'];
  initPrice: StateProps['initPrice'];
  dispatch: Dispatch<Actions>;
}) {
  const theme = useTheme();

  const { versionMap, subPeggedVersionList } = useVersionList();

  const { initPriceLabel } = versionMap[selectedVersion];

  if (!baseToken || !quoteToken) return null;

  return (
    <>
      <Box
        sx={{
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4,
        }}
      >
        <Box
          sx={{
            typography: 'body2',
            color: theme.palette.text.secondary,
            fontWeight: 500,
          }}
        >
          {initPriceLabel}
        </Box>
        <Box
          sx={{
            typography: 'h5',
            color: theme.palette.text.primary,
            fontWeight: 600,
          }}
        >
          1&nbsp;{baseToken?.symbol}=
          {computeInitPriceText({
            midPrice: undefined,
            quoteToken,
            selectedVersion,
            initPrice,
          }) ?? '-'}
          &nbsp;
          {quoteToken.symbol}
        </Box>
      </Box>

      <Box
        sx={{
          mt: 20,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          px: 20,
        }}
      >
        {subPeggedVersionList.map((item) => {
          const selected = selectedSubPeggedVersion === item.version;
          return (
            <RadioButton
              key={item.version}
              title={item.title}
              description={item.description}
              onClick={() => {
                dispatch({
                  type: Types.SelectNewSubPeggedVersion,
                  payload: item.version,
                });
              }}
              selected={selected}
              subTitle={undefined}
              sx={{
                backgroundColor: '#F4F0EC',
                borderColor: selected
                  ? theme.palette.primary.main
                  : theme.palette.border.main,
              }}
              titleSx={{
                typography: 'body1',
                fontWeight: 600,
              }}
            />
          );
        })}
      </Box>
    </>
  );
}
