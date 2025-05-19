'use client';
import React, { PropsWithChildren } from 'react';

// chakra imports
import { Box,Flex,Button,Text,SkeletonCircle,SkeletonText,Divider,Icon,Textarea,Input, FormControl, FormLabel, RadioGroup, Radio, Stack, useColorModeValue} from '@chakra-ui/react';
import functions from 'utils/functions';

export interface MemberDetailProps extends PropsWithChildren {
  isOpen : boolean;
  setClose : () => void;
  memberId : string;
}

function MemberDetail(props: MemberDetailProps) {
  const { isOpen, setClose, memberId } = props;
  const [isLoading, setIsLoading] = React.useState(true);  
  const [inputs, setInputs] = React.useState<any>({
    doctorId: '',
    relation: '',
    req_name : '',
    req_phone : '',
    req_comment : '',
  });

  React.useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [isOpen]);
  const skeletonColor = useColorModeValue('white', 'navy.700');
  
  if ( isLoading ) {
    return (
      <Box padding='6' boxShadow='lg' bg={skeletonColor}>
        <SkeletonCircle size='10' />
        <SkeletonText mt='4' noOfLines={4} spacing='4' skeletonHeight='2' />
      </Box>
    )
  }else{

    return (
      <>
        <Flex display={'flex'} flexDirection={'row'} minHeight={'50px'} padding={'0 10px'}>
          <Box flex={1}>
            <FormControl variant="floatingLabel">
              <FormLabel>이름</FormLabel>
              <Input 
                type="text" 
                placeholder='이름' 
                onChange={(e) => setInputs({...inputs, req_name: e.target.value})}
              />
            </FormControl>
          </Box>              
          <Box flex={1}>
            <FormControl variant="floatingLabel">
              <FormLabel>이메일주소</FormLabel>
              <Input 
                type="text" 
                placeholder='이메일주소' 
                onChange={(e) => setInputs({...inputs, req_phone: e.target.value})}
              />
            </FormControl>
          </Box>
        </Flex> 
        <Flex display={'flex'} flexDirection={'row'} minHeight={'50px'} padding={'0 10px'} mt={5}>
          <Box flex={1}>
            <FormControl variant="floatingLabel">
              <FormLabel>등록일자</FormLabel>
              <Input 
                type="text" 
                placeholder='등록일자' 
                onChange={(e) => setInputs({...inputs, req_name: e.target.value})}
              />
            </FormControl>
          </Box>              
          <Box flex={1}>
            <FormControl variant="floatingLabel">
              <FormLabel>등급</FormLabel>
              <RadioGroup defaultValue='1'>
                <Stack spacing={5} direction='row' padding={'10px'}>
                  <Radio colorScheme='red' value='1' onClick={() => setInputs({...inputs, relation: '1'})}>
                    Platinum
                  </Radio>
                  <Radio colorScheme='green' value='2' onClick={() => setInputs({...inputs, relation: '2'})}>
                    Gold
                  </Radio>
                  <Radio colorScheme='blue' value='3' onClick={() => setInputs({...inputs, relation: '3'})}>
                    Silver
                  </Radio>
                  <Radio colorScheme='blue' value='4' onClick={() => setInputs({...inputs, relation: '4'})}>
                    Bronze
                  </Radio>
                </Stack>
              </RadioGroup>
            </FormControl>
          </Box>
        </Flex> 
        <Flex display={'flex'} flexDirection={'row'} minHeight={'50px'} padding={'0 10px'}>
          <Box mt={5}>
            <FormControl variant="floatingLabel">
              <FormLabel>가입경로</FormLabel>
              <RadioGroup defaultValue='1'>
                <Stack spacing={5} direction='row'>
                  <Radio colorScheme='red' value='1' onClick={() => setInputs({...inputs, relation: '1'})}>
                    AIGA
                  </Radio>
                  <Radio colorScheme='green' value='2' onClick={() => setInputs({...inputs, relation: '2'})}>
                    Naver
                  </Radio>
                  <Radio colorScheme='blue' value='3' onClick={() => setInputs({...inputs, relation: '3'})}>
                    Kakao
                  </Radio>
                </Stack>
              </RadioGroup>
            </FormControl>
          </Box>   
        </Flex>
        <Box height={'50px'} />
      </>
    )
  }
}

export default MemberDetail;