import { useQuery, useMutation } from '@apollo/react-hooks';

import gql from 'graphql-tag';

export const LIST_VENTAS = gql`
  query($vendedor: ID) {
    ventas(vendedor: $vendedor) {
      id
      fecha
      concepto
      cantidad
      iva
      precioUnitario
    }
  }
`;

export function useListVentas(vendedor) {
  const { error, loading, data, ...rest } = useQuery(LIST_VENTAS, {
    variables: { vendedor },
  });
  return loading || error
    ? { error, loading, ...rest }
    : {
        error,
        loading,
        ...rest,
        data: {
          ventas: data.ventas.map(({ fecha, ...rest }) => ({
            ...rest,
            fecha: new Date(fecha),
          })),
        },
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
    }
  }
`;

export function useGetVenta(id) {
  const { error, loading, data, ...rest } = useQuery(GET_VENTA, {
    variables: {
      id,
    },
    skip: !id,
  });
  return loading || error || !data
    ? { error, loading, ...rest }
    : {
        error,
        loading,
        ...rest,
        data: {
          venta: {
            ...data.venta,
            fecha: new Date(data.venta.fecha),
            iva: !!data.venta.iva,
          },
        },
      };
}

export const CREATE_VENTA = gql`
  mutation(
    $fecha: String!
    $concepto: String!
    $cantidad: Int
    $iva: Boolean
    $precioUnitario: Float
  ) {
    createVenta(
      fecha: $fecha
      concepto: $concepto
      cantidad: $cantidad
      iva: $iva
      precioUnitario: $precioUnitario
    ) {
      id
    }
  }
`;

export function useCreateVenta() {
  const [createVenta, createStatus] = useMutation(CREATE_VENTA);
  return [
    values =>
      createVenta({
        variables: values,
        update: (cache, { data }) => {
          const cached = cache.readQuery({
            query: LIST_VENTAS,
          });
          cached.ventas.push({
            ...values,
            ...data.createVenta,
          });
          cached.ventas.sort((a, b) => {
            if (a.fecha < b.fecha) return -1;
            if (a.fecha > b.fecha) return 1;
            return 0;
          });
          cache.writeQuery({
            query: LIST_VENTAS,
            data: cached,
          });
        },
      }),
    createStatus,
  ];
}

export const UPDATE_VENTA = gql`
  mutation(
    $id: ID!
    $fecha: String
    $concepto: String
    $cantidad: Int
    $iva: Boolean
    $precioUnitario: Float
  ) {
    updateVenta(
      id: $id
      fecha: $fecha
      concepto: $concepto
      cantidad: $cantidad
      iva: $iva
      precioUnitario: $precioUnitario
    ) {
      id
      fecha
      concepto
      cantidad
      iva
      precioUnitario
    }
  }
`;

export function useUpdateVenta() {
  const [updateVenta, updateStatus] = useMutation(UPDATE_VENTA);
  return [
    (id, values) =>
      updateVenta({
        variables: { id, ...values },
      }),
    updateStatus,
  ];
}

export const DELETE_VENTA = gql`
  mutation($id: ID!) {
    deleteVenta(id: $id) {
      id
    }
  }
`;

export function useDeleteVenta() {
  const [delVenta, delStatus] = useMutation(DELETE_VENTA);
  return [
    id =>
      delVenta({
        variables: { id },
        update: cache => {
          const cached = cache.readQuery({
            query: LIST_VENTAS,
          });

          cache.writeQuery({
            query: LIST_VENTAS,
            data: {
              ventas: cached.ventas.filter(d => d.id !== id),
            },
          });
        },
      }),
    delStatus,
  ];
}
