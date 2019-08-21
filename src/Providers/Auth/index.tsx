import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useMemo,
} from 'react';
import createAuth0Client from '@auth0/auth0-spa-js';
import Auth0Client from '@auth0/auth0-spa-js/dist/typings/Auth0Client';
import useReactRouter from 'use-react-router';

type Auth0ContextType = {
  isAuthenticated: boolean;
  user: any;
  loading: boolean;
  popupOpen: boolean;
  auth0Client?: Auth0Client;
  loginWithPopup: (options?: Readonly<PopupLoginOptions>) => Promise<void>;
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
  loading: false,
  popupOpen: false,
  auth0Client: undefined,
  loginWithPopup: notImplemented,
  getIdTokenClaims: notImplemented,
  loginWithRedirect: notImplemented,
  getTokenSilently: notImplemented,
  getTokenWithPopup: notImplemented,
  logout: notImplemented,
};
export const Auth0Context = React.createContext<Auth0ContextType>(
  initialValues
);

export const useAuth0 = () => useContext(Auth0Context);

export const Auth0Provider: React.FC<Auth0ClientOptions> = ({
  children,
  domain,
  client_id,
  redirect_uri,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState();
  const [auth0Client, setAuth0] = useState<Auth0Client>();
  const [loading, setLoading] = useState(true);
  const [popupOpen, setPopupOpen] = useState(false);
  const { history, location } = useReactRouter();

  console.log('state', {
    isAuthenticated,
    loading,
    popupOpen,
    user,
    auth0Client,
  });
  useEffect(() => {
    const initAuth0 = async () => {
      const auth0FromHook = await createAuth0Client({
        domain,
        client_id,
        redirect_uri,
      });

      if (location.search.includes('code=')) {
        const { appState } = await auth0FromHook.handleRedirectCallback();
        if (!!appState && appState.targetUrl)
          history.replace(appState.targetUrl);
      }

      const isAuthenticated = await auth0FromHook.isAuthenticated();

      setIsAuthenticated(isAuthenticated);
      setAuth0(auth0FromHook);
      setLoading(false);
    };
    initAuth0();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (isAuthenticated && auth0Client) {
      auth0Client.getUser().then(user => setUser(user));
    } else setUser(undefined);
  }, [isAuthenticated, auth0Client]);

  const loginWithPopup = useCallback(
    async (params = {}) => {
      if (auth0Client) {
        setPopupOpen(true);
        try {
          await auth0Client.loginWithPopup(params);
        } catch (error) {
          console.error(error);
        } finally {
          setPopupOpen(false);
        }
        setIsAuthenticated(true);
      }
    },
    [auth0Client]
  );

  const ctx: Auth0ContextType = useMemo(() => {
    if (auth0Client) {
      return {
        isAuthenticated,
        user,
        loading,
        popupOpen,
        auth0Client,
        loginWithPopup,
        getIdTokenClaims: (...p) => auth0Client.getIdTokenClaims(...p),
        loginWithRedirect: (...p) => auth0Client.loginWithRedirect(...p),
        getTokenSilently: (...p) => auth0Client.getTokenSilently(...p),
        getTokenWithPopup: (...p) => auth0Client.getTokenWithPopup(...p),
        logout: (...p) => auth0Client.logout(...p),
      };
    }
    return {
      ...initialValues,
      isAuthenticated,
      user,
      loading,
      popupOpen,
      loginWithPopup,
    };
  }, [isAuthenticated, user, loading, popupOpen, loginWithPopup, auth0Client]);

  return <Auth0Context.Provider value={ctx}>{children}</Auth0Context.Provider>;
};
