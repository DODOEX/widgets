import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import utc from 'dayjs/plugin/utc';
import { ReactNode, useEffect } from 'react';
import { SupportedLang, defaultLang } from '../constants/locales';
import { messages } from '../locales/en-US.js';

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

// Activate default language synchronously
i18n.load(defaultLang, messages);
i18n.activate(defaultLang);
export function LangProvider({ locale, children }: LangProviderProps) {
  if (!i18n.locale) {
    i18n.load(defaultLang, messages);
    i18n.activate(defaultLang);
  }
  useEffect(() => {
    const loadLocale = async () => {
      await loadI18(locale);
    };
    loadLocale();
  }, [locale]);
  return (
    <I18nProvider i18n={i18n} key={locale}>
      {children}
    </I18nProvider>
  );
}
