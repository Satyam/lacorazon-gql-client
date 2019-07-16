import React from 'react';
import useReactRouter from 'use-react-router';

import { Table } from 'reactstrap';
import { ButtonIconAdd } from 'Components/Icons';

import Loading from 'Components/Loading';
import Page from 'Components/Page';
import GqlError from 'Components/GqlError';

import TableRowVenta from './TableRowVenta';

import { useListVentas, useDeleteVenta } from './actions';

export default function ListVentas({ vendedor, wide }) {
  const { history } = useReactRouter();
  const { loading, error, data } = useListVentas(vendedor);
  const [deleteVenta, deleteStatus] = useDeleteVenta();
  if (loading) return <Loading>Cargando ventas</Loading>;
  if (deleteStatus.loading) return <Loading>Borrando venta</Loading>;

  const ventas = data ? data.ventas : [];

  return (
    <Page title="Ventas" heading="Ventas" wide={wide}>
      <GqlError error={[error, deleteStatus]}>
        <Table striped hover size="sm" responsive>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Concepto</th>
              <th>Cantidad</th>
              <th>Precio Unitario</th>
              <th>IVA</th>
              <th>Precio Total</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {ventas.map(venta => TableRowVenta(venta, history, deleteVenta))}
          </tbody>
        </Table>
        <ButtonIconAdd onClick={() => history.push('/distribuidor/new')}>
          Agregar
        </ButtonIconAdd>
      </GqlError>
    </Page>
  );
}
