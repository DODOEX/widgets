import {
  Box,
  Button,
  ButtonBase,
  Checkbox,
  LoadingSkeleton,
  Skeleton,
  Tooltip,
  useTheme,
} from '@dodoex/components';
import LiquidityTable from '../../PoolWidget/PoolList/components/LiquidityTable';
import { t, Trans } from '@lingui/macro';
import TokenLogo from '../../../components/TokenLogo';
import { formatTokenAmountNumber } from '../../../utils';
import { Lock, useFetchUserLocks } from './hooks/useFetchUserLocks';
import {
  getUnlockTimeText,
  getUnlockTimeTextShort,
} from '../Ve33LockOperate/utils';
import React from 'react';
import { Done } from '@dodoex/icons';

export interface CardListProps {
  inSelected: boolean;
  selectedId: number[];
  setSelectedId: React.Dispatch<React.SetStateAction<number[]>>;
  fetchUserLocks: ReturnType<typeof useFetchUserLocks>;
  onManage: (lock: Lock) => void;
  onClaim: (lock: Lock) => void;
}

export const CardList = ({
  inSelected,
  selectedId,
  setSelectedId,
  fetchUserLocks,
  onManage,
  onClaim,
}: CardListProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      {fetchUserLocks.isLoading ? (
        <CardItem
          inSelected={inSelected}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          onManage={onManage}
          onClaim={onClaim}
        />
      ) : (
        fetchUserLocks.userLocks?.map((item, i) => {
          return (
            <CardItem
              key={item.tokenId?.toString() ?? i}
              inSelected={inSelected}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
              data={item}
              onManage={onManage}
              onClaim={onClaim}
            />
          );
        })
      )}
    </Box>
  );
};

