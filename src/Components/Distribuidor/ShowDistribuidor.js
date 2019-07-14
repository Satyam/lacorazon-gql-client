import React from 'react';

import { LabeledText } from 'Components/Form';
import Page from 'Components/Page';
import Loading from 'Components/Loading';
import { Alert } from 'reactstrap';
import GqlError from 'Components/GqlError';

import { useQueryDistribuidor } from './actions';

export default function ShowDistribuidor({ id }) {
  const { loading, error, data } = useQueryDistribuidor(id);
  if (loading) return <Loading>Cargando distribuidor</Loading>;

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
        <GqlError error={error}>
          <LabeledText label="Nombre" value={nombre} />
          <LabeledText label="eMail" value={email} />
          <LabeledText label="Localidad" value={localidad} />
          <LabeledText label="Dirección" value={direccion} pre />
          <LabeledText label="Contacto" value={contacto} />
          <LabeledText label="Teléfono" value={telefono} />
        </GqlError>
      </Page>
    );
  } else {
    return (
      <GqlError error={error}>
        <Alert color="danger">El distribuidor no existe o fue borrado</Alert>
      </GqlError>
    );
  }
}
