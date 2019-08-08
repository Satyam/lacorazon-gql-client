import React from 'react';

import { GqlProvider } from 'Providers/Apollo';
import { AuthProvider } from 'Providers/Auth';
import { IntlProvider } from 'Providers/Intl';
import { ModalsProvider } from 'Providers/Modals';

const Providers: React.FC<{}> = ({ children }) => (
  <GqlProvider>
    <IntlProvider locale="es-ES">
      <AuthProvider>
        <ModalsProvider>{children}</ModalsProvider>
      </AuthProvider>
    </IntlProvider>
  </GqlProvider>
);

export default Providers;