function CardItem({
  inSelected,
  selectedId,
  setSelectedId,
  data,
  onManage,
  onClaim,
}: Pick<
  CardListProps,
  'inSelected' | 'selectedId' | 'setSelectedId' | 'onManage' | 'onClaim'
> & {
  data?: Lock;
}) {
  const theme = useTheme();
  const checked = !!data && selectedId.includes(data.tokenId);
  const token = data?.token;
  const isUnlock = !!data && data?.lockedEnd < Date.now();
  const claimText = isUnlock ? t`Claim` : t`Claim & Lock`;
  const canCheckbox = selectedId.length < 2 || checked;

  return (
    <Box
      sx={{
        position: 'relative',
        p: theme.spacing(20, 20, 12),
        borderRadius: 24,
        backgroundColor: theme.palette.background.paper,
        cursor: inSelected ? 'pointer' : undefined,
        ...(checked && {
          border: `solid 2px ${theme.palette.secondary.main}`,
        }),
      }}
      onClick={
        inSelected && data
          ? () => {
              setSelectedId((prev) => {
                const result = [...prev];
                const index = result.indexOf(data.tokenId);
                if (index === -1) {
                  if (result.length < 2) {
                    return [...result, data.tokenId];
                  }
                } else {
                  result.splice(index, 1);
                }
                return result;
              });
            }
          : undefined
      }
    >
      {inSelected && canCheckbox && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            px: 20,
            py: 8,
            borderRadius: theme.spacing(0, 24, 0, 12),
            backgroundColor: checked
              ? theme.palette.secondary.main
              : theme.palette.background.paperDarkContrast,
            color: checked
              ? theme.palette.secondary.contrastText
              : theme.palette.text.secondary,
          }}
        >
          <Box
            component={Done}
            sx={{
              width: 18,
              height: 18,
            }}
          />
        </Box>
      )}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          typography: 'body2',
          fontWeight: 600,
        }}
      >
        {!data || !token ? (
          <Skeleton width={24} height={24} variant="circular" />
        ) : (
          <TokenLogo
            chainId={data?.tokenId}
            address={token?.address}
            width={24}
            height={24}
            marginRight={0}
          />
        )}
        {t`Lock` + ` #${data?.tokenId ?? ''}`}
      </Box>

      <LoadingSkeleton
        loading={!data}
        loadingProps={{
          width: 100,
        }}
        sx={{
          mt: 40,
          typography: 'h5',
          color: theme.palette.success.main,
        }}
      >
        2.11307%
      </LoadingSkeleton>
      <Box
        sx={{ typography: 'h6', color: 'text.secondary' }}
      >{t`Rebase APR`}</Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          mt: 16,
          pt: 16,
          borderTop: `solid 1px ${theme.palette.border.main}`,
        }}
      >
        <InfoItem label={t`Locked Amount`}>
          <TokenAmountValue
            amount={formatTokenAmountNumber({
              input: data?.value!,
              decimals: token?.decimals,
            })}
            symbol={token?.symbol}
            isLoading={!data}
          />
        </InfoItem>
        <InfoItem label={t`Voting Power`}>
          <TokenAmountValue
            amount={formatTokenAmountNumber({
              input: data?.votingPower!,
              decimals: token?.decimals,
            })}
            symbol={`ve${token?.symbol}`}
            isLoading={!data}
          />
        </InfoItem>
        <InfoItem label={t`Unlock Date`}>
          <LoadingSkeleton loading={!data} loadingProps={{ width: 100 }}>
            <Tooltip title={getUnlockTimeText(data?.lockedEnd!)}>
              <Box
                sx={{
                  color: theme.palette.success.main,
                }}
              >
                {getUnlockTimeTextShort(data?.lockedEnd!)}
              </Box>
            </Tooltip>
          </LoadingSkeleton>
        </InfoItem>
        <InfoItem label={t`Rebases`}>
          <TokenAmountValue
            amount={formatTokenAmountNumber({
              input: 100,
              decimals: token?.decimals,
            })}
            symbol={token?.symbol}
            isLoading={!data}
          />
        </InfoItem>
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          mt: 16,
        }}
      >
        <Button
          sx={{
            p: theme.spacing(0, 16),
            height: 32,
            typography: 'body2',
            fontWeight: 600,
            borderRadius: 8,
            flex: 1,
          }}
          onClick={() => onClaim(data!)}
        >
          {claimText}
        </Button>
        <ButtonBase
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 64,
            height: 32,
            borderRadius: 8,
            backgroundColor: theme.palette.background.paperDarkContrast,
          }}
          onClick={() => onManage(data!)}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M10.5264 2.10617C10.8039 1.90667 11.1939 1.81367 11.5771 1.95392C12.3919 2.2524 13.1487 2.69016 13.8136 3.24767C14.1264 3.51017 14.2411 3.89342 14.2066 4.23242C14.1504 4.79717 14.2494 5.34242 14.5216 5.81192C14.7616 6.22967 15.1231 6.55967 15.5641 6.79217L15.7329 6.87467C16.0434 7.01492 16.3194 7.30667 16.3891 7.70942C16.5373 8.56304 16.5373 9.4358 16.3891 10.2894C16.3269 10.6524 16.0966 10.9247 15.8244 11.0777L15.7329 11.1249C15.2154 11.3574 14.7924 11.7174 14.5209 12.1869C14.2494 12.6572 14.1504 13.2017 14.2066 13.7664C14.2404 14.1054 14.1264 14.4894 13.8136 14.7512C13.1487 15.3087 12.3919 15.7464 11.5771 16.0449C11.403 16.1072 11.2162 16.1259 11.0332 16.0994C10.8502 16.0728 10.6764 16.0019 10.5271 15.8927C10.0651 15.5619 9.54238 15.3744 9.00013 15.3744C8.45788 15.3744 7.93513 15.5612 7.47388 15.8927C7.32451 16.002 7.15063 16.073 6.96745 16.0996C6.78427 16.1261 6.59738 16.1073 6.42313 16.0449C5.60833 15.7464 4.85158 15.3087 4.18663 14.7512C4.04579 14.6315 3.93636 14.4792 3.86786 14.3076C3.79936 14.136 3.77388 13.9502 3.79363 13.7664C3.84988 13.2017 3.75013 12.6564 3.47863 12.1869C3.23135 11.7677 2.86973 11.4277 2.43613 11.2067L2.26738 11.1242C2.09814 11.0492 1.94984 10.9339 1.83544 10.7884C1.72104 10.6429 1.64403 10.4716 1.61113 10.2894C1.46296 9.4358 1.46296 8.56304 1.61113 7.70942C1.67338 7.34642 1.90363 7.07417 2.17588 6.92117L2.26738 6.87467C2.78488 6.64142 3.20788 6.28217 3.47938 5.81192C3.75013 5.34242 3.84988 4.79717 3.79363 4.23242C3.77388 4.04867 3.79936 3.86289 3.86786 3.69125C3.93636 3.51961 4.04579 3.36733 4.18663 3.24767C4.85159 2.69016 5.60834 2.2524 6.42313 1.95392C6.59729 1.89169 6.78402 1.87304 6.96705 1.89957C7.15007 1.92611 7.32382 1.99704 7.47313 2.10617C7.93438 2.43767 8.45713 2.62442 9.00013 2.62442C9.54313 2.62442 10.0651 2.43767 10.5264 2.10617ZM11.2441 3.43292C10.5946 3.86042 9.82888 4.12442 9.00013 4.12442C8.17138 4.12442 7.40563 3.85967 6.75613 3.43292C6.234 3.64367 5.74419 3.92696 5.30113 4.27442C5.34613 5.04917 5.19238 5.84417 4.77838 6.56192C4.36363 7.27892 3.75238 7.80917 3.05863 8.15792C2.98047 8.71569 2.98047 9.28164 3.05863 9.83942C3.75238 10.1882 4.36363 10.7184 4.77838 11.4369C5.19238 12.1532 5.34613 12.9482 5.30113 13.7229C5.74414 14.0706 6.23396 14.3542 6.75613 14.5652C7.40563 14.1377 8.17138 13.8737 9.00013 13.8737C9.82888 13.8737 10.5946 14.1384 11.2441 14.5652C11.7662 14.3544 12.2561 14.0711 12.6991 13.7237C12.6541 12.9482 12.8079 12.1532 13.2219 11.4362C13.6359 10.7184 14.2479 10.1882 14.9416 9.83867C15.0198 9.28139 15.0198 8.71594 14.9416 8.15867C14.2479 7.80917 13.6366 7.27892 13.2219 6.56117C12.8079 5.84417 12.6541 5.04917 12.6991 4.27367C12.2561 3.92621 11.7663 3.64367 11.2441 3.43292ZM9.00013 5.99942C9.79578 5.99942 10.5588 6.31549 11.1215 6.8781C11.6841 7.44071 12.0001 8.20377 12.0001 8.99942C12.0001 9.79507 11.6841 10.5581 11.1215 11.1207C10.5588 11.6833 9.79578 11.9994 9.00013 11.9994C8.20448 11.9994 7.44142 11.6833 6.87881 11.1207C6.3162 10.5581 6.00013 9.79507 6.00013 8.99942C6.00013 8.20377 6.3162 7.44071 6.87881 6.8781C7.44142 6.31549 8.20448 5.99942 9.00013 5.99942ZM9.00013 7.49942C8.60231 7.49942 8.22077 7.65745 7.93947 7.93876C7.65817 8.22006 7.50013 8.60159 7.50013 8.99942C7.50013 9.39724 7.65817 9.77877 7.93947 10.0601C8.22077 10.3414 8.60231 10.4994 9.00013 10.4994C9.39795 10.4994 9.77949 10.3414 10.0608 10.0601C10.3421 9.77877 10.5001 9.39724 10.5001 8.99942C10.5001 8.60159 10.3421 8.22006 10.0608 7.93876C9.77949 7.65745 9.39795 7.49942 9.00013 7.49942Z"
              fill="currentColor"
            />
          </svg>
        </ButtonBase>
      </Box>
    </Box>
  );
}

function InfoItem({
  label,
  children,
}: React.PropsWithChildren<{
  label: React.ReactNode;
}>) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        typography: 'body2',
        fontWeight: 600,
      }}
    >
      <Box
        sx={{
          typography: 'h6',
          color: 'text.secondary',
        }}
      >
        {label}
      </Box>
      {children}
    </Box>
  );
}

function TokenAmountValue({
  symbol,
  amount,
  isLoading,
}: {
  symbol: string | undefined;
  amount: string | undefined;
  isLoading: boolean;
}) {
  return (
    <Box>
      <LoadingSkeleton
        component="span"
        loading={isLoading}
        loadingProps={{ width: 40 }}
      >
        {amount}
      </LoadingSkeleton>
      <Box
        component="span"
        sx={{
          color: 'text.secondary',
        }}
      >{` ${symbol}`}</Box>
    </Box>
  );
}
