# API

DODO Service API

## HOW TO USE

```TypeScript
import { SwapWidgetApi } from '@dodoex/api';
import { SwapWidget } from '@dodoex/widgets';

const dodoService = new SwapWidgetApi();
const apikey = ""
const projectId = "";

export default function Swap() {
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

  return <SwapWidget {...config} apikey={apiKey} />;
}
```
