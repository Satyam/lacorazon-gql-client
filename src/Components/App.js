import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { Navigation } from 'Components/Navigation';
import ErrorBoundary from 'Components/ErrorBoundary';

import Users from 'Components/User/ListUsers';
import EditUser from 'Components/User/EditUser';
import ShowUser from 'Components/User/ShowUser';
import Distribuidores from 'Components/Distribuidor/ListDistribuidores';
import EditDistribuidor from 'Components/Distribuidor/EditDistribuidor';
import ShowDistribuidor from 'Components/Distribuidor/ShowDistribuidor';
import Login from 'Components/auth/Login';

function App() {
  return (
    <Router>
      <Navigation />

      <ErrorBoundary>
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
        <Route path="/login/:register?" component={Login} />
      </ErrorBoundary>
    </Router>
  );
}

export default App;
