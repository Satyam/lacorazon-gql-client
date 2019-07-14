import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

export const GET_CURRENT_USER = gql`
  query {
    currentUser {
      id
      nombre
      email
    }
  }
`;

export function useGetCurrentUser() {
  return useQuery(GET_CURRENT_USER);
}

export const LOGIN = gql`
  mutation($nombre: String!, $password: String!) {
    login(nombre: $nombre, password: $password) {
      id
    }
  }
`;

export function useLogin() {
  const [login, loginStatus] = useMutation(LOGIN);
  return [values => login({ variables: values }), loginStatus];
}

export const LOGOUT = gql`
  mutation {
    logout
  }
`;

export function useLogout() {
  return useMutation(LOGOUT);
}
