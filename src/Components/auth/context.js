import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';

import { useGetCurrentUser, useLogout } from './actions';
import Loading from 'Components/Loading';
import GqlError from 'Components/GqlError';

export const UserContext = createContext({});

export function AuthProvider({ children }) {
  const {
    loading,
    error,
    currentUser: originalUser,
    refetch,
  } = useGetCurrentUser();
  const [currentUser, setCurrentUser] = useState(originalUser);
  const [doLogout, logoutStatus] = useLogout();

  const refreshCurrentUser = useCallback(
    () =>
      refetch().then(({ data, error }) => {
        if (error) {
          throw new Error('refreshCurrentUser failed (see console)');
        }
        return setCurrentUser(data.currentUser);
      }),
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
  if (logoutStatus.loading) return <Loading>Logging out</Loading>;
  return (
    <GqlError error={[error, logoutStatus]}>
      <UserContext.Provider value={{ currentUser, refreshCurrentUser, logout }}>
        {children}
      </UserContext.Provider>
    </GqlError>
  );
}

export function useAuth() {
  return useContext(UserContext);
}
