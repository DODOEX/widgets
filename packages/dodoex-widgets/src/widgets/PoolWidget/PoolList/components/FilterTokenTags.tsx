import { Box, BoxProps } from '@dodoex/components';
import { Error } from '@dodoex/icons';
import TokenLogoSimple from '../../../../components/TokenLogoSimple';
import { TokenInfo } from '../../../../hooks/Token';

export default function FilterTokenTags({
  tags,
  onDeleteTag,
  sx,
}: {
  tags: TokenInfo[];
  onDeleteTag: (tag: TokenInfo) => void;
  sx?: BoxProps['sx'];
}) {
  if (!tags.length) return null;
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        ...sx,
      }}
    >
      {tags.map((tag) => (
        <Box
          key={tag.address}
          sx={{
            typography: 'body2',
            display: 'flex',
            alignItems: 'center',
            px: 8,
            mr: 8,
            borderRadius: 8,
            fontWeight: 600,
            height: 32,
            backgroundColor: 'hover.default',
          }}
        >
          <TokenLogoSimple
            address={tag.address}
            url={tag.logoURI ?? ''}
            width={20}
            height={20}
            sx={{
              mr: 8,
            }}
          />
          {tag.symbol}
          <Box
            component={Error}
            sx={{
              ml: 4,
              width: 16,
              height: 16,
              cursor: 'pointer',
              color: 'text.secondary',
              position: 'relative',
              top: 1.5,
            }}
            onClick={() => onDeleteTag(tag)}
          />
        </Box>
      ))}
    </Box>
  );
}
