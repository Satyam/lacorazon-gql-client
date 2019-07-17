import React, { createContext, useContext, useEffect, useState } from 'react';

export const IntlContext = createContext({});

export function IntlProvider({
  locale: l = navigator.locale,
  currency: c = 'EUR',
  children,
}) {
  const [locale, setLocale] = useState(l);
  const [currency, setCurrency] = useState(c);
  const [formatDate, setFormatDate] = useState(value => value);
  const [formatCurrency, setFormatCurrency] = useState(value => value);

  console.log('set provider', locale, currency);
  useEffect(() => {
    console.log('date effect', locale);
    const dateTimeFormatter = new Intl.DateTimeFormat(locale);
    setFormatDate(() => date => dateTimeFormatter.format(date));
  }, [locale]);

  useEffect(() => {
    console.log('currency effect', locale, currency);
    const currFormatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    });
    setFormatCurrency(() => value => currFormatter.format(value));
  }, [currency, locale]);

  return (
    <IntlContext.Provider
      value={{
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
