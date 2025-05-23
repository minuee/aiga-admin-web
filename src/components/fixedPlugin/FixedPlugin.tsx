// Chakra Imports
import { Button, Icon, useColorMode } from '@chakra-ui/react';
// Custom Icons
import { IoMdMoon, IoMdSunny } from 'react-icons/io';
import React, { useEffect } from 'react';
import { isWindowAvailable } from 'utils/navigation';

export default function FixedPlugin (props: { [x: string]: any }) {
  const { ...rest } = props
  const { colorMode, toggleColorMode } = useColorMode();
  let bgButton = 'linear-gradient(135deg, #868CFF 0%, #4318FF 100%)';

  let left = '';
  let right = '35px';

  return (
    <Button
      {...rest}
      h={{base : "40px", md : '60px'}}
      w={{base : "40px", md : '60px'}}
      bg={bgButton}
      zIndex='99'
      position='fixed'
      variant='no-effects'
      left={left}
      right={{base : '10px', md : "35px"}}
      bottom={{base : "10px", md : '30px'}}
      border='1px solid'
      borderColor='#6A53FF'
      borderRadius={{base :  "20px", md : '50px'}}
      onClick={toggleColorMode}
      display='flex'
      p='0px'
      alignItems='center'
      justifyContent='center'
    >
      <Icon
        h={{base : "20px", md:'24px'}}
        w={{base : "20px", md:'24px'}}
        color='white'
        as={colorMode === 'light' ? IoMdMoon : IoMdSunny}
      />
    </Button>
  )
}