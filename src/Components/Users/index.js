import React from 'react';
import useReactRouter from 'use-react-router';
import { useQuery, useMutation } from '@apollo/react-hooks';

import { Table } from 'reactstrap';
import { ButtonIconAdd } from 'Components/Icons';
import Loading from 'Components/Loading';
import Page from 'Components/Page';
import GqlError from 'Components/GqlError';
import UserRow from './UserRow';

import { USERS_QUERY, DELETE_USER } from 'Gql/users';

export default function Users() {
  const { history } = useReactRouter();
  const { loading, error, data } = useQuery(USERS_QUERY);
  const [delUser, delStatus] = useMutation(DELETE_USER);

  if (loading) return <Loading>Cargando usuarios</Loading>;
  if (delStatus.loading) return <Loading>Borrando usuario</Loading>;

  const users = data ? data.users : [];
  const deleteUser = id => {
    delUser({
      variables: { id },
      update: cache => {
        const cached = cache.readQuery({
          query: USERS_QUERY,
        });

        cache.writeQuery({
          query: USERS_QUERY,
          data: {
            users: cached.users.filter(u => u.id !== id),
          },
        });
      },
    });
  };

  return (
    <Page title="Vendedores" heading="Vendedores">
      <GqlError error={[error, delStatus]}>
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
