import React from 'react';
import useReactRouter from 'use-react-router';

import { Table } from 'reactstrap';
import { ButtonIconAdd } from 'Components/Icons';

import Loading from 'Components/Loading';
import Page from 'Components/Page';
import GqlError from 'Components/GqlError';

import TableRowDistribuidor from './TableRowDistribuidor';

import { useListDistribuidores, useDeleteDistribuidor } from './queries';

export default function ListDistribuidores() {
  const { history } = useReactRouter();
  const { loading, error, data } = useListDistribuidores();
  const [deleteDistribuidor, deleteStatus] = useDeleteDistribuidor();

  if (loading) return <Loading>Cargando distribuidores</Loading>;
  if (deleteStatus.loading) return <Loading>Borrando distribuidor</Loading>;

  const distribuidores = data ? data.distribuidores : [];

  return (
    <Page wide title="Distribuidores" heading="Distribuidores">
      <GqlError error={[error, deleteStatus]}>
        <Table striped hover size="sm" responsive>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Contacto</th>
              <th>Teléfono</th>
              <th>Dirección</th>
              <th>Localidad</th>
              <th>e-Mail</th>

              <th />
            </tr>
          </thead>
          <tbody>
            {distribuidores.map(distribuidor =>
              TableRowDistribuidor(distribuidor, history, deleteDistribuidor)
            )}
          </tbody>
        </Table>
        <ButtonIconAdd onClick={() => history.push('/distribuidor?edit=true')}>
          Agregar
        </ButtonIconAdd>
      </GqlError>
    </Page>
  );
}
