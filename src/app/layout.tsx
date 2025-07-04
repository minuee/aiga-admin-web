import { Box } from '@chakra-ui/react';
import React, { ReactNode } from 'react';
import AppWrappers  from './AppWrappers';
import Head from "./head";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'AIGA Admin',
    template: '%s',
  },
  description: 'AIGA Admin',
  icons: {
    icon: `/img/fav/Icon-512.png`,
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <Head />
      <body id={'root'}>
        <AppWrappers>{children}</AppWrappers>
      </body>
    </html>
  );
}
