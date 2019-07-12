import React, { useEffect } from 'react';
import useReactRouter from 'use-react-router';
import { useMutation } from '@apollo/react-hooks';
import useManualQuery from 'Components/useManualQuery';

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
  DISTRIBUIDORES_QUERY,
} from 'Gql/distribuidores';

import distribuidorSchema from 'ValidationSchemas/distribuidor';

export default function EditDistribuidor({ id }) {
  const { history } = useReactRouter();
  const [queryDistribuidor, queryStatus] = useManualQuery(DISTRIBUIDOR_QUERY);
  const [createDistribuidor, createStatus] = useMutation(CREATE_DISTRIBUIDOR);
  const [updateDistribuidor, updateStatus] = useMutation(UPDATE_DISTRIBUIDOR);
  const [deleteDistribuidor, deleteStatus] = useMutation(DELETE_DISTRIBUIDOR);

  useEffect(() => {
    if (id) queryDistribuidor({ id });
  }, [id, queryDistribuidor]);

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
    return <Loading title="Distribuidores" />;
  }

  const { distribuidor } = queryStatus.data;
  if (id && !distribuidor) {
    return (
      <Alert color="danger">El distribuidor no existe o fue borrado</Alert>
    );
  }
  return (
    <Page
      title={`Distribuidor - ${distribuidor ? distribuidor.nombre : 'nuevo'}`}
      heading={`${id ? 'Edit' : 'Add'} Distribuidor`}
    >
      <Form
        values={distribuidor}
        onSubmit={values => {
          if (id) {
            updateDistribuidor({
              variables: { id, ...values },
            }).then(() => queryDistribuidor({ id }));
          } else {
            createDistribuidor({
              variables: values,
              update: (cache, { data }) => {
                const cached = cache.readQuery({
                  query: DISTRIBUIDORES_QUERY,
                });
                cached.distribuidores.push({
                  entregados: 0,
                  existencias: 0,
                  ...data.createDistribuidor,
                });
                cached.distribuidores.sort((a, b) => {
                  if (a.nombre < b.nombre) return -1;
                  if (a.nombre > b.nombre) return 1;
                  return 0;
                });
                cache.writeQuery({
                  query: DISTRIBUIDORES_QUERY,
                  data: cached,
                });
              },
            }).then(({ data }) => {
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
              deleteDistribuidor({
                variables: { id },
                update: cache => {
                  const cached = cache.readQuery({
                    query: DISTRIBUIDORES_QUERY,
                  });

                  cache.writeQuery({
                    query: DISTRIBUIDORES_QUERY,
                    data: {
                      distribuidores: cached.distribuidores.filter(
                        d => d.id !== id
                      ),
                    },
                  });
                },
              }).then(() => history.replace('/distribuidores'));
            }}
          >
            Borrar
          </ButtonIconDelete>
        </ButtonSet>
      </Form>
    </Page>
  );
}
