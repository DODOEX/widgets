import { Box } from '@dodoex/components';
import { useWidgetDevice } from '../../../../hooks/style/useWidgetDevice';
import { PageType, useRouterStore } from '../../../../router';
import { ChainId } from '@dodoex/api';

export default function GoPoolDetailBtn({
  chainId,
  address,
}: {
  chainId: number;
  address: string;
}) {
  const { isMobile } = useWidgetDevice();
  return (
    <Box
      component="button"
      onClick={(evt) => {
        evt.stopPropagation();
        useRouterStore.getState().push({
          type: PageType.PoolDetail,
          params: {
            chainId: chainId as ChainId,
            address: address,
          },
        });
      }}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        cursor: 'pointer',
        flexShrink: 0,
        height: 36,
        color: 'text.primary',
        '&:hover': {
          opacity: 0.5,
        },
        ...(isMobile
          ? {
              width: 64,
              backgroundColor: 'background.tag',
            }
          : {
              width: 40,
              backgroundColor: 'transparent',
              borderWidth: 1,
            }),
      }}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5.83333 14.1667H7.5V8.33333H5.83333V14.1667ZM9.16667 14.1667H10.8333V5.83333H9.16667V14.1667ZM12.5 14.1667H14.1667V10.8333H12.5V14.1667ZM4.16667 17.5C3.70833 17.5 3.31597 17.3368 2.98958 17.0104C2.66319 16.684 2.5 16.2917 2.5 15.8333V4.16667C2.5 3.70833 2.66319 3.31597 2.98958 2.98958C3.31597 2.66319 3.70833 2.5 4.16667 2.5H15.8333C16.2917 2.5 16.684 2.66319 17.0104 2.98958C17.3368 3.31597 17.5 3.70833 17.5 4.16667V15.8333C17.5 16.2917 17.3368 16.684 17.0104 17.0104C16.684 17.3368 16.2917 17.5 15.8333 17.5H4.16667ZM4.16667 15.8333H15.8333V4.16667H4.16667V15.8333Z"
          fill="currentColor"
        />
      </svg>
    </Box>
  );
}
