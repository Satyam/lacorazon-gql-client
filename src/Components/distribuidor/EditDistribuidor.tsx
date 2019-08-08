import React from 'react';
import useReactRouter from 'use-react-router';
import { Alert } from 'reactstrap';
import { FormikHelpers } from 'formik';
import * as yup from 'yup';

import { Form, TextField, SubmitButton } from 'Components/Form';
import { ButtonIconAdd, ButtonIconDelete, ButtonSet } from 'Components/Icons';
import Page from 'Components/Page';
import { Loading } from 'Components/Modals';
import { useModals } from 'Providers/Modals';

import {
  useCreateDistribuidor,
  useDeleteDistribuidor,
  useUpdateDistribuidor,
  useGetDistribuidor,
  DistribuidorType,
} from './actions';

const distribuidorSchema = yup.object().shape({
  nombre: yup
    .string()
    .required()
    .trim()
    .default(''),
  localidad: yup
    .string()
    .trim()
    .default(''),
  contacto: yup
    .string()
    .trim()
    .default(''),
  telefono: yup
    .string()
    .trim()
    .matches(/[\d\s\-()]+/, { excludeEmptyString: true })
    .default(''),
  email: yup
    .string()
    .trim()
    .email()
    .default(''),
  direccion: yup
    .string()
    .trim()
    .default(''),
});

export default function EditDistribuidor() {
  const { history, match } = useReactRouter<{ id: ID }>();
  const id = match.params.id;
  const { loading, error, distribuidor } = useGetDistribuidor(id);

  const createDistribuidor = useCreateDistribuidor();
  const updateDistribuidor = useUpdateDistribuidor();
  const deleteDistribuidor = useDeleteDistribuidor();

  const { openLoading, closeLoading, confirmDelete } = useModals();

  if (loading) return <Loading>Cargando distribuidor</Loading>;

  const onDeleteClick = (ev: React.MouseEvent<HTMLButtonElement>) => {
    ev.stopPropagation();
    confirmDelete(
      `al distribuidor ${distribuidor && distribuidor.nombre}`,
      () =>
        deleteDistribuidor(id).then(() => history.replace('/distribuidores'))
    );
  };
  const onSubmit = (
    values: DistribuidorType,
    { setFieldError }: FormikHelpers<DistribuidorType>
  ) => {
    if (id) {
      openLoading('Actualizando Distribuidor');
      updateDistribuidor(id, values)
        .catch(err => {
          if (
            err.message ===
            'GraphQL error: SQLITE_CONSTRAINT: UNIQUE constraint failed: Users.nombre'
          ) {
            setFieldError('nombre', 'Ese distribuidor ya existe');
          } else throw err;
        })
        .finally(closeLoading);
    } else {
      openLoading('Creando distribuidor');
      createDistribuidor(values)
        .then(id => {
          history.replace(`/distribuidor/edit/${id}`);
        })
        .catch(err => {
          if (
            err.message ===
            'GraphQL error: SQLITE_CONSTRAINT: UNIQUE constraint failed: Users.nombre'
          ) {
            setFieldError('nombre', 'Ese distribuidor ya existe');
          } else throw err;
        })
        .finally(closeLoading);
    }
  };

  return (
    <Page
      title={`Distribuidor - ${distribuidor ? distribuidor.nombre : 'nuevo'}`}
      heading={`${id ? 'Edit' : 'Add'} Distribuidor`}
      error={error}
    >
      {id && !distribuidor ? (
        <Alert color="danger">El distribuidor no existe o fue borrado</Alert>
      ) : (
        <Form
          values={distribuidor}
          onSubmit={onSubmit}
          schema={distribuidorSchema}
        >
          <TextField name="nombre" label="Nombre" />
          <TextField name="email" label="eMail" />
          <TextField name="localidad" label="Localidad" />
          <TextField name="contacto" label="Contacto" />
          <TextField name="telefono" label="Teléfono" />
          <TextField name="direccion" label="Dirección" rows={5} />
          <ButtonSet>
            <SubmitButton component={ButtonIconAdd}>
              {id ? 'Modificar' : 'Agregar'}
            </SubmitButton>
            <ButtonIconDelete disabled={!id} onClick={onDeleteClick}>
              Borrar
            </ButtonIconDelete>
          </ButtonSet>
        </Form>
      )}
    </Page>
  );
}
