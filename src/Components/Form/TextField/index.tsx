import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  FormGroup,
  Label,
  FormFeedback,
  FormText,
  Col,
  Input,
  InputProps,
} from 'reactstrap';
import { ErrorMessage, useField, FieldValidator } from 'formik';
import invariant from 'invariant';

let counter = 0;
/**
 * Produces a labeled input box within form
 */
const TextField: React.FC<
  {
    name: string;
    label?: string;
    id?: string;
    rows?: number;
    help?: string;
    validate?: FieldValidator;
  } & InputProps
> = ({ name, type, label, id, rows, help, validate, ...rest }) => {
  invariant(name, 'TextField: name argument is mandatory');

  const [fieldProps, meta] = useField({ name, validate });
  const [actualId] = useState(id || `F_TF_${counter}`);
  counter = (counter + 1) % Number.MAX_SAFE_INTEGER;

  return (
    <FormGroup row>
      <Label for={actualId} xs={12} lg={2}>
        {label}
      </Label>
      <Col xs={12} lg={8}>
        <Input
          type={type || (rows ? 'textarea' : 'text')}
          invalid={meta.touched && !!meta.error}
          rows={rows}
          id={actualId}
          {...fieldProps}
          {...rest}
        />
        {help && <FormText>{help}</FormText>}
        <ErrorMessage name={name} component={FormFeedback} />
      </Col>
    </FormGroup>
  );
};

TextField.propTypes = {
  /**
   * Name of the field this component is to show or edit.
   * It should match the key of one of the values in the
   * enclosing [`Form`](#form) `values` property.
   */
  name: PropTypes.string.isRequired,
  /**
   * The label to be shown to the user along the input box
   */
  label: PropTypes.string,
  /**
   * An optional `id` attribute.
   * If none is provided, the component will generate a unique one
   * so the `<label for="inputId">` element can match it
   */
  id: PropTypes.string,
  /**
   * If provided, a `<textarea>` will be produced with as many rows
   * as given, instead of a regular `<input>`box
   */
  rows: PropTypes.number,
  /**
   * An optional help text to be shown below the input field
   */
  help: PropTypes.string,
  /**
   * Any other properties will be passed on to the `<input>` or `<textarea>` elements
   */
  // '...rest': PropTypes.object,
};

export default TextField;
