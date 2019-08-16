import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useMemo,
} from 'react';
import createAuth0Client from '@auth0/auth0-spa-js';
import Auth0Client from '@auth0/auth0-spa-js/dist/typings/Auth0Client';

type Auth0ContextType = {
  isAuthenticated: boolean;
  user: any;
  loading: boolean;
  popupOpen: boolean;
  login: (options?: PopupLoginOptions) => Promise<void>;
  handleRedirectCallback: () => Promise<void>;
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
  login: notImplemented,
  handleRedirectCallback: notImplemented,
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

  useEffect(() => {
    const initAuth0 = async () => {
      const auth0FromHook = await createAuth0Client({
        domain,
        client_id,
        redirect_uri,
      });
      setAuth0(auth0FromHook);

      if (window.location.search.includes('code=')) {
        const { appState } = await auth0FromHook.handleRedirectCallback();
        window.history.replaceState(
          {},
          document.title,
          appState && appState.targetUrl
            ? appState.targetUrl
            : window.location.pathname
        );
      }

      const isAuthenticated = await auth0FromHook.isAuthenticated();

      setIsAuthenticated(isAuthenticated);

      if (isAuthenticated) {
        const user = await auth0FromHook.getUser();
        setUser(user);
      }

      setLoading(false);
    };
    initAuth0();
    // eslint-disable-next-line
  }, []);

  const login = useCallback(
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
        const user = await auth0Client.getUser();
        setUser(user);
        setIsAuthenticated(true);
      }
    },
    [auth0Client]
  );

  const handleRedirectCallback = useCallback(async () => {
    if (auth0Client) {
      setLoading(true);
      await auth0Client.handleRedirectCallback();
      const user = await auth0Client.getUser();
      setLoading(false);
      setIsAuthenticated(true);
      setUser(user);
    }
  }, [auth0Client]);

  const ctx: Auth0ContextType = useMemo(() => {
    if (auth0Client) {
      return {
        isAuthenticated,
        user,
        loading,
        popupOpen,
        login,
        handleRedirectCallback,
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
      login,
      handleRedirectCallback,
    };
  }, [
    isAuthenticated,
    user,
    loading,
    popupOpen,
    login,
    handleRedirectCallback,
    auth0Client,
  ]);

  return <Auth0Context.Provider value={ctx}>{children}</Auth0Context.Provider>;
};
