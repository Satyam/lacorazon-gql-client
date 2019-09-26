import React from 'react';
import { Alert } from 'reactstrap';
import { useParams } from 'react-router-dom';

import { LabeledText } from 'Components/Form';
import Page from 'Components/Page';
import { Loading } from 'Components/Modals';

import { useGetDistribuidor } from './actions';

export default function ShowDistribuidor() {
  const { id } = useParams<{ id: ID }>();
  const { loading, error, distribuidor } = useGetDistribuidor(id);
  if (loading) return <Loading>Cargando distribuidor</Loading>;

  return (
    <Page
      title={`Distribuidor - ${distribuidor ? distribuidor.nombre : '??'}`}
      heading={`Distribuidor`}
      error={error}
    >
      {distribuidor ? (
        <>
          <LabeledText label="Nombre" value={distribuidor.nombre} />
          <LabeledText label="eMail" value={distribuidor.email} />
          <LabeledText label="Localidad" value={distribuidor.localidad} />
          <LabeledText label="Dirección" value={distribuidor.direccion} pre />
          <LabeledText label="Contacto" value={distribuidor.contacto} />
          <LabeledText label="Teléfono" value={distribuidor.telefono} />
          <LabeledText label="Entregados" value={distribuidor.entregados} />
          <LabeledText label="Existencias" value={distribuidor.existencias} />
        </>
      ) : (
        <Alert color="danger">El distribuidor no existe o fue borrado</Alert>
      )}
    </Page>
  );
}
