import { useCallback, useEffect, useState } from 'react';
import { StateProps } from '../reducers';

interface IntroSettingsValidationResult {
  errorKey: string;
  isValid: boolean;
  reCheck: (getErrorState?: (isError: boolean) => void) => void;
}

// URL validation regex - matches http://, https://, and valid URLs
const URL_REGEX = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;

function isValidUrl(url: string): boolean {
  if (!url) return true; // Empty URLs are valid (optional fields)
  return URL_REGEX.test(url);
}

export const useIntroSettingsValidation = (
  state: StateProps,
): IntroSettingsValidationResult => {
  const [errorKey, setErrorKey] = useState<string>('');
  const { websiteUrl, twitterUrl, discordUrl, telegramUrl } = state.introSettings;
  const { enabledSocialLinks } = state.introSettings as any & {
    enabledSocialLinks?: Record<string, boolean>;
  };

  const check = useCallback(
    (getErrorState?: (isError: boolean) => void) => {
      let errKey = '';

      // Check Website URL if enabled
      if (enabledSocialLinks?.website && !isValidUrl(websiteUrl || '')) {
        errKey = 'Invalid website URL';
      }

      // Check Twitter URL if enabled
      if (!errKey && enabledSocialLinks?.twitter && !isValidUrl(twitterUrl || '')) {
        errKey = 'Invalid X (Twitter) URL';
      }

      // Check Discord URL if enabled
      if (!errKey && enabledSocialLinks?.discord && !isValidUrl(discordUrl || '')) {
        errKey = 'Invalid Discord URL';
      }

      // Check Telegram URL if enabled
      if (!errKey && enabledSocialLinks?.telegram && !isValidUrl(telegramUrl || '')) {
        errKey = 'Invalid Telegram URL';
      }

      setErrorKey(errKey);
      if (getErrorState) {
        getErrorState(!!errKey);
      }
    },
    [websiteUrl, twitterUrl, discordUrl, telegramUrl, enabledSocialLinks],
  );

  useEffect(() => {
    check();
  }, [check]);

  return {
    errorKey,
    isValid: !errorKey,
    reCheck: check,
  };
};
