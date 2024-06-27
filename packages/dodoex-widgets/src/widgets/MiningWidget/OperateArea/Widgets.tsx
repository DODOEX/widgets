import styled from '@emotion/styled';
import { Box } from '@dodoex/components';

export const OperateButtonWrapper = styled(Box)(({ theme }) => {
  return {
    paddingTop: 20,
    backgroundColor: theme.palette.background.paper,
    position: 'sticky',
    bottom: 0,
  };
});
