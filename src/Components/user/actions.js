import { useQuery, useMutation } from '@apollo/react-hooks';

import {
  LIST_USERS,
  GET_USER,
  CREATE_USER,
  UPDATE_USER,
  DELETE_USER,
} from './gql';

export function useListUsers() {
  return useQuery(LIST_USERS);
}

export function useGetUser(id) {
  return useQuery(GET_USER, {
    variables: {
      id,
    },
    skip: !id,
  });
}

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
          cached.users.push(data.createUser);
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

export function useUpdateUser() {
  const [updateUser, updateStatus] = useMutation(UPDATE_USER);
  return [
    (id, values) => updateUser({ variables: { id, ...values } }),
    updateStatus,
  ];
}

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
