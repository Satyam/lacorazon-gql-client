import React from 'react';
import { Button } from 'reactstrap';
import { useFormikContext } from 'formik';

export default function SubmitButton({
  component: Component = Button,
  ...rest
}) {
  const { isSubmitting, isValid, dirty } = useFormikContext();
  return (
    <Component
      type="submit"
      disabled={isSubmitting || !isValid || !dirty}
      {...rest}
    />
  );
}
