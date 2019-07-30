import React from 'react';
import useReactRouter from 'use-react-router';
import { object, string, number, boolean, date } from 'yup';

import { Alert } from 'reactstrap';
import {
  Form,
  TextField,
  DateField,
  CheckboxField,
  DropdownField,
  SubmitButton,
} from 'Components/Form';
import { ButtonIconAdd, ButtonIconDelete, ButtonSet } from 'Components/Icons';
import Loading from 'Components/Loading';
import Page from 'Components/Page';
import GqlError from 'Components/GqlError';
import { confirmDelete } from 'Components/shared';
import { useIntl } from 'Components/intl';

import {
  useCreateVenta,
  useDeleteVenta,
  useUpdateVenta,
  useGetVenta,
  useOptionsVendedores,
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
  const optionVendedoresStatus = useOptionsVendedores();
  const [createVenta, createStatus] = useCreateVenta();
  const [updateVenta, updateStatus] = useUpdateVenta();
  const [deleteVenta, deleteStatus] = useDeleteVenta();

  const { formatDate } = useIntl();
  if (loading) return <Loading>Cargando venta</Loading>;
  if (optionVendedoresStatus.loading)
    return <Loading>Cargando vendedores</Loading>;
  if (createStatus.loading) return <Loading>Creando venta</Loading>;
  if (updateStatus.loading) return <Loading>Actualizando venta</Loading>;
  if (deleteStatus.loading) return <Loading>Borrando venta</Loading>;

  const venta = (data && data.venta) || {};
  venta.vendedor = venta.vendedor || { id: '' };
  return (
    <Page
      title={`Venta - ${venta ? venta.nombre : 'nuevo'}`}
      heading={`${id ? 'Edit' : 'Add'} Venta`}
    >
      <GqlError
        error={[
          error,
          optionVendedoresStatus.error,
          createStatus.error,
          updateStatus.error,
          deleteStatus.error,
        ]}
      >
        {id && !venta ? (
          <Alert color="danger">La venta no existe o fue borrada</Alert>
        ) : (
          <Form
            values={venta}
            onSubmit={values => {
              values.idVendedor = values.vendedor.id;
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
            <DropdownField
              name="vendedor.id"
              label="Vendedor"
              noOption={!id}
              options={optionVendedoresStatus.data.users}
            />
            <TextField name="cantidad" label="Cantidad" />
            <CheckboxField name="iva" label="IVA" />
            <TextField name="precioUnitario" label="Precio Unitario" />
            <ButtonSet>
              <SubmitButton component={ButtonIconAdd}>
                {id ? 'Modificar' : 'Agregar'}
              </SubmitButton>
              <ButtonIconDelete
                disabled={!id}
                onClick={ev => {
                  ev.stopPropagation();
                  confirmDelete(`la venta del ${formatDate(venta.fecha)}`, () =>
                    deleteVenta(id).then(() => history.replace('/ventas'))
                  );
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
