import {
  alpha,
  Box,
  ButtonBase,
  TooltipToast,
  useTheme,
} from '@dodoex/components';
import { useLingui } from '@lingui/react';
import copy from 'copy-to-clipboard';
import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import { AddressWithLinkAndCopy } from '../../../../components/AddressWithLinkAndCopy';
import { CopyTooltipToast } from '../../../../components/CopyTooltipToast';
import {
  openEtherscanPage,
  truncatePoolAddress,
} from '../../../../utils/address';
import { useMyCreatedMiningList } from '../../hooks/useMyCreatedMiningList';
import { MiningERC20TokenI, MyCreatedMiningI } from '../../types';
import { CloseButton } from '../components/CloseButton';
import GoBack from '../components/GoBack';
import { MiningTags } from '../components/MiningTags';
import { MiningTitle } from '../components/MiningTitle';
import { UsersIcon } from '../components/UsersIcon';
import { generateMiningDetailUrl } from '../utils';
import { ReactComponent as LinkIcon } from './open_link_24dp.svg';
import { RewardCard } from './RewardCard';

export function OperateArea({
  miningItem,
  tokenPairs,
  onClose,
  setShareModalVisible,
  refetch,
}: {
  miningItem: MyCreatedMiningI;
  tokenPairs: MiningERC20TokenI[];
  onClose: () => void;
  setShareModalVisible: Dispatch<SetStateAction<boolean>>;
  refetch: ReturnType<typeof useMyCreatedMiningList>['refetch'];
}) {
  const {
    chainId,
    type,
    name,
    rewardTokenList,
    miningContractAddress,
    status,
    participantsNum,
    token,
    lpToken,
    isNewERCMineV3,
  } = miningItem;

  const theme = useTheme();
  const { i18n } = useLingui();

  const [rewardUpdateHistoryModalVisible, setRewardUpdateHistoryModalVisible] =
    useState(false);
  const [open, setOpen] = useState(false);

  const miningType = useMemo(() => {
    return (
      <Box
        sx={{
          py: 4,
          px: 8,
          borderRadius: 8,
          backgroundColor: alpha(theme.palette.purple.main, 0.1),
          color: theme.palette.purple.main,
          typography: 'h6',
          fontWeight: 600,
          [theme.breakpoints.up('tablet')]: {
            py: 8,
          },
        }}
      >
        {i18n._(
          type === 'lptoken' ? 'Token Pair Mining' : 'Single-Token Mining',
        )}
      </Box>
    );
  }, [i18n, theme.breakpoints, theme.palette.purple.main, type]);

  const stakeTokenAddress = type === 'lptoken' ? lpToken.id : token.address;

  return (
    <>
      <Box
        sx={{
          mx: 20,
          mb: 20,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          [theme.breakpoints.up('tablet')]: {
            display: 'none',
          },
        }}
      >
        <GoBack onClick={onClose} />

        <MiningTitle
          chainId={chainId}
          size="medium"
          title={name}
          titleTypography="h4"
          tokenPairs={tokenPairs}
          type={type}
          sx={{
            mt: 20,
          }}
          stakeTokenAddress={stakeTokenAddress}
          miningContractAddress={miningContractAddress}
        />

        <Box
          sx={{
            mt: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <MiningTags
            type={status}
            sx={{
              width: 'auto',
              py: 4,
              borderRadius: 4,
            }}
          />
          {miningType}
        </Box>
      </Box>

      <Box
        sx={{
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          backgroundColor: theme.palette.background.paper,
          p: 20,
          [theme.breakpoints.down('tablet')]: {
            display: 'none',
          },
        }}
      >
        <Box
          sx={{
            typography: 'h4',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            {name ?? '-'}

            {miningType}
          </Box>

          <CloseButton onClick={onClose} />
        </Box>

        <AddressWithLinkAndCopy
          size="small"
          truncate
          address={stakeTokenAddress ?? ''}
          iconSpace={4}
          sx={{
            mt: 2,
            color: theme.palette.text.secondary,
          }}
          customChainId={chainId}
        />
      </Box>

      <Box
        sx={{
          backgroundColor: theme.palette.background.paper,
          borderTopColor: theme.palette.border.main,
          borderTopWidth: 1,
          borderTopStyle: 'solid',
          pt: 20,
          px: 20,
          pb: 68,
          [theme.breakpoints.up('tablet')]: {
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16,
            pb: 20,
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            color: theme.palette.text.primary,
          }}
        >
          <UsersIcon />
        </Box>
        <Box
          sx={{
            mt: 12,
            color: theme.palette.text.primary,
            typography: 'caption',
            textAlign: 'center',
          }}
        >
          {participantsNum ?? '-'}
        </Box>
        <Box
          sx={{
            color: theme.palette.text.secondary,
            typography: 'body2',
            textAlign: 'center',
          }}
        >
          {i18n._('Users')}
        </Box>

        <Box
          sx={{
            pt: 4,
          }}
        >
          {rewardTokenList.map((rewardToken, index) => {
            return (
              <RewardCard
                key={rewardToken.address}
                index={index}
                chainId={chainId}
                rewardToken={rewardToken}
                miningContractAddress={miningContractAddress}
                isNewERCMineV3={isNewERCMineV3}
                refetch={refetch}
              />
            );
          })}
        </Box>

        <Box
          sx={{
            mt: 16,
            px: 20,
            py: 12,
            backgroundColor: theme.palette.background.tag,
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Box>
            <Box
              sx={{
                typography: 'h6',
                color: theme.palette.text.secondary,
              }}
            >
              {i18n._('Mining Pool')}
            </Box>
            <Box
              sx={{
                mt: 4,
                typography: 'body1',
                color: theme.palette.text.primary,
              }}
            >
              {truncatePoolAddress(miningContractAddress)}
            </Box>
          </Box>

          <Box
            component={ButtonBase}
            onClick={() => {
              openEtherscanPage(`address/${miningContractAddress}`, chainId);
            }}
            sx={{
              ml: 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 32,
              height: 32,
              borderRadius: '50%',
              borderColor: theme.palette.border.main,
              borderWidth: 1,
              borderStyle: 'solid',
              color: theme.palette.text.secondary,
              '&:hover': {
                color: theme.palette.text.primary,
              },
            }}
          >
            <LinkIcon
              style={{
                width: 16,
                height: 16,
              }}
            />
          </Box>

          <CopyTooltipToast
            size={16}
            copyText={miningContractAddress}
            componentProps={{
              sx: {
                ml: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 32,
                height: 32,
                borderRadius: '50%',
                borderColor: theme.palette.border.main,
                borderWidth: 1,
                borderStyle: 'solid',
                color: theme.palette.text.secondary,
                '&:hover': {
                  color: theme.palette.text.primary,
                },
              },
            }}
          />
        </Box>

        {/* <Box
          sx={{
            mt: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box
            sx={{
              typography: 'body2',
              fontWeight: 700,
              color: theme.palette.text.secondary,
            }}
          >
            {i18n._('mining.details.reward.edit.history')}
          </Box>
          <Box
            component={ButtonBase}
            sx={{
              typography: 'body2',
              fontWeight: 600,
              color: theme.palette.text.primary,
              gap: 2,
            }}
            onClick={() => {
              setRewardUpdateHistoryModalVisible(true);
            }}
          >
            {i18n._('mining.details')}
            <svg
              width="16"
              height="17"
              viewBox="0 0 16 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.43 13.1665L5.33334 12.0698L8.89556 8.49984L5.33334 4.92984L6.43 3.83317L11.0967 8.49984L6.43 13.1665Z"
                fill="currentColor"
              />
            </svg>
          </Box>
        </Box> */}

        <Box
          sx={{
            mt: 20,
            [theme.breakpoints.down('tablet')]: {
              mt: 0,
              p: 20,
              backgroundColor: theme.palette.background.paper,
              position: 'fixed',
              bottom: 85,
              left: 0,
              right: 0,
            },
          }}
        >
          <TooltipToast
            title={i18n._(`Copied`)}
            open={open}
            onClose={() => setOpen(false)}
          >
            <Box
              component={ButtonBase}
              onClick={(evt: any) => {
                evt.stopPropagation();
                const copyText = generateMiningDetailUrl({
                  chainId,
                  miningContractAddress,
                  stakeTokenAddress,
                });
                if (copyText) {
                  copy(copyText);
                  setOpen(true);
                }
              }}
              sx={{
                cursor: 'pointer',
              }}
            >
              {i18n._('Invite')}
            </Box>
          </TooltipToast>
        </Box>
      </Box>
    </>
  );
}
