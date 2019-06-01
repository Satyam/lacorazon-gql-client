import React from 'react';
import { Alert } from 'reactstrap';
import querystring from 'querystring';
import { useQuery } from 'graphql-hooks';

import Loading from 'Components/Loading';

import EditUser from './EditUser';
import ShowUser from './ShowUser';

import { USER_QUERY } from 'Gql/users';
export default function User({ match, location }) {
  const id = match.params.id;
  const edit = querystring.parse(location.search.substring(1)).edit;

  const { loading, error, data, refetch } = useQuery(USER_QUERY, {
    variables: {
      id,
    },
  });

  if (loading) return <Loading title="Usuario" />;
  if (error)
    return `Something Bad Happened:
     ${error}`;
  const user = data.user;
  if (user) {
    return edit || !id ? (
      <EditUser id={id} user={user} refetch={refetch} />
    ) : (
      <ShowUser id={id} user={user} />
    );
  } else {
    return <Alert color="danger">El usuario no existe o fue borrado</Alert>;
  }
}
