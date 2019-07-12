import { useState, useEffect } from 'react';
import { useApolloClient } from '@apollo/react-hooks';

export default function useManualQuery(query) {
  const client = useApolloClient();
  const IDLE = {
    loading: false,
    error: undefined,
    data: {},
  };
  const [status, setStatus] = useState(IDLE);
  const [variables, setVariables] = useState();

  useEffect(() => {
    if (variables) {
      setStatus({
        ...IDLE,
        loading: true,
      });
      client
        .query({
          query,
          variables,
        })
        .then(
          ({ data }) =>
            setStatus({
              ...IDLE,
              data,
            }),
          error => {
            setStatus({
              ...IDLE,
              error,
            });
          }
        );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, variables]);
  return [setVariables, status];
}
