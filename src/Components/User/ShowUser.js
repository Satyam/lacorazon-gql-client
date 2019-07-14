import React from 'react';

import { LabeledText } from 'Components/Form';
import Page from 'Components/Page';
import Loading from 'Components/Loading';
import { Alert } from 'reactstrap';
import GqlError from 'Components/GqlError';

import { useQueryUser } from './actions';

export default function ShowUser({ id }) {
  const { loading, error, data } = useQueryUser(id);
  if (loading) return <Loading>Cargando usuario</Loading>;

  if (data.user) {
    const { nombre, email } = data.user;
    return (
      <Page title={`Vendedor - ${nombre}`} heading={`Vendedor`}>
        <GqlError error={error}>
          <LabeledText label="Nombre" value={nombre} />
          <LabeledText label="eMail" value={email} />
        </GqlError>
      </Page>
    );
  } else {
    return (
      <GqlError error={error}>
        <Alert color="danger">El usuario no existe o fue borrado</Alert>
      </GqlError>
    );
  }
}
