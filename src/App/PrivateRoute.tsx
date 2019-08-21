import React from 'react';
import { Route } from 'react-router-dom';
import { useAuth0 } from 'Providers/Auth';

export const PrivateRoute: React.FC<{
  component: React.ComponentType;
  path: string;
}> = ({ component: Component, path, ...rest }) => {
  const { loading, isAuthenticated, loginWithRedirect } = useAuth0();

  const render = (props: any) => {
    console.log('PrivateRoute:', { loading, isAuthenticated });
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
