import React from 'react';
import useReactRouter from 'use-react-router';
import { useQuery } from 'graphql-hooks';

import { Table } from 'reactstrap';
import { ButtonIconAdd } from 'Components/Icons';

import Loading from 'Components/Loading';
import Page from 'Components/Page';
import RowDistr from './RowDistr';

import { DISTRIBUIDORES_QUERY } from 'Gql/distribuidores';
export default function Distribuidores() {
  const { history } = useReactRouter();
  const { loading, error, data } = useQuery(DISTRIBUIDORES_QUERY);

  if (loading) return <Loading title="Distribuidores" />;
  if (error)
    return `Something Bad Happened:
     ${error}`;

  const deleteDistribuidor = id => alert(`delete distribuidor ${id}`);
  return (
    <Page wide title="Distribuidores" heading="Distribuidores">
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
          {data.distribuidores.map(distribuidor =>
            RowDistr(distribuidor, history, deleteDistribuidor)
          )}
        </tbody>
      </Table>
      <ButtonIconAdd onClick={() => history.push('/distribuidor?edit=true')}>
        Agregar
      </ButtonIconAdd>
    </Page>
  );
}
