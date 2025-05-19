'use client';
import React, { PropsWithChildren } from 'react';

// chakra imports
import { Box,Flex,Button,Text,SkeletonCircle,SkeletonText,Divider,Icon,Textarea,Input, FormControl, FormLabel, RadioGroup, Radio, Stack, useColorModeValue} from '@chakra-ui/react';


export interface InquiryDetailProps extends PropsWithChildren {
  isOpen : boolean;
  setClose : () => void;
  inquiryId : string;
}

function InquiryDetail(props: InquiryDetailProps) {
  const { isOpen, setClose, inquiryId } = props;
  const [isLoading, setIsLoading] = React.useState(true);  
  const [inputs, setInputs] = React.useState<any>({
    doctorId: '',
    relation: '',
    req_name : '',
    req_phone : '',
    req_comment : '',
  });
  const skeletonColor = useColorModeValue('white', 'navy.700');
  
  React.useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [isOpen]);

  const onHandleRegistReview = (data:any) => {
    console.log('onHandleRegistReview', data);
  }

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
              <FormLabel>요청자 이름</FormLabel>
              <Input 
                type="text" 
                placeholder='이름' 
                readOnly
              />
            </FormControl>
          </Box>              
          <Box flex={1}>
            <FormControl variant="floatingLabel">
              <FormLabel>연락처</FormLabel>
              <Input 
                type="text" 
                placeholder='연락처' 
                readOnly
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
                readOnly
              />
            </FormControl>
          </Box>              
          <Box flex={1}>
            <FormControl variant="floatingLabel">
              <FormLabel>관계</FormLabel>
              <RadioGroup defaultValue='1'>
                <Stack spacing={5} direction='row' padding={'10px'}>
                  <Radio colorScheme='red' value='1' readOnly>
                    본인
                  </Radio>
                  <Radio colorScheme='green' value='2' readOnly>
                    관계자
                  </Radio>
                  <Radio colorScheme='blue' value='3' readOnly>
                    기타
                  </Radio>
                </Stack>
              </RadioGroup>
            </FormControl>
          </Box>
        </Flex> 
        <Flex display={'flex'} flexDirection={'row'} minHeight={'50px'} padding={'0 10px'}>
          <Box mt={5} width={'100%'}>
            <FormControl variant="floatingLabel">
              <FormLabel>요청사항</FormLabel>
              <Textarea 
                variant={'outline'} 
                value={inputs.req_comment} 
                //onChange={(e) => setInputs({...inputs, req_comment: e.target.value})} 
                resize={'none'}  
                minH={'150px'}
                width={'100%'}
                size={'sm'} 
                readOnly
              />
            </FormControl>
          </Box>   
        </Flex>
        <Divider orientation='horizontal' py={2}/>
        <Flex display={'flex'} flexDirection={'row'} minHeight={'50px'} padding={'0 10px'} mt={5}>
          <Box flex={1}>
            <FormControl variant="floatingLabel">
              <FormLabel>코멘트</FormLabel>
              <Input 
                type="text" 
                placeholder='간략히 적으세요' 
                readOnly
              />
            </FormControl>
          </Box>              
          <Box flex={1}>
            <FormControl variant="floatingLabel">
              <FormLabel>처리</FormLabel>
              <RadioGroup defaultValue='1'>
                <Stack spacing={5} direction='row' padding={'10px'}>
                  <Radio colorScheme='red' value='1' readOnly>
                    완료
                  </Radio>
                  <Radio colorScheme='green' value='2' readOnly>
                    보류
                  </Radio>
                  <Radio colorScheme='blue' value='3' readOnly>
                    대기
                  </Radio>
                </Stack>
              </RadioGroup>
            </FormControl>
          </Box>
        </Flex>
        <Box display={'flex'} flexDirection={'row'} justifyContent={'center'}  width={'98%'} mt={5}>
          <Button 
            colorScheme='blue' 
            variant='solid' 
            width={'200px'} 
            borderRadius={'10px'}
            onClick={() => onHandleRegistReview(inputs)}
          >
            수정
          </Button>
        </Box>
        <Box height={'50px'} />
      </>
    )
  }
}


export default InquiryDetail;
