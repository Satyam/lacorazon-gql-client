import React, { useState } from 'react';
import {
  FormGroup,
  Label,
  FormFeedback,
  FormText,
  Col,
  Input,
} from 'reactstrap';
import { useFormContext } from 'react-hook-form';
import invariant from 'invariant';

let counter = 0;
/**
 * Produces a labeled input box within form
 */
const CheckboxField: React.FC<{
  name: string;
  label?: string;
  id?: string;
  help?: string;
}> = ({ name, label, id, help, ...rest }) => {
  invariant(name, 'CheckboxField: name argument is mandatory');

  const [actualId] = useState(id || `F_TF_${counter}`);
  counter = (counter + 1) % Number.MAX_SAFE_INTEGER;
  const { register, errors } = useFormContext();

  return (
    <FormGroup row>
      <Label for={actualId} xs={12} lg={2}>
        {label}
      </Label>
      <Col xs={12} lg={8}>
        <Input
          type="checkbox"
          name={name}
          invalid={!!errors[name]}
          id={actualId}
          style={{ marginLeft: '0' }}
          innerRef={register}
          {...rest}
        />
        {help && <FormText>{help}</FormText>}
        <FormFeedback>{errors[name]?.message}</FormFeedback>
      </Col>
    </FormGroup>
  );
};

export default CheckboxField;
