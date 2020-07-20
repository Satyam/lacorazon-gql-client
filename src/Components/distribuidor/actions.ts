import {
  gql,
  useQuery,
  useMutation,
  ApolloError,
  DataProxy,
} from '@apollo/client';

export type DistribuidorType = {
  id?: ID;
  nombre?: string;
  localidad?: string;
  contacto?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  entregados?: number;
  existencias?: number;
};

export type DistribuidorCacheType = {
  distribuidores: DistribuidorType[];
};

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

export function useListDistribuidores(): {
  error?: ApolloError;
  loading: boolean;
  distribuidores?: DistribuidorType[];
} {
  const { error, loading, data } = useQuery(LIST_DISTRIBUIDORES);
  if (!data || loading || error) return { error, loading };
  return {
    error,
    loading,
    distribuidores: data.distribuidores,
  };
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

export function useGetDistribuidor(
  id: ID
): { error?: ApolloError; loading: boolean; distribuidor?: DistribuidorType } {
  const { error, loading, data } = useQuery(GET_DISTRIBUIDOR, {
    variables: {
      id,
    },
    skip: !id,
  });
  if (!data || loading || error) {
    return { loading, error };
  }
  return {
    loading,
    error,
    distribuidor: data.distribuidor,
  };
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
      nombre
      email
      localidad
      contacto
      telefono
      direccion
      entregados
      existencias
    }
  }
`;

function readDistribuidoresCache(cache: DataProxy): DistribuidorCacheType {
  let cached: DistribuidorCacheType | null = null;
  try {
    cached = cache.readQuery({
      query: LIST_DISTRIBUIDORES,
    });
  } catch (err) {}
  return cached || { distribuidores: [] };
}

export function useCreateDistribuidor(): (
  values: DistribuidorType
) => Promise<ID> {
  const [createDistribuidor] = useMutation(CREATE_DISTRIBUIDOR, {
    ignoreResults: true,
  });
  return (values: DistribuidorType) =>
    createDistribuidor({
      variables: values,
      update: (cache, { data }) => {
        const cached = readDistribuidoresCache(cache);
        cached.distribuidores.push(data.createDistribuidor);
        cached.distribuidores.sort((a, b) => {
          if (a.nombre! < b.nombre!) return -1;
          if (a.nombre! > b.nombre!) return 1;
          return 0;
        });
        cache.writeQuery({
          query: LIST_DISTRIBUIDORES,
          data: cached,
        });
      },
    }).then(
      // https://github.com/apollographql/react-apollo/issues/2095
      (status) => (status && status.data && status.data.createUser.id) || ''
    );
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

export function useUpdateDistribuidor(): (
  id: ID,
  values: Omit<DistribuidorType, 'id'>
) => Promise<ID> {
  const [updateDistribuidor] = useMutation(UPDATE_DISTRIBUIDOR, {
    ignoreResults: true,
  });
  return (id, values) =>
    updateDistribuidor({
      variables: { id, ...values },
    }).then(
      (status) => (status && status.data && status.data.updateUser.id) || ''
    );
}

export const DELETE_DISTRIBUIDOR = gql`
  mutation($id: ID!) {
    deleteDistribuidor(id: $id) {
      id
    }
  }
`;

export function useDeleteDistribuidor(): (id: ID) => Promise<ID> {
  const [delDistribuidor] = useMutation(DELETE_DISTRIBUIDOR, {
    ignoreResults: true,
  });
  return (id) =>
    delDistribuidor({
      variables: { id },
      update: (cache) => {
        const cached = readDistribuidoresCache(cache);

        cache.writeQuery({
          query: LIST_DISTRIBUIDORES,
          data: {
            distribuidores: cached.distribuidores.filter((d) => d.id !== id),
          },
        });
      },
    }).then(
      (status) => (status && status.data && status.data.deleteUser.id) || ''
    );
}
