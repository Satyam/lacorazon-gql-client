import React from 'react';
import ReactDOM from 'react-dom';

import ApolloClient from 'apollo-client';
import { ApolloProvider } from '@apollo/react-hooks';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

import 'bootstrap/dist/css/bootstrap.min.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faTrashAlt,
  faCheckCircle,
  faTimesCircle,
  faEdit,
  faExclamationTriangle,
  faMinusCircle,
  faPlusCircle,
  faExclamationCircle,
  faCalendarAlt,
} from '@fortawesome/free-solid-svg-icons';

import './index.css';
import App from 'Components/App';
import * as serviceWorker from './serviceWorker';
import { AuthProvider } from 'Components/auth/context';

library.add(
  faTrashAlt,
  faTimesCircle,
  faCheckCircle,
  faEdit,
  faExclamationTriangle,
  faMinusCircle,
  faPlusCircle,
  faExclamationCircle,
  faCalendarAlt
);

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: createHttpLink({
    uri: '/graphql',
    credentials: 'same-origin',
  }),
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <AuthProvider>
      <App />
    </AuthProvider>
  </ApolloProvider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
