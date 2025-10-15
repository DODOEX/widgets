import {
  useDevices,
  Box,
  BoxProps,
  Slider as SliderOrigin,
  SliderProps,
  styled,
} from '@dodoex/components';
import { Trans } from '@lingui/macro';
import React from 'react';

const SliderOver = styled(SliderOrigin)(({ theme }) => ({
  height: 2,
  padding: '15px 0',
  margin: 0,
  '& .base-Slider-valueLabel': {
    fontSize: 12,
    fontWeight: 'normal',
    top: -6,
    backgroundColor: 'unset',
    color: theme.palette.text.primary,
    '&:before': {
      display: 'none',
    },
    '& *': {
      background: 'transparent',
      color: theme.palette.text.primary,
    },
  },
  '& .base-Slider-track': {
    display: 'none',
  },
  '& .base-Slider-rail': {
    backgroundColor: theme.palette.text.disabled,
    height: 1,
    opacity: 1,
  },
  '& .base-Slider-mark': {
    display: 'none',
    opacity: 1,
    backgroundColor: theme.palette.success.main,
    height: 6,
    width: 4,
    borderRadius: 4,
  },
  '& .base-Slider-markLabel': {
    display: 'none',
    fontSize: '12px',
    lineHeight: '17px',
  },
  '&&& .base-Slider-thumb': {
    backgroundColor: 'transparent',
  },
}));

interface Props {
  formatValue: (value?: number) => string | React.ReactNode;
  hoverValue: number | null;
  getSliderYPosition: (value?: number) => number;
}
interface ThumbComponentProps extends React.HTMLAttributes<unknown> {}
function ThumbComponent({
  hidden,
  sx,
  value,
  color: colorProps,
  min,
  max,
  formatValue,
  getSliderYPosition,
  ...props
}: ThumbComponentProps &
  Omit<Props, 'hoverValue'> & {
    hidden?: boolean;
    sx?: BoxProps;
    value?: number;
    color?: string;
    min?: number;
    max?: number;
  }) {
  const { children, ...other } = props;
  const { isMobile } = useDevices();
  const ref = React.useRef<HTMLDivElement>(null);
  const yPosition = getSliderYPosition(value);
  // The mobile version is a little different, so differentiate it.
  const space = isMobile ? 4 : 0;
  // 15 is the distance between the bottom and two more dots 12, which is 15 + 12 + 12 = 39
  const lineHeight = yPosition ? yPosition - 39 - space : undefined;
  const color = colorProps ?? 'text.primary';
  const isStart = value === min;
  const isRecommend = value === max;
  return (
    <Box
      {...other}
      ref={ref}
      sx={{
        position: 'absolute',
        '&&&': {
          display: hidden ? 'none' : 'block',
          backgroundColor: 'transparent',
          boxShadow: 'none',
          bottom: 8 + space,
          width: 'auto',
          height: 'auto',
          top: 'auto',
          marginLeft: 0,
          transform: 'none',
        },
        ...sx,
      }}
    >
      {children}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
        }}
      >
        {lineHeight ? (
          <>
            <Box
              sx={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                backgroundColor: color,
                borderStyle: 'solid',
                borderWidth: 2,
                borderColor: 'background.paperContrast',
                flexShrink: 1,
              }}
            />
            <Box
              sx={{
                height: lineHeight,
                width: '0',
                borderStyle: 'dashed',
                borderWidth: 1,
                borderColor: color,
              }}
            />
          </>
        ) : (
          ''
        )}
        <Box
          sx={{
            width: 16,
            height: 16,
            borderRadius: '50%',
            backgroundColor: color,
            borderStyle: 'solid',
            borderWidth: 2,
            borderColor: 'background.paperContrast',
            flexShrink: 1,
          }}
        />
        {/* text */}
        <Box
          sx={{
            typography: 'h6',
            position: 'absolute',
            bottom: -20,
            color,
            whiteSpace: 'nowrap',
            backgroundColor: 'background.paperContrast',
            ...(isStart
              ? {
                  left: 0,
                }
              : {}),
            ...(isRecommend
              ? {
                  right: 0,
                }
              : {}),
          }}
        >
          {isRecommend ? (
            <>
              <Box
                component="span"
                sx={{
                  color: 'success.main',
                }}
              >
                <Trans>Dynamic</Trans>
              </Box>
              <span>{' • '}</span>
            </>
          ) : (
            ''
          )}
          {formatValue(value)}
        </Box>
      </Box>
    </Box>
  );
}

export default function SlippageSlider({
  hoverValue,
  formatValue,
  getSliderYPosition,
  ...props
}: SliderProps & Props) {
  const { isMobile } = useDevices();

  // Because hovering is not convenient on the mobile terminal, dragging is used to change the hover value. Instead, the displayed value is passed in as hoverValue for easy display. Change the color inside again and make it the same color as the PC
  const activeColor = isMobile ? 'primary.main' : undefined;
  const hoverColor = isMobile ? undefined : 'primary.main';
  return (
    <SliderOver
      slots={{
        thumb: (slotsProps) => {
          const hidden =
            props.value &&
            typeof props.value === 'number' &&
            ((props.min && props.value < props.min) ||
              (props.max && props.value > props.max));

          const defaultProps = {
            value: props.value,
            min: props.min,
            max: props.max,
            hidden: !!hidden,
            color: activeColor,
            formatValue,
            getSliderYPosition,
          };
          const thumbProps = {
            ...slotsProps,
            ...defaultProps,
          };

          if (
            hoverValue !== null &&
            props.max &&
            props.min &&
            props.value !== hoverValue
          ) {
            const count = props.max - props.min;
            const currentSplitValue = hoverValue - props.min;
            const left = currentSplitValue
              ? (currentSplitValue / count) * 100
              : 0;
            if (isMobile) {
              // The mobile terminal uses hoverValue for value.
              const hoverHidden =
                !!hoverValue &&
                ((!!props.min && hoverValue < props.min) ||
                  (!!props.max && hoverValue > props.max));
              // On the mobile side, hover and value are opposite, so change the order to prevent the hover element from being obscured by the value element.
              return (
                <>
                  <ThumbComponent
                    {...defaultProps}
                    value={hoverValue}
                    color={hoverColor}
                    hidden={hoverHidden}
                    sx={{
                      left: left + '%',
                    }}
                  />
                  {/* hover display */}
                  <ThumbComponent {...thumbProps} />
                </>
              );
            }
            return (
              <>
                <ThumbComponent {...thumbProps} />
                {/* hover display */}
                <ThumbComponent
                  {...defaultProps}
                  value={hoverValue}
                  hidden={false}
                  color={hoverColor}
                  sx={{
                    left: left + '%',
                  }}
                />
              </>
            );
          }
          return <ThumbComponent {...thumbProps} />;
        },
      }}
      {...props}
    />
  );
}
