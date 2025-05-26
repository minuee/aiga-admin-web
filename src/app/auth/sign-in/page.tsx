'use client';

import React from 'react';
// Chakra imports
import { Box,Button,useColorMode,Flex,FormControl,FormLabel,Heading,Icon,Input,InputGroup,InputRightElement,Text,useColorModeValue,useToast,Spinner} from '@chakra-ui/react';
import { redirect } from 'next/navigation';
// Custom components
import { authProvider } from "services/auth";
import DefaultAuthLayout from 'layouts/auth/Default';
// Asset
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { RiEyeCloseLine } from 'react-icons/ri';
import Image from 'next/image';
import functions from "utils/functions";
//로그인 전역상태
import AdminUserStateStore from 'store/userStore';

export default function SignIn() {
  const setAdminLoginUserInfo = AdminUserStateStore((state) => state.setAdminUserState);
  const [isLoading, setIsLoading] = React.useState(false);
  // Chakra color mode
  const { colorMode, toggleColorMode } = useColorMode();
  const textColor = useColorModeValue('navy.700', 'white');
  const textColorSecondary = 'gray.400';
  const textColorDetails = useColorModeValue('navy.700', 'secondaryGray.600');
  const textColorBrand = useColorModeValue('brand.500', 'white');
  const brandStars = useColorModeValue('brand.500', 'brand.400');
  const googleBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.200');
  const googleText = useColorModeValue('navy.700', 'white');
  const googleHover = useColorModeValue({ bg: 'gray.200' },{ bg: 'whiteAlpha.300' });
  const googleActive = useColorModeValue({ bg: 'secondaryGray.300' },{ bg: 'whiteAlpha.200' });
  const toast = useToast();

  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);
  const [login, setLogin] = React.useState({
    staff_id: '',
    staff_pw: '',
  });

  const onHandleChage = (event: any) => {
    setLogin({
      ...login,
      [event.target.id]: event.target.value,
    });
  };

  const handleLogin = async () => {
    toast.closeAll();
    
    if (login.staff_id.trim() == '') {
      functions.simpleToast(toast,`아이디를 입력해주세요`);
    } else if (login.staff_pw.trim() == '') {
      functions.simpleToast(toast,`비밀번호를 입력해주세요`);
    } else if (login.staff_pw.trim().length < 4) {
      functions.simpleToast(toast,`비밀번호를 제대로 입력해주세요`);
    } else {
      setIsLoading(true);
      try {
        const ret = await authProvider.signin(login.staff_id.trim(), login.staff_pw.trim());
        const prefixHead = process.env.NODE_ENV == 'development' ? "" : "/admin"
        if (!ret.is_ok ) {
          setIsLoading(false);
          functions.simpleToast(toast,`잘못된 정보입니다.`);
          return {
            error: "Invalid login attempt",
          };
        }else{
          setIsLoading(false);
          setAdminLoginUserInfo(
            true,
            login.staff_id,
            ret.data.role,
            ret.data.nickName
          );
          setTimeout(() => redirect(`${prefixHead}/v1/dashboard`), 500);
        }
      } catch (error) {
        // Unused as of now but this is how you would handle invalid
        // username/password combinations - just like validating the inputs
        // above
        functions.simpleToast(toast,`잘못된 정보입니다.`);
        setIsLoading(false);
        return {
          error: "Invalid login attempt",
        };
      }      
    }
  };

  const handleEnterPress = (e: any) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <DefaultAuthLayout illustrationBackground={`${process.env.NEXT_PUBLIC_ASSETS_PREFIX}/img/auth/bg.png`}>
      <Flex
        maxW={{ base: '100%', md: 'max-content' }}
        w="100%"
        mx={{ base: 'auto', lg: '0px' }}
        me="auto"
        h="100%"
        alignItems="start"
        justifyContent={{base : "flex-start", md : "center"}}
        mb={{ base: '30px', md: '60px' }}
        px={{ base: '15px', md: '0px' }}
        mt={{ base: '0px', md: '14vh' }}
        flexDirection="column"
      >
        {
          isLoading && (
            <Box display="flex" justifyContent="center" alignItems="center" w="100%" h="100%" position="absolute" top="0" left="0" bg="rgba(0, 0, 0, 0.5)" opacity="0.5" zIndex="1000">
              <Spinner size="lg" />
            </Box>
          )
        }
        <Box me="auto" width={'100%'}>
          <Flex display={{base : 'flex', xl : 'none'}} justifyContent={'center'} alignItems={'center'} my={{base : '30px', md : 0}} minH={{base : "60px", md:"0px"}} >
            <Image src={colorMode == 'light' ? require("../../../img/admin_logo3.png") : require("../../../img/admin_logo3_white.png")} alt='aigia' height={40}/>
          </Flex>
          <Heading color={textColor} fontSize={{base : "30px", md:"36px"}} mb="10px">
            Sign In
          </Heading>
          <Text
            mb={{base : "25px", md : "36px"}}
            ms="4px"
            color={textColorSecondary}
            fontWeight="400"
            fontSize="sm"
          >
            AIGA 전용 Admin Page ( 비밀번호와 패스워드는 관리자에게 문의하세요 )
          </Text>
        </Box>
        <Flex
          zIndex="2"
          direction="column"
          w={{ base: '100%', md: '420px' }}
          maxW="100%"
          background="transparent"
          borderRadius="15px"
          mx={{ base: 'auto', lg: 'unset' }}
          me="auto"
          mb={{ base: '20px', md: 'auto' }}
        >
          <FormControl>
            <FormLabel
              display="flex"
              ms="4px"
              fontSize="sm"
              fontWeight="500"
              color={textColor}
              mb="8px"
            >
              Email<Text color={brandStars}>*</Text>
            </FormLabel>
            <Input
              isRequired={true}
              variant="auth"
              id="staff_id"
              fontSize="sm"
              ms={{ base: '0px', md: '0px' }}
              type="email"
              placeholder="mail@kormedi.com"
              mb="24px"
              fontWeight="500"
              size="lg"
              onChange={(e) => {
                onHandleChage(e);
              }}
            />
            <FormLabel
              ms="4px"
              fontSize="sm"
              fontWeight="500"
              color={textColor}
              display="flex"
            >
              Password<Text color={brandStars}>*</Text>
            </FormLabel>
            <InputGroup size="md">
              <Input
                isRequired={true}
                fontSize="sm"
                id="staff_pw"
                placeholder="Min. 4 characters"
                mb="24px"
                size="lg"
                type={show ? 'text' : 'password'}
                variant="auth"
                onChange={(e) => {
                  onHandleChage(e);
                }}
              />
              <InputRightElement display="flex" alignItems="center" mt="4px">
                <Icon
                  color={textColorSecondary}
                  _hover={{ cursor: 'pointer' }}
                  as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                  onClick={handleClick}
                />
              </InputRightElement>
            </InputGroup>
            {/* <Flex justifyContent="space-between" align="center" mb="24px">
              <FormControl display="flex" alignItems="center">
                <Checkbox
                  id="remember-login"
                  colorScheme="brandScheme"
                  me="10px"
                />
                <FormLabel
                  htmlFor="remember-login"
                  mb="0"
                  fontWeight="normal"
                  color={textColor}
                  fontSize="sm"
                >
                  Keep me logged in
                </FormLabel>
              </FormControl>
            </Flex> */}
            <Button
              fontSize="sm"
              variant="brand"
              fontWeight="500"
              w="100%"
              h="50"
              mb="24px"
              onClick={handleLogin}
              id="button_signin"
            >
              Sign In
            </Button>
          </FormControl>
        </Flex>
      </Flex>
    </DefaultAuthLayout>
  );
}
