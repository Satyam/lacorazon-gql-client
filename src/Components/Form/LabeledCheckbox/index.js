import React from 'react';
import { FormGroup, Label, Col } from 'reactstrap';
import { MdCheckBox, MdCheckBoxOutlineBlank } from 'react-icons/md';
import classNames from 'classnames';

export default function LabeledCheckbox({
  label,
  value,
  checked,
  className,
  ...rest
}) {
  return (
    <FormGroup row className={className}>
      <Label xs={12} lg={2}>
        {label}
      </Label>
      <Col xs={12} lg={8}>
        <div className={classNames('form-control', 'border-0')} {...rest}>
          {value | checked ? <MdCheckBox /> : <MdCheckBoxOutlineBlank />}
        </div>
      </Col>
    </FormGroup>
  );
}
