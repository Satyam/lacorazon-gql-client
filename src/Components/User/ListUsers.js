import React from 'react';
import useReactRouter from 'use-react-router';

import { Table } from 'reactstrap';
import { ButtonIconAdd } from 'Components/Icons';
import Loading from 'Components/Loading';
import Page from 'Components/Page';
import GqlError from 'Components/GqlError';
import UserRow from './UserRow';

import { useListUsers, useDeleteUser } from './actions';

export default function ListUsers() {
  const { history } = useReactRouter();
  const { loading, error, data } = useListUsers();
  const [deleteUser, deleteStatus] = useDeleteUser();

  if (loading) return <Loading>Cargando usuarios</Loading>;
  if (deleteStatus.loading) return <Loading>Borrando usuario</Loading>;

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
          <tbody>
            {users.map(user =>
              UserRow({
                user,
                history,
                deleteUser,
              })
            )}
          </tbody>
        </Table>
        <ButtonIconAdd
          outline
          onClick={() => {
            history.push(`/user`);
          }}
          label="Agregar"
        >
          Agregar
        </ButtonIconAdd>
      </GqlError>
    </Page>
  );
}
