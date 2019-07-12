import React from 'react';
import { useQuery } from '@apollo/react-hooks';

import { LabeledText } from '../Form';
import Page from '../Page';
import Loading from 'Components/Loading';
import { Alert } from 'reactstrap';

import { DISTRIBUIDOR_QUERY } from 'Gql/distribuidores';

export default function ShowDistribuidor({ id }) {
  const { loading, error, data } = useQuery(DISTRIBUIDOR_QUERY, {
    variables: {
      id,
    },
  });
  if (loading) return <Loading>Cargando distribuidor</Loading>;
  if (error) {
    return 'Something Bad Happened';
  }
  if (data.distribuidor) {
    const {
      nombre,
      email,
      localidad,
      direccion,
      contacto,
      telefono,
    } = data.distribuidor;
    return (
      <Page title={`Distribuidor - ${nombre}`} heading={`Distribuidor`}>
        <LabeledText label="Nombre" value={nombre} />
        <LabeledText label="eMail" value={email} />
        <LabeledText label="Localidad" value={localidad} />
        <LabeledText label="Dirección" value={direccion} pre />
        <LabeledText label="Contacto" value={contacto} />
        <LabeledText label="Teléfono" value={telefono} />
      </Page>
    );
  } else {
    return (
      <Alert color="danger">El distribuidor no existe o fue borrado</Alert>
    );
  }
}
