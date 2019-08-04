import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';

import { format } from 'date-fns';
import { enUS, es } from 'date-fns/locale';

import { registerLocale, setDefaultLocale } from 'react-datepicker';

const localeTables: { [index: string]: any } = { 'en-US': enUS, 'es-ES': es };

Object.keys(localeTables).forEach(l => registerLocale(l, localeTables[l]));

type intlType = {
  locales: string[];
  setLocale: (locale: string) => void;
  locale: string;
  formatDate: (date?: object) => string;
  currency: string;
  setCurrency: (currency: string) => void;
  formatCurrency: (amount?: number) => string;
};

const notImplemented = () => {
  throw new Error('Internationalization Context not ready yet');
};

export const IntlContext = createContext<intlType>({
  locales: Object.keys(localeTables),
  setLocale: notImplemented,
  locale: navigator.language,
  formatDate: notImplemented,
  currency: 'EUR',
  setCurrency: notImplemented,
  formatCurrency: notImplemented,
});

export const IntlProvider: React.FC<{
  locale?: string;
  currency?: string;
}> = ({ locale: l = navigator.language, currency: c = 'EUR', children }) => {
  const [locale, setLocale] = useState(l);
  const [currency, setCurrency] = useState(c);
  const [formatCurrency, setFormatCurrency] = useState<
    (value?: number) => string
  >(value => String(value));

  const formatDate = useCallback(
    (date, formatStr = 'P') =>
      date
        ? format(date, formatStr, {
            locale: localeTables[locale],
          })
        : '',
    [locale]
  );

  useEffect(() => {
    setDefaultLocale(locale);
  }, [locale]);

  useEffect(() => {
    const currFormatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    });
    setFormatCurrency(() => (value?: number) =>
      value ? currFormatter.format(value) : ''
    );
  }, [currency, locale]);

  return (
    <IntlContext.Provider
      value={{
        locales: Object.keys(localeTables),
        setLocale,
        locale,
        formatDate,
        currency,
        setCurrency,
        formatCurrency,
      }}
    >
      {children}
    </IntlContext.Provider>
  );
};

export function useIntl() {
  return useContext(IntlContext);
}
