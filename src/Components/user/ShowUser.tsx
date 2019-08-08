import React from 'react';
import useReactRouter from 'use-react-router';
import { Alert } from 'reactstrap';

import { LabeledText } from 'Components/Form';
import Page from 'Components/Page';
import { Loading } from 'Components/Modals';
import { Accordion, AccordionPanel } from 'Components/Accordion';
import ListVentas from 'Components/ventas/ListVentas';

import { useGetUser } from './actions';

const ShowUser = () => {
  const { match } = useReactRouter<{ id: string }>();
  const id = match.params.id;
  const { loading, error, user } = useGetUser(id);

  if (loading) return <Loading>Cargando usuario</Loading>;

  return (
    <Page
      title={`Vendedor - ${user ? user.nombre : '??'}`}
      heading={`Vendedor`}
      error={error}
    >
      {user ? (
        <>
          <LabeledText label="Nombre" value={user.nombre} />
          <LabeledText label="eMail" value={user.email} />
          <Accordion>
            <AccordionPanel label="Ventas" name="ventas">
              <ListVentas idVendedor={id} nombreVendedor={user.nombre} wide />
            </AccordionPanel>
            <AccordionPanel label="Consigna" name="consigna">
              Aqui iría los libros en consigna en las librerías de este vendedor
            </AccordionPanel>
          </Accordion>
        </>
      ) : (
        <Alert color="danger">El usuario no existe o fue borrado</Alert>
      )}
    </Page>
  );
};

export default ShowUser;
