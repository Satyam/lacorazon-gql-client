import React from 'react';
import { ButtonGroup } from 'reactstrap';
import { ButtonIconEdit, ButtonIconDelete } from '../Icons';
import styles from './styles.module.css';

export default function TableRowDistribuidor(
  distribuidor,
  history,
  deleteDistribuidor
) {
  return (
    <tr
      key={distribuidor.id}
      onClick={() => history.push(`/distribuidor/${distribuidor.id}`)}
    >
      <td>{distribuidor.nombre}</td>
      <td>{distribuidor.contacto}</td>
      <td>{distribuidor.telefono}</td>
      <td className={styles.small}>{distribuidor.direccion}</td>
      <td>{distribuidor.localidad}</td>
      <td className={styles.small}>
        {(distribuidor.email || '').replace('@', '\n@')}
      </td>
      <td>
        <ButtonGroup size="sm">
          <ButtonIconEdit
            onClick={ev => {
              ev.stopPropagation();
              history.push(`/distribuidor/${distribuidor.id}?edit=true`);
            }}
          />
          <ButtonIconDelete
            onClick={ev => {
              ev.stopPropagation();
              deleteDistribuidor(distribuidor.id);
            }}
          />
        </ButtonGroup>
      </td>
    </tr>
  );
}
