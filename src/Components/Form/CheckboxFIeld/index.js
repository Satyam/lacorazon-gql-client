import React, { useState } from 'react';
import { FormGroup, Label, FormFeedback, FormText, Col } from 'reactstrap';
import { Field as KField, ErrorMessage } from 'formik';
import classNames from 'classnames';
import invariant from 'invariant';

import { useFormik } from '../shared';

let counter = 0;
/**
 * Produces a labeled input box within form
 */
export default function TextField({ name, label, id, rows, help, ...rest }) {
  invariant(name, 'TextField: name argument is mandatory');

  const { errors, touched } = useFormik();
  const invalid = errors[name] && touched[name];
  const [actualId] = useState(id || `F_TF_${counter}`);
  counter = (counter + 1) % Number.MAX_SAFE_INTEGER;

  return (
    <FormGroup row>
      <Label for={actualId} xs={12} lg={2}>
        {label}
      </Label>
      <Col xs={12} lg={8}>
        <KField
          as="input"
          type="checkbox"
          className={classNames('form-control', 'form-check', {
            'is-invalid': invalid,
          })}
          style={{
            height: 'auto',
            width: 'auto',
            margin: '0.5em 0',
          }}
          rows={rows}
          name={name}
          id={actualId}
          {...rest}
        />
        {help && <FormText>{help}</FormText>}
        <ErrorMessage name={name} component={FormFeedback} />
      </Col>
    </FormGroup>
  );
}
