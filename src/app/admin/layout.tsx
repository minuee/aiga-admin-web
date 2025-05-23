'use client';
// Chakra imports
import { Portal,Box,useDisclosure,useColorModeValue } from '@chakra-ui/react';
import Footer from 'components/footer/FooterAdmin';
// Layout components
import Navbar from 'components/navbar/NavbarAdmin';
import Sidebar from 'components/sidebar/Sidebar';
import { PropsWithChildren, useEffect, useState } from 'react';
import routes from 'routes';
import { usePathname } from 'next/navigation';
import { getActiveNavbar,getActiveNavbarText,getActiveRoute } from 'utils/navigation';
//로그인 전역상태
import LnbStateStore from 'store/lnbStore';
import LnbSmallStateStore from 'store/lnbSmallStore';

interface DashboardLayoutProps extends PropsWithChildren {
  [x: string]: any;
}

// Custom Chakra theme
export default function AdminLayout(props: DashboardLayoutProps) {
  const { children, ...rest } = props;
  // states and functions
  const [fixed] = useState(false);
  const [newBrandText, setNewBrandText] = useState("Default");
  // functions for changing the states from components
  const { onOpen } = useDisclosure();
  const isLeftOpen = LnbStateStore(state => state.isOpen);
  const isSmall = LnbSmallStateStore(state => state.isSmall);
  const pathname = usePathname();
  const bg = useColorModeValue('secondaryGray.300', 'navy.900');

  useEffect(() => {
    const newRouteName = getActiveRoute(routes);
    setNewBrandText(newRouteName)
  }, [pathname])

  return (
    <Box h="100vh" w="100vw" bg={bg}>
      <Box>
        <Sidebar routes={routes} display="none" {...rest} />
        <Box
          float="right"
          minHeight="100vh"
          height="100%"
          overflow="auto"
          position="relative"
          maxHeight="100%"
          w={isSmall ? { base: '100%', xl: 'calc( 100% - 90px )' } : { base: '100%', xl: 'calc( 100% - 290px )' }}
          maxWidth={isSmall ? { base: '100%', xl: 'calc( 100% - 90px )' } : { base: '100%', xl: 'calc( 100% - 290px )' }}
          transition="all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)"
          transitionDuration=".2s, .2s, .35s"
          transitionProperty="top, bottom, width"
          transitionTimingFunction="linear, linear, ease"
        >
          <Portal>
            <Box>
              <Navbar
                onOpen={onOpen}
                logoText={'AIGA ADMIN'}
                //brandText={getActiveRoute(routes)}
                brandText={newBrandText}
                secondary={getActiveNavbar(routes)}
                message={getActiveNavbarText(routes)}
                fixed={fixed}
                {...rest}
              />
            </Box>
          </Portal>

          <Box 
            mx="auto" 
            p={{ base: '20px', md: '30px' }} 
            pe="20px" 
            minH={{base : "100%", xl : "100vh"}} 
            pt={{base : "0px", xl : "50px"}}
          >
            {children}
          </Box>
          <Box>
            <Footer />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
