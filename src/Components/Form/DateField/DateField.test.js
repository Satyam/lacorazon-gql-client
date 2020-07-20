import React from 'react';
import {
  render,
  fireEvent,
  cleanup,
  waitFor,
  queries as stdQueries,
} from '@testing-library/react';
import * as Yup from 'yup';

import Form from '../Form';
import DateField from './';
import SubmitButton from '../SubmitButton';
import { FormContext, getContextById } from '../index.test';

const queries = { ...stdQueries, getContextById };

afterEach(cleanup);

class ErrorBoundary extends React.PureComponent {
  state = { hasError: false };

  static getDerivedStateFromError(err) {
    // Update state so the next render will show the fallback UI.
    return { hasError: err.message };
  }

  // componentDidCatch(err, info) {
  //   this.setState({ hasError: err.message });
  // }

  render() {
    return this.state.hasError || React.Children.only(this.props.children);
  }
}
const nullSubmit = () => undefined;

describe('Form/DateField', () => {
  it('should throw with no props as name argument is mandatory', () => {
    const e = console.error;
    console.error = (msg) => {};
    const { container } = render(
      <ErrorBoundary>
        <Form onSubmit={nullSubmit}>
          <DateField />
        </Form>
      </ErrorBoundary>
    );

    expect(container.innerHTML).toMatchSnapshot();
    console.error = e;
  });
  it('should throw with any extra property but name as argument is mandatory', () => {
    const e = console.error;
    console.error = (msg) => {};
    const { container } = render(
      <ErrorBoundary>
        <Form onSubmit={nullSubmit}>
          <DateField label="some label" value="Some value" />
        </Form>
      </ErrorBoundary>
    );
    expect(container.innerHTML).toMatchSnapshot();
    console.error = e;
  });

  xit('should validate on field change', () => {
    const validate = jest.fn(() => '');
    const { getByLabelText, getByText } = render(
      <Form values={{ one: new Date(2019, 8, 7) }} onSubmit={nullSubmit}>
        <DateField label="one" name="one" validation={validate} />
        <SubmitButton>Submit</SubmitButton>
      </Form>
    );
    fireEvent.input(getByLabelText('one'), {
      target: { value: new Date(2019, 2, 2) },
    });
    fireEvent.click(getByText('Submit'));
    return waitFor(() => {
      expect(validate).toBeCalledWith(new Date(2019, 2, 2));
    });
  });

  xit('should validate on field blur', () => {
    const validate = jest.fn(() => '');
    const { getByLabelText } = render(
      <Form values={{ one: new Date(2019, 8, 7) }} onSubmit={nullSubmit}>
        <DateField label="one" name="one" validation={validate} />
      </Form>
    );

    fireEvent.blur(getByLabelText('one'));
    expect(validate).toBeCalledWith(new Date(2019, 8, 7));
  });

  it('should generate an id when no id provided', () => {
    const { getByLabelText } = render(
      <Form values={{ one: new Date(2019, 8, 7) }} onSubmit={nullSubmit}>
        <DateField label="one" name="one" />
      </Form>
    );
    expect(getByLabelText('one').id).toMatch(/^F_DF_\d+$/);
  });

  it('should respect the id provided', () => {
    const { getByLabelText } = render(
      <Form values={{ one: new Date(2019, 8, 7) }} onSubmit={nullSubmit}>
        <DateField label="one" name="one" id="abcd" />
      </Form>
    );
    expect(getByLabelText('one').id).toBe('abcd');
  });

  it('should take values from the schema', () => {
    const schema = Yup.object().shape({
      one: Yup.date().default(new Date(2019, 8, 7)),
    });
    const { getContextById } = render(
      <Form schema={schema} onSubmit={nullSubmit}>
        <DateField label="one" name="one" />
        <FormContext id="context" />
      </Form>,
      { queries }
    );
    return waitFor(() => {
      expect(getContextById('context')).toEqual(
        expect.objectContaining({
          values: {
            one: '2019-09-06T22:00:00.000Z',
          },
        })
      );
    });
  });
  it('should reject values below the min in the schema', () => {
    // since the out-of-range dates are not enabled, they can't be clicked
    const schema = Yup.object().shape({
      one: Yup.date().min(new Date(2019, 8, 10)).default(new Date(2019, 8, 20)),
    });
    const { getByLabelText, getByText, container } = render(
      <Form schema={schema} onSubmit={nullSubmit}>
        <DateField label="one" name="one" />
        <SubmitButton>Submit</SubmitButton>
      </Form>
    );

    fireEvent.click(getByLabelText('one'));
    fireEvent.click(getByText('6'));
    fireEvent.click(getByText('Submit'));
    return waitFor(() => {
      expect(getByLabelText('one')).toHaveClass('is-invalid');
      expect(container.querySelector('.invalid-feedback')).toBeVisible();
    });
  });
});
