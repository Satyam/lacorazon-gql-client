import React from 'react';
import useReactRouter from 'use-react-router';
import { useQuery, useMutation } from '@apollo/react-hooks';

import { Table } from 'reactstrap';
import { ButtonIconAdd } from 'Components/Icons';

import Loading from 'Components/Loading';
import Page from 'Components/Page';
import RowDistr from './RowDistr';

import { DISTRIBUIDORES_QUERY, DELETE_DISTRIBUIDOR } from 'Gql/distribuidores';

export default function Distribuidores() {
  const { history } = useReactRouter();
  const { loading, error, data, refetch } = useQuery(DISTRIBUIDORES_QUERY);
  const [delDistribuidor, delStatus] = useMutation(DELETE_DISTRIBUIDOR);

  if (loading || delStatus.loading) return <Loading title="Distribuidores" />;
  if (error || delStatus.error) return 'Something Bad Happened';

  const distribuidores = data ? data.distribuidores : [];
  const deleteDistribuidor = id => {
    delDistribuidor({ variables: { id } }).then(refetch);
  };

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
          {distribuidores.map(distribuidor =>
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
