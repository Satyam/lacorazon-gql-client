import React, { useState } from 'react';
import { Form as BSForm, Alert } from 'reactstrap';
import {
  useForm,
  FormProvider,
  UseFormMethods,
  UseFormOptions,
  SubmitHandler,
} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers';
import invariant from 'invariant';
import { ObjectSchema } from 'yup';

export default function Form<V extends Record<string, any>>({
  mode,
  reValidateMode,
  defaultValues,
  schema,
  resolver,
  context,
  criteriaMode,
  shouldFocusError,
  onSubmit,
  children,
  inline,
  className,
  ...rest
}: UseFormOptions<V> & {
  schema?: ObjectSchema;
  onSubmit: (values: V, formMethods: UseFormMethods<V>) => Promise<void> | void;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}): React.ReactElement {
  const methods = useForm<V>({
    defaultValues: schema
      ? Object.assign(schema.default(), defaultValues)
      : defaultValues,
    resolver: schema ? yupResolver(schema) : resolver,
    mode,
    reValidateMode,
    context,
    criteriaMode,
    shouldFocusError,
  });
  invariant(
    typeof onSubmit === 'function',
    'Form should have an onSubmit function'
  );
  const [status, setStatus] = useState<string | undefined>();

  const mySubmit: SubmitHandler<V> = (values) => {
    const result = onSubmit(values as V, methods);
    if (result instanceof Promise) {
      return result.catch((err: any) => {
        setStatus(err);
      });
    }
    return;
  };
  return (
    <FormProvider {...methods}>
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
    </FormProvider>
  );
}
