import React from 'react';
import useReactRouter from 'use-react-router';

import { Table } from 'reactstrap';
import {
  ButtonIconAdd,
  ButtonIconEdit,
  ButtonIconDelete,
} from 'Components/Icons';
import { ButtonGroup } from 'reactstrap';
import Loading from 'Components/Loading';
import Page from 'Components/Page';
import GqlError from 'Components/GqlError';

import { useListUsers, useDeleteUser } from './actions';

export default function ListUsers() {
  const { history } = useReactRouter();
  const { loading, error, data } = useListUsers();
  const [deleteUser, deleteStatus] = useDeleteUser();

  if (loading) return <Loading>Cargando usuarios</Loading>;
  if (deleteStatus.loading) return <Loading>Borrando usuario</Loading>;

  const onAdd = ev => {
    ev.stopPropagation();
    history.push(`/user/new`);
  };
  const onShow = ev => {
    ev.stopPropagation();
    history.push(`/user/${ev.currentTarget.dataset.id}`);
  };
  const onDelete = ev => {
    ev.stopPropagation();
    deleteUser(ev.currentTarget.dataset.id);
  };
  const onEdit = ev => {
    ev.stopPropagation();
    history.push(`/user/edit/${ev.currentTarget.dataset.id}`);
  };

  const rowUser = user => {
    const id = user.id;
    return (
      <tr key={id} onClick={onShow} data-id={id}>
        <td>{user.email}</td>
        <td>{user.nombre}</td>
        <td>
          <ButtonGroup size="sm">
            <ButtonIconEdit outline onClick={onEdit} data-id={id} />
            <ButtonIconDelete outline onClick={onDelete} data-id={id} />
          </ButtonGroup>
        </td>
      </tr>
    );
  };

  const users = data ? data.users : [];

  return (
    <Page title="Vendedores" heading="Vendedores">
      <GqlError error={[error, deleteStatus]}>
        <Table striped hover size="sm" responsive>
          <thead>
            <tr>
              <th>Alias</th>
              <th>Nombre</th>
              <th />
            </tr>
          </thead>
          <tbody>{users.map(rowUser)}</tbody>
        </Table>
        <ButtonIconAdd outline onClick={onAdd} label="Agregar">
          Agregar
        </ButtonIconAdd>
      </GqlError>
    </Page>
  );
}
