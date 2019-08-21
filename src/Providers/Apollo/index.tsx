import React, { useMemo } from 'react';

import ApolloClient from 'apollo-client';
import { ApolloProvider } from '@apollo/react-hooks';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';

import { useAuth0 } from 'Providers/Auth';

export const GqlProvider: React.FC<{}> = ({ children }) => {
  const { loading, getTokenSilently, isAuthenticated } = useAuth0();

  const client = useMemo(() => {
    const httpLink = createHttpLink({
      uri: '/graphql',
      credentials: 'same-origin',
    });
    if (!loading && isAuthenticated) {
      const authLink = setContext(async (_, { headers }) => {
        // get the authentication token from local storage if it exists
        const token = await getTokenSilently();
        // return the headers to the context so httpLink can read them
        return {
          headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : '',
          },
        };
      });
      return new ApolloClient({
        cache: new InMemoryCache(),
        link: authLink.concat(httpLink),
      });
    }
    return new ApolloClient({
      cache: new InMemoryCache(),
      link: httpLink,
    });
  }, [loading, getTokenSilently, isAuthenticated]);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
