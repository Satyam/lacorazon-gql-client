import { useQuery, useMutation } from '@apollo/react-hooks';

import gql from 'graphql-tag';

export const LIST_DISTRIBUIDORES = gql`
  query($offset: Int, $limit: Int) {
    distribuidores(offset: $offset, limit: $limit) {
      id
      nombre
      localidad
      contacto
      telefono
      email
      direccion
      entregados
      existencias
    }
  }
`;

export function useListDistribuidores() {
  return useQuery(LIST_DISTRIBUIDORES);
}

export const GET_DISTRIBUIDOR = gql`
  query($id: ID!) {
    distribuidor(id: $id) {
      id
      nombre
      localidad
      contacto
      telefono
      email
      direccion
      entregados
      existencias
    }
  }
`;

export function useGetDistribuidor(id) {
  return useQuery(GET_DISTRIBUIDOR, {
    variables: {
      id,
    },
    skip: !id,
  });
}

export const CREATE_DISTRIBUIDOR = gql`
  mutation(
    $nombre: String!
    $email: String
    $localidad: String
    $contacto: String
    $telefono: String
    $direccion: String
  ) {
    createDistribuidor(
      nombre: $nombre
      email: $email
      localidad: $localidad
      contacto: $contacto
      telefono: $telefono
      direccion: $direccion
    ) {
      id
      entregados
      existencias
    }
  }
`;

function readDistribuidoresCache(cache) {
  let cached = null;
  try {
    cached = cache.readQuery({
      query: LIST_DISTRIBUIDORES,
    });
  } catch (err) {}
  return cached || { distribuidores: [] };
}

export function useCreateDistribuidor() {
  const [createDistribuidor, createStatus] = useMutation(CREATE_DISTRIBUIDOR);
  return [
    values =>
      createDistribuidor({
        variables: values,
        update: (cache, { data }) => {
          const cached = readDistribuidoresCache(cache);
          cached.distribuidores.push(data.createDistribuidor);
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

export const UPDATE_DISTRIBUIDOR = gql`
  mutation(
    $id: ID!
    $nombre: String
    $email: String
    $localidad: String
    $contacto: String
    $telefono: String
    $direccion: String
  ) {
    updateDistribuidor(
      id: $id
      nombre: $nombre
      email: $email
      localidad: $localidad
      contacto: $contacto
      telefono: $telefono
      direccion: $direccion
    ) {
      id
      nombre
      localidad
      contacto
      telefono
      email
      direccion
      entregados
      existencias
    }
  }
`;

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

export const DELETE_DISTRIBUIDOR = gql`
  mutation($id: ID!) {
    deleteDistribuidor(id: $id) {
      id
    }
  }
`;

export function useDeleteDistribuidor() {
  const [delDistribuidor, delStatus] = useMutation(DELETE_DISTRIBUIDOR);
  return [
    id =>
      delDistribuidor({
        variables: { id },
        update: cache => {
          const cached = readDistribuidoresCache(cache);

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
