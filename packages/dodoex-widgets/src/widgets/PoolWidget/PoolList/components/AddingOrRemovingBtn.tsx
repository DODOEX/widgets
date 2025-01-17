import { Box, useTheme } from '@dodoex/components';
import { ArrowBack } from '@dodoex/icons';

export default function AddingOrRemovingBtn({
  text,
  onClick,
}: {
  text: string;
  onClick: () => void;
}) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        typography: 'body2',
        display: 'inline-flex',
        alignItems: 'center',
        p: theme.spacing(0, 4, 0, 8),
        width: 'max-content',
        height: 32,
        color: '#FFF',
        backgroundColor: 'rgba(255, 255, 255, 0.20)',
        borderWidth: 1,
        borderRadius: 8,
        cursor: 'pointer',
      }}
      onClick={onClick}
    >
      {text}
      <Box
        component={ArrowBack}
        sx={{
          ml: 2,
          width: 16,
          height: 16,
          transform: 'rotate(180deg)',
        }}
      />
    </Box>
  );
}
