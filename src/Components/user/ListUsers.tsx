import React from 'react';
import useReactRouter from 'use-react-router';
import { Table, ButtonGroup } from 'reactstrap';

import {
  ButtonIconAdd,
  ButtonIconEdit,
  ButtonIconDelete,
} from 'Components/Icons';
import Page from 'Components/Page';
import { Loading } from 'Components/Modals';
import { useModals } from 'Providers/Modals';

import { useListUsers, useDeleteUser, UserType } from './actions';

const ListUsers = () => {
  const { history } = useReactRouter();
  const { loading, error, users } = useListUsers();
  const deleteUser = useDeleteUser();
  const { confirmDelete } = useModals();

  if (loading) return <Loading>Cargando usuarios</Loading>;

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

  return (
    <Page
      title="Vendedores"
      heading="Vendedores"
      action={
        <ButtonIconAdd outline onClick={onAdd} label="Agregar">
          Agregar
        </ButtonIconAdd>
      }
      error={error}
    >
      <Table striped hover size="sm" responsive>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>E-mail</th>
            <th />
          </tr>
        </thead>
        <tbody>{(users || []).map(rowUser)}</tbody>
      </Table>
    </Page>
  );
};

export default ListUsers;
