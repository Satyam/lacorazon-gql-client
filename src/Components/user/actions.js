import { useQuery, useMutation } from '@apollo/react-hooks';

import gql from 'graphql-tag';

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
  return useQuery(LIST_USERS);
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

export function useGetUser(id) {
  return useQuery(GET_USER, {
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

export function useCreateUser(values) {
  const [createUser, createStatus] = useMutation(CREATE_USER);
  return [
    values =>
      createUser({
        variables: { ...values, password: values.nombre },
        update: (cache, { data }) => {
          const cached = cache.readQuery({
            query: LIST_USERS,
          });
          cached.users.push({
            ...values,
            ...data.createUser,
          });
          cached.users.sort((a, b) => {
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

export function useUpdateUser() {
  const [updateUser, updateStatus] = useMutation(UPDATE_USER);
  return [
    (id, values) => updateUser({ variables: { id, ...values } }),
    updateStatus,
  ];
}

export const DELETE_USER = gql`
  mutation($id: ID!) {
    deleteUser(id: $id) {
      id
    }
  }
`;

export function useDeleteUser() {
  const [deleteUser, deleteStatus] = useMutation(DELETE_USER);
  return [
    id =>
      deleteUser({
        variables: { id },
        update: cache => {
          const cached = cache.readQuery({
            query: LIST_USERS,
          });
          cache.writeQuery({
            query: LIST_USERS,
            data: {
              users: cached.users.filter(u => u.id !== id),
            },
          });
        },
      }),
    deleteStatus,
  ];
}
