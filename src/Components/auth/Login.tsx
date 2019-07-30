import React from 'react';
import useReactRouter from 'use-react-router';
import * as yup from 'yup';

import Loading from 'Components/Loading';
import { Form, TextField, SubmitButton } from 'Components/Form';
import Page from 'Components/Page';
import GqlError from 'Components/GqlError';

import { useLogin } from './actions';
import { useCreateUser } from 'Components/user/actions';
import { useAuth } from './context';

const loginSchema = yup.object().shape({
  nombre: yup
    .string()
    .required()
    .trim()
    .default(''),
  password: yup
    .string()
    .required()
    .trim()
    .default(''),
  confirmPassword: yup
    .string()
    .trim()
    .default(''),
});

const Login: React.FC<{}> = () => {
  const { history, match } = useReactRouter<{ register?: string }>();
  const { refreshCurrentUser } = useAuth();
  const [login, loginStatus] = useLogin();
  const [createUser, createUserStatus] = useCreateUser();
  const register = match.params.register;

  return (
    <Page
      title={register ? 'Registro' : 'Login'}
      heading={register ? 'Registro' : 'Login'}
    >
      <GqlError error={[loginStatus.error, createUserStatus.error]}>
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
                }).then(status =>
                  status && status.data
                    ? refreshCurrentUser().then(() => {
                        history.goBack();
                      })
                    : Promise.reject('Duplicate user name')
                );
              } else {
                return Promise.reject('Confirmación no coincide');
              }
            } else {
              return login(values).then(status =>
                status && status.data
                  ? refreshCurrentUser().then(() => {
                      history.goBack();
                    })
                  : Promise.reject('User name or password do not exist')
              );
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
};

export default Login;
