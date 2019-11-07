import React, { useState } from 'react';
import {
  FormGroup,
  Label,
  FormFeedback,
  FormText,
  Col,
  Input,
} from 'reactstrap';
import {
  ErrorMessage,
  Field,
  FieldValidator,
  FieldInputProps,
  FieldMetaProps,
} from 'formik';
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
  validate?: FieldValidator;
}> = ({ name, label, id, help, validate, ...rest }) => {
  invariant(name, 'CheckboxField: name argument is mandatory');

  const [actualId] = useState(id || `F_TF_${counter}`);
  counter = (counter + 1) % Number.MAX_SAFE_INTEGER;

  return (
    <Field name={name} type="checkbox" validate={validate}>
      {({
        field,
        meta,
      }: {
        field: FieldInputProps<any>;
        meta: FieldMetaProps<any>;
      }) => (
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
              {...field}
              {...rest}
            />
            {help && <FormText>{help}</FormText>}
            <ErrorMessage name={name} component={FormFeedback} />
          </Col>
        </FormGroup>
      )}
    </Field>
  );
};

export default CheckboxField;
