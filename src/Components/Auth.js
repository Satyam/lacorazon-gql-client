import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';

import { CURRENT_USER_QUERY, LOGOUT } from 'Gql/users';
import Loading from 'Components/Loading';

export const UserContext = createContext({});

export function AuthProvider({ children }) {
  const { loading, error, currentUser: originalUser, refetch } = useQuery(
    CURRENT_USER_QUERY
  );
  const [currentUser, setCurrentUser] = useState(originalUser);
  const [doLogout, logoutStatus] = useMutation(LOGOUT);

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

  if (error || logoutStatus.error) return 'Something Bad Happened';
  if (loading || logoutStatus.loading) return <Loading title="Current User" />;
  return (
    <UserContext.Provider value={{ currentUser, refreshCurrentUser, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useAuth() {
  return useContext(UserContext);
}
