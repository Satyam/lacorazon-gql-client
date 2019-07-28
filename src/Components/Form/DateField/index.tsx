import React, { useEffect, useState } from 'react';
import { FormGroup, Label, FormFeedback, FormText, Col } from 'reactstrap';
import { ErrorMessage, useField, useFormikContext } from 'formik';
import invariant from 'invariant';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';
import classNames from 'classnames';

import { useIntl } from 'Components/intl';

let counter = 0;

const DateField: React.FC<{
  name: string;
  label?: string;
  id?: string;
  help?: string;
  className?: string;
  minDate?: Date;
  maxDate?: Date;
}> = ({ name, label, help, className, id, minDate, maxDate, ...rest }) => {
  invariant(name, 'DateField: name argument is mandatory');

  const [{ value, onChange, ...fieldProps }, meta] = useField(name);

  const { setFieldValue, setFieldTouched } = useFormikContext<any>();
  const { locale } = useIntl();

  const [actualId, setActualId] = useState(id || `F_DF_${counter}`);

  // I'm using setActualId as a means of forcing a
  // refresh of the component so it takes the new locale
  // In the end, it doesn't really changes the id at all.
  useEffect(() => setActualId(id => id), [locale]);

  counter = (counter + 1) % Number.MAX_SAFE_INTEGER;

  let actualMin = minDate;
  let actualMax = maxDate;

  // if (schema) {
  //   const tests = schema.fields[name].tests;
  //   if (!actualMin) {
  //     const minTest = tests.filter(t => t.TEST_NAME === 'min')[0];
  //     if (minTest) {
  //       actualMin = minTest.TEST.params.min;
  //     }
  //   }
  //   if (!actualMax) {
  //     const maxTest = tests.filter(t => t.TEST_NAME === 'max')[0];
  //     if (maxTest) {
  //       actualMax = maxTest.TEST.params.max;
  //     }
  //   }
  // }
  return (
    <FormGroup row>
      <Label for={actualId} xs={12} lg={2}>
        {label}
      </Label>
      <Col xs={12} lg={8}>
        <DatePicker
          className={classNames('form-control', className, {
            'is-invalid': meta.touched && meta.error,
          })}
          dateFormat="P"
          id={actualId}
          onChange={date => setFieldValue(name, date)}
          minDate={actualMin}
          maxDate={actualMax}
          onBlur={() => setFieldTouched(name, true)}
          selected={value}
          {...fieldProps}
          {...rest}
        />
        {help && <FormText>{help}</FormText>}
        <ErrorMessage name={name} component={FormFeedback} />
      </Col>
    </FormGroup>
  );
};

export default DateField;
