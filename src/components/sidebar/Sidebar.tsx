'use client';
import React, { PropsWithChildren } from 'react';

// chakra imports
import {
  Box,
  Flex,
  Drawer,
  DrawerBody,
  Icon,
  useColorModeValue,
  DrawerOverlay,
  useDisclosure,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react';
import Content from 'components/sidebar/components/Content';
import SmallContent from 'components/sidebar/components/SmallContent';
import {
  renderThumb,
  renderTrack,
  renderView,
} from 'components/scrollbar/Scrollbar';
import dynamic from 'next/dynamic';

//Left Sidebar 전역상태
import LnbStateStore from 'store/lnbStore';
import LnbSmallStateStore from 'store/lnbSmallStore';

const Scrollbars = dynamic(
  () => import('react-custom-scrollbars-2').then((mod) => mod.Scrollbars),
  { ssr: true },
);

// Assets
import { IoMenuOutline } from 'react-icons/io5';
import { IRoute } from 'types/navigation';
import { isWindowAvailable } from 'utils/navigation';

interface SidebarResponsiveProps {
  routes: IRoute[];
}

export interface SidebarProps extends PropsWithChildren {
  routes: IRoute[];
  [x: string]: any;
}
/* interface SidebarProps extends SidebarResponsiveProps {
  [x: string]: any;
} */

function Sidebar(props: SidebarProps) {
  const { routes } = props;
  const isSmall = LnbSmallStateStore(state => state.isSmall);

  let variantChange = '0.2s linear';
  let shadow = useColorModeValue(
    '14px 17px 40px 4px rgba(112, 144, 176, 0.08)',
    'unset',
  );
  // Chakra Color Mode
  let sidebarBg = useColorModeValue('white', 'navy.800');
  let sidebarMargins = '0px';

  if ( isSmall ) {
    // SIDEBAR
    return (
      <Box display={{ sm: 'none', xl: 'block' }} position="fixed" minH="100%">
        <Box
          bg={sidebarBg}
          transition={variantChange}
          w="100px"
          h="100vh"
          m={sidebarMargins}
          minH="100%"
          overflowX="hidden"
          boxShadow={shadow}
        >
          <Scrollbars universal={true}>
            <SmallContent routes={routes} />
          </Scrollbars>
        </Box>
      </Box>
    );
  }

  // SIDEBAR
  return (
    <Box display={{ sm: 'none', xl: 'block' }} position="fixed" minH="100%">
      <Box
        bg={sidebarBg}
        transition={variantChange}
        w="300px"
        h="100vh"
        m={sidebarMargins}
        minH="100%"
        overflowX="hidden"
        boxShadow={shadow}
      >
        <Scrollbars universal={true}>
          <Content routes={routes} />
        </Scrollbars>
      </Box>
    </Box>
  );
}

// FUNCTIONS

export function SidebarResponsive(props: SidebarResponsiveProps) {
  let sidebarBackgroundColor = useColorModeValue('white', 'navy.800');
  let menuColor = useColorModeValue('gray.400', 'white');
  // // SIDEBAR
  const { isOpen, onOpen, onClose } = useDisclosure();
  const setLeftOpenState = LnbStateStore((state) => state.setOpenState);
  const isLeftOpen = LnbStateStore(state => state.isOpen);

  React.useEffect(() => {
    setLeftOpenState(isOpen)
  }, [isOpen])

  React.useEffect(() => {
    if ( !isLeftOpen ) onClose()
  }, [isLeftOpen])
  
  
  const btnRef = React.useRef();
  const { routes } = props;
  // let isWindows = navigator.platform.startsWith("Win");
  //  BRAND

  return (
    <Flex display={{ sm: 'flex', xl: 'none' }} alignItems="center">
      <Flex ref={btnRef} w="max-content" h="max-content" onClick={onOpen}>
        <Icon
          as={IoMenuOutline}
          color={menuColor}
          my="auto"
          w="20px"
          h="20px"
          me="10px"
          _hover={{ cursor: 'pointer' }}
        />
      </Flex>
      {
        isLeftOpen && (
          <Drawer
            isOpen={isOpen}
            onClose={onClose}
            placement={'left'}
            finalFocusRef={btnRef}
            closeOnOverlayClick
          >
            <DrawerOverlay 
              backdropFilter="auto"
              backdropBlur="18px"
              color="red"
            />
            <DrawerContent 
              //h="100vh" 
              w="285px" 
              maxW="300px"  
              /* ms={{
                sm: '300px',
              }}
              my={{
                sm: '0',
              }}
              borderRadius="16px" */
            >
              <DrawerCloseButton
                zIndex="3"
                onClick={onClose}
                _focus={{ boxShadow: 'none' }}
                _hover={{ boxShadow: 'none' }}
              />
              <DrawerBody maxW="300px" px="0rem" pb="0">
                <Scrollbars
                  autoHide
                  renderTrackVertical={renderTrack}
                  renderThumbVertical={renderThumb}
                  renderView={renderView}
                  universal={true}
                >
                  <Content routes={routes} />
                </Scrollbars>
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        )
      }
      
    </Flex>
  );
}
// PROPS

type WindowSize = {
  width: number
  height: number
}


export default Sidebar;
