import React from 'react';
import { ButtonGroup } from 'reactstrap';
import { ButtonIconEdit, ButtonIconDelete } from '../Icons';
import { MdCheckBox, MdCheckBoxOutlineBlank } from 'react-icons/md';

const formatCurrency = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
});

export default function TableRowDistribuidor(venta, history, deleteVenta) {
  return (
    <tr key={venta.id} onClick={() => history.push(`/venta/${venta.id}`)}>
      <td>{venta.fecha.toLocaleDateString()}</td>
      <td>{venta.concepto}</td>
      <td align="right">{venta.cantidad}</td>
      <td align="right">{formatCurrency.format(venta.precioUnitario)}</td>
      <td align="center">
        {venta.iva ? <MdCheckBox /> : <MdCheckBoxOutlineBlank />}
      </td>
      <td align="right">
        {formatCurrency.format(venta.cantidad * venta.precioUnitario)}
      </td>
      <td>
        <ButtonGroup size="sm">
          <ButtonIconEdit
            onClick={ev => {
              ev.stopPropagation();
              history.push(`/venta/edit/${venta.id}`);
            }}
          />
          <ButtonIconDelete
            onClick={ev => {
              ev.stopPropagation();
              deleteVenta(venta.id);
            }}
          />
        </ButtonGroup>
      </td>
    </tr>
  );
}
