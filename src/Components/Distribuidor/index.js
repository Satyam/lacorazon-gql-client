import React from 'react';
import { Alert } from 'reactstrap';
import querystring from 'querystring';
import { useQuery } from 'graphql-hooks';

import Loading from 'Components/Loading';
import EditDistribuidor from './EditDistribuidor';
import ShowDistribuidor from './ShowDistribuidor';

import { DISTRIBUIDOR_QUERY } from 'Gql/distribuidores';

export default function Distribuidor({ match, location }) {
  const id = match.params.id;
  const edit = querystring.parse(location.search.substring(1)).edit;
  const { loading, error, data, refetch } = useQuery(DISTRIBUIDOR_QUERY, {
    variables: {
      id,
    },
  });

  if (loading) return <Loading title="Distribuidor" />;
  if (error)
    return `Something Bad Happened:
     ${error}`;

  const distribuidor = data.distribuidor;
  if (distribuidor) {
    return edit || !id ? (
      <EditDistribuidor id={id} distribuidor={distribuidor} refetch={refetch} />
    ) : (
      <ShowDistribuidor distribuidor={distribuidor} />
    );
  } else {
    return (
      <Alert color="danger">El distribuidor no existe o fue borrado</Alert>
    );
  }
}
