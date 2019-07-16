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
  const { error, loading, data } = useQuery(LIST_VENTAS, {
    variables: { vendedor },
  });
  return loading || error
    ? { error, loading }
    : {
        error,
        loading,
        data: {
          ventas: data.ventas.map(({ fecha, ...rest }) => ({
            ...rest,
            fecha: new Date(fecha),
          })),
        },
      };
}

export const DELETE_VENTA = gql`
  mutation($id: ID!) {
    deleteVenta(id: $id) {
      id
      fecha
      concepto
      cantidad
      iva
      precioUnitario
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
