import React from 'react';
import { Form as BSForm, Alert } from 'reactstrap';
import { Formik, FormikValues, FormikHelpers } from 'formik';
import { Schema } from 'yup';

const Form: React.FC<{
  schema?: Schema<any>;
  values?: FormikValues;
  onSubmit: (
    values: any,
    formikBag: FormikHelpers<FormikValues>
  ) => any | Promise<any>;
  formProps?: any;
}> = ({ schema, values, onSubmit, children, formProps, ...rest }) => (
  <Formik
    validationSchema={schema}
    initialValues={schema ? Object.assign(schema.default(), values) : values}
    onSubmit={(values, formikBag) => {
      const result = onSubmit(schema ? schema.cast(values) : values, formikBag);
      if (result && typeof result.then === 'function') {
        return result.catch((err: any) => {
          formikBag.setStatus(err);
        });
      }
      return result;
    }}
    {...rest}
  >
    {({ status, handleReset, handleSubmit }) => (
      <BSForm onSubmit={handleSubmit} onReset={handleReset} {...formProps}>
        {status && <Alert color="danger">{status}</Alert>}
        {children}
      </BSForm>
    )}
  </Formik>
);

export default Form;
