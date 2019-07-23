import React from 'react';
import { Button } from 'reactstrap';
import classNames from 'classnames/bind';
import {
  FaPlusCircle,
  FaRegTrashAlt,
  FaRegEdit,
  FaEye,
  FaCheckCircle,
  FaTimesCircle,
  FaCalendarAlt,
  FaExclamationCircle,
  FaExclamationTriangle,
} from 'react-icons/fa';

import styles from './styles.module.css';

const cx = classNames.bind(styles);

export const Icon = ({
  Component,
  color,
  button,
  disabled,
  className,
  onClick,
  ...props
}) => (
  <Component
    className={cx(className, {
      'active-icon': button && !disabled,
      [`icon-${color}`]: color,
      disabled: disabled,
    })}
    onClick={disabled ? undefined : onClick}
    {...props}
  />
);

export const IconAdd = ({ color = 'primary', ...props }) => (
  <Icon Component={FaPlusCircle} {...props} />
);

export const ButtonIconAdd = ({
  children,
  color = 'primary',
  title = 'Agregar',
  className,
  ...props
}) => (
  <Button color={color} className={className} title={title} {...props}>
    <FaPlusCircle />
    <span className={styles.label}>{children}</span>
  </Button>
);

export const IconDelete = ({ color = 'danger', ...props }) => (
  <Icon Component={FaRegTrashAlt} {...props} />
);

export const ButtonIconDelete = ({
  children,
  color = 'danger',
  title = 'Borrar',
  className,
  ...props
}) => (
  <Button color={color} className={className} title={title} {...props}>
    <FaRegTrashAlt />
    <span className={styles.label}>{children}</span>
  </Button>
);
export const IconEdit = ({ color = 'secondary', ...props }) => (
  <Icon Component={FaRegEdit} {...props} />
);

export const ButtonIconEdit = ({
  children,
  color = 'secondary',
  title = 'Modificar',
  className,
  ...props
}) => (
  <Button color={color} className={className} title={title} {...props}>
    <FaRegEdit />
    <span className={styles.label}>{children}</span>
  </Button>
);

export const IconView = ({ color = 'info', ...props }) => (
  <Icon Component={FaEye} {...props} />
);

export const ButtonIconView = ({
  children,
  color = 'info',
  title = 'Ver detalle',
  className,
  ...props
}) => (
  <Button color={color} className={className} title={title} {...props}>
    <FaEye />
    <span className={styles.label}>{children}</span>
  </Button>
);
export const IconCheck = ({ color = 'success', ...props }) => (
  <Icon Component={FaCheckCircle} {...props} />
);

export const ButtonIconCheck = ({
  children,
  color = 'success',

  className,
  ...props
}) => (
  <Button color={color} className={className} {...props}>
    <FaCheckCircle />
    <span className={styles.label}>{children}</span>
  </Button>
);
export const IconNotCheck = ({ color = 'danger', ...props }) => (
  <Icon Component={FaTimesCircle} {...props} />
);

export const ButtonIconNotCheck = ({
  children,
  color = 'warning',

  className,
  ...props
}) => (
  <Button color={color} className={className} {...props}>
    <FaTimesCircle />
    <span className={styles.label}>{children}</span>
  </Button>
);
export const IconCalendar = ({ color = 'secondary', ...props }) => (
  <Icon Component={FaCalendarAlt} {...props} />
);

export const ButtonIconCalendar = ({
  children,
  color = 'secondary',
  title = 'Calendario',
  className,
  ...props
}) => (
  <Button color={color} className={className} title={title} {...props}>
    <FaCalendarAlt />
    <span className={styles.label}>{children}</span>
  </Button>
);
export const IconWarning = ({ color = 'warning', ...props }) => (
  <Icon Component={FaExclamationTriangle} {...props} />
);

export const IconStop = ({ color = 'danger', ...props }) => (
  <Icon Component={FaExclamationCircle} {...props} />
);

export const ButtonSet = ({ className, children, size, ...rest }) => (
  <div className={cx('buttonSet', { [`btn-group-${size}`]: size }, className)}>
    {children}
  </div>
);
