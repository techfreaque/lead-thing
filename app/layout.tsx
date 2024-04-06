import '@mantine/core/styles.css';
import React from 'react';
import { MantineProvider, ColorSchemeScript } from '@mantine/core';
import { theme } from '../theme';
import Navbar from '@/app/components/NavBar/NavBar';
import ContentContainer from '@/app/components/ContentContainer/ContentContainer';
import "./globals.css"
import Footer from '@/app/components/Footer/Footer';
import { APP_NAME } from './constants';

export const metadata = {
  title: APP_NAME,
  description: 'Get a unified and simplified API interface to create leads on many newsletter systems.',
};

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript forceColorScheme="dark" />
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>
        <MantineProvider theme={theme}>
          <Navbar />
          <ContentContainer>{children}</ContentContainer>
          <Footer/>
        </MantineProvider>
      </body>
    </html>
  );
}
