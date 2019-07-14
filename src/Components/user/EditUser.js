import React from 'react';
import useReactRouter from 'use-react-router';

import { Alert } from 'reactstrap';
import Loading from 'Components/Loading';
import { Form, TextField, SubmitButton } from 'Components/Form';
import Page from 'Components/Page';
import GqlError from 'Components/GqlError';
import { ButtonIconAdd, ButtonIconDelete, ButtonSet } from 'Components/Icons';

import {
  useQueryUser,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
} from './queries';

import userSchema from 'ValidationSchemas/user';

export default function EditUser({ id }) {
  const { history } = useReactRouter();
  const { loading, error, data } = useQueryUser(id);
  const [createUser, createStatus] = useCreateUser();
  const [updateUser, updateStatus] = useUpdateUser();
  const [deleteUser, deleteStatus] = useDeleteUser();

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
              updateUser(id, values);
            } else {
              createUser({ ...values, password: values.nombre }).then(
                ({ data }) => {
                  history.replace(`/user/${data.createUser.id}?edit=true`);
                }
              );
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
                deleteUser(id).then(() => history.replace('/users'));
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