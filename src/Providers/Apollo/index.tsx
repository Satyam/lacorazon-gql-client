import React, { useEffect, useReducer } from 'react';

import ApolloClient from 'apollo-client';
import { ApolloProvider } from '@apollo/react-hooks';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';

import { useAuth0 } from 'Providers/Auth';

const httpLink = createHttpLink({
  uri: '/graphql',
  credentials: 'same-origin',
});

const unauthorizedClient: ApolloClient<
  NormalizedCacheObject
> = new ApolloClient({
  cache: new InMemoryCache(),
  link: httpLink,
});

type ActionType =
  | {
      type: 'withUser';
      token: string;
    }
  | {
      type: 'noUser';
    };

export const reducer = (
  state: ApolloClient<NormalizedCacheObject>,
  action: ActionType
): ApolloClient<NormalizedCacheObject> => {
  console.log(action);

  switch (action.type) {
    case 'withUser': {
      const authLink = setContext((_, { headers }) => ({
        headers: {
          ...headers,
          authorization: `Bearer ${action.token}`,
        },
      }));
      return new ApolloClient({
        cache: new InMemoryCache(),
        link: authLink.concat(httpLink),
      });
    }
    case 'noUser':
      return unauthorizedClient;
    default:
      return state;
  }
};
export const GqlProvider: React.FC<{}> & { whyDidYouRender?: boolean } = ({
  children,
}) => {
  const { loading, getTokenSilently, isAuthenticated } = useAuth0();

  const [client, dispatch] = useReducer(reducer, unauthorizedClient);

  useEffect(() => {
    if (loading) return;
    if (isAuthenticated) {
      getTokenSilently().then(token => {
        if (token) {
          dispatch({
            type: 'withUser',
            token,
          });
        } else {
          dispatch({ type: 'noUser' });
        }
      });
    } else {
      dispatch({ type: 'noUser' });
    }
  }, [loading, getTokenSilently, isAuthenticated]);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

GqlProvider.whyDidYouRender = true;
