import React, { useState, useEffect } from 'react';
import useReactRouter from 'use-react-router';
import { useMutation, useApolloClient } from '@apollo/react-hooks';

import { Alert } from 'reactstrap';
import { Form, TextField, SubmitButton } from 'Components/Form';
import { ButtonIconAdd, ButtonIconDelete, ButtonSet } from 'Components/Icons';
import Loading from 'Components/Loading';
import Page from 'Components/Page';

import {
  DISTRIBUIDOR_QUERY,
  CREATE_DISTRIBUIDOR,
  UPDATE_DISTRIBUIDOR,
  DELETE_DISTRIBUIDOR,
} from 'Gql/distribuidores';

import distribuidorSchema from 'ValidationSchemas/distribuidor';

export default function EditDistribuidor({ id }) {
  const { history } = useReactRouter();
  const client = useApolloClient();
  const [createDistribuidor, createStatus] = useMutation(CREATE_DISTRIBUIDOR);
  const [updateDistribuidor, updateStatus] = useMutation(UPDATE_DISTRIBUIDOR);
  const [deleteDistribuidor, deleteStatus] = useMutation(DELETE_DISTRIBUIDOR);

  const [distribuidor, setDistribuidor] = useState({});
  const [queryLoading, setQueryLoading] = useState(false);

  useEffect(() => {
    if (id) {
      setQueryLoading(true);
      client
        .query({
          query: DISTRIBUIDOR_QUERY,
          variables: {
            id,
          },
        })
        .then(({ data }) => {
          setQueryLoading(true);
          setDistribuidor(data.distribuidor);
        });
    }
  }, [id, client]);

  if (createStatus.error || updateStatus.error || deleteStatus.error)
    return 'Something Bad Happened';

  if (
    queryLoading ||
    createStatus.loading ||
    updateStatus.loading ||
    deleteStatus.loading
  ) {
    return <Loading title="Usuarios" />;
  }
  if (distribuidor) {
    return (
      <Page
        title={`Distribuidor - ${distribuidor ? distribuidor.nombre : 'nuevo'}`}
        heading={`${id ? 'Edit' : 'Add'} Distribuidor`}
      >
        <Form
          values={distribuidor}
          onSubmit={values => {
            if (id) {
              updateDistribuidor({ variables: { id, ...values } }).then(
                ({ data }) => {
                  setDistribuidor(data.updateDistribuidor);
                }
              );
            } else {
              createDistribuidor({ variables: values }).then(({ data }) => {
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
  } else {
    return (
      <Alert color="danger">El distribuidor no existe o fue borrado</Alert>
    );
  }
}
