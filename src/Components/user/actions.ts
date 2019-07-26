import { useQuery, useMutation } from '@apollo/react-hooks';

import gql from 'graphql-tag';

export type user = {
  id?: string;
  nombre: string;
  email?: string;
};
export type users = user[];
export type usersCache = {
  users: users;
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

export function useListUsers() {
  return useQuery<{ users: users }>(LIST_USERS);
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

export function useGetUser(id: string | number) {
  return useQuery<{ user: user }>(GET_USER, {
    variables: {
      id,
    },
    skip: !id,
  });
}

export const CREATE_USER = gql`
  mutation($nombre: String!, $email: String, $password: String!) {
    createUser(nombre: $nombre, email: $email, password: $password) {
      id
    }
  }
`;

export function useCreateUser() {
  const [createUser, createStatus] = useMutation<{
    createUser: user;
  }>(CREATE_USER);
  return [
    (values: user) =>
      createUser({
        variables: { ...values, password: values.nombre },
        update: (cache, { data }) => {
          const cached: usersCache = cache.readQuery({
            query: LIST_USERS,
          }) || { users: [] };
          cached.users.push({
            ...values,
            ...data.createUser,
          });
          cached.users.sort((a: user, b: user) => {
            if (a.nombre < b.nombre) return -1;
            if (a.nombre > b.nombre) return 1;
            return 0;
          });
          cache.writeQuery({
            query: LIST_USERS,
            data: cached,
          });
        },
      }),
    createStatus,
  ] as const;
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

export function useUpdateUser() {
  const [updateUser, updateStatus] = useMutation<{ updateUser: user }>(
    UPDATE_USER
  );
  return [
    (id: string, values: user) => updateUser({ variables: { id, ...values } }),
    updateStatus,
  ] as const;
}

export const DELETE_USER = gql`
  mutation($id: ID!) {
    deleteUser(id: $id) {
      id
    }
  }
`;

export function useDeleteUser() {
  const [deleteUser, deleteStatus] = useMutation<{
    deleteUser: {
      id: string;
    };
  }>(DELETE_USER);
  return [
    (id: string) =>
      deleteUser({
        variables: { id },
        update: cache => {
          const cached: usersCache = cache.readQuery({
            query: LIST_USERS,
          }) || { users: [] };
          cache.writeQuery({
            query: LIST_USERS,
            data: {
              users: cached.users.filter(u => u.id !== id),
            },
          });
        },
      }),
    deleteStatus,
  ] as const;
}