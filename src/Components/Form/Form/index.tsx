import React, { useState } from 'react';
import { Form as BSForm, Alert } from 'reactstrap';
import {
  useForm,
  FormContext,
  FormContextValues,
  UseFormOptions,
  ValidationResolver,
} from 'react-hook-form';

export default function Form<V extends Record<string, any>>({
  mode,
  reValidateMode,
  defaultValues,
  validationSchema, // Note: will be deprecated in the next major version with validationResolver
  validationResolver,
  validationContext,
  validateCriteriaMode,
  submitFocusError,
  onSubmit,
  children,
  inline,
  className,
  ...rest
}: UseFormOptions<V> & {
  validationResolver?: ValidationResolver<V>;
  onSubmit: (
    values: V,
    formContext: FormContextValues<V>
  ) => Promise<void> | void;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}): React.ReactElement {
  const methods = useForm<V>({
    defaultValues: (validationSchema
      ? Object.assign(validationSchema.default(), defaultValues)
      : defaultValues) as V,
    validationSchema,
    mode,
    reValidateMode,
    validationResolver,
    validationContext,
    validateCriteriaMode,
    submitFocusError,
  });

  const [status, setStatus] = useState<string | undefined>();

  const mySubmit = (values: V) => {
    const result = onSubmit(values as V, methods);
    if (result instanceof Promise) {
      return result.catch((err: any) => {
        setStatus(err);
      });
    }
    return;
  };
  return (
    <FormContext {...methods}>
      <BSForm
        onSubmit={methods.handleSubmit(mySubmit)}
        onReset={() => methods.reset()}
        inline={inline}
        className={className}
        {...rest}
      >
        {status && <Alert color="danger">{status}</Alert>}
        {children}
      </BSForm>
    </FormContext>
  );
}
