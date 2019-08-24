import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { ApolloError } from 'apollo-client';
import { DataProxy } from 'apollo-cache';

import { UserType } from 'Components/user/actions';

export interface GqlVentaType {
  id?: ID;
  fecha?: string;
  concepto?: string;
  idVendedor?: ID;
  cantidad?: number;
  iva?: boolean;
  precioUnitario?: number;
}
export type VentaType = Omit<GqlVentaType, 'fecha' | 'idVendedor'> & {
  fecha?: Date;
  vendedor?: UserType;
};

interface VentasCacheType {
  ventas: GqlVentaType[];
}

export const LIST_VENTAS = gql`
  query($idVendedor: ID) {
    ventas(idVendedor: $idVendedor) {
      id
      fecha
      concepto
      vendedor {
        id
        nombre
      }
      cantidad
      iva
      precioUnitario
    }
  }
`;

export function useListVentas(
  idVendedor?: ID
): {
  error?: ApolloError;
  loading: boolean;
  ventas?: VentaType[];
} {
  const { error, loading, data } = useQuery<
    { ventas: GqlVentaType[] },
    { idVendedor?: ID }
  >(LIST_VENTAS, {
    variables: { idVendedor },
  });
  if (!data || loading || error) return { error, loading };
  return {
    error,
    loading,
    ventas: data.ventas.map(({ fecha, ...rest }) => ({
      ...rest,
      fecha: fecha ? new Date(fecha) : undefined,
    })),
  };
}

export const GET_VENTA = gql`
  query($id: ID!) {
    venta(id: $id) {
      id
      fecha
      concepto
      cantidad
      iva
      precioUnitario
      vendedor {
        id
        nombre
      }
    }
  }
`;

export function useGetVenta(
  id?: ID
): { error?: ApolloError; loading: boolean; venta?: VentaType } {
  const { error, loading, data } = useQuery<
    { venta: GqlVentaType },
    { id?: ID }
  >(GET_VENTA, {
    variables: {
      id,
    },
    skip: !id,
  });
  if (!data || loading || error) {
    return { loading, error };
  }
  const { fecha, iva, ...rest } = data.venta;
  return {
    loading,
    error,
    venta: {
      fecha: fecha ? new Date(fecha) : undefined,
      iva: !!iva,
      ...rest,
    },
  };
}

export const CREATE_VENTA = gql`
  mutation(
    $fecha: String!
    $concepto: String!
    $idVendedor: ID
    $cantidad: Int
    $iva: Boolean
    $precioUnitario: Float
  ) {
    createVenta(
      fecha: $fecha
      concepto: $concepto
      idVendedor: $idVendedor
      cantidad: $cantidad
      iva: $iva
      precioUnitario: $precioUnitario
    ) {
      id
      fecha
      concepto
      vendedor {
        id
        nombre
      }
      cantidad
      iva
      precioUnitario
    }
  }
`;

function readVentasCache(cache: DataProxy): VentasCacheType {
  let cached: VentasCacheType | null = null;
  try {
    cached = cache.readQuery({
      query: LIST_VENTAS,
    });
  } catch (err) {}
  return cached || { ventas: [] };
}

export function useCreateVenta(): (
  values: Omit<VentaType, 'vendedor'> & { idVendedor: ID }
) => Promise<ID> {
  const [createVenta] = useMutation<{ createVenta: { id: ID } }, GqlVentaType>(
    CREATE_VENTA,
    { ignoreResults: true }
  );
  return values => {
    const { fecha, ...rest } = values;
    const gqlValues = {
      fecha: fecha && fecha.toISOString(),
      ...rest,
    };
    return createVenta({
      variables: gqlValues,

      update: (cache, { data }) => {
        if (data) {
          const cached = readVentasCache(cache);
          cached.ventas.push(data.createVenta);
          cached.ventas.sort((a: GqlVentaType, b: GqlVentaType) => {
            if (a.fecha! < b.fecha!) return -1;
            if (a.fecha! > b.fecha!) return 1;
            return 0;
          });
          cache.writeQuery({
            query: LIST_VENTAS,
            data: cached,
          });
        }
      },
    }).then(
      status => (status && status.data && status.data.createVenta.id) || ''
    );
  };
}

export const UPDATE_VENTA = gql`
  mutation(
    $id: ID!
    $fecha: String
    $concepto: String
    $idVendedor: ID
    $cantidad: Int
    $iva: Boolean
    $precioUnitario: Float
  ) {
    updateVenta(
      id: $id
      fecha: $fecha
      concepto: $concepto
      idVendedor: $idVendedor
      cantidad: $cantidad
      iva: $iva
      precioUnitario: $precioUnitario
    ) {
      id
      fecha
      concepto
      vendedor {
        id
        nombre
      }
      cantidad
      iva
      precioUnitario
    }
  }
`;

export function useUpdateVenta(): (
  id: ID,
  values: Omit<VentaType, 'id'>
) => Promise<ID> {
  const [updateVenta] = useMutation<
    { updateVenta: GqlVentaType },
    GqlVentaType
  >(UPDATE_VENTA, { ignoreResults: true });

  return (id, values) => {
    const { fecha, vendedor, ...rest } = values;
    const gqlValues = {
      id,
      fecha: fecha && fecha.toISOString(),
      idVendedor: vendedor && vendedor.id,
      ...rest,
    };
    return updateVenta({
      variables: gqlValues,
    }).then(
      status => (status && status.data && status.data.updateVenta.id) || ''
    );
  };
}

export const DELETE_VENTA = gql`
  mutation($id: ID!) {
    deleteVenta(id: $id) {
      id
    }
  }
`;

export function useDeleteVenta(): (id: ID) => Promise<ID> {
  const [delVenta] = useMutation<{ deleteVenta: { id: ID } }, { id: ID }>(
    DELETE_VENTA,
    { ignoreResults: true }
  );
  return id =>
    delVenta({
      variables: { id },
      update: cache => {
        const cached = readVentasCache(cache);
        cache.writeQuery({
          query: LIST_VENTAS,
          data: {
            ventas: cached.ventas.filter(d => d.id !== id),
          },
        });
      },
    }).then(
      status => (status && status.data && status.data.deleteVenta.id) || ''
    );
}

export const OPTIONS_VENDEDORES = gql`
  query {
    users {
      id
      nombre
    }
  }
`;

export function useOptionsVendedores(): {
  loading: boolean;
  error?: ApolloError;
  optionsVendedores?: { [index: string]: string | number }[];
} {
  const { error, loading, data } = useQuery<
    { users: Required<UserType>[] },
    {}
  >(OPTIONS_VENDEDORES);
  if (!data || loading || error) return { error, loading };
  return {
    error,
    loading,
    optionsVendedores: [
      { id: '', nombre: ' ---- ' },
      ...data.users
        .sort((a: UserType, b: UserType) => {
          if (a.nombre! < b.nombre!) return -1;
          if (a.nombre! > b.nombre!) return 1;
          return 0;
        })
        .map(v => ({
          id: v.id,
          nombre: v.nombre,
        })),
    ],
  };
}
