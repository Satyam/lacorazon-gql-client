import React from 'react';
import useReactRouter from 'use-react-router';

import { Table } from 'reactstrap';
import {
  ButtonIconAdd,
  ButtonIconEdit,
  ButtonIconDelete,
} from 'Components/Icons';
import { ButtonGroup } from 'reactstrap';
import { MdCheckBox, MdCheckBoxOutlineBlank } from 'react-icons/md';
import { useIntl } from 'Components/intl';
import Loading from 'Components/Loading';
import Page from 'Components/Page';
import GqlError from 'Components/GqlError';
import { confirmDelete } from 'Components/shared';

import { useListVentas, useDeleteVenta } from './actions';

export default function ListVentas({ idVendedor, nombreVendedor, wide }) {
  const { history } = useReactRouter();
  const { loading, error, data } = useListVentas(idVendedor);
  const [deleteVenta, deleteStatus] = useDeleteVenta();
  const { formatDate, formatCurrency } = useIntl();

  if (loading) return <Loading>Cargando ventas</Loading>;
  if (deleteStatus.loading) return <Loading>Borrando venta</Loading>;

  const onAdd = ev => {
    ev.stopPropagation();
    history.push('/venta/new');
  };
  const onShow = ev => {
    ev.stopPropagation();
    history.push(`/venta/${ev.currentTarget.dataset.id}`);
  };
  const onDelete = ev => {
    ev.stopPropagation();
    const { fecha, id } = ev.currentTarget.dataset;
    confirmDelete(`la venta del ${fecha}`, () => deleteVenta(id));
  };
  const onEdit = ev => {
    ev.stopPropagation();
    history.push(`/venta/edit/${ev.currentTarget.dataset.id}`);
  };

  const onShowVendedor = ev => {
    ev.stopPropagation();
    history.push(`/user/${ev.currentTarget.dataset.id}`);
  };
  const rowVenta = venta => {
    const id = venta.id;
    return (
      <tr key={id}>
        <td
          align="right"
          className="link"
          onClick={onShow}
          data-id={id}
          title="Ver detalle esta venta"
        >
          {formatDate(venta.fecha)}
        </td>
        <td>{venta.concepto}</td>
        {!idVendedor &&
          (venta.vendedor ? (
            <td
              className="link"
              onClick={onShowVendedor}
              data-id={venta.vendedor.id}
              title={`Ver detalle vendedor: \n${venta.vendedor.nombre}`}
            >
              {venta.vendedor.nombre}
            </td>
          ) : (
            <td>---</td>
          ))}
        <td align="right">{venta.cantidad}</td>
        <td align="right">{formatCurrency(venta.precioUnitario)}</td>
        <td align="center">
          {venta.iva ? <MdCheckBox /> : <MdCheckBoxOutlineBlank />}
        </td>
        <td align="right">
          {formatCurrency(venta.cantidad * venta.precioUnitario)}
        </td>
        <td>
          <ButtonGroup size="sm">
            <ButtonIconEdit
              outline
              onClick={onEdit}
              data-id={id}
              data-fecha={formatDate(venta.fecha)}
            />
            <ButtonIconDelete outline onClick={onDelete} data-id={id} />
          </ButtonGroup>
        </td>
      </tr>
    );
  };

  const ventas = data ? data.ventas : [];

  return (
    <Page
      title={!idVendedor && 'Ventas'}
      heading={nombreVendedor ? `Ventas de ${nombreVendedor}` : 'Ventas'}
      wide={wide}
      action={
        <ButtonIconAdd outline onClick={onAdd}>
          Agregar
        </ButtonIconAdd>
      }
    >
      <GqlError error={[error, deleteStatus]}>
        <Table striped hover size="sm" responsive>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Concepto</th>
              {!idVendedor && <th>Vendedor</th>}
              <th>Cantidad</th>
              <th>Precio Unitario</th>
              <th>IVA</th>
              <th>Precio Total</th>
              <th />
            </tr>
          </thead>
          <tbody>{ventas.map(rowVenta)}</tbody>
        </Table>
      </GqlError>
    </Page>
  );
}
