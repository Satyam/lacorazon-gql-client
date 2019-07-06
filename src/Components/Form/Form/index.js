import React from 'react';
import { Form as BSForm, Alert } from 'reactstrap';
import { Formik, Form as KForm } from 'formik';

export default function Form({
  schema,
  values,
  onSubmit,
  children,
  enableReinitialize = true,
  initialErrors = {},
  onReset,
  validate,
  validateOnBlur = true,
  validateOnChange = true,
  ...rest
}) {
  return (
    <Formik
      validationSchema={schema}
      initialValues={schema ? Object.assign(schema.default(), values) : values}
      onSubmit={(values, { setStatus, setSubmitting }) => {
        const result = onSubmit(schema ? schema.cast(values) : values);
        if (result && typeof result.then === 'function') {
          return result.catch(err => {
            setStatus(err);
          });
          // .finally(() => {
          //   console.log('onSubmit unset isSubmitting');
          //   setSubmitting(false);
          // });
        }
        return result;
      }}
      enableReinitialize={enableReinitialize}
      initialErrors={initialErrors}
      onReset={onReset}
      validate={validate}
      validateOnBlur={validateOnBlur}
      validateOnChange={validateOnChange}
    >
      {({ status }) => (
        <BSForm tag={KForm} {...rest}>
          {status && <Alert color="danger">{status}</Alert>}
          {children}
        </BSForm>
      )}
    </Formik>
  );
}
