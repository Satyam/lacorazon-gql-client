import React from 'react';
import querystring from 'querystring';

import EditDistribuidor from './EditDistribuidor';
import ShowDistribuidor from './ShowDistribuidor';

export default function Distribuidor({ match, location }) {
  const id = match.params.id;
  const edit = querystring.parse(location.search.substring(1)).edit;

  return edit || !id ? (
    <EditDistribuidor id={id} />
  ) : (
    <ShowDistribuidor id={id} />
  );
}
