import React, { useState, useContext, createContext, useCallback } from 'react';

import Loading from 'Components/Loading';

import ConfirmDelete from './ConfirmDelete';

type PopupsType = {
  openLoading: (message: string) => void;
  closeLoading: () => void;
  confirmDelete: (descr: string, fn: () => void) => void;
};

const notImplemented = () => {
  throw new Error('Popup Context not ready yet');
};

export const PopupsContext = createContext<PopupsType>({
  openLoading: notImplemented,
  closeLoading: notImplemented,
  confirmDelete: notImplemented,
});

export const PopupsProvider: React.FC<{}> = ({ children }) => {
  const [t, setLoading] = useState<string | undefined>(undefined);
  const [delParams, setDelParams] = useState<{
    descr?: string;
    fn?: () => void;
  }>({});

  const confirmDelete = useCallback(
    (descr: string, fn: () => void): void => {
      setDelParams({ descr, fn });
    },
    [setDelParams]
  );

  const onCloseConfirmDelete = useCallback(
    (result: boolean) => {
      setDelParams({});
      if (result && delParams.fn) delParams.fn();
    },
    [setDelParams, delParams]
  );

  return (
    <PopupsContext.Provider
      value={{
        openLoading: setLoading,
        closeLoading: () => setLoading(undefined),
        confirmDelete,
      }}
    >
      <Loading isOpen={!!t}>{t}</Loading>
      <ConfirmDelete descr={delParams.descr} onClose={onCloseConfirmDelete} />
      {children}
    </PopupsContext.Provider>
  );
};

export function usePopups() {
  return useContext(PopupsContext);
}
