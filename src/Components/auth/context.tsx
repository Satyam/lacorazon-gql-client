import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';

import { useGetCurrentUser, useLogout, UserType } from './actions';
import Loading from 'Components/Loading';
import GqlError from 'Components/GqlError';
import { ApolloQueryResult } from 'apollo-client';

export type UserContextType = {
  currentUser?: UserType;
  refreshCurrentUser: () => Promise<ApolloQueryResult<{
    createUser: UserType;
  }> | void>;
  logout: () => Promise<void>;
};

const notImplemented = () => {
  throw new Error('User Context not ready yet');
};

export const UserContext = createContext<UserContextType>({
  refreshCurrentUser: notImplemented,
  logout: notImplemented,
});

export const AuthProvider: React.FC<{}> = ({ children }) => {
  const { loading, error, data, refetch } = useGetCurrentUser();
  const originalUser = data && data.currentUser;

  const [currentUser, setCurrentUser] = useState(originalUser);
  const doLogout = useLogout();

  const refreshCurrentUser = useCallback(
    () => refetch().then(({ data }) => setCurrentUser(data.currentUser)),
    [refetch, setCurrentUser]
  );

  useEffect(() => {
    const timer = setInterval(refreshCurrentUser, 10 * 60 * 10000);
    return () => clearInterval(timer);
  }, [refreshCurrentUser]);

  function logout() {
    return doLogout().then(refreshCurrentUser);
  }

  if (loading) return <Loading>Current User</Loading>;
  return (
    <GqlError error={error}>
      <UserContext.Provider value={{ currentUser, refreshCurrentUser, logout }}>
        {children}
      </UserContext.Provider>
    </GqlError>
  );
};

export function useAuth() {
  return useContext(UserContext);
}
