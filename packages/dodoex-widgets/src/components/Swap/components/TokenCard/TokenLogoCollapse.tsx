import { Box, useTheme, ButtonBase, BoxProps } from '@dodoex/components';
import { Trans } from '@lingui/macro';
import TokenLogo from '../../../TokenLogo';
import { swapSelectTokenBtn } from '../../../../constants/testId';
import { TokenInfo } from '../../../../hooks/Token';
import { chainListMap } from '../../../../constants/chainList';

export function TokenLogoCollapse({
  token,
  onClick,
  tokenLogoSize = 30,
  showChainLogo,
  readonly,
  showChainName: showChainNameProps,
  sx,
  symbolSx,
}: {
  token?: TokenInfo | null;
  tokenLogoSize?: number;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  showChainLogo?: boolean;
  readonly?: boolean;
  showChainName?: boolean;
  sx?: BoxProps['sx'];
  symbolSx?: BoxProps['sx'];
}) {
  const theme = useTheme();
  const chain = token?.chainId ? chainListMap.get(token.chainId) : null;
  const showChainName = showChainNameProps && !!chain;
  return (
    <Box
      component={ButtonBase}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        color: theme.palette.text.primary,
        typography: showChainName ? 'body2' : 'body1',
        fontWeight: 600,
        '&:focus-visible': {
          opacity: 0.5,
        },
        ...sx,
      }}
      onClick={(e: any) => {
        if (readonly) return;
        onClick && onClick(e);
      }}
      data-testid={swapSelectTokenBtn}
    >
      {!!token?.address && (
        <TokenLogo
          url={token?.logoURI}
          address={token?.address ?? ''}
          chainId={token?.chainId}
          noShowChain={!showChainLogo}
          width={tokenLogoSize}
          height={tokenLogoSize}
          chainSize={16}
          logoOffset={10}
          marginRight={0}
        />
      )}
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', ...symbolSx }}>
          {token?.address ? (
            <>
              <Box>{token?.symbol ?? '-'}</Box>
            </>
          ) : (
            <Trans>SELECT TOKEN</Trans>
          )}
          {!readonly && (
            <svg
              width="18"
              height="19"
              viewBox="0 0 18 19"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9 11.75L12 7.25H6L9 11.75Z"
                fill="currentColor"
              />
            </svg>
          )}
        </Box>
        {!!showChainName && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              typography: 'h6',
              color: 'text.secondary',
            }}
          >
            {chain.name}
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.6036 4.12761C5.50037 4.20906 5.3708 4.24967 5.23958 4.24169C5.10836 4.23372 4.98466 4.17773 4.89203 4.08438C4.7994 3.99103 4.74433 3.86685 4.7373 3.73549C4.73026 3.60413 4.77177 3.47477 4.8539 3.37205L5.96239 2.25211C6.46737 1.76405 7.14372 1.494 7.84575 1.5001C8.54779 1.50621 9.21934 1.78798 9.71577 2.28474C10.2122 2.78151 10.4938 3.4535 10.4999 4.156C10.506 4.85851 10.2361 5.5353 9.74839 6.04062L8.60241 7.16592C8.55441 7.22201 8.49533 7.26757 8.4289 7.29974C8.36246 7.3319 8.29009 7.34997 8.21635 7.35282C8.1426 7.35567 8.06906 7.34324 8.00034 7.3163C7.93162 7.28936 7.86921 7.2485 7.81702 7.19627C7.76483 7.14405 7.724 7.0816 7.69707 7.01284C7.67015 6.94407 7.65772 6.87048 7.66057 6.79668C7.66342 6.72289 7.68148 6.65047 7.71363 6.58399C7.74577 6.51751 7.7913 6.4584 7.84736 6.41036L8.97191 5.28506C9.25568 4.98032 9.41017 4.57725 9.40283 4.16078C9.39549 3.74431 9.22689 3.34695 8.93255 3.05242C8.63821 2.75788 8.24111 2.58917 7.82491 2.58182C7.40872 2.57447 7.00592 2.72906 6.70138 3.01302L5.6036 4.12761ZM6.34259 7.93755C6.38819 7.87582 6.44652 7.82461 6.51361 7.7874C6.58071 7.75018 6.65501 7.72783 6.73149 7.72185C6.80798 7.71586 6.88485 7.7264 6.95691 7.75273C7.02897 7.77906 7.09453 7.82058 7.14917 7.87447C7.2038 7.92836 7.24622 7.99337 7.27356 8.06509C7.3009 8.13682 7.31252 8.21358 7.30764 8.29019C7.30275 8.3668 7.28148 8.44147 7.24525 8.50913C7.20902 8.5768 7.15869 8.63589 7.09765 8.68239L5.96774 9.81305C5.45894 10.2708 4.7943 10.5163 4.11029 10.4992C3.42627 10.482 2.77479 10.2034 2.2896 9.72061C1.80441 9.23784 1.52232 8.58752 1.50127 7.90316C1.48021 7.2188 1.72179 6.55234 2.17638 6.04062L3.30629 4.93139C3.3504 4.86735 3.4079 4.81369 3.47482 4.77413C3.54174 4.73456 3.61646 4.71005 3.69379 4.70229C3.77113 4.69453 3.84922 4.70371 3.92266 4.72919C3.99609 4.75466 4.0631 4.79583 4.11904 4.84983C4.17497 4.90384 4.21849 4.96937 4.24657 5.0419C4.27464 5.11442 4.28661 5.19219 4.28163 5.2698C4.27665 5.34742 4.25484 5.42302 4.21773 5.49135C4.18062 5.55969 4.12908 5.61912 4.06671 5.66552L2.93144 6.79618C2.64767 7.10092 2.49318 7.50398 2.50052 7.92045C2.50786 8.33692 2.67647 8.73428 2.97081 9.02882C3.26515 9.32335 3.66224 9.49207 4.07844 9.49942C4.49463 9.50676 4.89743 9.35217 5.20197 9.06821L6.34259 7.93755ZM5.00919 7.76072C4.96119 7.81681 4.90211 7.86237 4.83567 7.89454C4.76924 7.9267 4.69687 7.94477 4.62312 7.94763C4.54937 7.95048 4.47583 7.93804 4.40711 7.9111C4.33839 7.88416 4.27598 7.8433 4.2238 7.79108C4.17161 7.73885 4.13077 7.6764 4.10385 7.60764C4.07693 7.53887 4.0645 7.46528 4.06735 7.39149C4.0702 7.31769 4.08826 7.24528 4.1204 7.17879C4.15255 7.11231 4.19808 7.0532 4.25413 7.00516L6.90487 4.35267C7.00731 4.26488 7.13909 4.21901 7.27386 4.22422C7.40863 4.22943 7.53648 4.28533 7.63185 4.38077C7.72722 4.4762 7.78309 4.60413 7.7883 4.73899C7.7935 4.87385 7.74766 5.00572 7.65993 5.10823L5.00919 7.76072Z"
                fill="currentColor"
              />
            </svg>
          </Box>
        )}
      </Box>
    </Box>
  );
}
