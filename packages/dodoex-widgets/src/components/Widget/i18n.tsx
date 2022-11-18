import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import {
  supportedLang,
  SupportedLang,
  defaultLang,
} from '../../constants/locales';
import { ReactNode, useEffect } from 'react';
import { en, zh } from 'make-plural/plurals';
import { PluralCategory } from 'make-plural/plurals';

type LocalePlural = {
  [key in SupportedLang]: (n: number | string, ord?: boolean) => PluralCategory;
};
const plurals: LocalePlural = {
  'en-US': en,
  'zh-CN': zh,
  pseudo: en,
};

interface LangProviderProps {
  locale?: SupportedLang;
  children: ReactNode;
}

export async function loadI18(locale: SupportedLang = defaultLang) {
  i18n.loadLocaleData(locale, { plurals: () => plurals[locale] });
  try {
    const catalog = await import(`../../locales/${locale}.js`);
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
