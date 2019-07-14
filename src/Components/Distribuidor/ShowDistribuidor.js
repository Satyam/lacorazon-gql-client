import React from 'react';

import { LabeledText } from 'Components/Form';
import Page from 'Components/Page';
import Loading from 'Components/Loading';
import { Alert } from 'reactstrap';
import GqlError from 'Components/GqlError';

import { useGetDistribuidor } from './actions';

export default function ShowDistribuidor({ match }) {
  const id = match.params.id;
  const { loading, error, data } = useGetDistribuidor(id);
  if (loading) return <Loading>Cargando distribuidor</Loading>;

  const dist = data.distribuidor;

  return (
    <Page
      title={`Distribuidor - ${dist ? dist.nombre : '??'}`}
      heading={`Distribuidor`}
    >
      <GqlError error={error}>
        {dist ? (
          <>
            <LabeledText label="Nombre" value={dist.nombre} />
            <LabeledText label="eMail" value={dist.email} />
            <LabeledText label="Localidad" value={dist.localidad} />
            <LabeledText label="Dirección" value={dist.direccion} pre />
            <LabeledText label="Contacto" value={dist.contacto} />
            <LabeledText label="Teléfono" value={dist.telefono} />
          </>
        ) : (
          <Alert color="danger">El distribuidor no existe o fue borrado</Alert>
        )}
      </GqlError>
    </Page>
  );
}
