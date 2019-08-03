import React, { useState, useContext, createContext, useCallback } from 'react';
import Loading from 'Components/Loading';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

import styles from './styles.module.css';

type PopupsType = {
  openLoading: (message: string) => void;
  closeLoading: () => void;
  confirmDelete: (descr: string, fn: () => void) => void;
};

export const PopupsContext = createContext<PopupsType>({
  openLoading: t => undefined,
  closeLoading: () => undefined,
  confirmDelete: () => undefined,
});

const ConfirmDelete: React.FC<{
  descr?: string;
  onClose: (result: boolean) => void;
}> = ({ descr, onClose }) => (
  <Modal isOpen={!!descr}>
    <ModalHeader className={styles.confirmDeleteHeader}>
      Confirmación borrado
    </ModalHeader>
    <ModalBody className={styles.confirmDeleteBody}>
      {`¿Está seguro que desea borrar ${descr} ?`}
    </ModalBody>
    <ModalFooter>
      <Button
        outline
        color="danger"
        onClick={() => {
          onClose(true);
        }}
      >
        Sí
      </Button>
      <Button outline onClick={() => onClose(false)}>
        No
      </Button>
    </ModalFooter>
  </Modal>
);

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
