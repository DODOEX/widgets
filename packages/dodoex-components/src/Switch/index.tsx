import React from 'react';
import { Box, BoxProps } from '../Box';

type SwitchProps = {
  sx?: BoxProps['sx'];
  size?: number;
  checked?: boolean;
  onChange?: (
    evt: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => void;
};

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  function Switch({ sx, onChange, size: sizeProps, ...other }, ref) {
    const size = sizeProps ?? 12; // 使用高度作为基准尺寸
    const thumbSize = 8; // 滑块大小固定为 8x8
    const trackWidth = 22; // 固定宽度 22px
    const trackHeight = size; // 固定高度 12px
    const gap = 2; // 2px 间距

    return (
      <Box
        component="span"
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          width: trackWidth,
          height: trackHeight,
          cursor: 'pointer',
          ...sx,
        }}
      >
        <Box
          component="input"
          type="checkbox"
          {...other}
          ref={ref}
          onChange={(evt) => {
            onChange?.(evt, evt.target.checked);
          }}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: 0,
            cursor: 'pointer',
            zIndex: 1,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: trackHeight / 2,
            backgroundColor: other.checked ? 'primary.main' : 'text.secondary',
            opacity: other.checked ? 1 : 0.3,
            transition: 'all 0.2s ease-in-out',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: other.checked
              ? `calc(100% - ${thumbSize + gap}px)`
              : `${gap}px`,
            transform: 'translateY(-50%)',
            width: thumbSize,
            height: thumbSize,
            borderRadius: '50%',
            backgroundColor: 'background.paper',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            transition: 'all 0.2s ease-in-out',
          }}
        />
      </Box>
    );
  },
);
