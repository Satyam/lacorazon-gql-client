import React from 'react';
import useReactRouter from 'use-react-router';

import { LabeledText, LabeledCheckbox } from 'Components/Form';
import Page from 'Components/Page';
import { Loading } from 'Components/Modals';
import { Alert } from 'reactstrap';
import { useIntl } from 'Providers/Intl';

import { useGetVenta } from './actions';

export default function ShowVenta() {
  const { history, match } = useReactRouter<{ id?: string }>();
  const id = match.params.id;
  const { loading, error, venta } = useGetVenta(id);
  const { formatDate, formatCurrency } = useIntl();

  if (loading) return <Loading>Cargando venta</Loading>;

  const vendedor = (venta && venta.vendedor) || { nombre: '', id: '' };

  const onShowVendedor: React.MouseEventHandler<HTMLDivElement> = ev => {
    ev.stopPropagation();
    history.push(`/user/${ev.currentTarget.dataset.id}`);
  };

  return (
    <Page
      title={`Venta - ${venta ? venta.fecha : '??'}`}
      heading={`Venta`}
      error={error}
    >
      {venta ? (
        <>
          <LabeledText label="Fecha" value={formatDate(venta.fecha)} />
          <LabeledText label="Concepto" value={venta.concepto} />
          <LabeledText
            label="Vendedor"
            value={vendedor.nombre}
            data-id={vendedor.id}
            onClick={vendedor.id ? onShowVendedor : undefined}
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
            value={formatCurrency(venta.precioUnitario! * venta.cantidad!)}
          />
        </>
      ) : (
        <Alert color="danger">La venta no existe o fue borrada</Alert>
      )}
    </Page>
  );
}
