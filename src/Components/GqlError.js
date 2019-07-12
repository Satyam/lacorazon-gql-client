import React from 'react';
import { Alert } from 'reactstrap';

export default function GqlError({ error, children }) {
  const errors = Array.isArray(error) ? error : [error];
  const msgs = errors
    .map(err => {
      const e = typeof err === 'object' ? err.error : err;
      return e && (typeof e === 'object' ? e.message : e);
    })
    .filter(m => !!m);
  return msgs.length
    ? msgs.map((m, i) => (
        <Alert color="danger" key={i}>
          {m}
        </Alert>
      ))
    : children;
}
