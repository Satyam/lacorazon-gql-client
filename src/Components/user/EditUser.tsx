import React, { useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Alert } from 'reactstrap';
import * as yup from 'yup';

import { Form, TextField, SubmitButton } from 'Components/Form';
import Page from 'Components/Page';
import { ButtonIconAdd, ButtonIconDelete, ButtonSet } from 'Components/Icons';
import { Loading } from 'Components/Modals';
import { useModals } from 'Providers/Modals';

import {
  useGetUser,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
  UserType,
} from './actions';
import { useAuth0 } from 'Providers/Auth';
import { FormContextValues } from 'react-hook-form';

const userSchema = yup.object().shape({
  email: yup.string().trim().email().default(''),
  nombre: yup.string().trim().required().default(''),
});

export default function EditUser() {
  const history = useHistory();
  const { id } = useParams<{ id: ID }>();
  const { loading, error, user } = useGetUser(id);
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();
  const { openLoading, closeLoading, confirmDelete } = useModals();
  const [gqlErr, setGqlErr] = useState<string | false>(false);
  const { can } = useAuth0();

  if (loading) return <Loading>Cargando usuario</Loading>;

  const onDeleteClick: React.MouseEventHandler<HTMLButtonElement> = (ev) => {
    ev.stopPropagation();
    const { nombre, id } = ev.currentTarget.dataset;
    confirmDelete(`al usuario ${nombre}`, () =>
      deleteUser(id as string)
        .then(() => history.replace('/users'))
        .catch((err) => {
          if (err.message === 'GraphQL error: unauthorized') {
            setGqlErr('No está autorizado para borrar el usuario');
          } else throw err;
        })
    );
  };

  const onSubmit = async (
    values: UserType,
    formContext: FormContextValues
  ): Promise<void> => {
    if (id) {
      openLoading('Actualizando usuario');
      await updateUser(id, values)
        .catch((err) => {
          if (
            err.message ===
            'GraphQL error: SQLITE_CONSTRAINT: UNIQUE constraint failed: Users.nombre'
          ) {
            formContext.setError(
              'nombre',
              'duplicate',
              'Ese usuario ya existe'
            );
          } else throw err;
        })
        .finally(closeLoading);
    } else {
      openLoading('Creando usuario');
      await createUser({ ...values, password: values.nombre })
        .then((id) => {
          history.replace(`/user/edit/${id}`);
        })
        .catch((err) => {
          if (
            err.message ===
            'GraphQL error: SQLITE_CONSTRAINT: UNIQUE constraint failed: Users.nombre'
          ) {
            formContext.setError(
              'nombre',
              'duplicate',
              'Ese usuario ya existe'
            );
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
      <Alert color="danger" isOpen={!!gqlErr} toggle={() => setGqlErr(false)}>
        {gqlErr}
      </Alert>
      {id && !user ? (
        <Alert color="danger">El usuario no existe o fue borrado</Alert>
      ) : (
        <Form<UserType>
          values={user}
          onSubmit={onSubmit}
          validationSchema={userSchema}
        >
          <TextField name="nombre" label="Nombre" />
          <TextField name="email" label="eMail" />
          <ButtonSet>
            <SubmitButton component={ButtonIconAdd}>
              {id ? 'Modificar' : 'Agregar'}
            </SubmitButton>
            {id && can('user:delete') && (
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
