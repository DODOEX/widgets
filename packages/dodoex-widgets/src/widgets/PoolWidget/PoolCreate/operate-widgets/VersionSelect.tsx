import { Box, useTheme } from '@dodoex/components';
import React from 'react';
import { useWidgetDevice } from '../../../../hooks/style/useWidgetDevice';
import RadioButton from '../components/RadioButton';
import { useVersionList } from '../hooks/useVersionList';
import { Actions, StateProps, Types } from '../reducer';

export default function VersionSelect({
  chainId,
  selectedVersion,
  dispatch,
}: {
  chainId: number | undefined;
  selectedVersion: StateProps['selectedVersion'];
  dispatch: React.Dispatch<Actions>;
}) {
  const theme = useTheme();
  const { isMobile } = useWidgetDevice();

  const { versionList } = useVersionList(chainId);

  const isLight = theme.palette.mode === 'light';
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        px: 20,
      }}
    >
      {versionList.map((item) => {
        const selected = selectedVersion === item.version;
        return (
          <RadioButton
            key={item.version}
            title={item.title}
            description={item.description}
            onClick={() => {
              dispatch({
                type: Types.SelectNewVersion,
                payload: item.version,
              });
            }}
            selected={selected}
          >
            {isMobile && selected && (
              <Box
                component={
                  isLight ? item.exampleImgUrl : item.exampleDarkImgUrl
                }
                sx={{
                  mt: 28,
                  width: '100%',
                  height: 88.1,
                }}
              />
            )}
          </RadioButton>
        );
      })}
    </Box>
  );
}
