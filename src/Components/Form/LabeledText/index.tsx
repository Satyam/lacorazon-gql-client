import React from 'react';
import { FormGroup, Label, Col } from 'reactstrap';
import classNames from 'classnames/bind';
import styles from './styles.module.css';

const cx = classNames.bind(styles);

const LabeledText: React.FC<{
  label: string;
  value: any;
  pre?: boolean;
  className?: string;
}> = ({ label, value, children, pre, className, ...rest }) => (
  <FormGroup row>
    <Label xs={12} lg={2}>
      {label}
    </Label>
    <Col xs={12} lg={8}>
      <div
        className={cx(
          'form-control',
          'readonly',
          { 'labeled-pre': pre },
          className
        )}
        {...rest}
      >
        {value}
        {children}
      </div>
    </Col>
  </FormGroup>
);

export default LabeledText;
