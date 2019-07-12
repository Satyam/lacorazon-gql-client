import React from 'react';
import useReactRouter from 'use-react-router';
import { useMutation, useQuery } from '@apollo/react-hooks';

import { Alert } from 'reactstrap';
import Loading from 'Components/Loading';
import { Form, TextField, SubmitButton } from 'Components/Form';
import Page from 'Components/Page';
import GqlError from 'Components/GqlError';
import { ButtonIconAdd, ButtonIconDelete, ButtonSet } from 'Components/Icons';

import {
  USER_QUERY,
  CREATE_USER,
  UPDATE_USER,
  DELETE_USER,
  USERS_QUERY,
} from 'Gql/users';
import userSchema from 'ValidationSchemas/user';

export default function EditUser({ id }) {
  const { history } = useReactRouter();
  const { loading, error, data } = useQuery(USER_QUERY, {
    variables: {
      id,
    },
    skip: !id,
  });
  const [createUser, createStatus] = useMutation(CREATE_USER);
  const [updateUser, updateStatus] = useMutation(UPDATE_USER);
  const [deleteUser, deleteStatus] = useMutation(DELETE_USER);

  if (loading) return <Loading>Cargando usuario</Loading>;
  if (createStatus.loading) return <Loading>Creando usuario</Loading>;
  if (updateStatus.loading) return <Loading>Actualizando usuario</Loading>;
  if (deleteStatus.loading) return <Loading>Borrando usuario</Loading>;

  const user = (data && data.user) || {};

  if (id && !user) {
    return (
      <GqlError error={[error, createStatus, updateStatus, deleteStatus]}>
        <Alert color="danger">El usuario no existe o fue borrado</Alert>
      </GqlError>
    );
  }
  return (
    <Page
      title={`Vendedor - ${user ? user.nombre : 'nuevo'}`}
      heading={`${id ? 'Edit' : 'Add'} Vendedor`}
    >
      <GqlError error={[error, createStatus, updateStatus, deleteStatus]}>
        <Form
          values={user}
          onSubmit={values => {
            if (id) {
              updateUser({ variables: { id, ...values } });
            } else {
              createUser({
                variables: { ...values, password: values.nombre },
                update: (cache, { data }) => {
                  const cached = cache.readQuery({
                    query: USERS_QUERY,
                  });
                  cached.user.push(data.createUser);
                  cached.user.sort((a, b) => {
                    if (a.nombre < b.nombre) return -1;
                    if (a.nombre > b.nombre) return 1;
                    return 0;
                  });
                  cache.writeQuery({
                    query: USERS_QUERY,
                    data: cached,
                  });
                },
              }).then(({ data }) => {
                history.replace(`/user/${data.createUser.id}?edit=true`);
              });
            }
          }}
          schema={userSchema}
        >
          <TextField name="email" label="eMail" />
          <TextField name="nombre" label="Nombre" />
          <ButtonSet>
            <SubmitButton component={ButtonIconAdd}>
              {id ? 'Modificar' : 'Agregar'}
            </SubmitButton>
            <ButtonIconDelete
              disabled={!id}
              onClick={() => {
                deleteUser({
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
                }).then(() => history.replace('/users'));
              }}
            >
              Borrar
            </ButtonIconDelete>
          </ButtonSet>
        </Form>
      </GqlError>
    </Page>
  );
}
