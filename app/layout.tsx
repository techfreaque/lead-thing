import '@mantine/core/styles.css';

import { ColorSchemeScript } from '@mantine/core';
import React from 'react';

import { APP_NAME } from './_lib/constants';

export const metadata = {
  title: APP_NAME,
  description:
    'Get a unified and simplified API interface to create leads on many newsletter systems.',
};

export default function RootLayout() {
  return (
    <html lang="en">
      <head>
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
        <ColorSchemeScript forceColorScheme="dark" defaultColorScheme="dark" />
      </head>
      <body>
        <h1>Leadthing has been retired.</h1>
        <h2>
          If you already have an active account,
          you can use it until the end of the year for free.
          Potentially longer in case the API is still used by others.
        </h2>
        {/* <MantineProvider theme={theme} defaultColorScheme="dark">
          <MainLayout>{children}</MainLayout>
        </MantineProvider> */}
      </body>
    </html>
  );
}
