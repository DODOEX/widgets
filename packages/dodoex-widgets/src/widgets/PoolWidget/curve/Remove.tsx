import { Box, Button, useTheme } from '@dodoex/components';
import { OperateButtonContainer } from './components/OperateButtonContainer';
import { OperateCurvePoolT } from './types';

export interface RemoveProps {
  operateCurvePool: OperateCurvePoolT;
}

export const Remove = (props: RemoveProps) => {
  const theme = useTheme();
  return (
    <>
      <Box
        sx={{
          pb: 80,
          [theme.breakpoints.up('tablet')]: {
            pb: 0,
          },
        }}
      >
        Remove
      </Box>

      <OperateButtonContainer>
        <Button
          fullWidth
          disabled={false}
          isLoading={false}
          onClick={() => {
            //
          }}
        >
          Remove
        </Button>
      </OperateButtonContainer>
    </>
  );
};
