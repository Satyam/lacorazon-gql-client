import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

export type UserType = {
  id?: ID;
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

export function useLogin(): (values: LoginType) => Promise<ID | void> {
  const [login] = useMutation<{ login: { id: ID } }, LoginType>(LOGIN, {
    ignoreResults: true,
  });
  return values =>
    login({ variables: values }).then(
      status => status && status.data && status.data.login.id
    );
}

export const LOGOUT = gql`
  mutation {
    logout
  }
`;

export function useLogout() {
  const [logout] = useMutation<{}, void>(LOGOUT, { ignoreResults: true });
  return logout;
}
