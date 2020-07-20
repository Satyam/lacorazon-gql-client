import React from 'react';
import { useParams, useHistory } from 'react-router-dom';
import * as yup from 'yup';
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
import { Loading } from 'Components/Modals';
import Page from 'Components/Page';
import { useIntl } from 'Providers/Intl';
import { useModals } from 'Providers/Modals';

import {
  useCreateVenta,
  useDeleteVenta,
  useUpdateVenta,
  useGetVenta,
  useOptionsVendedores,
  VentaType,
} from './actions';

const ventaSchema = yup.object().shape({
  fecha: yup.mixed().required().default(new Date()),
  concepto: yup.string().trim().required().default(''),
  cantidad: yup.number().integer().positive().default(1),
  iva: yup.boolean().default(false),
  precioUnitario: yup.number().default(10),
});

export default function EditVenta() {
  const history = useHistory();
  const { id } = useParams<{ id: ID }>();
  const { loading, error, venta } = useGetVenta(id);
  const optionVendedoresStatus = useOptionsVendedores();
  const createVenta = useCreateVenta();
  const updateVenta = useUpdateVenta();
  const deleteVenta = useDeleteVenta();
  const { openLoading, closeLoading, confirmDelete } = useModals();
  const { formatDate } = useIntl();

  if (loading) return <Loading>Cargando venta</Loading>;
  if (optionVendedoresStatus.loading)
    return <Loading>Cargando vendedores</Loading>;

  type VentaValues = Omit<VentaType, 'vendedor'> & { idVendedor: ID };

  const onSubmit = async (values: VentaValues): Promise<void> => {
    if (id) {
      openLoading('Actualizando Venta');
      await updateVenta(id, values).finally(closeLoading);
    } else {
      openLoading('Creando Venta');
      await createVenta(values)
        .then((id) => {
          history.replace(`/venta/edit/${id}`);
        })
        .finally(closeLoading);
    }
  };

  const onDeleteClick: React.MouseEventHandler<HTMLButtonElement> = (ev) => {
    ev.stopPropagation();
    confirmDelete(`la venta del ${formatDate(venta && venta.fecha)}`, () =>
      deleteVenta(id!).then(() => history.replace('/ventas'))
    );
  };

  let values: Partial<VentaValues> = {};
  if (venta) {
    const { vendedor, ...rest } = venta;
    values = {
      ...rest,
      idVendedor: (vendedor && vendedor.id) || '',
    };
  }

  return (
    <Page
      title={`Venta - ${venta ? venta.fecha : 'nuevo'}`}
      heading={`${id ? 'Edit' : 'Add'} Venta`}
      error={[error, optionVendedoresStatus.error]}
    >
      {id && !venta ? (
        <Alert color="danger">La venta no existe o fue borrada</Alert>
      ) : (
        <Form<VentaValues>
          defaultValues={values}
          onSubmit={onSubmit}
          schema={ventaSchema}
        >
          <DateField name="fecha" label="Fecha" />
          <TextField name="concepto" label="Concepto" />
          {optionVendedoresStatus.optionsVendedores && (
            <DropdownField
              name="idVendedor"
              label="Vendedor"
              noOption={!id}
              options={optionVendedoresStatus.optionsVendedores}
            />
          )}
          <TextField name="cantidad" label="Cantidad" />
          <CheckboxField name="iva" label="IVA" />
          <TextField name="precioUnitario" label="Precio Unitario" />
          <ButtonSet>
            <SubmitButton component={ButtonIconAdd}>
              {id ? 'Modificar' : 'Agregar'}
            </SubmitButton>
            {id && (
              <ButtonIconDelete disabled={!id} onClick={onDeleteClick}>
                Borrar
              </ButtonIconDelete>
            )}
          </ButtonSet>
        </Form>
      )}
    </Page>
  );
}
