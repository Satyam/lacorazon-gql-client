import React, { useEffect, useState } from 'react';
import { FormGroup, Label, FormFeedback, FormText, Col } from 'reactstrap';
import { ErrorMessage } from 'formik';
import invariant from 'invariant';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';
import classNames from 'classnames';

import { useFormik } from '../shared';
import { useIntl } from 'Components/intl';

let counter = 0;

export default function DateField({
  name,
  label,
  help,
  className,
  id,
  ...rest
}) {
  invariant(name, 'DateField: name argument is mandatory');

  const {
    values,
    errors,
    touched,
    registerField,
    unregisterField,
    setFieldTouched,
    setFieldValue,
    validationSchema,
  } = useFormik();
  const { locale } = useIntl();
  useEffect(() => {
    registerField(name, {
      props: {
        name,
        label,
        help,
        className,
        id,
        ...rest,
      },
    });
    return () =>
      unregisterField(name, {
        props: {
          name,
          label,
          help,
          className,
          id,
          ...rest,
        },
      });
  });

  const [actualId, setActualId] = useState(id || `F_DF_${counter}`);

  // I'm using setActualId as a means of forcing a
  // refresh of the component so it takes the new locale
  // In the end, it doesn't really changes the id at all.
  useEffect(() => setActualId(id => id), [locale]);

  counter = (counter + 1) % Number.MAX_SAFE_INTEGER;

  const invalid = errors[name] && touched[name];

  let actualMin = rest.minDate;
  let actualMax = rest.maxDate;

  if (validationSchema) {
    const tests = validationSchema.fields[name].tests;
    if (!actualMin) {
      const minTest = tests.filter(t => t.TEST_NAME === 'min')[0];
      if (minTest) {
        actualMin = minTest.TEST.params.min;
      }
    }
    if (!actualMax) {
      const maxTest = tests.filter(t => t.TEST_NAME === 'max')[0];
      if (maxTest) {
        actualMax = maxTest.TEST.params.max;
      }
    }
  }
  return (
    <FormGroup row>
      <Label for={actualId} xs={12} lg={2}>
        {label}
      </Label>
      <Col xs={12} lg={8}>
        <DatePicker
          className={classNames('form-control', className, {
            'is-invalid': invalid,
          })}
          dateFormat="P"
          name={name}
          id={actualId}
          minDate={actualMin}
          maxDate={actualMax}
          onChange={value => setFieldValue(name, value)}
          onBlur={() => setFieldTouched(name, true)}
          selected={values[name]}
          {...rest}
        />
        {help && <FormText>{help}</FormText>}
        <ErrorMessage
          name={name}
          component={FormFeedback}
          style={{ display: invalid ? 'block' : 'none' }}
        />
      </Col>
    </FormGroup>
  );
}
