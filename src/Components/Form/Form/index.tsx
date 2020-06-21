import React, { useState } from 'react';
import { Form as BSForm, Alert } from 'reactstrap';
import { ObjectSchema } from 'yup';
import { useForm, FormContext, FormContextValues } from 'react-hook-form';

// we are now able to to write our function component with generics
// function CollapsableDataList<T>({ collapsed, listOfData }: IProps<T> & { children?: React.ReactNode }): React.ReactElement {
//   // logic etc.
//   return (
//   // JSX output
//   );
// }
export default function Form<V extends Record<string, any>>({
  schema,
  values,
  onSubmit,
  children,
  inline,
  className,
  ...rest
}: {
  schema?: ObjectSchema;
  values?: Record<string, any>;
  onSubmit: (
    values: V,
    formContext: FormContextValues<V>
  ) => Promise<void> | void;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}): React.ReactElement {
  const methods = useForm<V>({
    defaultValues: (schema
      ? Object.assign(schema.default(), values)
      : values) as V,
    validationSchema: schema,
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
