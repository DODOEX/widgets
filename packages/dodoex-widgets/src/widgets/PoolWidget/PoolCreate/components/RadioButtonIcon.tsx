import { useTheme } from '@dodoex/components';

export function RadioButtonIcon({ selected }: { selected: boolean }) {
  const theme = useTheme();

  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ marginLeft: 'auto', flexShrink: 0 }}
    >
      <rect
        x="0.5"
        y="0.5"
        width="17"
        height="17"
        rx="8.5"
        stroke={
          selected ? theme.palette.success.main : theme.palette.text.secondary
        }
      />
      {selected && (
        <rect
          x="4.5"
          y="4.5"
          width="9"
          height="9"
          rx="4.5"
          fill={theme.palette.success.main}
          stroke={theme.palette.success.main}
        />
      )}
    </svg>
  );
}
