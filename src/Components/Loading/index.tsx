import React from 'react';
import icon from './loading.gif';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import styles from './styles.module.css';

const Loading: React.FC<{
  title?: string;
  noIcon: boolean;
  isOpen?: boolean;
}> = ({
  title = 'Cargando ....',
  children,
  noIcon,
  isOpen = true,
  ...props
}) => (
  <Modal isOpen={isOpen} {...props}>
    <ModalHeader className={styles.header}>{title}</ModalHeader>
    <ModalBody className={styles.container}>
      {children}
      {!noIcon && <img className={styles.img} src={icon} alt="loading..." />}
    </ModalBody>
  </Modal>
);

export default Loading;
