import React from 'react';
import {
  Slider as BaseSlider,
  sliderClasses,
  SliderProps as BaseSliderProps,
} from '@mui/base/Slider';
import { alpha, Box, styled } from '@mui/system';
import { ButtonBase } from '../Button';
import { Tooltip } from '../Tooltip';

const boxShadow = `0 2px 4px ${alpha('#1A1A1B', 0.2)}`;

const SliderStyle = styled(BaseSlider)(
  ({ theme }) => `
  position: relative;
  display: inline-flex;
  width: 100%;
  color: ${theme.palette.primary.main};
  height: 2px;
  padding: 15px 0px;
  margin-bottom: 20px;

  &.${sliderClasses.disabled} { 
    pointer-events: none;
    cursor: default;
    color: ${theme.palette.text.disabled};
  }

  & .${sliderClasses.rail} {
    display: block;
    position: absolute;
    width: 100%;
    height: 4px;
    border-radius: 6px;
    background-color: ${theme.palette.border.main};
  }

  & .${sliderClasses.track} {
    display: block;
    position: absolute;
    height: 4px;
    border-radius: 6px;
    background-color: currentColor;
  }

  & .${sliderClasses.thumb} {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 5px;
    margin-left: -11px;
    height: 24px;
    width: 24px;
    background-color: #fff;
    box-shadow: ${boxShadow};
    border-radius: 8px;
    &:focus, &:hover, &.Mui-active {
      box-shadow: ${boxShadow};
      @media (hover: none) {
        box-shadow: ${boxShadow};
      }
    }
    & .thumb-bar {
      height: 9px;
      width: 2px;
      background-color: #1A1A1B;
      margin-left: 1px;
      margin-right: 1px;
    }

    &.${sliderClasses.focusVisible} {
      box-shadow: ${boxShadow};
      outline: none;
    }

    &.${sliderClasses.active} {
      box-shadow: ${boxShadow};
      outline: none;
      transform: scale(1.2);
    }
    
    &.${sliderClasses.disabled} {
      background-color: ${theme.palette.text.disabled};
    }
  }

  & .${sliderClasses.mark} {
    position: absolute;
    transform: translate(-1px, -4px);
    border-radius: 1px;
    background-color: ${theme.palette.border.main};
    height: 12px;
    width: 2px;
  }
  & .${sliderClasses.markActive} {
    background-color: currentColor;
  }
  & .${sliderClasses.markLabel} {
    position: absolute;
    top: 30px;
    transform: translateX(-50%);
    font-size: 12px;
    line-height: 17px;
    white-space: nowrap;
  }
`,
);

function ThumbComponent(props: React.HTMLAttributes<unknown>) {
  const { children, ...other } = props;

  const ownerState = (other as any)?.ownerState as SliderProps | undefined;

  if (ownerState?.tooltip) {
    return (
      <Tooltip
        open
        title={ownerState?.value + ownerState.tooltip}
        arrow={false}
        placement="bottom"
        offset={[0, 4]}
        sx={{
          padding: '2px 4px',
          backgroundColor: 'primary.main',
          color: 'primary.contrastText',
        }}
      >
        <ButtonBase {...other}>
          {children}
          <span className="thumb-bar" />
          <span className="thumb-bar" />
          <span className="thumb-bar" />
        </ButtonBase>
      </Tooltip>
    );
  }

  return (
    <ButtonBase {...other}>
      {children}
      <span className="thumb-bar" />
      <span className="thumb-bar" />
      <span className="thumb-bar" />
    </ButtonBase>
  );
}

export interface SliderProps extends BaseSliderProps {
  tooltip?: string;
}
export const Slider = ({ tooltip, ...other }: SliderProps) => {
  return (
    <SliderStyle
      slots={{
        thumb: ThumbComponent,
      }}
      tooltip={tooltip}
      {...other}
    />
  );
};
