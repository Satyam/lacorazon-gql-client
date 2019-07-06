import React from 'react';
import useReactRouter from 'use-react-router';
import { useQuery, useMutation } from 'graphql-hooks';

import { Table } from 'reactstrap';
import { ButtonIconAdd } from 'Components/Icons';
import Loading from 'Components/Loading';
import Page from 'Components/Page';
import UserRow from './UserRow';

import { USERS_QUERY, DELETE_USER } from 'Gql/users';

export default function Users() {
  const { history } = useReactRouter();
  const { loading, error, data, refetch } = useQuery(USERS_QUERY);
  const [delUser, delStatus] = useMutation(DELETE_USER);

  if (loading || delStatus.loading) return <Loading title="Usuarios" />;
  if (error || delStatus.error) return 'Something Bad Happened';

  const users = data ? data.users : [];
  const deleteUser = id => {
    delUser({ variables: { id } }).then(refetch);
  };

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
    </Page>
  );
}
