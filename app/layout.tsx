import '@mantine/core/styles.css';
import React from 'react';
import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { theme } from '../theme';
import { APP_NAME } from './_lib/constants';
import MainLayout from './_components/MainLayout/MainLayout';

export const metadata = {
  title: APP_NAME,
  description:
    'Get a unified and simplified API interface to create leads on many newsletter systems.',
};

export default function RootLayout({ children }: { children: any; }) {
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
        <MantineProvider theme={theme} defaultColorScheme="dark">
          <MainLayout>{children}</MainLayout>
        </MantineProvider>
      </body>
    </html>
  );
}
