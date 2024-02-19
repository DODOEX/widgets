import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { SupportedLang, defaultLang } from '../constants/locales';
import { ReactNode, useEffect } from 'react';

interface LangProviderProps {
  locale?: SupportedLang;
  children: ReactNode;
}

export async function loadI18(locale: SupportedLang = defaultLang) {
  try {
    const catalog = await import(`../locales/${locale}.js`);
    i18n.load(locale, catalog.messages || catalog.default.messages);
  } catch {}
  i18n.activate(locale);
}
export function LangProvider({ locale, children }: LangProviderProps) {
  useEffect(() => {
    const loadLocale = async () => {
      await loadI18(locale);
    };
    loadLocale();
  }, [locale]);
  return <I18nProvider i18n={i18n}>{children}</I18nProvider>;
}
