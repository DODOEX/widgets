import { alpha, Box, Tooltip } from '@dodoex/components';
import { ChainListItem } from '../../constants/chainList';

export default function SelectChainItem({
  chain,
  active,
  onClick,
}: {
  chain: ChainListItem;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <Tooltip key={chain.chainId} title={chain.name} placement="top" onlyHover>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          p: 8,
          borderRadius: 8,
          cursor: 'pointer',
          border: '1px solid',
          ...(active
            ? {
                backgroundColor: 'tabActive.main',
                borderColor: 'tabActive.main',
                color: 'primary.main',
              }
            : {
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

        {active && (
          <Box
            sx={{
              typography: 'body2',
              color: 'primary.main',
            }}
          >
            {chain.name}
          </Box>
        )}
      </Box>
    </Tooltip>
  );
}
