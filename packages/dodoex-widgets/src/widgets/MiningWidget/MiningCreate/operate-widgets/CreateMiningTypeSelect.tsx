import { Box } from '@dodoex/components';
import { Dispatch } from 'react';
import { useCreateMiningTypeList } from '../hooks/useCreateMiningTypeList';
import RadioButton from '../../../PoolWidget/PoolCreate/components/RadioButton';
import { Actions, StateProps, Types } from '../hooks/reducers';

export default function CreateMiningTypeSelect({
  tokenType,
  dispatch,
}: {
  tokenType: StateProps['tokenType'];
  dispatch: Dispatch<Actions>;
}) {
  const { createMiningTypeList } = useCreateMiningTypeList();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        px: 20,
      }}
    >
      {createMiningTypeList.map((item) => {
        const selected = tokenType === item.type;
        return (
          <RadioButton
            key={item.type}
            title={item.title}
            description={item.description}
            onClick={() => {
              dispatch({
                type: Types.updateTokenType,
                payload: item.type,
              });
            }}
            selected={selected}
          />
        );
      })}
    </Box>
  );
}
