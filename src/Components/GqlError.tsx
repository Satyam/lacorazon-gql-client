import React from 'react';
import { Alert } from 'reactstrap';
import { ApolloError } from '@apollo/client';

const GqlError: React.FC<{
  error?: ApolloError | (ApolloError | undefined)[];
}> = ({ error, children }) => {
  const errors = Array.isArray(error) ? error : [error];
  const msgs = errors.map((e) => e && e.message).filter((m) => !!m);
  return (
    <>
      {msgs.length
        ? msgs.map((m, i) => (
            <Alert color="danger" key={i}>
              {m}
            </Alert>
          ))
        : children}{' '}
    </>
  );
};

export default GqlError;
