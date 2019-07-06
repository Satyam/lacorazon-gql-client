import React from 'react';
import { useMutation } from 'graphql-hooks';
import useReactRouter from 'use-react-router';
import { object, string } from 'yup';

import Loading from 'Components/Loading';
import { Form, TextField, SubmitButton } from 'Components/Form';
import Page from 'Components/Page';
import { LOGIN, CREATE_USER } from 'Gql/users';
import { useAuth } from 'Components/Auth';

const loginSchema = object().shape({
  nombre: string()
    .required()
    .trim()
    .default(''),
  password: string()
    .required()
    .trim()
    .default(''),
  confirmPassword: string()
    .trim()
    .default(''),
});

export default function Login() {
  const { history, match } = useReactRouter();
  const { refreshCurrentUser } = useAuth();
  const [login, loginStatus] = useMutation(LOGIN);
  const [createUser, createUserStatus] = useMutation(CREATE_USER);
  const register = match.params.register;

  if (loginStatus.error || createUserStatus.error)
    return 'Something Bad Happened';
  return (
    <Page
      title={register ? 'Registro' : 'Login'}
      heading={register ? 'Registro' : 'Login'}
    >
      {(loginStatus.loading || createUserStatus.loading) && (
        <Loading title={register ? 'Registrando' : 'Confirmando'} />
      )}
      <Form
        onSubmit={values => {
          if (register) {
            if (values.password === values.confirmPassword) {
              return createUser(
                {
                  variables: {
                    nombre: values.nombre,
                    password: values.password,
                  },
                }.then(({ error, data }) => {
                  if (error) {
                    return Promise.reject('Server error');
                  }
                  return data.createUser
                    ? refreshCurrentUser().then(() => {
                        history.goBack();
                      })
                    : Promise.reject('Duplicate user name');
                })
              );
            } else {
              return Promise.reject('Confirmación no coincide');
            }
          } else {
            return login({ variables: values }).then(
              ({ error, loading, data }) => {
                if (error) {
                  return Promise.reject('Server error');
                }
                return data.login
                  ? refreshCurrentUser().then(() => {
                      history.goBack();
                    })
                  : Promise.reject('User name or password do not exist');
              }
            );
          }
        }}
        schema={loginSchema}
        values={{
          nombre: '',
          password: '',
          confirmPassword: '',
        }}
      >
        <TextField name="nombre" label="Nombre" />
        <TextField type="password" name="password" label="Contraseña" />
        {register && (
          <TextField
            type="password"
            name="confirmPassword"
            label="Confirmar contraseña"
          />
        )}
        <SubmitButton color="primary">
          {register ? 'Crear' : 'Entrar'}
        </SubmitButton>
      </Form>
    </Page>
  );
}
