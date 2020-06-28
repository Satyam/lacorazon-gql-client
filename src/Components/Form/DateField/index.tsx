import React, { useEffect, useState } from 'react';
import { FormGroup, Label, FormFeedback, FormText, Col } from 'reactstrap';
import { Controller, useFormContext } from 'react-hook-form';
import invariant from 'invariant';
import ReactDatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';
import classNames from 'classnames';

import { useIntl } from 'Providers/Intl';

let counter = 0;

const DateField: React.FC<{
  name: string;
  label?: string;
  id?: string;
  help?: string;
  className?: string;
  minDate?: Date;
  maxDate?: Date;
}> & { whyDidYouRender: boolean } = ({
  name,
  label,
  help,
  className,
  id,
  minDate,
  maxDate,
  ...rest
}) => {
  invariant(name, 'DateField: name argument is mandatory');

  const { locale } = useIntl();
  const { errors, getValues, control } = useFormContext();

  const [actualId, setActualId] = useState(id || `F_DF_${counter}`);

  // I'm using setActualId as a means of forcing a
  // refresh of the component so it takes the new locale
  // In the end, it doesn't really changes the id at all.
  useEffect(() => setActualId((id) => id), [locale]);

  counter = (counter + 1) % Number.MAX_SAFE_INTEGER;

  let actualMin = minDate;
  let actualMax = maxDate;

  // if (validationSchema) {
  //   const tests = validationSchema.fields[name].tests;
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
        <Controller
          as={
            <ReactDatePicker
              className={classNames('form-control', className, {
                'is-invalid': !!errors[name],
              })}
              onChange={() => null}
              dateFormat="P"
              id={actualId}
              minDate={actualMin}
              maxDate={actualMax}
              {...rest}
            />
          }
          name={name}
          control={control}
          valueName="selected" // DateSelect value's name is selected
          defaultValue={getValues(name)}
          onChange={([selected]: Date[]) => {
            return selected;
          }}
        />
        {help && <FormText>{help}</FormText>}
        <FormFeedback>{errors[name]?.message}</FormFeedback>
      </Col>
    </FormGroup>
  );
};
DateField.whyDidYouRender = true;

export default DateField;
