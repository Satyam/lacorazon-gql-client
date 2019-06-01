import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import { Navigation } from 'Components/Navigation';
import ErrorBoundary from 'Components/ErrorBoundary';

import Users from 'Components/Users';
import User from 'Components/User';
import Distribuidores from 'Components/Distribuidores';
import Distribuidor from 'Components/Distribuidor';

function App() {
  return (
    <Router>
      <Navigation />

      <ErrorBoundary>
        <Route path="/users" component={Users} />
        <Route path="/user/:id?" component={User} />
        <Route path="/distribuidores" component={Distribuidores} />
        <Route path="/distribuidor/:id?" component={Distribuidor} />
      </ErrorBoundary>
    </Router>
  );
}

export default App;
