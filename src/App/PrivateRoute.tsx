import React from 'react';
import { Route } from 'react-router-dom';
import { useAuth0 } from 'Providers/Auth';

export const PrivateRoute: React.FC<{
  component: React.ComponentType;
  path: string;
  permission?: string;
}> & { whyDidYouRender: boolean } = ({
  component: Component,
  path,
  permission,
  ...rest
}) => {
  const { loading, user, loginWithRedirect, can } = useAuth0();

  const render = (props: any) => {
    if (loading) return null;
    if (user) {
      if (permission && !can(permission)) return null;
      return <Component {...props} />;
    }
    loginWithRedirect({
      appState: { targetUrl: path },
    });
    return null;
  };

  return <Route path={path} render={render} {...rest} />;
};

export default PrivateRoute;

PrivateRoute.whyDidYouRender = true;
