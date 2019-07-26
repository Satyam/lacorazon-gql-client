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
import { confirmDelete } from 'Components/shared';

import { useListUsers, useDeleteUser, UserType } from './actions';

export default function ListUsers() {
  const { history } = useReactRouter();
  const { loading, error, data } = useListUsers();
  const [deleteUser, deleteStatus] = useDeleteUser();

  if (loading) return <Loading>Cargando usuarios</Loading>;
  if (deleteStatus.loading) return <Loading>Borrando usuario</Loading>;

  const onAdd: React.MouseEventHandler<HTMLButtonElement> = ev => {
    ev.stopPropagation();
    history.push(`/user/new`);
  };
  const onShow: React.MouseEventHandler<HTMLTableCellElement> = ev => {
    ev.stopPropagation();
    history.push(`/user/${ev.currentTarget.dataset.id}`);
  };
  const onDelete: React.MouseEventHandler<HTMLButtonElement> = ev => {
    ev.stopPropagation();
    const { nombre, id } = ev.currentTarget.dataset;
    confirmDelete(`al usuario ${nombre}`, () => deleteUser(id as string));
  };
  const onEdit: React.MouseEventHandler<HTMLButtonElement> = ev => {
    ev.stopPropagation();
    history.push(`/user/edit/${ev.currentTarget.dataset.id}`);
  };

  const rowUser = (user: UserType) => {
    const id = user.id;
    return (
      <tr key={id}>
        <td
          onClick={onShow}
          data-id={id}
          className="link"
          title={`Ver detalles\n${user.nombre}`}
        >
          {user.nombre}
        </td>
        <td>{user.email}</td>
        <td>
          <ButtonGroup size="sm">
            <ButtonIconEdit outline onClick={onEdit} data-id={id} />
            <ButtonIconDelete
              outline
              onClick={onDelete}
              data-id={id}
              data-nombre={user.nombre}
            />
          </ButtonGroup>
        </td>
      </tr>
    );
  };

  const users = data ? data.users : [];

  return (
    <Page
      title="Vendedores"
      heading="Vendedores"
      action={
        <ButtonIconAdd outline onClick={onAdd} label="Agregar">
          Agregar
        </ButtonIconAdd>
      }
    >
      <GqlError error={[error, deleteStatus]}>
        <Table striped hover size="sm" responsive>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>E-mail</th>
              <th />
            </tr>
          </thead>
          <tbody>{users.map(rowUser)}</tbody>
        </Table>
      </GqlError>
    </Page>
  );
}
