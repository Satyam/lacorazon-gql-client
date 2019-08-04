import React from 'react';
import useReactRouter from 'use-react-router';
import { Table, ButtonGroup } from 'reactstrap';

import {
  ButtonIconAdd,
  ButtonIconEdit,
  ButtonIconDelete,
} from 'Components/Icons';
import Page from 'Components/Page';
import { useModals, Loading } from 'Components/modals';

import {
  useListDistribuidores,
  useDeleteDistribuidor,
  DistribuidorType,
} from './actions';
import styles from './styles.module.css';

export default function ListDistribuidores() {
  const { history } = useReactRouter();
  const { loading, error, distribuidores } = useListDistribuidores();
  const deleteDistribuidor = useDeleteDistribuidor();
  const { confirmDelete } = useModals();

  if (loading) return <Loading>Cargando distribuidores</Loading>;

  const onEdit: React.MouseEventHandler<HTMLButtonElement> = ev => {
    ev.stopPropagation();
    history.push(`/distribuidor/edit/${ev.currentTarget.dataset.id}`);
  };
  const onShow: React.MouseEventHandler<HTMLTableCellElement> = ev => {
    ev.stopPropagation();
    history.push(`/distribuidor/${ev.currentTarget.dataset.id}`);
  };
  const onDelete: React.MouseEventHandler<HTMLButtonElement> = ev => {
    ev.stopPropagation();
    const { nombre, id } = ev.currentTarget.dataset;
    confirmDelete(`al distribuidor ${nombre}`, () =>
      deleteDistribuidor(id as ID)
    );
  };
  const onAdd: React.MouseEventHandler<HTMLButtonElement> = ev => {
    ev.stopPropagation();
    history.push('/distribuidor/new');
  };
  const rowDistribuidor = (distribuidor: DistribuidorType) => {
    const id = distribuidor.id;
    return (
      <tr key={id}>
        <td
          onClick={onShow}
          data-id={id}
          className="link"
          title={`Ver detalle:\n  ${distribuidor.nombre}`}
        >
          {distribuidor.nombre}
        </td>
        <td>{distribuidor.contacto}</td>
        <td>{distribuidor.telefono}</td>
        <td>
          <div className={styles.small}>{distribuidor.direccion}</div>

          {distribuidor.localidad}
        </td>
        <td className={styles.small}>
          {(distribuidor.email || '').replace('@', '\n@')}
        </td>
        <td align="right">{distribuidor.entregados}</td>
        <td align="right">{distribuidor.existencias}</td>
        <td>
          <ButtonGroup size="sm">
            <ButtonIconEdit outline onClick={onEdit} data-id={id} />
            <ButtonIconDelete
              outline
              onClick={onDelete}
              data-id={id}
              data-nombre={distribuidor.nombre}
            />
          </ButtonGroup>
        </td>
      </tr>
    );
  };

  return (
    <Page
      wide
      title="Distribuidores"
      heading="Distribuidores"
      action={
        <ButtonIconAdd outline onClick={onAdd}>
          Agregar
        </ButtonIconAdd>
      }
      error={error}
    >
      <Table striped hover size="sm" responsive>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Contacto</th>
            <th>Teléfono</th>
            <th>Dirección</th>
            <th>e-Mail</th>
            <th>Entregados</th>
            <th>Existencias</th>
            <th />
          </tr>
        </thead>
        <tbody>{(distribuidores || []).map(rowDistribuidor)}</tbody>
      </Table>
    </Page>
  );
}
