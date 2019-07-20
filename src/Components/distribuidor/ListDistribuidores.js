import React from 'react';
import useReactRouter from 'use-react-router';

import { Table } from 'reactstrap';
import {
  ButtonIconAdd,
  ButtonIconEdit,
  ButtonIconDelete,
} from 'Components/Icons';
import { ButtonGroup } from 'reactstrap';
import styles from './styles.module.css';
import Loading from 'Components/Loading';
import Page from 'Components/Page';
import GqlError from 'Components/GqlError';

import { useListDistribuidores, useDeleteDistribuidor } from './actions';

export default function ListDistribuidores() {
  const { history } = useReactRouter();
  const { loading, error, data } = useListDistribuidores();
  const [deleteDistribuidor, deleteStatus] = useDeleteDistribuidor();

  if (loading) return <Loading>Cargando distribuidores</Loading>;
  if (deleteStatus.loading) return <Loading>Borrando distribuidor</Loading>;

  const onEdit = ev => {
    ev.stopPropagation();
    history.push(`/distribuidor/edit/${ev.currentTarget.dataset.id}`);
  };
  const onShow = ev => {
    ev.stopPropagation();
    history.push(`/distribuidor/${ev.currentTarget.dataset.id}`);
  };
  const onDelete = ev => {
    ev.stopPropagation();
    deleteDistribuidor(ev.currentTarget.dataset.id);
  };
  const onAdd = ev => {
    ev.stopPropagation();
    history.push('/distribuidor/new');
  };
  const rowDistribuidor = distribuidor => {
    const id = distribuidor.id;
    return (
      <tr key={id} onClick={onShow} data-id={id}>
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
            <ButtonIconEdit onClick={onEdit} data-id={id} />
            <ButtonIconDelete onClick={onDelete} data-id={id} />
          </ButtonGroup>
        </td>
      </tr>
    );
  };

  const distribuidores = data ? data.distribuidores : [];

  return (
    <Page wide title="Distribuidores" heading="Distribuidores">
      <GqlError error={[error, deleteStatus]}>
        <Table striped hover size="sm" responsive>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Contacto</th>
              <th>Teléfono</th>
              <th>Dirección</th>
              <th>Localidad</th>
              <th>e-Mail</th>
              <th />
            </tr>
          </thead>
          <tbody>{distribuidores.map(rowDistribuidor)}</tbody>
        </Table>
        <ButtonIconAdd onClick={onAdd}>Agregar</ButtonIconAdd>
      </GqlError>
    </Page>
  );
}
