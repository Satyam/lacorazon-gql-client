import React from 'react';
import useReactRouter from 'use-react-router';
import { object, string, number, boolean, date } from 'yup';

import { Alert } from 'reactstrap';
import {
  Form,
  TextField,
  DateField,
  CheckboxField,
  SubmitButton,
} from 'Components/Form';
import { ButtonIconAdd, ButtonIconDelete, ButtonSet } from 'Components/Icons';
import Loading from 'Components/Loading';
import Page from 'Components/Page';
import GqlError from 'Components/GqlError';

import {
  useCreateVenta,
  useDeleteVenta,
  useUpdateVenta,
  useGetVenta,
} from './actions';

const ventaSchema = object().shape({
  fecha: date()
    .required()
    .default(new Date()),
  concepto: string()
    .trim()
    .default(''),
  cantidad: number()
    .integer()
    .positive()
    .default(1),
  iva: boolean().default(false),
  precioUnitario: number().default(10),
});

export default function EditVenta({ match }) {
  const id = match.params.id;
  const { history } = useReactRouter();
  const { loading, error, data } = useGetVenta(id);

  const [createVenta, createStatus] = useCreateVenta();
  const [updateVenta, updateStatus] = useUpdateVenta();
  const [deleteVenta, deleteStatus] = useDeleteVenta();

  if (loading) return <Loading>Cargando venta</Loading>;
  if (createStatus.loading) return <Loading>Creando venta</Loading>;
  if (updateStatus.loading) return <Loading>Actualizando venta</Loading>;
  if (deleteStatus.loading) return <Loading>Borrando venta</Loading>;

  const venta = (data && data.venta) || {};
  console.log(venta);
  return (
    <Page
      title={`Venta - ${venta ? venta.nombre : 'nuevo'}`}
      heading={`${id ? 'Edit' : 'Add'} Venta`}
    >
      <GqlError error={[error, createStatus, updateStatus, deleteStatus]}>
        {id && !venta ? (
          <Alert color="danger">La venta no existe o fue borrada</Alert>
        ) : (
          <Form
            values={venta}
            onSubmit={values => {
              if (id) {
                updateVenta(id, values);
              } else {
                createVenta(values).then(({ data }) => {
                  history.replace(`/venta/edit/${data.createVenta.id}`);
                });
              }
            }}
            schema={ventaSchema}
          >
            <DateField name="fecha" label="Fecha" />
            <TextField name="concepto" label="Concepto" />
            <TextField name="cantidad" label="Cantidad" />
            <CheckboxField name="iva" label="IVA" />
            <TextField name="precioUnitario" label="Precio Unitario" />
            <ButtonSet>
              <SubmitButton component={ButtonIconAdd}>
                {id ? 'Modificar' : 'Agregar'}
              </SubmitButton>
              <ButtonIconDelete
                disabled={!id}
                onClick={() => {
                  deleteVenta(id).then(() => history.replace('/ventas'));
                }}
              >
                Borrar
              </ButtonIconDelete>
            </ButtonSet>
          </Form>
        )}
      </GqlError>
    </Page>
  );
}
