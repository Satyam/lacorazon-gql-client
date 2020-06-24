import React from 'react';
import * as Yup from 'yup';
import { render, fireEvent, cleanup, wait } from '@testing-library/react';

import Form from '.';
import TextField from '../TextField';
import SubmitButton from '../SubmitButton';

afterEach(cleanup);

function TestForm(props) {
  return (
    <Form values={{ one: 1 }} {...props}>
      <TextField label="one" name="one" />
      <SubmitButton>Submit</SubmitButton>
    </Form>
  );
}
describe('Form / Form', () => {
  describe('with no validationSchema', () => {
    it('should submit form', () => {
      const submitHandler = jest.fn();
      const validate = jest.fn(() => ({}));

      const { getByText, getByLabelText } = render(
        <TestForm onSubmit={submitHandler} validationResolver={validate} />
      );
      expect(getByText('Submit')).toBeDisabled();

      fireEvent.change(getByLabelText('one'), {
        target: { name: 'one', value: '2' },
      });
      expect(getByText('Submit')).not.toBeDisabled();
      jest.clearAllMocks();
      fireEvent.click(getByText('Submit'));

      expect(validate).toBeCalledWith({ one: '2' }, undefined);
      expect(validate.mock.calls).toEqual([[{ one: '2' }, undefined]]);
      expect(validate.mock.results[0].value).toEqual({});
      // validation is always async, so we have to wait for it
      return wait(() => {
        expect(submitHandler).toBeCalled();
        expect(submitHandler.mock.calls[0][0]).toEqual({ one: '2' });
      });
    });

    it('should not submit form on validation error', () => {
      const submitHandler = jest.fn();
      const validate = jest.fn(() => ({ one: 'some error' }));
      const { getByText, getByLabelText } = render(
        <TestForm onSubmit={submitHandler} validate={validate} />
      );

      expect(getByText('Submit')).toBeDisabled();

      fireEvent.change(getByLabelText('one'), {
        target: { name: 'one', value: '2' },
      });
      expect(getByText('Submit')).not.toBeDisabled();

      jest.clearAllMocks();
      fireEvent.click(getByText('Submit'));

      expect(validate).toBeCalledWith({ one: '2' }, undefined);
      expect(validate.mock.calls).toEqual([[{ one: '2' }, undefined]]);
      expect(validate.mock.results[0].value).toEqual({ one: 'some error' });
      // validation is always async, so we have to wait for it
      // however, since it fails, it is not going to happen
      return wait(() => {
        expect(getByText('Submit')).toBeDisabled();
        expect(submitHandler).not.toBeCalled();
      });
    });
    it('should submit form asynchronously (with Promise)', () => {
      const submitHandler = jest.fn(() => Promise.resolve());
      const validate = jest.fn(() => ({}));
      const { getByText, getByLabelText } = render(
        <TestForm onSubmit={submitHandler} validate={validate} />
      );

      expect(getByText('Submit')).toBeDisabled();
      fireEvent.change(getByLabelText('one'), {
        target: { name: 'one', value: '2' },
      });
      expect(getByText('Submit')).not.toBeDisabled();
      jest.clearAllMocks();
      fireEvent.click(getByText('Submit'));

      expect(validate).toBeCalledWith({ one: '2' }, undefined);
      expect(validate.mock.calls).toEqual([[{ one: '2' }, undefined]]);
      expect(validate.mock.results[0].value).toEqual({});
      // validation is always async, so we have to wait for it
      return wait(() => {
        expect(submitHandler).toBeCalled();
        expect(submitHandler.mock.calls[0][0]).toEqual({ one: '2' });
      });
    });
  });
  describe('with validation schema', () => {
    const schema = Yup.object().shape({
      one: Yup.number().integer().truncate().default(99),
    });
    it('should submit form', () => {
      const submitHandler = jest.fn();
      const { getByText, getByLabelText } = render(
        <TestForm onSubmit={submitHandler} validationSchema={schema} />
      );
      expect(getByText('Submit')).toBeDisabled();
      fireEvent.change(getByLabelText('one'), {
        target: { name: 'one', value: '2.5' },
      });
      expect(getByText('Submit')).not.toBeDisabled();
      jest.clearAllMocks();
      fireEvent.click(getByText('Submit'));

      // validation is always async, so we have to wait for it
      return wait(() => {
        expect(submitHandler).toBeCalled();
        // Notice value '2.5' is cast to number and truncated to an integer: 2
        expect(submitHandler.mock.calls[0][0]).toEqual({ one: 2 });
      });
    });
    it('should take default values from schema', () => {
      const { getByText, getByLabelText } = render(
        <Form validationSchema={schema}>
          <TextField label="one" name="one" />
          <SubmitButton>Submit</SubmitButton>
        </Form>
      );
      expect(Number(getByLabelText('one').value)).toBe(99);

      expect(getByText('Submit')).toBeDisabled();
    });
  });
});
