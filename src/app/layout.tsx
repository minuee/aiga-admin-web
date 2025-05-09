import { Box } from '@chakra-ui/react';
import React, { ReactNode } from 'react';
import AppWrappers  from './AppWrappers';
import Head from "./head"

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
