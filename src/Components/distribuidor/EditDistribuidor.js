import React from 'react';
import useReactRouter from 'use-react-router';

import { Alert } from 'reactstrap';
import { Form, TextField, SubmitButton } from 'Components/Form';
import { ButtonIconAdd, ButtonIconDelete, ButtonSet } from 'Components/Icons';
import Loading from 'Components/Loading';
import Page from 'Components/Page';
import GqlError from 'Components/GqlError';

import {
  useCreateDistribuidor,
  useDeleteDistribuidor,
  useUpdateDistribuidor,
  useGetDistribuidor,
} from './actions';

import distribuidorSchema from 'Components/distribuidor/validation';

export default function EditDistribuidor({ match }) {
  const id = match.params.id;
  const { history } = useReactRouter();
  const { loading, error, data } = useGetDistribuidor(id);

  const [createDistribuidor, createStatus] = useCreateDistribuidor();
  const [updateDistribuidor, updateStatus] = useUpdateDistribuidor();
  const [deleteDistribuidor, deleteStatus] = useDeleteDistribuidor();

  if (loading) return <Loading>Cargando distribuidor</Loading>;
  if (createStatus.loading) return <Loading>Creando distribuidor</Loading>;
  if (updateStatus.loading) return <Loading>Actualizando distribuidor</Loading>;
  if (deleteStatus.loading) return <Loading>Borrando distribuidor</Loading>;

  const distribuidor = (data && data.distribuidor) || {};
  return (
    <Page
      title={`Distribuidor - ${distribuidor ? distribuidor.nombre : 'nuevo'}`}
      heading={`${id ? 'Edit' : 'Add'} Distribuidor`}
    >
      <GqlError error={[error, createStatus, updateStatus, deleteStatus]}>
        {id && !distribuidor ? (
          <Alert color="danger">El distribuidor no existe o fue borrado</Alert>
        ) : (
          <Form
            values={distribuidor}
            onSubmit={values => {
              if (id) {
                updateDistribuidor(id, values);
              } else {
                createDistribuidor(values).then(({ data }) => {
                  history.replace(
                    `/distribuidor/${data.createDistribuidor.id}?edit=true`
                  );
                });
              }
            }}
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
              <ButtonIconDelete
                disabled={!id}
                onClick={() => {
                  deleteDistribuidor(id).then(() =>
                    history.replace('/distribuidores')
                  );
                }}
              >
                Borrar
              </ButtonIconDelete>
            </ButtonSet>
          </Form>
        )}
      </GqlError>
    </Page>
  );
}