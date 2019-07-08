import React from 'react';
import { Button } from 'reactstrap';
import { useFormik } from '../shared';

export default function SubmitButton({
  component: Component = Button,
  ...rest
}) {
  const { isSubmitting, isValid, dirty } = useFormik();
  return (
    <Component
      type="submit"
      disabled={isSubmitting || !isValid || !dirty}
      {...rest}
    />
  );
}
