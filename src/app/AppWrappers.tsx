/* 'use client';

import { ChakraProvider } from '@chakra-ui/react';
import React, { ReactNode } from 'react';
import theme from '../theme/theme';
export default function AppWrappers({ children }: { children: React.ReactNode }) {
    const [hydrated, setHydrated] = React.useState(false);

    React.useEffect(() => {
         // this forces a rerender
        setHydrated(true)
    }, [])

    if (!hydrated) {
        // this returns null on first render, so the client and server match
        return null
    } 

    return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
} */

'use client';
import React, { ReactNode } from 'react';
import 'styles/App.css';
import 'styles/Contact.css';
import 'styles/MiniCalendar.css';
import { ChakraProvider } from '@chakra-ui/react';
import theme from '../theme/theme';

const _NoSSR = ({ children }: any) => (
    <React.Fragment>{children}</React.Fragment>
);

export default function AppWrappers({ children }: { children: ReactNode }) {
    return (
      // <NoSSR>
      <ChakraProvider theme={theme}>{children}</ChakraProvider>
      // </NoSSR>
    );
}