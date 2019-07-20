import React from 'react';
import { ButtonGroup } from 'reactstrap';
import { ButtonIconEdit, ButtonIconDelete } from '../Icons';
import { MdCheckBox, MdCheckBoxOutlineBlank } from 'react-icons/md';
import { useIntl } from 'Components/intl';

export default function TableRowDistribuidor({ venta, history, deleteVenta }) {
  const { formatDate, formatCurrency } = useIntl();
  return (
    <tr onClick={() => history.push(`/venta/${venta.id}`)}>
      <td align="right">{formatDate(venta.fecha)}</td>
      <td>{venta.concepto}</td>
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
