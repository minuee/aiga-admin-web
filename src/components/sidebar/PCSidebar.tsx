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
import {
  renderThumb,
  renderTrack,
  renderView,
} from 'components/scrollbar/Scrollbar';
import dynamic from 'next/dynamic';

//Left Sidebar 전역상태
import LnbSmallStateStore from 'store/lnbSmallStore';

const Scrollbars = dynamic(
  () => import('react-custom-scrollbars-2').then((mod) => mod.Scrollbars),
  { ssr: true },
);

// Assets
import { IoArrowForward, IoArrowBack } from 'react-icons/io5';
import { IRoute } from 'types/navigation';

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

  let variantChange = '0.2s linear';
  let shadow = useColorModeValue(
    '14px 17px 40px 4px rgba(112, 144, 176, 0.08)',
    'unset',
  );
  // Chakra Color Mode
  let sidebarBg = useColorModeValue('white', 'navy.800');
  let sidebarMargins = '0px';

  // SIDEBAR
  return (
    <Box display={{ xl: 'none', sm: 'block' }} position="fixed" minH="100%">
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

export function SidebarPCResponsive(props: SidebarResponsiveProps) {
  let sidebarBackgroundColor = useColorModeValue('white', 'navy.800');
  let menuColor = useColorModeValue('gray.400', 'white');
  // // SIDEBAR
  const setLeftSmallState = LnbSmallStateStore((state) => state.setSmallState);
  const isSmall = LnbSmallStateStore(state => state.isSmall);

  const btnRef = React.useRef();
  const { routes } = props;
  // let isWindows = navigator.platform.startsWith("Win");
  //  BRAND

  return (
    <Flex display={{ xl: 'flex', sm: 'none' }} alignItems="center">
      <Flex ref={btnRef} w="max-content" h="max-content" onClick={()=>setLeftSmallState(!isSmall)}>
        <Icon
          as={isSmall ? IoArrowForward : IoArrowBack}
          color={menuColor}
          my="auto"
          w="20px"
          h="20px"
          me="10px"
          _hover={{ cursor: 'pointer' }}
        />
      </Flex>
    </Flex>
  );
}
// PROPS

type WindowSize = {
  width: number
  height: number
}


export default Sidebar;
