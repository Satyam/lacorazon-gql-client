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

const localeTables = { 'en-US': enUS, 'es-ES': es };

Object.keys(localeTables).forEach(l => registerLocale(l, localeTables[l]));

export const IntlContext = createContext({});

export function IntlProvider({
  locale: l = navigator.locale,
  currency: c = 'EUR',
  children,
}) {
  const [locale, setLocale] = useState(l);
  const [currency, setCurrency] = useState(c);
  const [formatCurrency, setFormatCurrency] = useState(value => value);

  const formatDate = useCallback(
    (date, formatStr = 'P') =>
      format(date, formatStr, {
        locale: localeTables[locale],
      }),
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
    setFormatCurrency(() => value => currFormatter.format(value));
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
}

export function useIntl() {
  return useContext(IntlContext);
}
