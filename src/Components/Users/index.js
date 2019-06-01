import React from 'react';
import useReactRouter from 'use-react-router';
import { useQuery } from 'graphql-hooks';

import { Table } from 'reactstrap';
import { ButtonIconAdd } from 'Components/Icons';
import Loading from 'Components/Loading';
import Page from 'Components/Page';
import UserRow from './UserRow';

import { USERS_QUERY } from 'Gql/users';

export default function Users() {
  const { history } = useReactRouter();
  const { loading, error, data } = useQuery(USERS_QUERY);

  if (loading) return <Loading title="Usuarios" />;
  if (error)
    return `Something Bad Happened:
     ${error}`;

  const deleteUser = id => alert(`delete user ${id}`);

  return (
    <Page title="Vendedores" heading="Vendedores">
      <Table striped hover size="sm" responsive>
        <thead>
          <tr>
            <th>Alias</th>
            <th>Nombre</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {data.users.map(user =>
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
    </Page>
  );
}
