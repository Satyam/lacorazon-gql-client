import React from 'react';
import { confirmAlert } from 'react-confirm-alert';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

export function confirmDelete(descr, fn) {
  confirmAlert({
    customUI: ({ onClose }) => {
      return (
        <Modal isOpen>
          <ModalHeader
            style={{ backgroundColor: 'var(--primary)', color: 'var(--light)' }}
          >
            Confirmación borrado
          </ModalHeader>
          <ModalBody
            style={{ width: '100%', textAlign: 'center', padding: '2em' }}
          >
            {`¿Está seguro que desea borrar ${descr} ?`}
          </ModalBody>
          <ModalFooter>
            <Button
              outline
              color="danger"
              onClick={() => {
                fn();
                onClose();
              }}
            >
              Sí
            </Button>
            <Button outline onClick={onClose}>
              No
            </Button>
          </ModalFooter>
        </Modal>
      );
    },
  });
}
