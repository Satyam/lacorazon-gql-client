import React, { useEffect, useReducer } from 'react';

import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  NormalizedCacheObject,
  createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

import { useAuth0 } from 'Providers/Auth';

const unauthorizedClient: ApolloClient<NormalizedCacheObject> = new ApolloClient(
  {
    cache: new InMemoryCache(),
    uri: '/graphql',
    headers: {
      credentials: 'same-origin',
    },
  }
);

enum Action {
  WithUser = 'WithUser',
  NoUser = 'NoUser',
}

type ActionsType =
  | {
      type: Action.WithUser;
      token: string;
    }
  | {
      type: Action.NoUser;
    };

// Exporting for test purposes only
export const reducer = (
  state: ApolloClient<NormalizedCacheObject>,
  action: ActionsType
): ApolloClient<NormalizedCacheObject> => {
  state.clearStore();
  switch (action.type) {
    case Action.WithUser: {
      const authLink = setContext((_, { headers }) => ({
        headers: {
          ...headers,
          credentials: 'same-origin',
          authorization: `Bearer ${action.token}`,
        },
      }));
      return new ApolloClient({
        cache: new InMemoryCache(),
        link: authLink.concat(
          createHttpLink({
            uri: '/graphql',
            credentials: 'same-origin',
          })
        ),
      });
    }
    case Action.NoUser:
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
      getTokenSilently().then((token) => {
        if (token) {
          dispatch({
            type: Action.WithUser,
            token,
          });
        } else {
          dispatch({ type: Action.NoUser });
        }
      });
    } else {
      dispatch({ type: Action.NoUser });
    }
  }, [loading, getTokenSilently, isAuthenticated]);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

GqlProvider.whyDidYouRender = true;
