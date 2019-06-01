import React from 'react';
import useReactRouter from 'use-react-router';
import { useMutation } from 'graphql-hooks';

import { Form, TextField, SubmitButton } from 'Components/Form';
import Page from 'Components/Page';
import Loading from 'Components/Loading';
import { ButtonIconAdd, ButtonIconDelete, ButtonSet } from 'Components/Icons';

import { CREATE_USER, UPDATE_USER, DELETE_USER } from 'Gql/users';
import userSchema from 'ValidationSchemas/user';

export default function EditUser({ id, user, refetch }) {
  const { history } = useReactRouter();
  const [createUser, createStatus] = useMutation(CREATE_USER);
  const [updateUser, updateStatus] = useMutation(UPDATE_USER);
  const [deleteUser, deleteStatus] = useMutation(DELETE_USER);

  const error = createStatus.error + updateStatus.error + deleteStatus.error;

  if (createStatus.loading + updateStatus.loading + deleteStatus.loading) {
    return <Loading title="Usuarios" />;
  }
  if (error)
    return `Something Bad Happened:
     ${error}`;

  return (
    <Page
      title={`Vendedor - ${user ? user.nombre : 'nuevo'}`}
      heading={`${id ? 'Edit' : 'Add'} Vendedor`}
    >
      <Form
        values={user}
        onSubmit={(values, { setFieldError }) =>
          (id
            ? updateUser({ variables: { id, ...values } })
            : createUser({ variables: values })
          ).then(({ response }) => {
            refetch();
            history.replace(`/user/${response.id}?edit=true`);
          })
        }
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
}
