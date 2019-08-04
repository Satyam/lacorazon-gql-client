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
import { ModalsProvider } from 'Components/modals';

import App from 'Components/App';
import * as serviceWorker from './serviceWorker';

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: createHttpLink({
    uri: '/graphql',
    credentials: 'same-origin',
  }),
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <IntlProvider locale="es-ES">
      <AuthProvider>
        <ModalsProvider>
          <App />
        </ModalsProvider>
      </AuthProvider>
    </IntlProvider>
  </ApolloProvider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
