import { Box, BoxProps, Button } from '@dodoex/components';
import { CP_STATUS, Crowdpooling } from '../../types';
import React from 'react';
import { Share } from '@dodoex/icons';
import { Trans } from '@lingui/macro';
import { PageType, useRouterStore } from '../../../../router';
import { CopyTooltipToast } from '../../../../components/CopyTooltipToast';
import { useUserOptions } from '../../../../components/UserOptionsProvider';

interface OperationButtonProps {
  data: Crowdpooling;
}

export function OperationButton({ data }: OperationButtonProps) {
  const { status } = data;
  const { getPageUrl } = useUserOptions();

  const onManage = () => {
    useRouterStore.getState().push({
      type: PageType.CrowdpoolingDetail,
      params: {
        address: data.id,
        chainId: data.chainId as any,
      },
    });
  };

  switch (status) {
    case CP_STATUS.WAITING:
    case CP_STATUS.PROCESSING:
      return (
        <CopyTooltipToast
          notCopyIcon
          copyText={getPageUrl?.(PageType.CrowdpoolingDetail, {
            address: data.id,
            chainId: data.chainId as any,
          })}
        >
          <HoverBtn icon={Share} label={<Trans>Share URL</Trans>} />
        </CopyTooltipToast>
      );
    case CP_STATUS.SETTLING:
      return (
        <HoverBtn
          icon={SettleIcon}
          label={<Trans>Settle</Trans>}
          onClick={onManage}
        />
      );
    case CP_STATUS.CALMING:
      return (
        <HoverBtn
          icon={SettleIcon}
          label={<Trans>Withdraw</Trans>}
          onClick={onManage}
        />
      );
    case CP_STATUS.ENDED:
      return (
        <HoverBtn
          icon={JumpIcon}
          label={<Trans>Withdraw</Trans>}
          onClick={onManage}
        />
      );
  }
  return null;
}

function HoverBtn({
  icon,
  label,
  onClick,
}: {
  icon: BoxProps['component'];
  label: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Button
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 'max-content',
        width: 'max-content',
        borderRadius: 64,
        typography: 'body2',
        fontWeight: 600,
        p: 2,
        gap: 4,
        '&:not(&:hover)': {
          '& > .text': {
            display: 'none',
          },
        },
        '&:hover': {
          px: 8,
        },
      }}
      onClick={onClick}
    >
      <Box
        component={icon}
        sx={{
          width: 14,
          height: 14,
        }}
      />
      <div className="text">{label}</div>
    </Button>
  );
}

const SettleIcon = () => {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.37214 10V8.69423H5.85201V10H4.37214ZM4.37214 1.30577V0H5.85201V1.30577H4.37214ZM5.12296 9.07508C4.56438 9.07508 4.06202 8.97171 3.61589 8.76496C3.17338 8.55459 2.81248 8.25716 2.53319 7.87269C2.2539 7.48821 2.07617 7.03663 2 6.51795L3.46899 6.28945C3.53428 6.57236 3.64853 6.82082 3.81175 7.03482C3.97497 7.24519 4.17628 7.40842 4.41567 7.52448C4.65869 7.63693 4.92347 7.69315 5.21001 7.69315C5.47842 7.69315 5.72144 7.64962 5.93906 7.56257C6.15669 7.47552 6.32717 7.35582 6.45049 7.20348C6.57381 7.04752 6.63547 6.87704 6.63547 6.69206C6.63547 6.56511 6.60827 6.45267 6.55386 6.35473C6.50308 6.2568 6.42329 6.17156 6.31447 6.09902C6.20928 6.02648 6.07327 5.963 5.90642 5.9086L3.96953 5.31012C3.41821 5.13965 3.00109 4.88212 2.71817 4.53754C2.43526 4.19296 2.2938 3.76859 2.2938 3.26442C2.2938 2.78926 2.40624 2.37577 2.63112 2.02394C2.85963 1.66848 3.18244 1.39645 3.59956 1.20783C4.01668 1.0156 4.50635 0.921291 5.06855 0.924919C5.58361 0.932173 6.04244 1.02648 6.44505 1.20783C6.85129 1.38556 7.18861 1.6449 7.45702 1.98585C7.72905 2.32318 7.92673 2.73486 8.05005 3.22089L6.52666 3.49293C6.47588 3.26079 6.38157 3.05767 6.24374 2.88357C6.10591 2.70584 5.93362 2.56801 5.72688 2.47008C5.52013 2.36852 5.29343 2.31411 5.04679 2.30686C4.81103 2.2996 4.59521 2.33406 4.39935 2.41023C4.20348 2.4864 4.04752 2.5934 3.93145 2.73123C3.81901 2.86906 3.76279 3.0214 3.76279 3.18825C3.76279 3.38049 3.84258 3.54371 4.00218 3.67791C4.16177 3.81212 4.41567 3.92818 4.76387 4.02612L6.14581 4.41785C6.61008 4.55205 6.98549 4.71708 7.27203 4.91295C7.55858 5.10519 7.76895 5.33732 7.90316 5.60936C8.03736 5.88139 8.10446 6.20602 8.10446 6.58324C8.10446 7.07291 7.97932 7.50635 7.72905 7.88357C7.47878 8.26079 7.12695 8.55459 6.67356 8.76496C6.22379 8.97171 5.70693 9.07508 5.12296 9.07508Z"
        fill="currentColor"
      />
    </svg>
  );
};

const JumpIcon = () => (
  <svg
    width="10"
    height="10"
    viewBox="0 0 10 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9.00015 2.41378L9.01436 2.39957L9.00015 2.38535V0.999571H7.61437L7.60015 0.985352L7.58593 0.999571H3.00015V2.99957H5.58593L0.585938 7.99957L2.00015 9.41378L7.00015 4.41378V6.99957H9.00015V2.41378Z"
      fill="currentColor"
    />
  </svg>
);
