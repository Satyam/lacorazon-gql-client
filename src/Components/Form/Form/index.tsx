import React from 'react';
import { Form as BSForm, Alert } from 'reactstrap';
import { Formik, Form as KForm, FormikValues } from 'formik';
import { Schema } from 'yup';

const Form: React.FC<{
  schema?: Schema<any>;
  values?: FormikValues;
  onSubmit: (values: any) => any | Promise<any>;
  formProps?: any;
}> = ({ schema, values, onSubmit, children, formProps, ...rest }) => (
  <Formik
    validationSchema={schema}
    initialValues={schema ? Object.assign(schema.default(), values) : values}
    onSubmit={(values, { setStatus }) => {
      const result = onSubmit(schema ? schema.cast(values) : values);
      if (result && typeof result.then === 'function') {
        return result.catch((err: any) => {
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

export default Form;
