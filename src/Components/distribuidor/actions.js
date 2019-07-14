import { useQuery, useMutation } from '@apollo/react-hooks';

import {
  LIST_DISTRIBUIDORES,
  GET_DISTRIBUIDOR,
  DELETE_DISTRIBUIDOR,
  CREATE_DISTRIBUIDOR,
  UPDATE_DISTRIBUIDOR,
} from './gql';

export function useListDistribuidores() {
  return useQuery(LIST_DISTRIBUIDORES);
}

export function useGetDistribuidor(id) {
  return useQuery(GET_DISTRIBUIDOR, {
    variables: {
      id,
    },
    skip: !id,
  });
}

export function useDeleteDistribuidor() {
  const [delDistribuidor, delStatus] = useMutation(DELETE_DISTRIBUIDOR);
  return [
    id =>
      delDistribuidor({
        variables: { id },
        update: cache => {
          const cached = cache.readQuery({
            query: LIST_DISTRIBUIDORES,
          });

          cache.writeQuery({
            query: LIST_DISTRIBUIDORES,
            data: {
              distribuidores: cached.distribuidores.filter(d => d.id !== id),
            },
          });
        },
      }),
    delStatus,
  ];
}

export function useCreateDistribuidor() {
  const [createDistribuidor, createStatus] = useMutation(CREATE_DISTRIBUIDOR);
  return [
    values =>
      createDistribuidor({
        variables: values,
        update: (cache, { data }) => {
          const cached = cache.readQuery({
            query: LIST_DISTRIBUIDORES,
          });
          cached.distribuidores.push({
            entregados: 0,
            existencias: 0,
            ...data.createDistribuidor,
          });
          cached.distribuidores.sort((a, b) => {
            if (a.nombre < b.nombre) return -1;
            if (a.nombre > b.nombre) return 1;
            return 0;
          });
          cache.writeQuery({
            query: LIST_DISTRIBUIDORES,
            data: cached,
          });
        },
      }),
    createStatus,
  ];
}
export function useUpdateDistribuidor() {
  const [updateDistribuidor, updateStatus] = useMutation(UPDATE_DISTRIBUIDOR);
  return [
    (id, values) =>
      updateDistribuidor({
        variables: { id, ...values },
      }),
    updateStatus,
  ];
}
