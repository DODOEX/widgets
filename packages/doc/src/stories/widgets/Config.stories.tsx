import {
  Swap,
  SwapOrderHistory,
  SwapWidget,
  SwapWidgetProps,
  Widget,
} from '@dodoex/widgets';
import { SwapWidgetApi } from '@dodoex/api';
import React from 'react';
import { Box } from '@dodoex/components';

export default {
  title: 'Widgets/Config',
  component: 'div',
};

export const Primary = ({
  projectId,
  apiKey,
  hasOrder,
  onlyChainId,
}: {
  projectId: string;
  apiKey: string;
  hasOrder: boolean;
  onlyChainId?: number;
}) => {
  const [config, setConfig] = React.useState<SwapWidgetProps>({
    tokenList: [],
  });
  React.useEffect(() => {
    if (projectId && apiKey) {
      const dodoService = new SwapWidgetApi();
      dodoService
        .getConfigSwapWidgetProps(projectId, apiKey)
        .then(({ swapWidgetProps }) => {
          setConfig(swapWidgetProps);
        });
    }
  }, [projectId, apiKey]);

  if (!hasOrder)
    return <SwapWidget {...config} onlyChainId={onlyChainId} apikey={apiKey} />;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
      }}
    >
      <Widget {...config} onlyChainId={onlyChainId} apikey={apiKey} noUI>
        <Box
          sx={{
            width: config.width ?? 375,
            height: config.height,
            overflow: 'hidden',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            minWidth: 335,
            minHeight: 494,
            borderRadius: 16,
            backgroundColor: 'background.paper',
          }}
        >
          <Swap />
        </Box>
        <Box
          sx={{
            width: '100%',
            backgroundColor: 'background.paper',
          }}
        >
          <SwapOrderHistory />
        </Box>
      </Widget>
    </Box>
  );
};

Primary.args = {
  projectId: 'project2',
  apiKey: 'ee53d6b75b12aceed4',
  hasOrder: true,
  onlyChainId: 167000,
};
