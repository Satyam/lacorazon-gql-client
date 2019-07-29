import React from 'react';
import useReactRouter from 'use-react-router';
import { LabeledText, LabeledCheckbox } from 'Components/Form';
import Page from 'Components/Page';
import Loading from 'Components/Loading';
import { Alert } from 'reactstrap';
import GqlError from 'Components/GqlError';

import { useIntl } from 'Components/intl';

import { useGetVenta } from './actions';

export default function ShowVenta({ match }) {
  const id = match.params.id;
  const { loading, error, data } = useGetVenta(id);
  const { formatDate, formatCurrency } = useIntl();
  const { history } = useReactRouter();

  if (loading) return <Loading>Cargando venta</Loading>;

  const venta = data.venta;
  const onShowVendedor = ev => {
    ev.stopPropagation();
    history.push(`/user/${ev.currentTarget.dataset.id}`);
  };
  venta.vendedor = venta.vendedor || { nombre: '' };
  return (
    <Page title={`Venta - ${venta ? venta.nombre : '??'}`} heading={`Venta`}>
      <GqlError error={error}>
        {venta ? (
          <>
            <LabeledText label="Fecha" value={formatDate(venta.fecha)} />
            <LabeledText label="Concepto" value={venta.concepto} />
            <LabeledText
              label="Vendedor"
              value={venta.vendedor.nombre}
              data-id={venta.vendedor.id}
              onClick={venta.vendedor.id && onShowVendedor}
              className="link"
            />
            <LabeledText label="Cantidad" value={venta.cantidad} />
            <LabeledCheckbox label="IVA" value={venta.iva} />
            <LabeledText
              label="Precio Unitario"
              value={formatCurrency(venta.precioUnitario)}
            />
            <LabeledText
              label="Precio Total"
              value={formatCurrency(venta.precioUnitario * venta.cantidad)}
            />
          </>
        ) : (
          <Alert color="danger">La venta no existe o fue borrada</Alert>
        )}
      </GqlError>
    </Page>
  );
}
