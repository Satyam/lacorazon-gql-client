import React from 'react';
import { Button } from 'reactstrap';
import { MyButtonProps } from 'Components/Icons';
import { useFormContext } from 'react-hook-form';

const SubmitButton: React.FC<
  MyButtonProps & {
    component?: React.ComponentType<MyButtonProps>;
  }
> = ({ component: Component = Button, ...rest }) => {
  const {
    formState: { isSubmitting, isValid, dirty },
  } = useFormContext();
  return (
    <Component
      type="submit"
      disabled={isSubmitting || !isValid || !dirty}
      {...rest}
    />
  );
};

export default SubmitButton;
