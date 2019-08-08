import React from 'react';

import ApolloClient from 'apollo-client';
import { ApolloProvider } from '@apollo/react-hooks';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: createHttpLink({
    uri: '/graphql',
    credentials: 'same-origin',
  }),
});

export const GqlProvider: React.FC<{}> = ({ children }) => (
  <ApolloProvider client={client}>{children}</ApolloProvider>
);
