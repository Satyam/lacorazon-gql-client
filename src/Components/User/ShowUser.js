import React from 'react';
import { useQuery } from 'graphql-hooks';

import { LabeledText } from 'Components/Form';
import Page from 'Components/Page';
import Loading from 'Components/Loading';
import { Alert } from 'reactstrap';

import { USER_QUERY } from 'Gql/users';

export default function ShowUser({ id }) {
  const { loading, error, data } = useQuery(USER_QUERY, {
    variables: {
      id,
    },
  });
  if (loading) return <Loading title="Usuario" />;
  if (error) {
    return `Something Bad Happened:
     ${error}`;
  }
  if (data.user) {
    const { nombre, email } = data.user;
    return (
      <Page title={`Vendedor - ${nombre}`} heading={`Vendedor`}>
        <LabeledText label="Nombre" value={nombre} />
        <LabeledText label="eMail" value={email} />
      </Page>
    );
  } else {
    return <Alert color="danger">El usuario no existe o fue borrado</Alert>;
  }
}
