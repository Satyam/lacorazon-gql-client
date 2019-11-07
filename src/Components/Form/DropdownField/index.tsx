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

const DropdownField: React.FC<{
  name: string;
  optValue?: string;
  optLabel?: string;
  options: { [index: string]: string | number }[];
  noOption: boolean;
  label?: string;
  id?: string;
  rows?: number;
  help?: string;
  validate?: FieldValidator;
}> = ({
  name,
  label,
  id,
  options,
  optValue = 'id',
  optLabel = 'nombre',
  help,
  noOption,
  validate,
  ...rest
}) => {
  invariant(name, 'DropdownField: name argument is mandatory');
  invariant(options, 'DropdownField: options argument is mandatory');

  const [actualId] = useState(id || `F_DDF_${counter}`);
  counter = (counter + 1) % Number.MAX_SAFE_INTEGER;

  return (
    <Field name={name} validate={validate}>
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
              type="select"
              invalid={!!meta.error && meta.touched}
              name={name}
              id={actualId}
              {...field}
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
            </Input>

            {help && <FormText>{help}</FormText>}
            <ErrorMessage name={name} component={FormFeedback} />
          </Col>
        </FormGroup>
      )}
    </Field>
  );
};

export default DropdownField;
