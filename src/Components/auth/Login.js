import React from 'react';
import useReactRouter from 'use-react-router';
import { object, string } from 'yup';

import Loading from 'Components/Loading';
import { Form, TextField, SubmitButton } from 'Components/Form';
import Page from 'Components/Page';
import GqlError from 'Components/GqlError';

import { useLogin } from './actions';
import { useCreateUser } from 'Components/User/queries';
import { useAuth } from './context';

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
  const [login, loginStatus] = useLogin();
  const [createUser, createUserStatus] = useCreateUser();
  const register = match.params.register;

  return (
    <Page
      title={register ? 'Registro' : 'Login'}
      heading={register ? 'Registro' : 'Login'}
    >
      <GqlError error={[loginStatus, createUserStatus]}>
        {(loginStatus.loading || createUserStatus.loading) && (
          <Loading>{register ? 'Registrando' : 'Confirmando'} usuario</Loading>
        )}
        <Form
          onSubmit={values => {
            if (register) {
              if (values.password === values.confirmPassword) {
                return createUser({
                  nombre: values.nombre,
                  password: values.password,
                }).then(({ error, data }) => {
                  if (error) {
                    return Promise.reject('Server error');
                  }
                  return data.createUser
                    ? refreshCurrentUser().then(() => {
                        history.goBack();
                      })
                    : Promise.reject('Duplicate user name');
                });
              } else {
                return Promise.reject('Confirmación no coincide');
              }
            } else {
              return login(values).then(({ error, data }) => {
                if (error) {
                  return Promise.reject('Server error');
                }
                return data.login
                  ? refreshCurrentUser().then(() => {
                      history.goBack();
                    })
                  : Promise.reject('User name or password do not exist');
              });
            }
          }}
          schema={loginSchema}
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
      </GqlError>
    </Page>
  );
}
