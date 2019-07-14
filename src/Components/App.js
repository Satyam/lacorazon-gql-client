import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import { Navigation } from 'Components/Navigation';
import ErrorBoundary from 'Components/ErrorBoundary';

import Users from 'Components/User/ListUsers';
import User from 'Components/User';
import Distribuidores from 'Components/Distribuidor/ListDistribuidores';
import Distribuidor from 'Components/Distribuidor';
import Login from 'Components/auth/Login';

function App() {
  return (
    <Router>
      <Navigation />

      <ErrorBoundary>
        <Route path="/users" component={Users} />
        <Route path="/user/:id?" component={User} />
        <Route path="/distribuidores" component={Distribuidores} />
        <Route path="/distribuidor/:id?" component={Distribuidor} />
        <Route path="/login/:register?" component={Login} />
      </ErrorBoundary>
    </Router>
  );
}

export default App;
