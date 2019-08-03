import React from 'react';
import useReactRouter from 'use-react-router';
import { Alert } from 'reactstrap';
import { FormikHelpers } from 'formik';
import * as yup from 'yup';

import Loading from 'Components/Loading';
import { Form, TextField, SubmitButton } from 'Components/Form';
import Page from 'Components/Page';
import { ButtonIconAdd, ButtonIconDelete, ButtonSet } from 'Components/Icons';
import { usePopups } from 'Components/Popups';

import {
  useGetUser,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
  UserType,
} from './actions';

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

export default function EditUser() {
  const { history, match } = useReactRouter<{ id: string }>();
  const id = match.params.id;
  const { loading, error, user } = useGetUser(id);
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();
  const { openLoading, closeLoading, confirmDelete } = usePopups();

  if (loading) return <Loading>Cargando usuario</Loading>;

  const onDeleteClick = (ev: React.MouseEvent<HTMLButtonElement>) => {
    ev.stopPropagation();
    const { nombre, id } = ev.currentTarget.dataset;
    confirmDelete(`al usuario ${nombre}`, () =>
      deleteUser(id as string).then(() => history.replace('/users'))
    );
  };

  const onSubmit = (
    values: UserType,
    { setFieldError }: FormikHelpers<UserType>
  ) => {
    if (id) {
      openLoading('Actualizando usuario');
      return updateUser(id, values)
        .catch(err => {
          if (
            err.message ===
            'GraphQL error: SQLITE_CONSTRAINT: UNIQUE constraint failed: Users.nombre'
          ) {
            setFieldError('nombre', 'Ese usuario ya existe');
          } else throw err;
        })
        .finally(closeLoading);
    } else {
      openLoading('Creando usuario');
      return createUser({ ...values, password: values.nombre })
        .then(id => {
          history.replace(`/user/edit/${id}`);
        })
        .catch(err => {
          if (
            err.message ===
            'GraphQL error: SQLITE_CONSTRAINT: UNIQUE constraint failed: Users.nombre'
          ) {
            setFieldError('nombre', 'Ese usuario ya existe');
          } else throw err;
        })
        .finally(closeLoading);
    }
  };

  return (
    <Page
      title={`Vendedor - ${user ? user.nombre : 'nuevo'}`}
      heading={`${id ? 'Edit' : 'Add'} Vendedor`}
      error={error}
    >
      {id && !user ? (
        <Alert color="danger">El usuario no existe o fue borrado</Alert>
      ) : (
        <Form values={user} onSubmit={onSubmit} schema={userSchema}>
          <TextField name="email" label="eMail" />
          <TextField name="nombre" label="Nombre" />
          <ButtonSet>
            <SubmitButton component={ButtonIconAdd}>
              {id ? 'Modificar' : 'Agregar'}
            </SubmitButton>
            {id && (
              <ButtonIconDelete
                data-id={id}
                data-nombre={user && user.nombre}
                onClick={onDeleteClick}
              >
                Borrar
              </ButtonIconDelete>
            )}
          </ButtonSet>
        </Form>
      )}
    </Page>
  );
}
