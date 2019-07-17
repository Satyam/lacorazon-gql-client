import React from 'react';
import ReactDOM from 'react-dom';

import 'bootstrap/dist/css/bootstrap.min.css';

import './index.css';

import ApolloClient from 'apollo-client';
import { ApolloProvider } from '@apollo/react-hooks';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

import { AuthProvider } from 'Components/auth/context';
import { IntlProvider } from 'Components/intl';

import App from 'Components/App';
import * as serviceWorker from './serviceWorker';

// import { addLocaleData, IntlProvider } from 'react-intl';
// import esLocaleData from 'react-intl/locale-data/es';

// addLocaleData(esLocaleData);
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: createHttpLink({
    uri: '/graphql',
    credentials: 'same-origin',
  }),
});

/*<IntlProvider
    locale={'es-ES' /*navigator.language* /}
    formats={{
      number: {
        EUR: {
          style: 'currency',
          currency: 'EUR',
        },
        USD: {
          style: 'currency',
          currency: 'USD',
        },
      },
    }}
  >*/
ReactDOM.render(
  <ApolloProvider client={client}>
    <IntlProvider locale="es-ES">
      <AuthProvider>
        <App />
      </AuthProvider>
    </IntlProvider>
  </ApolloProvider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
