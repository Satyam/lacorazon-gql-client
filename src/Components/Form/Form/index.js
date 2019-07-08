import React from 'react';
import { Form as BSForm, Alert } from 'reactstrap';
import { Formik, Form as KForm } from 'formik';

export default function Form({
  schema,
  values,
  onSubmit,
  children,
  formProps,
  ...rest
}) {
  return (
    <Formik
      validationSchema={schema}
      initialValues={schema ? Object.assign(schema.default(), values) : values}
      onSubmit={(values, { setStatus }) => {
        const result = onSubmit(schema ? schema.cast(values) : values);
        if (result && typeof result.then === 'function') {
          return result.catch(err => {
            setStatus(err);
          });
        }
        return result;
      }}
      {...rest}
    >
      {({ status }) => (
        <BSForm tag={KForm} {...formProps}>
          {status && <Alert color="danger">{status}</Alert>}
          {children}
        </BSForm>
      )}
    </Formik>
  );
}
