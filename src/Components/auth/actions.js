import { useQuery, useMutation } from '@apollo/react-hooks';

import { LOGIN, LOGOUT, GET_CURRENT_USER } from './gql';

export function useGetCurrentUser() {
  return useQuery(GET_CURRENT_USER);
}
export function useLogin() {
  const [login, loginStatus] = useMutation(LOGIN);
  return [values => login({ variables: values }), loginStatus];
}

export function useLogout() {
  return useMutation(LOGOUT);
}
