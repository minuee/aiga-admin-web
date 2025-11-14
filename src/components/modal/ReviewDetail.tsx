'use client';
import React, { PropsWithChildren } from 'react';

// chakra imports
import { Box,Flex,Button,Text,SkeletonCircle,SkeletonText,Divider,Textarea,Input, FormControl, FormLabel, RadioGroup, Radio, Stack, useColorModeValue} from '@chakra-ui/react';
import Slider from 'components/etc/Slider';

import useCheckAdmin from "store/useCheckAdmin";
import functions from 'utils/functions';
export interface ReviewDetailProps extends PropsWithChildren {
  isOpen : boolean;
  setClose : () => void;
  reviewId : any;
}

function ReviewDetail(props: ReviewDetailProps) {
  const { isOpen, setClose, reviewId } = props;
  console.log("ReviewDetail",reviewId)
  const isAdmin = useCheckAdmin();
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

  React.useEffect(() => {
    setInputs({
      reg_name: reviewId?.nickname || "-",
      reg_email: reviewId?.email || "-",
      reg_date: reviewId?.createAt ? functions.dateToDateTime(reviewId?.createAt) : "-",
      hospital_name: reviewId?.doctor_basic?.hospital?.shortName || "-",
      doctor_name: reviewId?.doctor_basic?.doctorname || "-",
      ratingKind: reviewId?.kindness_score || 0,
      ratingTreatment: reviewId?.explaination_score || 0,
      ratingDialog: reviewId?.satisfaction_score || 0,
      ratingRecommend: reviewId?.recommand_score || 0,
      comment: reviewId?.content || "",
    })
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [isOpen]);
  const skeletonColor = useColorModeValue('white', 'navy.700');
  const textColor = useColorModeValue('navy.700', 'white');

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
        <Flex display={'flex'} flexDirection={{base : 'column' , xl : 'row'}} minHeight={'50px'} padding={{base : '0', xl : '0 10px'}}>
          <Box flex={1}>
            <FormControl variant="floatingLabel">
              <FormLabel>작성자 이름</FormLabel>
              <Input type="text" placeholder='이름' disabled id='reqName' color={textColor} value={inputs.reg_name} readOnly/>
            </FormControl>
          </Box>              
          <Box flex={2} mt={{base : 5, xl : 0}}>
            <FormControl variant="floatingLabel">
              <FormLabel>작성자 이메일</FormLabel>
              <Input type="text" placeholder='이메일' disabled id='reqEmail' color={textColor} value={inputs.reg_email} readOnly />
            </FormControl>
          </Box>
          <Box flex={1} mt={{base : 5, xl : 0}}>
            <FormControl variant="floatingLabel">
              <FormLabel>등록일자</FormLabel>
              <Input type="text" placeholder='등록일자' disabled id='regDate' color={textColor} value={inputs.reg_date} readOnly />
            </FormControl>
          </Box>   
        </Flex> 
        <Flex display={'flex'} flexDirection={{base : 'column' , xl : 'row'}} minHeight={'50px'} padding={{base : '0', xl : '0 10px'}} mt={5}>
          <Box flex={1}>
            <FormControl variant="floatingLabel">
              <FormLabel>병원명</FormLabel>
              <Input type="text" placeholder='병원명' disabled id='hospitalName' color={textColor} value={inputs.hospital_name} readOnly/>
            </FormControl>
          </Box>              
          <Box flex={1} mt={{base : 5, xl : 0}}>
            <FormControl variant="floatingLabel">
              <FormLabel>의사명</FormLabel>
              <Input type="text" placeholder='의사명' disabled id='doctorName' color={textColor} value={inputs.doctor_name} readOnly />
            </FormControl>
          </Box> 
        </Flex> 
        <Flex display={'flex'} flexDirection={{base : 'column' , xl : 'row'}} minHeight={'50px'} padding={{base : '0', xl : '0 10px'}}>
          <Box mt={5} width={'100%'}>
            <FormControl variant="floatingLabel">
              <FormLabel>평가</FormLabel>
              <Flex display={'flex'} flexDirection={'column'} minHeight={'100px'} padding={{base : '0', xl : '0 10px'}} mt={{base : 5, xl : 0}}>
                <Box display={'flex'} flexDirection={'row'} justifyContent={'center'}  width={'98%'} mb={10}>
                  <Box flex={1} display={'flex'} justifyContent={'flex-end'} alignItems={'center'} pr={3}>
                    <Text fontSize={'14px'} fontWeight={'bold'}>친절•배려</Text>
                  </Box>
                  <Box flex={4} display={'flex'} flexDirection={'column'}>
                    <Slider
                      data={inputs.ratingKind} 
                      readOnly={true}
                      setInputs={(value) => setInputs({...inputs, ratingKind: value})} 
                    />
                  </Box>
                </Box>
                <Box display={'flex'} flexDirection={'row'} justifyContent={'center'}  width={'98%'} mb={10}>
                  <Box flex={1} display={'flex'} justifyContent={'flex-end'} alignItems={'center'} pr={3}>
                    <Text fontSize={'14px'} fontWeight={'bold'}>치료 결과 만족도</Text>
                  </Box>
                  <Box flex={4} display={'flex'} flexDirection={'column'}>
                    <Slider
                      data={inputs.ratingTreatment} 
                      readOnly={true}
                      setInputs={(value) => setInputs({...inputs, ratingTreatment: value})} 
                    />
                  </Box>
                </Box>
                <Box display={'flex'} flexDirection={'row'} justifyContent={'center'}  width={'98%'} mb={10}>
                  <Box flex={1} display={'flex'} justifyContent={'flex-end'} alignItems={'center'} pr={3}>
                    <Text fontSize={'14px'} fontWeight={'bold'}>쉽고 명쾌한 설명</Text>
                  </Box>
                  <Box flex={4} display={'flex'} flexDirection={'column'}>
                    <Slider
                      data={inputs.ratingDialog} 
                      readOnly={true}
                      setInputs={(value) => setInputs({...inputs, ratingDialog: value})} 
                    />
                  </Box>
                </Box>
                <Box display={'flex'} flexDirection={'row'} justifyContent={'center'}  width={'98%'} mb={10}>
                  <Box flex={1} display={'flex'} justifyContent={'flex-end'} alignItems={'center'} pr={3}>
                    <Text fontSize={'14px'} fontWeight={'bold'}>추천 여부</Text>
                  </Box>
                  <Box flex={4} display={'flex'} flexDirection={'column'}>
                    <Slider
                      data={inputs.ratingRecommend} 
                      readOnly={true}
                      setInputs={(value) => setInputs({...inputs, ratingRecommend: value})} 
                    />
                  </Box>
                </Box>
              </Flex>
            </FormControl>
          </Box>   
        </Flex>
        <Flex display={'flex'} flexDirection={{base : 'column' , xl : 'row'}} minHeight={'50px'} padding={{base : '0', xl : '0 10px'}}>
          <Box mt={5} width={'100%'}>
            <FormControl variant="floatingLabel">
              <FormLabel>내용</FormLabel>
              <Textarea 
                variant={'outline'} 
                value={inputs?.comment} 
                //onChange={(e) => setInputs({...inputs, req_comment: e.target.value})} 
                resize={'none'}  
                minH={'150px'}
                width={'100%'}
                size={'sm'} 
                readOnly
                id='req_comment'
                color={textColor}
              />
            </FormControl>
          </Box>   
        </Flex>
        <Divider orientation='horizontal' py={2}/>
        <Flex display={'flex'} flexDirection={{base : 'column' , xl : 'row'}} minHeight={'50px'} padding={{base : '0', xl : '0 10px'}} mt={{base : 5, xl : 5}}>
          <Box flex={1}>
            <FormControl variant="floatingLabel">
              <FormLabel>코멘트</FormLabel>
              <Input type="text" placeholder='간략히 적으세요' readOnly={!isAdmin} disabled={!isAdmin} id='comment' color={textColor} />
            </FormControl>
          </Box>   
        </Flex>
        <Flex display={'flex'} flexDirection={{base : 'column' , xl : 'row'}} minHeight={'50px'} padding={{base : '0', xl : '0 10px'}} mt={{base : 5, xl : 5}}>       
          <Box flex={1}>
            <FormControl variant="floatingLabel">
              <FormLabel>처리</FormLabel>
              <RadioGroup value={inputs?.is_open}>
                <Stack spacing={5} direction='row' padding={'10px'}>
                  <Radio colorScheme='red' value='1' readOnly={!isAdmin} isDisabled={!isAdmin}>공개</Radio>
                  <Radio colorScheme='green' value='2' readOnly={!isAdmin} isDisabled={!isAdmin}>보류</Radio>
                  <Radio colorScheme='blue' value='3' readOnly={!isAdmin} isDisabled={!isAdmin}>미공개</Radio>
                </Stack>
              </RadioGroup>
            </FormControl>
          </Box>
        </Flex>
        <Box display={isAdmin ? 'flex' : 'none'} flexDirection={'row'} justifyContent={'center'}  width={'98%'} mt={5}>
          <Button 
            colorScheme='blue' 
            variant='solid' 
            width={'200px'} 
            borderRadius={'10px'}
            onClick={() => onHandleRegistReview(inputs)}
            id="button_modify"
          >
            수정
          </Button>
        </Box>
        <Box height={'50px'} />
      </>
    )
  }
}

export default ReviewDetail;