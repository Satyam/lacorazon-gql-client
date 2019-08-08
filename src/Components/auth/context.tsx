import React, {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useMemo,
} from 'react';

import { useGetCurrentUser, useLogout, useLogin, UserType, LoginType } from './actions';
import { Loading } from 'Components/modals';
import GqlError from 'Components/GqlError';

export type UserContextType = {
  currentUser?: UserType;
  refreshCurrentUser: () => Promise<void>;
  logout: () => Promise<void>;
  login: (values: LoginType) => Promise<ID | void>
};

const notImplemented = () => {
  throw new Error('User Context not ready yet');
};

export const UserContext = createContext<UserContextType>({
  refreshCurrentUser: notImplemented,
  logout: notImplemented,
  login: notImplemented
});

export const AuthProvider: React.FC<{}> = ({ children }) => {
  const { loading, error, data, refetch } = useGetCurrentUser();
  const doLogout = useLogout();
  const doLogin = useLogin();

  const currentUser = data && data.currentUser;

  const refreshCurrentUser = useCallback(
    () => refetch().then(() => undefined),
    [refetch]
  );

  const logout = useCallback(() => doLogout().then(refreshCurrentUser), [
    doLogout,
    refreshCurrentUser,
  ]);

  const login = useCallback((values: LoginType) =>  doLogin(values).then(id => {
    refreshCurrentUser();
    return id;
  }),[doLogin, refreshCurrentUser])

  const ctx = useMemo(() => ({ currentUser, refreshCurrentUser, logout, login }), [
    currentUser,
    refreshCurrentUser,
    logout,
    login
  ]);

  useEffect(() => {
    const timer = setInterval(refreshCurrentUser, 10 * 60 * 10000);
    return () => clearInterval(timer);
  }, [refreshCurrentUser]);

  if (loading) return <Loading>Current User</Loading>;

  return (
    <GqlError error={error}>
      <UserContext.Provider value={ctx}>{children}</UserContext.Provider>
    </GqlError>
  );
};

export function useAuth() {
  return useContext(UserContext);
}
