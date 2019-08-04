import React, { useState, useContext, createContext, useCallback } from 'react';

import Loading from './Loading';

import ConfirmDelete from './ConfirmDelete';

type ModalsType = {
  openLoading: (message: string) => void;
  closeLoading: () => void;
  confirmDelete: (descr: string, fn: () => void) => void;
};

const notImplemented = () => {
  throw new Error('Popup Context not ready yet');
};

export const ModalsContext = createContext<ModalsType>({
  openLoading: notImplemented,
  closeLoading: notImplemented,
  confirmDelete: notImplemented,
});

export const ModalsProvider: React.FC<{}> = ({ children }) => {
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
    <ModalsContext.Provider
      value={{
        openLoading: setLoading,
        closeLoading: () => setLoading(undefined),
        confirmDelete,
      }}
    >
      <Loading isOpen={!!t}>{t}</Loading>
      <ConfirmDelete descr={delParams.descr} onClose={onCloseConfirmDelete} />
      {children}
    </ModalsContext.Provider>
  );
};

export function useModals() {
  return useContext(ModalsContext);
}
