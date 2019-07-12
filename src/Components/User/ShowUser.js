import React from 'react';
import { useQuery } from '@apollo/react-hooks';

import { LabeledText } from 'Components/Form';
import Page from 'Components/Page';
import Loading from 'Components/Loading';
import { Alert } from 'reactstrap';
import GqlError from 'Components/GqlError';

import { USER_QUERY } from 'Gql/users';

export default function ShowUser({ id }) {
  const { loading, error, data } = useQuery(USER_QUERY, {
    variables: {
      id,
    },
  });
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
