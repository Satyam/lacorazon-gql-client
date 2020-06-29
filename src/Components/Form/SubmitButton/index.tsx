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
    errors,
    formState: { isSubmitting, dirty },
  } = useFormContext();

  return (
    <Component
      type="submit"
      disabled={isSubmitting || !dirty || !!Object.keys(errors).length}
      {...rest}
    />
  );
};

export default SubmitButton;
