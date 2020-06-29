import * as FormComponents from './';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { queryHelpers } from '@testing-library/react';

describe('Form', () => {
  it('Should export all components', () => {
    expect(Object.keys(FormComponents).sort()).toEqual(
      [
        'TextField',
        'DateField',
        'CheckboxField',
        'DropdownField',
        'SubmitButton',
        'LabeledCheckbox',
        'LabeledText',
        'Form',
      ].sort()
    );
  });
});

export const FormContext = ({ id }) => {
  const {
    errors,
    getValues,
    formState: {
      dirty,
      dirtyFields,
      isSubmitted,
      touched,
      isSubmitting,
      submitCount,
      isValid,
    },
  } = useFormContext();
  return (
    <div data-testid={id}>
      {JSON.stringify({
        errors,
        values: getValues(),
        dirty,
        dirtyFields,
        isSubmitted,
        touched,
        isSubmitting,
        submitCount,
        isValid,
      })}
    </div>
  );
};

const queryByTestId = queryHelpers.queryByAttribute.bind(null, 'data-testid');

export const getContextById = (container, id) => {
  const el = queryByTestId(container, id);
  if (el) {
    return JSON.parse(el.innerHTML);
  }
};
