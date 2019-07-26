import React from 'react';
import { Button } from 'reactstrap';
import { useFormikContext } from 'formik';
import { MyButtonProps } from 'Components/Icons';

const SubmitButton: React.FC<{
  component: React.ComponentType<MyButtonProps>;
}> = ({ component: Component = Button, ...rest }) => {
  const { isSubmitting, isValid, dirty } = useFormikContext();
  return (
    <Component
      type="submit"
      disabled={isSubmitting || !isValid || !dirty}
      {...rest}
    />
  );
};

export default SubmitButton;
