// chakra imports
import { Box, Flex, HStack, Text, useColorModeValue,useDisclosure } from '@chakra-ui/react';
import Link from 'next/link';
import { IRoute } from 'types/navigation';
import { usePathname } from 'next/navigation';
import { useCallback } from 'react';
//Left Sidebar 전역상태
import LnbStateStore from 'store/lnbStore';
import LnbSmallStateStore from 'store/lnbSmallStore';

interface SidebarLinksProps {
  routes: IRoute[];
}

export function SidebarLinks(props: SidebarLinksProps) {
  const { routes } = props;
  // // SIDEBAR
  const { isOpen, onOpen, onClose } = useDisclosure();
  const setLeftOpenState = LnbStateStore((state) => state.setOpenState);
  const isSmall = LnbSmallStateStore(state => state.isSmall);
  const isLeftOpen = LnbStateStore(state => state.isOpen);

  //   Chakra color mode
  const pathname = usePathname();

  let activeColor = useColorModeValue('gray.700', 'white');
  let inactiveColor = useColorModeValue('secondaryGray.600','secondaryGray.600');
  let activeIcon = useColorModeValue('brand.500', 'white');
  let textColor = useColorModeValue('secondaryGray.500', 'white');
  let brandColor = useColorModeValue('brand.500', 'brand.400');
  console.log("process.env.NEXT_PUBLIC_ASSETS_PREFIX",process.env.NEXT_PUBLIC_ASSETS_PREFIX)
  // verifies if routeName is the one active (in browser input)
  const activeRoute = useCallback(
    (routeName: string) => {
      return pathname?.includes(routeName);
    },
    [pathname],
  );


  const onHandleClick = (url:string) => {
    if ( isLeftOpen ) {
      setTimeout(() => setLeftOpenState(false), 600);
    }
  }

  // this function creates the links from the secondary accordions (for example auth -> sign-in -> default)
  const createLinks = (routes: IRoute[]) => {
    return routes.map((route, index: number) => {
      if ( route.layout === '/v1' || route.layout === '/auth' || route.layout === '/rtl' ) {
        return (
          <Link key={index} href={process.env.NEXT_PUBLIC_ASSETS_PREFIX +  route.layout + route.path} onClick={()=>onHandleClick(route.path)}>
            {route.icon ? (
              <Box>
                <HStack
                  spacing={ activeRoute(route.path.toLowerCase()) ? '22px' : '26px'}
                  py="5px"
                  ps="10px"
                >
                  <Flex w="100%" alignItems="center" justifyContent="center">
                    <Box
                      color={ activeRoute(route.path.toLowerCase()) ? activeIcon : textColor}
                      me="18px"
                    >
                      {route.icon}
                    </Box>
                    {
                      
                      (isSmall && !isLeftOpen)
                      ? 
                      null
                      :
                      (
                        <Text
                          me="auto"
                          color={ activeRoute(route.path.toLowerCase()) ? activeColor : textColor }
                          fontWeight={ activeRoute(route.path.toLowerCase()) ? 'bold' : 'normal'}
                        >
                          {route.name}
                        </Text>
                      )
                    }
                    
                  </Flex>
                  <Box
                    h="36px"
                    w="4px"
                    bg={ activeRoute(route.path.toLowerCase()) ? brandColor : 'transparent' }
                    borderRadius="5px"
                  />
                </HStack>
              </Box>
            ) : (
              <Box>
                <HStack
                  spacing={ activeRoute(route.path.toLowerCase()) ? '22px' : '26px'}
                  py="5px"
                  ps="10px"
                >
                  <Text
                    me="auto"
                    color={ activeRoute(route.path.toLowerCase()) ? activeColor : inactiveColor }
                    fontWeight={ activeRoute(route.path.toLowerCase()) ? 'bold' : 'normal' }
                  >
                    {route.name}
                  </Text>
                  <Box h="36px" w="4px" bg="brand.400" borderRadius="5px" />
                </HStack>
              </Box>
            )}
          </Link>
        );
      }
    });
  };
  //  BRAND
  return <>{createLinks(routes)}</>;
}

export default SidebarLinks;