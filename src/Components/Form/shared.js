import { useContext } from 'react';
import { FormikConsumer } from 'formik';

export function useFormik() {
  return useContext(FormikConsumer._context);
}
