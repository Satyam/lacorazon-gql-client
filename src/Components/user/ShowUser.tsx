import React from 'react';

import { LabeledText } from 'Components/Form';
import Page from 'Components/Page';
import Loading from 'Components/Loading';
import { Accordion, AccordionPanel } from 'Components/Accordion';
import { Alert } from 'reactstrap';
import GqlError from 'Components/GqlError';

import ListVentas from 'Components/ventas/ListVentas';

import { useGetUser } from './actions';
import { RouteComponentProps } from 'react-router-dom';

const ShowUser = ({ match }: RouteComponentProps<{ id: string }>) => {
  const id = match.params.id;
  const { loading, error, data } = useGetUser(id);
  if (loading) return <Loading>Cargando usuario</Loading>;

  const user = data && data.user;
  return (
    <Page
      title={`Vendedor - ${user ? user.nombre : '??'}`}
      heading={`Vendedor`}
    >
      <GqlError error={error}>
        {user ? (
          <>
            <LabeledText label="Nombre" value={user.nombre} />
            <LabeledText label="eMail" value={user.email} />
            <Accordion>
              <AccordionPanel label="Ventas" name="ventas">
                <ListVentas idVendedor={id} nombreVendedor={user.nombre} wide />
              </AccordionPanel>
              <AccordionPanel label="Consigna" name="consigna">
                Aqui iría los libros en consigna en las librerías de este
                vendedor
              </AccordionPanel>
            </Accordion>
          </>
        ) : (
          <Alert color="danger">El usuario no existe o fue borrado</Alert>
        )}
      </GqlError>
    </Page>
  );
};

export default ShowUser;
