import React from 'react';
import useReactRouter from 'use-react-router';
import { RouteComponentProps } from 'react-router-dom';
import { Alert } from 'reactstrap';
import Loading from 'Components/Loading';
import { Form, TextField, SubmitButton } from 'Components/Form';
import Page from 'Components/Page';
import GqlError from 'Components/GqlError';
import { ButtonIconAdd, ButtonIconDelete, ButtonSet } from 'Components/Icons';
import { confirmDelete } from 'Components/shared';

import {
  useGetUser,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
  UserType,
} from './actions';

import * as yup from 'yup';

const userSchema = yup.object().shape({
  email: yup
    .string()
    .trim()
    .email()
    .default(''),
  nombre: yup
    .string()
    .trim()
    .default(''),
});

export default function EditUser({
  match,
}: RouteComponentProps<{ id: string }>) {
  const id = match.params.id;
  const { history } = useReactRouter();
  const { loading, error, user } = useGetUser(id);
  const [createUser, createStatus] = useCreateUser();
  const [updateUser, updateStatus] = useUpdateUser();
  const [deleteUser, deleteStatus] = useDeleteUser();

  if (loading) return <Loading>Cargando usuario</Loading>;
  if (createStatus.loading) return <Loading>Creando usuario</Loading>;
  if (updateStatus.loading) return <Loading>Actualizando usuario</Loading>;
  if (deleteStatus.loading) return <Loading>Borrando usuario</Loading>;

  return (
    <Page
      title={`Vendedor - ${user ? user.nombre : 'nuevo'}`}
      heading={`${id ? 'Edit' : 'Add'} Vendedor`}
    >
      <GqlError
        error={[
          error,
          createStatus.error,
          updateStatus.error,
          deleteStatus.error,
        ]}
      >
        {id && !user ? (
          <Alert color="danger">El usuario no existe o fue borrado</Alert>
        ) : (
          <Form
            values={user}
            onSubmit={(values: UserType) => {
              if (id) {
                return updateUser(id, values);
              } else {
                return createUser({ ...values, password: values.nombre }).then(
                  // https://github.com/apollographql/react-apollo/issues/2095
                  id => {
                    history.replace(`/user/edit/${id}`);
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
              {id && (
                <ButtonIconDelete
                  disabled={!id}
                  onClick={(ev: React.MouseEvent<HTMLButtonElement>) => {
                    ev.stopPropagation();
                    confirmDelete(`al usuario ${user && user.nombre}`, () =>
                      deleteUser(id).then(() => history.replace('/users'))
                    );
                  }}
                >
                  Borrar
                </ButtonIconDelete>
              )}
            </ButtonSet>
          </Form>
        )}
      </GqlError>
    </Page>
  );
}
