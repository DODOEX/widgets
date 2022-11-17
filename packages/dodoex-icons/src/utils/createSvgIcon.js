import { memo, forwardRef } from 'react';

function createSvgIcon(path, displayName) {
  const Component = (props, ref) => (
    <svg data-testid={`${displayName}Icon`} viewBox="0 0 24 24" width="24px" height="24px" ref={ref} {...props}>
      {path}
    </svg>
  );

  if (process.env.NODE_ENV !== 'production') {
    // Need to set `displayName` on the inner component for React.memo.
    // React prior to 16.14 ignores `displayName` on the wrapper.
    Component.displayName = `${displayName}Icon`;
  }

  return memo(forwardRef(Component));
}

export default createSvgIcon;