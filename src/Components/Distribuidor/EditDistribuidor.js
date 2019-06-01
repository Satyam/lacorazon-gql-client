import React from 'react';
import useReactRouter from 'use-react-router';
import { useMutation } from 'graphql-hooks';

import { Form, TextField, SubmitButton } from 'Components/Form';
import { ButtonIconAdd, ButtonIconDelete, ButtonSet } from 'Components/Icons';
import Loading from 'Components/Loading';
import Page from 'Components/Page';

import {
  CREATE_DISTRIBUIDOR,
  UPDATE_DISTRIBUIDOR,
  DELETE_DISTRIBUIDOR,
} from 'Gql/distribuidores';
import distribuidorSchema from 'ValidationSchemas/distribuidor';

export default function EditDistribuidor({ id, distribuidor, refetch }) {
  const { history } = useReactRouter();
  const [createDistribuidor, createStatus] = useMutation(CREATE_DISTRIBUIDOR);
  const [updateDistribuidor, updateStatus] = useMutation(UPDATE_DISTRIBUIDOR);
  const [deleteDistribuidor, deleteStatus] = useMutation(DELETE_DISTRIBUIDOR);

  const error = createStatus.error + updateStatus.error + deleteStatus.error;

  if (createStatus.loading + updateStatus.loading + deleteStatus.loading) {
    return <Loading title="Usuarios" />;
  }
  if (error)
    return `Something Bad Happened:
     ${error}`;

  return (
    <Page
      title={`Distribuidor - ${distribuidor ? distribuidor.nombre : 'nuevo'}`}
      heading={`${id ? 'Edit' : 'Add'} Distribuidor`}
    >
      <Form
        values={distribuidor}
        onSubmit={(values, { setFieldError }) =>
          (id
            ? updateDistribuidor({ variables: { id, ...values } })
            : createDistribuidor({ variables: values })
          ).then(({ response }) => {
            refetch();
            history.replace(`/distribuidor/${response.id}?edit=true`);
          })
        }
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
              deleteDistribuidor({ variables: { id } }).then(() =>
                history.replace('/distribuidores')
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
