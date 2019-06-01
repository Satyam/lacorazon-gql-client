import React from 'react';
import querystring from 'querystring';
import EditUser from './EditUser';
import ShowUser from './ShowUser';

export default function User({ match, location }) {
  const id = match.params.id;
  const edit = querystring.parse(location.search.substring(1)).edit;

  return edit || !id ? <EditUser id={id} /> : <ShowUser id={id} />;
}
