import React from 'react';
import { Route } from 'react-router-dom';
import { useAuth0 } from 'Providers/Auth';
import useReactRouter from 'use-react-router';

export const PrivateRoute: React.FC<{
  component: React.ComponentType;
  path: string;
}> = ({ component: Component, path, ...rest }) => {
  const { user, login } = useAuth0();

  const render = (props: any) => {
    console.log({ user, login });
    debugger;
    if (user) return <Component {...props} />;
    login({
      appState: { targetUrl: path },
    });
    return null;
  };

  return <Route path={path} render={render} {...rest} />;
};

export default PrivateRoute;

export const PrivateRouteHandler: React.FC<{}> = ({ children }) => {
  const { history, location } = useReactRouter();
  console.log('PrivateRouteHandler', location);
  // const { handleRedirectCallback } = useAuth0();

  // if (location.search.includes('code=')) {
  //   handleRedirectCallback().then(({ appState }) => {
  //     debugger;
  //     if (!!appState && appState.targetUrl) history.replace(appState.targetUrl);
  //   });
  //   return null;
  // }
  return <>{children}</>;
};
