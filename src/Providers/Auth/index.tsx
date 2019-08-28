import React, { useEffect, useContext, useReducer } from 'react';
import createAuth0Client from '@auth0/auth0-spa-js';
import Auth0Client from '@auth0/auth0-spa-js/dist/typings/Auth0Client';
import useReactRouter from 'use-react-router';

type LoginWithPopup = (options?: Readonly<PopupLoginOptions>) => Promise<void>;
type Auth0ContextType = {
  isAuthenticated: boolean;
  user: any;
  can: (permission: string) => boolean;
  loading: boolean;
  popupOpen: boolean;
  auth0Client?: Auth0Client;
  loginWithPopup: LoginWithPopup;
} & Pick<
  Auth0Client,
  | 'getIdTokenClaims'
  | 'loginWithRedirect'
  | 'getTokenSilently'
  | 'getTokenWithPopup'
  | 'logout'
>;

const notImplemented = () => {
  throw new Error('Auth0 Context not ready yet');
};

const initialValues = {
  isAuthenticated: false,
  user: null,
  can: () => false,
  loading: true,
  popupOpen: false,
  auth0Client: undefined,
  loginWithPopup: notImplemented,
  getIdTokenClaims: notImplemented,
  loginWithRedirect: notImplemented,
  getTokenSilently: notImplemented,
  getTokenWithPopup: notImplemented,
  logout: notImplemented,
};

// Exporting for test purposes only
export const Auth0Context = React.createContext<Auth0ContextType>(
  initialValues
);

export const useAuth0 = () => useContext(Auth0Context);

type ActionsType =
  | {
      type: 'init';
      isAuthenticated: boolean;
      auth0Client: Auth0Client;
      user: any;
      loginWithPopup: LoginWithPopup;
    }
  | {
      type: 'loginStart';
    }
  | {
      type: 'loginEnd';
      user: any;
    };

// Exporting for test purposes only
export const reducer = (
  state: Auth0ContextType,
  action: ActionsType
): Auth0ContextType => {
  switch (action.type) {
    case 'init': {
      const { type, auth0Client, user, ...rest } = action;
      return {
        ...state,
        ...rest,
        auth0Client,
        user,
        loading: false,
        can: (permission: string) =>
          user ? user.permissions.includes(permission) : false,
        getIdTokenClaims: (...p) => auth0Client.getIdTokenClaims(...p),
        loginWithRedirect: (...p) => auth0Client.loginWithRedirect(...p),
        getTokenSilently: (...p) => auth0Client.getTokenSilently(...p),
        getTokenWithPopup: (...p) => auth0Client.getTokenWithPopup(...p),
        logout: (...p) => auth0Client.logout(...p),
      };
    }
    case 'loginStart':
      return { ...state, popupOpen: true };
    case 'loginEnd': {
      const { user } = action;
      return {
        ...state,
        user,
        popupOpen: false,
        isAuthenticated: true,
        can: (permission: string) =>
          user ? user.permissions.includes(permission) : false,
      };
    }
    default:
      return state;
  }
};

export const Auth0Provider: React.FC<Auth0ClientOptions> = ({
  children,
  ...auth0Options
}) => {
  const [ctx, dispatch] = useReducer(reducer, initialValues);

  const { history, location } = useReactRouter();

  const getUser = (auth0Client: Auth0Client) =>
    auth0Client.getUser().then((user: any) => ({
      ...user,
      permissions:
        user[`${auth0Options.audience}/user_authorization`].permissions,
    }));

  useEffect(() => {
    const initAuth0 = async () => {
      const auth0FromHook = await createAuth0Client(auth0Options);

      let user;
      const isAuthenticated = await auth0FromHook.isAuthenticated();
      if (isAuthenticated) user = await getUser(auth0FromHook);

      const loginWithPopup = async (params = {}) => {
        if (auth0FromHook) {
          dispatch({
            type: 'loginStart',
          });
          try {
            await auth0FromHook.loginWithPopup(params);
          } catch (error) {
            console.error(error);
          }
          const user = await getUser(auth0FromHook);

          dispatch({
            type: 'loginEnd',
            user,
          });
        }
      };
      dispatch({
        type: 'init',
        isAuthenticated,
        auth0Client: auth0FromHook,
        user,
        loginWithPopup,
      });

      if (location.search.includes('code=')) {
        const { appState } = await auth0FromHook.handleRedirectCallback();
        if (!!appState && appState.targetUrl)
          history.replace(appState.targetUrl);
      }
    };
    initAuth0();
    // eslint-disable-next-line
  }, []);

  return <Auth0Context.Provider value={ctx}>{children}</Auth0Context.Provider>;
};
