import React, { useState } from 'react';
import { FormGroup, Label, FormFeedback, FormText, Col } from 'reactstrap';
import { Field as KField, ErrorMessage } from 'formik';
import classNames from 'classnames';
import invariant from 'invariant';

import { useFormik } from '../shared';

let counter = 0;

export default function DropdownField({
  name,
  label,
  id,
  options,
  optValue = 'id',
  optLabel = 'nombre',
  help,
  noOption,
  ...rest
}) {
  invariant(name, 'DropdownField: name argument is mandatory');
  invariant(options, 'DropdownField: options argument is mandatory');

  const { errors, touched } = useFormik();
  const invalid = errors[name] && touched[name];
  const [actualId] = useState(id || `F_DDF_${counter}`);
  counter = (counter + 1) % Number.MAX_SAFE_INTEGER;

  return (
    <FormGroup row>
      <Label for={actualId} xs={12} lg={2}>
        {label}
      </Label>
      <Col xs={12} lg={8}>
        <KField
          as={'select'}
          className={classNames('form-control', {
            'is-invalid': invalid,
          })}
          name={name}
          id={actualId}
          {...rest}
        >
          {noOption && (
            <option key=" " value="">
              {' '}
              ----{' '}
            </option>
          )}
          {options.map(o => (
            <option key={o[optValue]} value={o[optValue]}>
              {o[optLabel]}
            </option>
          ))}
        </KField>

        {help && <FormText>{help}</FormText>}
        <ErrorMessage name={name} component={FormFeedback} />
      </Col>
    </FormGroup>
  );
}
