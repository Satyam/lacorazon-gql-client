import React, { useState, useEffect } from 'react';
import useReactRouter from 'use-react-router';
import { useMutation, useManualQuery } from 'graphql-hooks';

import { Alert } from 'reactstrap';
import Loading from 'Components/Loading';
import { Form, TextField, SubmitButton } from 'Components/Form';
import Page from 'Components/Page';
import { ButtonIconAdd, ButtonIconDelete, ButtonSet } from 'Components/Icons';

import { USER_QUERY, CREATE_USER, UPDATE_USER, DELETE_USER } from 'Gql/users';
import userSchema from 'ValidationSchemas/user';

export default function EditUser({ id }) {
  const { history } = useReactRouter();
  const [fetchUser, queryStatus] = useManualQuery(USER_QUERY);
  const [createUser, createStatus] = useMutation(CREATE_USER);
  const [updateUser, updateStatus] = useMutation(UPDATE_USER);
  const [deleteUser, deleteStatus] = useMutation(DELETE_USER);

  const [user, setUser] = useState({});

  useEffect(() => {
    if (id) {
      fetchUser({
        variables: {
          id,
        },
      }).then(({ data }) => setUser(data.user));
    }
    // useManualQuery always return a new fetchUser
    // https://github.com/nearform/graphql-hooks/issues/234
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (
    queryStatus.error ||
    createStatus.error ||
    updateStatus.error ||
    deleteStatus.error
  )
    return 'Something Bad Happened';

  if (
    queryStatus.loading ||
    createStatus.loading ||
    updateStatus.loading ||
    deleteStatus.loading
  ) {
    return <Loading title="Usuarios" />;
  }

  if (user) {
    return (
      <Page
        title={`Vendedor - ${user ? user.nombre : 'nuevo'}`}
        heading={`${id ? 'Edit' : 'Add'} Vendedor`}
      >
        <Form
          values={user}
          onSubmit={values => {
            if (id) {
              updateUser({ variables: { id, ...values } }).then(({ data }) => {
                setUser(data.updateUser);
              });
            } else {
              createUser({ variables: values }).then(({ data }) => {
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
                deleteUser({ variables: { id } }).then(() =>
                  history.replace('/users')
                );
              }}
            >
              Borrar
            </ButtonIconDelete>
          </ButtonSet>
        </Form>
      </Page>
    );
  } else {
    return <Alert color="danger">El usuario no existe o fue borrado</Alert>;
  }
}
