'use client';
import React, { PropsWithChildren } from 'react';
import * as OpinionService from "services/opinion/index";

// chakra imports
import { Box,Flex,Button,Text,SkeletonCircle,SkeletonText,Divider,Icon,Textarea,Input, FormControl, FormLabel, RadioGroup, Radio, Stack, useColorModeValue, useToast} from '@chakra-ui/react';
import useCheckAdmin from "store/useCheckAdmin";
import functions from 'utils/functions';

export interface InquiryDetailProps extends PropsWithChildren {
  isOpen : boolean;
  setClose : () => void;
  data : any;
  refetchData: () => void;
}

interface Inputs {
  is_clear: string;
}

function InquiryDetail(props: InquiryDetailProps) {
  const { isOpen, setClose, data, refetchData } = props;
  const isAdmin = useCheckAdmin();
  const toast = useToast();
  const [isLoading, setIsLoading] = React.useState(true);  
  const [inputs, setInputs] = React.useState<any>({
    opinion_id: '',
    user_id: '',
    opinion_type : '',
    doctor_id : '',
    title : '',
    content : '',
    nickname : '',
    doctor_name : '',
    hospital_name : '',
    is_clear: '0',
    comment: ''
  });
  const skeletonColor = useColorModeValue('white', 'navy.700');
  const textColor = useColorModeValue('navy.700', 'white');

  React.useEffect(() => {
    if (isOpen && data) {
      setInputs({
        ...data,
        doctor_name : data?.doctor_basic?.doctorname,
        hospital_name : data?.doctor_basic?.hospital?.shortName,
        is_clear: data?.is_clear || '0',
        comment: data?.comment || ''
      })
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  }, [isOpen, data]);

  const onHandleRegistReview = async (updateData:any) => {
    try {
      const res = await OpinionService.updateOpinion(updateData.opinion_id, {
        is_clear: updateData.is_clear,
        comment: updateData.comment,
      });
      if (res.status === 200) {
        toast({
          title: "성공",
          description: "수정요청이 처리되었습니다.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        refetchData(); // Refetch data in the parent component
        setClose(); // Close the modal
      } else {
        throw new Error(`API returned status ${res.status}`);
      }
    } catch (e) {
      console.error("Failed to update opinion:", e);
      toast({
        title: "오류",
        description: "처리 중 오류가 발생했습니다.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setInputs((prev: any) => ({ ...prev, [id]: value }));
  };

  const handleRadioChange = (value: string) => {
    setInputs((prev: any) => ({ ...prev, is_clear: value }));
  };

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
        <Flex display={'flex'} flexDirection={{base : 'column' , xl : 'row'}}  minHeight={'50px'} padding={'0 10px'} mt={5}>
          <Box flex={1}>
            <FormControl variant="floatingLabel">
              <FormLabel>요청자 이름</FormLabel>
              <Input type="text" placeholder='이름' disabled id='nickname' readOnly value={inputs.nickname} />
            </FormControl>
          </Box>  
          <Box flex={1}>
            <FormControl variant="floatingLabel">
              <FormLabel>등록일자</FormLabel>
              <Input type="text" placeholder='등록일자' disabled id='regDate' readOnly value={functions.dateToDateTime(inputs.createAt)}/>
            </FormControl>
          </Box>              
        </Flex> 
        <Flex display={'flex'} flexDirection={{base : 'column' , xl : 'row'}}  minHeight={'50px'} padding={'0 10px'}>      
          <Box flex={1} mt={{base : 5, xl : 0}}>
            <FormControl variant="floatingLabel">
              <FormLabel>병원명</FormLabel>
              <Input type="text" placeholder='병원명' disabled id='hospital_name' readOnly value={inputs.hospital_name}  />
            </FormControl>
          </Box>
          <Box flex={1} mt={{base : 5, xl : 0}}>
            <FormControl variant="floatingLabel">
              <FormLabel>의사명</FormLabel>
              <Input type="text" placeholder='의사명' disabled id='doctor_name' readOnly value={inputs.doctor_name}  />
            </FormControl>
          </Box>
        </Flex> 
        
        <Flex display={'flex'} flexDirection={{base : 'column' , xl : 'row'}}  minHeight={'50px'} padding={'0 10px'}>
          <Box mt={5} width={'100%'}>
            <FormControl variant="floatingLabel">
              <FormLabel>요청사항</FormLabel>
              <Textarea 
                variant={'outline'} 
                value={inputs?.content} 
                resize={'none'}  
                minH={'150px'}
                width={'100%'}
                size={'sm'} 
                isDisabled
                id="req_content"
              />
            </FormControl>
          </Box>   
        </Flex>
        <Divider orientation='horizontal' py={2}/>
        <Flex display={'flex'} flexDirection={{base : 'column' , xl : 'row'}}  minHeight={'50px'} padding={'0 10px'} mt={5}>
          <Box flex={1}>
            <FormControl variant="floatingLabel">
              <FormLabel>코멘트</FormLabel>
              <Input 
                type="text" 
                placeholder='간략히 적으세요' 
                id='comment'
                value={inputs.comment}
                onChange={handleInputChange}
                disabled={!isAdmin}
                color={textColor}
              />
            </FormControl>
          </Box>              
          <Box flex={1} mt={{base : 5, xl : 0}}>
            <FormControl variant="floatingLabel">
              <FormLabel>처리</FormLabel>
              <RadioGroup 
                value={inputs?.is_clear}
                onChange={handleRadioChange}
              >
                <Stack spacing={5} direction='row' padding={'10px'}>
                  <Radio colorScheme='blue' value='0'  isDisabled={!isAdmin}>대기</Radio>
                  <Radio colorScheme='red' value='1' isDisabled={!isAdmin}>완료</Radio>
                  <Radio colorScheme='green' value='9'  isDisabled={!isAdmin} >보류</Radio>
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

export default InquiryDetail;