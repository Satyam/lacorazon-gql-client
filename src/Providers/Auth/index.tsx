import React, {
  createContext,
  useReducer,
  useEffect,
  useMemo,
  useContext,
} from 'react';
import Auth0, {
  Auth0UserProfile,
  Auth0DecodedHash,
  Auth0Error,
  AuthorizeOptions,
} from 'auth0-js';

type ErrorType = 'userInfo' | 'authResult' | 'userInfo' | 'checkSession';

type Action =
  | {
      type: 'LOGIN';
      user: Auth0UserProfile;
      authResult: Auth0DecodedHash;
    }
  | { type: 'LOGOUT' }
  | {
      type: 'ERROR';
      errorType: ErrorType;
      error: Error | Auth0Error;
    };

type AppState = {
  user?: Auth0UserProfile;
  expiresAt?: number;
  errorType?: ErrorType;
  error?: Error | Auth0Error;
};

type Auth0ContextType = {
  login: (options?: AuthorizeOptions) => void;
  logout: () => void;
  user?: Auth0UserProfile;
};

const notImplemented = () => {
  throw new Error('Auth0 Context not ready yet');
};

const initialValue = {
  login: notImplemented,
  logout: notImplemented,
  user: undefined,
};

const authReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'LOGIN':
      const { authResult, user } = action;
      const expiresAt =
        (authResult.expiresIn || 0) * 1000 + new Date().getTime();

      return {
        user,
        expiresAt,
      };
    case 'LOGOUT':
      return {};
    case 'ERROR':
      const { errorType, error } = action;
      return {
        errorType,
        error,
      };
    default:
      return state;
  }
};

export const Auth0Context = createContext<Auth0ContextType>(initialValue);

export const Auth0Provider: React.FC<Auth0.AuthOptions> = ({
  children,
  redirectUri = window.location.origin,
  responseType = 'token id_token',
  scope = 'openid profile email',
  ...options
}) => {
  const auth0 = new Auth0.WebAuth({
    redirectUri,
    responseType,
    scope,
    ...options,
  });

  const [state, dispatch] = useReducer(authReducer, {});

  function setSession({ authResult }: { authResult: Auth0DecodedHash }) {
    return new Promise((resolve, reject) => {
      if (authResult && authResult.accessToken) {
        auth0.client.userInfo(authResult.accessToken, (err, user) => {
          if (err) {
            dispatch({
              type: 'ERROR',
              errorType: 'userInfo',
              error: err,
            });
            reject(err);
          } else {
            dispatch({
              type: 'LOGIN',
              authResult,
              user,
            });
            resolve(user);
          }
        });
      }
    });
  }

  function handleAuthResult({
    err,
    authResult,
  }: {
    err?: Error | Auth0Error;
    authResult?: Auth0DecodedHash;
  }): Promise<boolean> {
    const dispatchError = (err: Error | Auth0Error) => {
      console.error(err);
      dispatch({
        type: 'ERROR',
        error: err,
        errorType: 'authResult',
      });

      return false;
    };
    if (err) Promise.reject(dispatchError(err));

    if (authResult && authResult.accessToken && authResult.idToken) {
      return setSession({ authResult }).then(() => true, dispatchError);
    }
    return Promise.reject(false);
  }

  const handleAuthentication = ({ postLoginRoute = '/' } = {}) => {
    if (typeof window !== 'undefined') {
      auth0.parseHash((err, authResult) =>
        handleAuthResult({
          err: err || undefined,
          authResult: authResult || undefined,
        })
      );
    }
  };

  useEffect(() => {
    auth0.checkSession({}, (err, authResult: Auth0DecodedHash) => {
      if (err) {
        dispatch({
          type: 'ERROR',
          errorType: 'checkSession',
          error: err,
        });
      } else {
        handleAuthResult({ authResult });
      }
    });
  }, []);

  const ctx = useMemo(
    () => ({
      auth0,
      state,
      login: (options?: AuthorizeOptions) => {
        auth0.authorize(options);
      },
      logout: () => {
        auth0.logout({
          returnTo: window.location.origin,
        });
        dispatch({
          type: 'LOGOUT',
        });
      },
      isAuthenticated: () => {
        return state.expiresAt && new Date().getTime() < state.expiresAt;
      },
    }),
    [auth0, state]
  );

  return <Auth0Context.Provider value={ctx}>{children}</Auth0Context.Provider>;
};

export const useAuth0 = () => {
  return useContext(Auth0Context);
};
