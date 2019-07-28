import React from 'react';
import { FormGroup, Label, Col } from 'reactstrap';
import { FaRegCheckSquare, FaRegSquare } from 'react-icons/fa';
import classNames from 'classnames';

const LabeledCheckbox: React.FC<{
  label: string;
  value?: any;
  checked?: boolean;
  className?: string;
}> = ({ label, value, checked, className, ...rest }) => (
  <FormGroup row className={className}>
    <Label xs={12} lg={2}>
      {label}
    </Label>
    <Col xs={12} lg={8}>
      <div
        style={{ backgroundColor: 'var(--light)' }}
        className={classNames('form-control', 'border-0')}
        {...rest}
      >
        {value || checked ? <FaRegCheckSquare /> : <FaRegSquare />}
      </div>
    </Col>
  </FormGroup>
);

export default LabeledCheckbox;
