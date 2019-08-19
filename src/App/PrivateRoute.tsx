import React from 'react';
import { Route } from 'react-router-dom';
import { useAuth0 } from 'Providers/Auth';
import useReactRouter from 'use-react-router';

export const PrivateRoute: React.FC<{
  component: React.ComponentType;
  path: string;
}> = ({ component: Component, path, ...rest }) => {
  const { loading, isAuthenticated, loginWithRedirect } = useAuth0();

  const render = (props: any) => {
    console.log({ loading, isAuthenticated });
    debugger;
    if (loading) return null;
    if (isAuthenticated) return <Component {...props} />;
    loginWithRedirect({
      appState: { targetUrl: path },
    });
    return null;
  };

  return <Route path={path} render={render} {...rest} />;
};

export default PrivateRoute;

export const PrivateRouteHandler: React.FC<{}> = ({ children }) => {
  const { history, location } = useReactRouter();
  const { handleRedirectCallback } = useAuth0();

  if (location.search.includes('code=')) {
    handleRedirectCallback().then(({ appState }) => {
      debugger;
      if (!!appState && appState.targetUrl) history.replace(appState.targetUrl);
    });
    return null;
  }
  return <>{children}</>;
};
