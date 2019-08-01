import { useQuery, useMutation } from '@apollo/react-hooks';

import gql from 'graphql-tag';
import { ApolloError } from 'apollo-client';

export type UserType = {
  id?: ID;
  nombre?: string;
  email?: string;
};
export type UsersCacheType = {
  users: UserType[];
};

export const LIST_USERS = gql`
  query {
    users {
      id
      nombre
      email
    }
  }
`;

export function useListUsers(): {
  error?: ApolloError;
  loading: boolean;
  users?: UserType[];
} {
  const { error, loading, data } = useQuery<{ users: UserType[] }, void>(
    LIST_USERS
  );
  if (!data || loading || error) return { error, loading };
  return {
    error,
    loading,
    users: data.users,
  };
}

export const GET_USER = gql`
  query($id: ID!) {
    user(id: $id) {
      id
      nombre
      email
    }
  }
`;

export function useGetUser(
  id: ID
): { error?: ApolloError; loading: boolean; user?: UserType } {
  const { error, loading, data } = useQuery<{ user: UserType }, { id: ID }>(
    GET_USER,
    {
      variables: {
        id,
      },
      skip: !id,
    }
  );
  if (!data || loading || error) {
    return { loading, error };
  }
  return {
    loading,
    error,
    user: data.user,
  };
}

export const CREATE_USER = gql`
  mutation($nombre: String!, $email: String, $password: String!) {
    createUser(nombre: $nombre, email: $email, password: $password) {
      id
      nombre
      email
    }
  }
`;

export function useCreateUser(): [
  (values: UserType & { password?: string }) => Promise<ID>,
  { loading: boolean; error?: ApolloError }
] {
  const [createUser, { loading, error }] = useMutation<
    {
      createUser: UserType;
    },
    UserType & { password?: string }
  >(CREATE_USER);
  return [
    (values: UserType & { password?: string }) =>
      createUser({
        variables: { ...values, password: values.nombre },
        update: (cache, { data }) => {
          const cached: UsersCacheType = cache.readQuery({
            query: LIST_USERS,
          }) || { users: [] };
          cached.users.push({
            ...values,
            ...data.createUser,
          });
          cached.users.sort((a: UserType, b: UserType) => {
            if (a.nombre! < b.nombre!) return -1;
            if (a.nombre! > b.nombre!) return 1;
            return 0;
          });
          cache.writeQuery({
            query: LIST_USERS,
            data: cached,
          });
        },
      }).then(
        status => (status && status.data && status.data.createUser.id) || ''
      ),
    { loading, error },
  ];
}

export const UPDATE_USER = gql`
  mutation($id: ID!, $nombre: String, $email: String, $password: String) {
    updateUser(id: $id, nombre: $nombre, email: $email, password: $password) {
      id
      nombre
      email
    }
  }
`;

export function useUpdateUser(): [
  (id: ID, values: Omit<UserType, 'id'>) => Promise<ID>,
  { loading: boolean; error?: ApolloError }
] {
  const [updateUser, { loading, error }] = useMutation<
    { updateUser: UserType },
    UserType & { password?: string }
  >(UPDATE_USER);
  return [
    (id: string, values: UserType & { password?: string }) =>
      updateUser({ variables: { id, ...values } }).then(
        status => (status && status.data && status.data.updateUser.id) || ''
      ),
    { loading, error },
  ];
}

export const DELETE_USER = gql`
  mutation($id: ID!) {
    deleteUser(id: $id) {
      id
    }
  }
`;

export function useDeleteUser(): [
  (id: ID) => Promise<ID>,
  { loading: boolean; error?: ApolloError }
] {
  const [deleteUser, { loading, error }] = useMutation<
    {
      deleteUser: {
        id: ID;
      };
    },
    { id: ID }
  >(DELETE_USER);
  return [
    id =>
      deleteUser({
        variables: { id },
        update: cache => {
          const cached: UsersCacheType = cache.readQuery({
            query: LIST_USERS,
          }) || { users: [] };
          cache.writeQuery({
            query: LIST_USERS,
            data: {
              users: cached.users.filter(u => u.id !== id),
            },
          });
        },
      }).then(
        status => (status && status.data && status.data.deleteUser.id) || ''
      ),
    { loading, error },
  ];
}
