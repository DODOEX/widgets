import { Box, Tooltip } from '@dodoex/components';
import { useAppKitAccountByChainId } from '../../../../hooks/ConnectWallet/useAccountByChainId';
import { TokenInfo } from '../../../../hooks/Token/type';

export interface Props {
  token: TokenInfo;
}

export const WalletConnectBtn = ({ token }: Props) => {
  const targetChainId = token.chainId;

  const { account } = useAppKitAccountByChainId(targetChainId);

  return (
    <Tooltip
      arrow={false}
      leaveDelay={300}
      placement="bottom-end"
      onlyClick
      title={<Box>Wallet address:-</Box>}
    >
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          px: 4,
          py: 2,
          borderRadius: 4,
          backgroundColor: 'background.tag',
          typography: 'h6',
          lineHeight: '16px',
        }}
      >
        Wallet address:-
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="17"
          viewBox="0 0 16 17"
          fill="none"
        >
          <path
            d="M12.667 6.93016L11.5703 5.8335L8.00033 9.39572L4.43033 5.8335L3.33366 6.93016L8.00033 11.5968L12.667 6.93016Z"
            fill="currentColor"
            fillOpacity="0.5"
          />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="17"
          viewBox="0 0 16 17"
          fill="none"
        >
          <path
            d="M3.33301 10.0698L4.42967 11.1665L7.99967 7.60428L11.5697 11.1665L12.6663 10.0698L7.99967 5.40317L3.33301 10.0698Z"
            fill="currentColor"
            fillOpacity="0.5"
          />
        </svg>
      </Box>
    </Tooltip>
  );
};
