import React from 'react';

import { GqlProvider } from 'Providers/Apollo';
import { Auth0Provider } from 'Providers/Auth';
import { IntlProvider } from 'Providers/Intl';
import { ModalsProvider } from 'Providers/Modals';

const Providers: React.FC<{}> = ({ children }) => (
  <GqlProvider>
    <IntlProvider locale="es-ES">
      <Auth0Provider
        domain={'dev-5ev0q6ua.eu.auth0.com'}
        clientID={'DBbfOnjfs74eUf3wVFqzHbWeCwkcYkdt'}
        redirectUri={window.location.origin}
      >
        <ModalsProvider>{children}</ModalsProvider>
      </Auth0Provider>
    </IntlProvider>
  </GqlProvider>
);

export default Providers;
