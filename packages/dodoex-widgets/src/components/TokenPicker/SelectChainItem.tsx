import { Box, Tooltip } from '@dodoex/components';
import { Trans } from '@lingui/macro';
import { chainListMap } from '../../constants/chainList';

export default function SelectChainItem({
  chain,
  active,
  onClick,
}: {
  chain: typeof chainListMap[keyof typeof chainListMap];
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <Tooltip key={chain.chainId} title={chain.name} placement="top" onlyHover>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 8,
          borderRadius: 8,
          cursor: 'pointer',
          ...(active
            ? {
                backgroundColor: 'secondary.main',
              }
            : {
                border: '1px solid',
                borderColor: 'border.main',
                '&:hover': {
                  backgroundColor: 'hover.default',
                },
              }),
        }}
        onClick={onClick}
      >
        <Box
          component={chain.logo}
          sx={{
            width: 24,
            height: 24,
          }}
        />
        {active ? (
          <Box
            sx={{
              ml: 8,
            }}
          >
            <Trans>on</Trans>
            {` ${chain.name}`}
          </Box>
        ) : (
          ''
        )}
      </Box>
    </Tooltip>
  );
}
