import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Users from 'Components/user/ListUsers';
import EditUser from 'Components/user/EditUser';
import ShowUser from 'Components/user/ShowUser';
import Distribuidores from 'Components/distribuidor/ListDistribuidores';
import EditDistribuidor from 'Components/distribuidor/EditDistribuidor';
import ShowDistribuidor from 'Components/distribuidor/ShowDistribuidor';
import ListVentas from 'Components/ventas/ListVentas';
import EditVenta from 'Components/ventas/EditVenta';
import ShowVenta from 'Components/ventas/ShowVenta';
import Profile from 'Components/Profile';

import PrivateRoute from './PrivateRoute';

const Routes = () => (
  <>
    <Route path="/users" component={Users} />
    <Switch>
      <Route path="/user/new" component={EditUser} />
      <Route path="/user/edit/:id" component={EditUser} />
      <Route path="/user/:id" component={ShowUser} />
    </Switch>
    <Route path="/distribuidores" component={Distribuidores} />
    <Switch>
      <Route path="/distribuidor/new" component={EditDistribuidor} />
      <Route path="/distribuidor/edit/:id" component={EditDistribuidor} />
      <Route path="/distribuidor/:id" component={ShowDistribuidor} />
    </Switch>
    <Route path="/ventas" component={ListVentas} />
    <Switch>
      <Route path="/venta/new" component={EditVenta} />
      <Route path="/venta/edit/:id" component={EditVenta} />
      <Route path="/venta/:id" component={ShowVenta} />
    </Switch>
    <PrivateRoute path="/profile" component={Profile} />
  </>
);

export default Routes;
