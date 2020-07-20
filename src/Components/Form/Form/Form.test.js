import React from 'react';
import * as Yup from 'yup';
import {
  render,
  fireEvent,
  cleanup,
  waitFor,
  queries as stdQueries,
} from '@testing-library/react';

import Form from '.';
import TextField from '../TextField';
import SubmitButton from '../SubmitButton';
import { FormContext, getContextById } from '../index.test';

const queries = { ...stdQueries, getContextById };
afterEach(cleanup);
const nullSubmit = () => undefined;
function TestForm(props) {
  return (
    <Form
      values={{ one: 1 }}
      submitFocusError={false}
      onSubmit={nullSubmit}
      {...props}
    >
      <TextField label="one" name="one" />
      <SubmitButton>Submit</SubmitButton>
      <FormContext id="context" />
    </Form>
  );
}
describe('Form / Form', () => {
  const contextBefore = {
    errors: {},
    values: {},
    isDirty: false,
    dirtyFields: {},
    isSubmitted: false,
    touched: {},
    isSubmitting: false,
    submitCount: 0,
    isValid: false,
  };
  const contextAfterInput = {
    errors: {},
    values: { one: '2' },
    isDirty: true,
    dirtyFields: {},
    isSubmitted: false,
    touched: {},
    isSubmitting: false,
    submitCount: 0,
    isValid: false,
  };
  describe('with no validationSchema', () => {
    it('should submit form', async () => {
      const submitHandler = jest.fn();
      const validate = jest.fn((values) => ({
        values,
        errors: {},
      }));

      const { getByText, getByLabelText, getContextById } = render(
        <TestForm onSubmit={submitHandler} validationResolver={validate} />,
        { queries }
      );

      await waitFor(() => {
        expect(getByText('Submit')).toBeDisabled();
        expect(getContextById('context')).toEqual(contextBefore);
      });

      fireEvent.input(getByLabelText('one'), {
        target: { name: 'one', value: '2' },
      });

      await waitFor(() => {
        expect(getByText('Submit')).not.toBeDisabled();
        expect(getContextById('context')).toEqual(contextAfterInput);
      });

      jest.clearAllMocks();
      fireEvent.click(getByText('Submit'));

      expect(validate).toBeCalledWith({ one: '2' }, undefined);
      expect(validate).toBeCalledTimes(1);
      expect(validate).toReturnWith({
        errors: {},
        values: { one: '2' },
      });
      // validation is always async, so we have to waitFor for it
      return waitFor(() => {
        expect(getContextById('context')).toEqual({
          values: { one: '2' },
          errors: {},
          isDirty: true,
          dirtyFields: {},
          isSubmitted: true,
          touched: {},
          isSubmitting: false,
          submitCount: 1,
          isValid: true,
        });
        expect(submitHandler).toBeCalled();
        expect(submitHandler.mock.calls[0][0]).toEqual({ one: '2' });
      });
    });

    it('should not submit form on validation error', async () => {
      const submitHandler = jest.fn();
      const validate = jest.fn((values) => ({
        values,
        errors: { one: 'some error' },
      }));
      const { getByText, getByLabelText, getContextById } = render(
        <TestForm onSubmit={submitHandler} validationResolver={validate} />,
        { queries }
      );

      await waitFor(() => {
        expect(getByText('Submit')).toBeDisabled();
        expect(getContextById('context')).toEqual(contextBefore);
      });

      fireEvent.input(getByLabelText('one'), {
        target: { name: 'one', value: '2' },
      });

      await waitFor(() => {
        expect(getByText('Submit')).not.toBeDisabled();
        expect(getContextById('context')).toEqual(contextAfterInput);
      });

      jest.clearAllMocks();
      fireEvent.click(getByText('Submit'));

      expect(validate).toBeCalledWith({ one: '2' }, undefined);
      expect(validate).toBeCalledTimes(1);
      expect(validate).toReturnWith({
        values: { one: '2' },
        errors: { one: 'some error' },
      });
      // validation is always async, so we have to waitFor for it
      // however, since it fails, it is not going to happen
      return waitFor(() => {
        expect(getContextById('context')).toEqual({
          values: { one: '2' },
          errors: { one: 'some error' },
          isDirty: true,
          dirtyFields: {},
          isSubmitted: true,
          touched: {},
          isSubmitting: false,
          submitCount: 1,
          isValid: false,
        });
        expect(getByText('Submit')).toBeDisabled();
        expect(submitHandler).not.toBeCalled();
      });
    });

    it('should submit form asynchronously (with Promise)', async () => {
      const submitHandler = jest.fn(() => Promise.resolve());
      const validate = jest.fn((values) => ({
        values,
        errors: {},
      }));
      const { getByText, getByLabelText, getContextById } = render(
        <TestForm onSubmit={submitHandler} validationResolver={validate} />,
        { queries }
      );

      await waitFor(() => {
        expect(getByText('Submit')).toBeDisabled();
        expect(getContextById('context')).toEqual(contextBefore);
      });

      fireEvent.input(getByLabelText('one'), {
        target: { name: 'one', value: '2' },
      });

      await waitFor(() => {
        expect(getByText('Submit')).not.toBeDisabled();
        expect(getContextById('context')).toEqual(contextAfterInput);
      });

      jest.clearAllMocks();
      fireEvent.click(getByText('Submit'));

      expect(validate).toBeCalledWith({ one: '2' }, undefined);
      expect(validate).toBeCalledTimes(1);
      expect(validate).toReturnWith({
        errors: {},
        values: { one: '2' },
      });
      // validation is always async, so we have to waitFor for it
      return waitFor(() => {
        expect(submitHandler).toBeCalled();
        expect(submitHandler.mock.calls[0][0]).toEqual({ one: '2' });
      });
    });
  });
  describe('with validation schema', () => {
    const schema = Yup.object().shape({
      one: Yup.number().integer().truncate().default(99),
    });
    it('should submit form', async () => {
      const submitHandler = jest.fn();
      const { getByText, getByLabelText, getContextById } = render(
        <TestForm onSubmit={submitHandler} schema={schema} />,
        { queries }
      );
      await waitFor(() => {
        expect(getByText('Submit')).toBeDisabled();
        expect(getContextById('context')).toEqual({
          ...contextBefore,
          values: { one: 99 },
        });
      });
      fireEvent.input(getByLabelText('one'), {
        target: { name: 'one', value: '2.5' },
      });
      await waitFor(() => {
        expect(getByText('Submit')).not.toBeDisabled();
        expect(getContextById('context')).toEqual({
          ...contextAfterInput,
          values: { one: '2.5' },
        });
      });
      jest.clearAllMocks();
      fireEvent.click(getByText('Submit'));

      // validation is always async, so we have to waitFor for it
      return waitFor(() => {
        expect(getContextById('context')).toEqual({
          values: { one: '2.5' },
          errors: {},
          isDirty: true,
          dirtyFields: {},
          isSubmitted: true,
          touched: {},
          isSubmitting: false,
          submitCount: 1,
          isValid: true,
        });
        expect(submitHandler).toBeCalled();
        // Notice value '2.5' is cast to number and truncated to an integer: 2
        expect(submitHandler.mock.calls[0][0]).toEqual({ one: 2 });
      });
    });
    it('should take default values from schema', () => {
      const { getByText, getByLabelText } = render(
        <Form schema={schema} onSubmit={nullSubmit}>
          <TextField label="one" name="one" />
          <SubmitButton>Submit</SubmitButton>
        </Form>
      );
      expect(Number(getByLabelText('one').value)).toBe(99);

      expect(getByText('Submit')).toBeDisabled();
    });
  });
});
