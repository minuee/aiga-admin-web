'use client';
import React, { PropsWithChildren } from 'react';

// chakra imports
import { Box,Flex,Button,Text,SkeletonCircle,SkeletonText,Divider,Icon,Textarea,Input, FormControl, FormLabel, RadioGroup, Radio, Stack, useColorModeValue} from '@chakra-ui/react';
import Slider from 'components/etc/Slider';
import { MdDiversity1 } from 'react-icons/md';
export interface HospitalDetailProps extends PropsWithChildren {
  isOpen : boolean;
  setClose : () => void;
  hospitalData : any;
}

function HospitalDetail(props: HospitalDetailProps) {
  const { isOpen, setClose, hospitalData } = props;
  const [isLoading, setIsLoading] = React.useState(true);  
  const [inputs, setInputs] = React.useState<any>({
    reg_name: '',
    reg_email: '',
    reg_date: '',
    hospital_name: '',
    doctor_name: '',
    ratingKind: 3,
    ratingTreatment: 3,
    ratingDialog: 3,
    ratingRecommend: 3,
    comment: ''
  });

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

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
      <Box padding='6' boxShadow='lg' bg='white'>
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
              <FormLabel>병원코드(HID)</FormLabel>
              <Input 
                type="text" 
                placeholder='이름' 
                borderColor={borderColor}
                color={textColor}
                value={hospitalData?.hid}
                readOnly
              />
            </FormControl>
          </Box>              
          
          <Box flex={1}>
            <FormControl variant="floatingLabel">
              <FormLabel>등록의사수</FormLabel>
              <Input 
                type="text" 
                borderColor={borderColor}
                color={textColor}
                placeholder='0' 
                textAlign={'right'}
                value={hospitalData?.doctor_count}
                readOnly
              />
            </FormControl>
          </Box>   
        </Flex> 
        <Flex display={'flex'} flexDirection={'row'} minHeight={'50px'} padding={'0 10px'} mt={5}>
          <Box flex={1}>
            <FormControl variant="floatingLabel">
              <FormLabel>기본병원명</FormLabel>
              <Input 
                type="text" 
                borderColor={borderColor}
                color={textColor}
                value={hospitalData?.baseName}
                placeholder='병원명' 
                readOnly
              />
            </FormControl>
          </Box>              
          <Box flex={1}>
            <FormControl variant="floatingLabel">
              <FormLabel>숏병원명</FormLabel>
              <Input 
                type="text"
                borderColor={borderColor}
                color={textColor} 
                value={hospitalData?.shortName}
                placeholder='의사명' 
                readOnly
              />
            </FormControl>
          </Box> 
        </Flex> 
        <Flex display={'flex'} flexDirection={'row'} minHeight={'50px'} padding={'0 10px'} mt={5}>
          <Box flex={1}>
            <FormControl variant="floatingLabel">
              <FormLabel>주소</FormLabel>
              <Input 
                type="text" 
                borderColor={borderColor}
                color={textColor}
                placeholder='주소' 
                readOnly
              />
            </FormControl>
          </Box>              
        </Flex> 
        <Flex display={'flex'} flexDirection={'row'} minHeight={'50px'} padding={'0 10px'} mt={5}>
          <Box flex={1}>
            <FormControl variant="floatingLabel">
              <FormLabel>예약사이트</FormLabel>
              <Input 
                type="text" 
                borderColor={borderColor}
                color={textColor}
                placeholder='예약사이트' 
                readOnly
              />
            </FormControl>
          </Box>              
          <Box flex={1}>
            <FormControl variant="floatingLabel">
              <FormLabel>예약전화번호</FormLabel>
              <Input 
                type="text"   
                borderColor={borderColor}
                color={textColor}
                placeholder='예약전화번호' 
                readOnly
              />
            </FormControl>
          </Box> 
        </Flex> 
        
        <Flex display={'flex'} flexDirection={'row'} minHeight={'50px'} padding={'0 10px'}>
          <Box mt={5} width={'100%'}>
            <FormControl variant="floatingLabel">
              <FormLabel>특이사항</FormLabel>
              <Textarea 
                variant={'outline'} 
                value={inputs.req_comment} 
                //onChange={(e) => setInputs({...inputs, req_comment: e.target.value})} 
                resize={'none'}  
                minH={'100px'}
                width={'100%'}
                size={'sm'} 
                readOnly
                borderColor={borderColor}
                color={textColor}
              />
            </FormControl>
          </Box>   
        </Flex>
        <Flex display={'flex'} flexDirection={'row'} minHeight={'50px'} padding={'0 10px'} mt={5}>           
          <Box flex={1}>
            <FormControl variant="floatingLabel">
              <FormLabel>공개여부</FormLabel>
              <RadioGroup defaultValue='1'>
                <Stack spacing={5} direction='row' padding={'10px'}>
                  <Radio colorScheme='red' value='1' readOnly>
                    공개
                  </Radio>
                  <Radio colorScheme='blue' value='3' readOnly>
                    미공개
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


export default HospitalDetail;
