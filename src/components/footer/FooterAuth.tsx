/* eslint-disable */

import { Flex,Link,Text,useColorModeValue } from '@chakra-ui/react';

export default function Footer(props: { [x: string]: any }) {

  let textColor = useColorModeValue('gray.400', 'white');
  let linkColor = useColorModeValue({ base: 'gray.400', lg: 'white' }, 'white');
  
  return (
    <Flex
      position={{base : 'absolute' ,md : 'relative'}}
      left={{base :0, md : 'auto'}}
      bottom={{base :0, md : 'auto'}}
      zIndex="3"
      flexDirection={{ base: 'column',lg: 'row' }}
      alignItems={{ base: 'center',xl: 'start'}}
      justifyContent="space-between"
      px={{ base: '20px', md: '0px' }}
      pb="30px"
      {...props}
    >
      <Text
        color={textColor}
        textAlign={{ base: 'center',xl: 'start'}}
        mb={{ base: '10px', lg: '0px' }}
      >
        {' '}
        &copy; {new Date().getFullYear()}
        <Text as="span" fontWeight="500" ms="4px">
          AIGA. All Rights Reserved. Powered by
          <Link mx="3px" color={textColor} href="https://www.simmmple.com" target="_blank" fontWeight="700">
            Noh.S.N
          </Link>
        </Text>
      </Text>
    </Flex>
  );
}
