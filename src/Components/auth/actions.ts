import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

export type UserType = {
  id?: string;
  nombre?: string;
  email?: string;
};

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
  return useQuery<{ currentUser: UserType }, void>(GET_CURRENT_USER);
}

export const LOGIN = gql`
  mutation($nombre: String!, $password: String!) {
    login(nombre: $nombre, password: $password) {
      id
    }
  }
`;

type LoginType = { nombre: string; password: string };

export function useLogin() {
  const [login, loginStatus] = useMutation<{ id: string }, LoginType>(LOGIN);
  return [
    (values: LoginType) => login({ variables: values }),
    loginStatus,
  ] as const;
}

export const LOGOUT = gql`
  mutation {
    logout
  }
`;

export function useLogout() {
  return useMutation<{}, void>(LOGOUT);
}
