import React from 'react';

// Router is, indeed, a context provider
import { BrowserRouter as Router } from 'react-router-dom';
import { GqlProvider } from 'Providers/Apollo';
import { Auth0Provider } from 'Providers/Auth';
import { IntlProvider } from 'Providers/Intl';
import { ModalsProvider } from 'Providers/Modals';

const Providers: React.FC<{}> = ({ children }) => (
  <GqlProvider>
    <IntlProvider locale="es-ES">
      <Router>
        {/* Auth0Provider requires Router to be available */}
        <Auth0Provider
          domain={'dev-5ev0q6ua.eu.auth0.com'}
          client_id={'DBbfOnjfs74eUf3wVFqzHbWeCwkcYkdt'}
          redirect_uri={window.location.origin}
        >
          <ModalsProvider>{children}</ModalsProvider>
        </Auth0Provider>
      </Router>
    </IntlProvider>
  </GqlProvider>
);

export default Providers;
