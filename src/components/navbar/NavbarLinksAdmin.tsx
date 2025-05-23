'use client';
// Chakra Imports
import { Box,Button,Center,Flex,Icon,Menu,MenuButton,MenuItem,MenuList,Text,useColorMode,useColorModeValue,useMediaQuery } from '@chakra-ui/react';
// Custom Components
import { SidebarResponsive } from 'components/sidebar/Sidebar';
import { SidebarPCResponsive } from 'components/sidebar/PCSidebar';
// Assets
import { IoMdMoon, IoMdSunny } from 'react-icons/io';
import routes from 'routes';
import IconFullScreen from "components/icons/IconFullScreen";
import functions from 'utils/functions';
//로그인 전역상태
import AdminUserStateStore from 'store/userStore';
import { redirect } from 'next/navigation';

export default function HeaderLinks(props: {
  secondary: boolean;
  onOpen: boolean | any;
  fixed: boolean | any;
}) {
  const { secondary } = props;
  const { colorMode, toggleColorMode } = useColorMode();
  const [isDesktop] = useMediaQuery('(min-width: 800px)')

  // Chakra Color Mode
  const navbarIcon = useColorModeValue('gray.400', 'white');
  let menuBg = useColorModeValue('white', 'navy.800');
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const textColorBrand = useColorModeValue('brand.700', 'brand.400');
  const ethColor = useColorModeValue('gray.700', 'white');
  const borderColor = useColorModeValue('#E6ECFA', 'rgba(135, 140, 189, 0.3)');
  const ethBg = useColorModeValue('secondaryGray.300', 'navy.900');
  const ethBox = useColorModeValue('white', 'navy.800');
  const shadow = useColorModeValue( '14px 17px 40px 4px rgba(112, 144, 176, 0.18)','14px 17px 40px 4px rgba(112, 144, 176, 0.06)');
  const borderButton = useColorModeValue('secondaryGray.500', 'whiteAlpha.200');
  const setAdminLoginUserInfo = AdminUserStateStore((state) => state.setAdminUserState);
  const { nickName, ...userInfo } = AdminUserStateStore(state => state);

  const onHandleClick = () => {
    setAdminLoginUserInfo(
      false,
      "",
      false,
      ""
    );

    setTimeout(() => redirect('/auth/sign-in'), 500);
  }
  return (
    <Flex
      w={{ sm: '100%', md: 'auto' }}
      alignItems="center"
      justifyContent={'flex-end'}
      flexDirection="row"
      bg={menuBg}
      flexWrap={secondary ? { base: 'wrap', md: 'nowrap' } : 'unset'}
      p={{base : "5px", xl : "10px"}}
      borderRadius={{ base : "15px", xl : "30px"}}
      boxShadow={shadow}
    >
      <SidebarResponsive routes={routes} />
      <SidebarPCResponsive routes={routes} />
      <Button
        variant="no-hover"
        bg="transparent"
        p="0px"
        minW="unset"
        minH="unset"
        h="18px"
        w="max-content"
        onClick={toggleColorMode}
        id="button_toggle_mode"
      >
        <Icon
          me="5px"
          h="18px"
          w="18px"
          color={navbarIcon}
          as={colorMode === 'light' ? IoMdMoon : IoMdSunny}
        />
      </Button>
      {
        isDesktop && (
          <Box display={{sm: 'none' , md : 'flex'}}>
            <IconFullScreen />
          </Box>
        )
      }
      <Menu>
        <MenuButton p="0px" style={{ position: 'relative' }}>
          <Box
            _hover={{ cursor: 'pointer' }}
            color="white"
            bg="#11047A"
            w={{base : "30px", xl : "40px"}}
            h={{base : "30px", xl : "40px"}}
            borderRadius={'50%'}
          />
          <Center top={0} left={0} position={'absolute'} w={'100%'} h={'100%'}>
            <Text fontSize={'xs'} fontWeight="bold" color={'white'}>
              {nickName ? nickName?.substring(0,2) : "??" }
            </Text>
          </Center>
        </MenuButton>
        <MenuList
          boxShadow={shadow}
          p="0px"
          mt="10px"
          borderRadius="20px"
          bg={menuBg}
          border="none"
        >
          <Flex w="100%" mb="0px">
            <Text
              ps="20px"
              pt="16px"
              pb="10px"
              w="100%"
              borderBottom="1px solid"
              borderColor={borderColor}
              fontSize="sm"
              fontWeight="700"
              color={textColor}
            >
              👋&nbsp; Hey, {nickName ? nickName : "AI" }님
            </Text>
          </Flex>
          <Flex flexDirection="column" p="10px" onClick={()=> onHandleClick()}>
            <MenuItem
              _hover={{ bg: 'none' }}
              _focus={{ bg: 'none' }}
              color="red.400"
              borderRadius="8px"
              px="14px"
            >
              <Text fontSize="sm">Log out</Text>
            </MenuItem>
          </Flex>
        </MenuList>
      </Menu>
    </Flex>
  );
}