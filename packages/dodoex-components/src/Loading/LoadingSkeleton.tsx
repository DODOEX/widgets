import { forwardRef } from 'react';
import { Box, BoxProps } from '../Box';
import { Skeleton, SkeletonProps } from '../Skeleton';
import { merge } from 'lodash';

interface LoadingSkeletonProps extends BoxProps {
  loading?: boolean;
  loadingSx?: BoxProps['sx'];
  loadingProps?: SkeletonProps;
}

// eslint-disable-next-line react/display-name
const LoadingSkeleton = forwardRef<HTMLDivElement, LoadingSkeletonProps>(
  ({ loading, loadingSx, loadingProps, children, ...attrs }, ref) => {
    return (
      <Box ref={ref} {...attrs}>
        {loading ? (
          // @ts-ignore
          <Skeleton
            height="fit-content"
            // @ts-ignore
            width={loadingSx?.width ?? '100%'}
            {...loadingProps}
            sx={merge(
              {
                borderRadius: 4,
              },
              loadingSx,
              loadingProps?.sx,
            )}
          >
            <Box
              sx={{
                visibility: 'hidden',
              }}
            >
              1
            </Box>
          </Skeleton>
        ) : (
          children
        )}
      </Box>
    );
  },
);

export default LoadingSkeleton;
