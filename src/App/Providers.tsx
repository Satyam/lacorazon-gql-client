import React from 'react';

import { GqlProvider } from 'Components/Apollo';
import { AuthProvider } from 'Components/auth/context';
import { IntlProvider } from 'Components/intl';
import { ModalsProvider } from 'Components/modals';

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
