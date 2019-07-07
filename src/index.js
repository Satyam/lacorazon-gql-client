import React from 'react';
import ReactDOM from 'react-dom';
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
import { GraphQLClient, ClientContext } from 'graphql-hooks';
import memCache from 'graphql-hooks-memcache';
import { AuthProvider } from './Components/Auth';

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

const client = new GraphQLClient({
  url: '/graphql',
  fetchOptions: {
    credentials: 'include',
  },
  cache: memCache(),
});

ReactDOM.render(
  <ClientContext.Provider value={client}>
    <AuthProvider>
      <App />
    </AuthProvider>
  </ClientContext.Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
