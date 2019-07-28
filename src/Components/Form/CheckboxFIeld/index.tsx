import React, { useState } from 'react';
import {
  FormGroup,
  Label,
  FormFeedback,
  FormText,
  Col,
  Input,
} from 'reactstrap';
import { ErrorMessage, useField, useFormikContext } from 'formik';
import invariant from 'invariant';

let counter = 0;
/**
 * Produces a labeled input box within form
 */
const CheckboxField: React.FC<{
  name: string;
  label?: string;
  id?: string;
  rows?: number;
  help?: string;
}> = ({ name, label, id, rows, help, ...rest }) => {
  invariant(name, 'CheckboxField: name argument is mandatory');

  const [{ value, onChange, ...fieldProps }, meta] = useField(name);
  const { setFieldValue } = useFormikContext<any>();
  const [actualId] = useState(id || `F_TF_${counter}`);
  counter = (counter + 1) % Number.MAX_SAFE_INTEGER;

  return (
    <FormGroup row>
      <Label for={actualId} xs={12} lg={2}>
        {label}
      </Label>
      <Col xs={12} lg={8}>
        <Input
          type="checkbox"
          invalid={meta.touched && !!meta.error}
          id={actualId}
          style={{ marginLeft: '0' }}
          checked={value}
          onChange={ev => setFieldValue(name, ev.target.checked)}
          {...fieldProps}
          {...rest}
        />
        {help && <FormText>{help}</FormText>}
        <ErrorMessage name={name} component={FormFeedback} />
      </Col>
    </FormGroup>
  );
};

export default CheckboxField;
