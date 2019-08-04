import React from 'react';
import useReactRouter from 'use-react-router';
import * as yup from 'yup';

import { Form, TextField, SubmitButton } from 'Components/Form';
import Page from 'Components/Page';
import { useCreateUser } from 'Components/user/actions';
import { useModals } from 'Components/modals';

import { useLogin } from './actions';
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
  const login = useLogin();
  const createUser = useCreateUser();
  const { openLoading, closeLoading } = useModals();
  const register = match.params.register;

  return (
    <Page
      title={register ? 'Registro' : 'Login'}
      heading={register ? 'Registro' : 'Login'}
    >
      <Form
        onSubmit={values => {
          if (register) {
            if (values.password === values.confirmPassword) {
              openLoading('Registrando nuevo usuario');
              return createUser({
                nombre: values.nombre,
                password: values.password,
              })
                .then(id =>
                  id
                    ? refreshCurrentUser().then(() => {
                        history.goBack();
                      })
                    : Promise.reject('Duplicate user name')
                )
                .finally(closeLoading);
            } else {
              return Promise.reject('Confirmación no coincide');
            }
          } else {
            openLoading('Accediendo ...');
            return login(values)
              .then(id =>
                id
                  ? refreshCurrentUser().then(() => {
                      history.goBack();
                    })
                  : Promise.reject('User name or password do not exist')
              )
              .finally(closeLoading);
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
    </Page>
  );
};

export default Login;
