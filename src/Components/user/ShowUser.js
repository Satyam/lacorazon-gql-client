import React from 'react';

import { LabeledText } from 'Components/Form';
import Page from 'Components/Page';
import Loading from 'Components/Loading';
import { Alert } from 'reactstrap';
import GqlError from 'Components/GqlError';

import ListVentas from 'Components/ventas/ListVentas';

import { useGetUser } from './actions';

export default function ShowUser({ match }) {
  const id = match.params.id;
  const { loading, error, data } = useGetUser(id);
  if (loading) return <Loading>Cargando usuario</Loading>;

  const user = data.user;
  return (
    <Page
      title={`Vendedor - ${user ? user.nombre : '??'}`}
      heading={`Vendedor`}
    >
      <GqlError error={error}>
        {user ? (
          <>
            <LabeledText label="Nombre" value={user.nombre} />
            <LabeledText label="eMail" value={user.email} />
            <ListVentas vendedor={id} wide />
          </>
        ) : (
          <Alert color="danger">El usuario no existe o fue borrado</Alert>
        )}
      </GqlError>
    </Page>
  );
}
