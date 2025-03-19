import { Box } from '@dodoex/components';
import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import utc from 'dayjs/plugin/utc';
import { ReactNode, useEffect, useState } from 'react';
import { LoadingRotation } from '../components/LoadingRotation';
import { SupportedLang, defaultLang } from '../constants/locales';

interface LangProviderProps {
  locale?: SupportedLang;
  children: ReactNode;
}

dayjs.extend(utc);
dayjs.extend(duration);
dayjs.extend(LocalizedFormat);

export async function loadI18(locale: SupportedLang = defaultLang) {
  try {
    const catalog = await import(`../locales/${locale}.js`);
    i18n.load(locale, catalog.messages || catalog.default.messages);
  } catch {}
  i18n.activate(locale);
}
export function LangProvider({ locale, children }: LangProviderProps) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const loadLocale = async () => {
      if (mounted) {
        setLoading(true);
        await loadI18(locale);
        setLoading(false);
      }
    };
    loadLocale();
    return () => {
      mounted = false;
    };
  }, [locale]);

  if (loading) {
    return (
      <Box
        sx={{
          height: '500px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <LoadingRotation />
      </Box>
    );
  }
  return <I18nProvider i18n={i18n}>{children}</I18nProvider>;
}
