import React, { useRef, useEffect, useMemo } from 'react';

import ApolloClient from 'apollo-client';
import { ApolloProvider } from '@apollo/react-hooks';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';

import { useAuth0 } from 'Providers/Auth';

export const GqlProvider: React.FC<{}> & { whyDidYouRender?: boolean } = ({
  children,
}) => {
  const { loading, getTokenSilently, isAuthenticated } = useAuth0();
  const httpLink = useMemo(
    () =>
      createHttpLink({
        uri: '/graphql',
        credentials: 'same-origin',
      }),
    []
  );

  const plainLink: ApolloClient<NormalizedCacheObject> = useMemo(
    () =>
      new ApolloClient({
        cache: new InMemoryCache(),
        link: httpLink,
      }),
    [httpLink]
  );

  const clientRef = useRef(plainLink);

  useEffect(() => {
    const newLink = () => {
      if (loading) return;
      if (isAuthenticated) {
        getTokenSilently().then(token => {
          const authLink = setContext((_, { headers }) => ({
            headers: {
              ...headers,
              authorization: token ? `Bearer ${token}` : '',
            },
          }));
          clientRef.current = new ApolloClient({
            cache: new InMemoryCache(),
            link: authLink.concat(httpLink),
          });
        });
      } else {
        clientRef.current = plainLink;
      }
    };
    newLink();
    return;
  }, [loading, getTokenSilently, isAuthenticated, httpLink, plainLink]);

  return <ApolloProvider client={clientRef.current}>{children}</ApolloProvider>;
};

GqlProvider.whyDidYouRender = true;
