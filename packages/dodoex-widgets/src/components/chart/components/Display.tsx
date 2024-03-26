import React, { CSSProperties } from 'react';

type Props = {
  display?: CSSProperties['display'];
  hidden?: boolean;
  children?: JSX.Element | Array<JSX.Element | undefined> | string | undefined;
  style?: React.CSSProperties;
};

const DisplayInner = ({
  display = 'block',
  hidden = false,
  children,
  style = {},
}: Props) => {
  return (
    <div
      style={{
        display: hidden ? 'none' : display,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const Display = React.memo(DisplayInner);
