import React from 'react';

import ErrorBoundary from 'Components/ErrorBoundary';

import Routes from './Routes';
import Providers from './Providers';

const App = () => (
  <Providers>
    <ErrorBoundary>
      <Routes />
    </ErrorBoundary>
  </Providers>
);

export default App;
