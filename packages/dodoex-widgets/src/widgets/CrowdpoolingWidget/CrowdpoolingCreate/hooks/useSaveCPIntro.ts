import { useMutation } from '@tanstack/react-query';
import { APIServiceKey } from '../../../../constants/api';
import { useGetAPIService } from '../../../../hooks/setting/useGetAPIService';
import { StateProps } from '../reducers';
import { useWalletInfo } from '../../../../hooks/ConnectWallet/useWalletInfo';
import axios from 'axios';
import { useMessageState } from '../../../../hooks/useMessageState';
import { t } from '@lingui/macro';

export function useSaveCPIntro() {
  const cpSetIntroAPI = useGetAPIService(APIServiceKey.cpSetIntro);
  const { chainId } = useWalletInfo();

  return useMutation({
    mutationFn: async ({
      header,
      introSettings,
      cpAddress,
    }: {
      header: object;
      introSettings: StateProps['introSettings'];
      cpAddress: string;
    }) => {
      const params = {
        chainId: String(chainId),
        name: introSettings.projectName,
        crowdpoolingAddress: cpAddress,
        description: introSettings.description,
        website: introSettings.websiteUrl,
        twitter: introSettings.twitterUrl,
        telegram: introSettings.telegramUrl,
        discord: introSettings.discordUrl,
        coverImg: introSettings.coverImageUrl,
      };
      const response = await axios.post(cpSetIntroAPI, params, {
        headers: {
          'Content-Type': 'application/json',
          ...header,
        },
      });
      if (response.data?.code !== 0) {
        const message = response.data?.msg || 'Save failed';
        useMessageState.getState().toast({
          message,
          type: 'error',
        });
        throw message;
      }
      useMessageState.getState().toast({
        message: t`Saved successfully`,
        type: 'success',
        timeout: 3000,
      });
    },
  });
}
