'use client';
import React, { PropsWithChildren } from 'react';

// chakra imports
import { Box,Flex,Button,useToast,SkeletonCircle,SkeletonText,Textarea,Input, FormControl, FormLabel, RadioGroup, Radio, Stack, useColorModeValue } from '@chakra-ui/react';
import * as HospitalService from "services/hospital/index";
import useCheckAdmin from "store/useCheckAdmin";
import functions from 'utils/functions';
import CustomAlert from 'components/etc/CustomAlert';

export interface HospitalDetailProps extends PropsWithChildren {
  isOpen : boolean;
  setClose : () => void;
  setCloseAndReload : () => void;
  hospitalData : any;
}

function HospitalDetail(props: HospitalDetailProps) {
  const { isOpen, setClose, setCloseAndReload, hospitalData } = props;
  const toast = useToast();
  const isAdmin = useCheckAdmin();
  const [isLoading, setIsLoading] = React.useState(true);  
  const [isShowConfirm, setIsShowConfirm] = React.useState(false);  
  const [inputs, setInputs] = React.useState<any>({
    hid : null,
    address : null,
    baseName : null,
    shortName : null,
    lat : null,
    lon : null,
    yoyang_giho : null,
    doctor_count : 0,
    reservation_site: null,
    telephone: null,
    req_comment: null,
    isOpen : 'true'
  })

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const skeletonColor = useColorModeValue('white', 'navy.700');
  
  React.useEffect(() => {
    setTimeout(() => {
      setInputs({
        ...inputs,
        hid : hospitalData?.hid,
        address : hospitalData?.address,
        baseName : hospitalData?.baseName,
        shortName : hospitalData?.shortName,
        lat : hospitalData?.lat,
        lon : hospitalData?.lon,
        yoyang_giho : hospitalData?.yoyang_giho,
        doctor_count : hospitalData?.doctor_count,
        telephone : hospitalData?.telephone,
        reservation_site : hospitalData?.reservation_site,
        req_comment : hospitalData?.req_comment,
        isOpen : 'true'
      })
      setIsLoading(false);
    }, 1000);
  }, [isOpen]);

  const onHandleRegistReview = async(data:any) => {
    console.log('onHandleRegistReview', data);
    try{
      const res:any = await HospitalService.setHospitalDetail(inputs);
      console.log('res', res);
      if ( res.success ) {
        functions.simpleToast(toast,`성공`);
        setTimeout(() => {
          setCloseAndReload()
        }, 1000);
      }else{
        functions.simpleToast(toast,`실패, 관리자에게 문의하세요`);
      }
    }catch(e){
      console.log('eeeee', e);
    }
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
        <Flex display={'flex'} flexDirection={{base : 'column' , xl : 'row'}} minHeight={'50px'} padding={'0 10px'}>
          <Box flex={1}>
            <FormControl variant="floatingLabel">
              <FormLabel>병원코드(HID)</FormLabel>
              <Input 
                type="text" 
                placeholder='병원코드(HID)' 
                borderColor={borderColor}
                color={textColor}
                value={inputs?.hid}
                disabled={!isAdmin}
                id='hid'
                readOnly={true}
              />
            </FormControl>
          </Box>              
          
          <Box flex={1} mt={{base : 5, xl : 0}}>
            <FormControl variant="floatingLabel">
              <FormLabel>등록의사수</FormLabel>
              <Input 
                type="text" 
                borderColor={borderColor}
                color={textColor}
                placeholder='0' 
                textAlign={'right'}
                value={inputs?.doctor_count}
                disabled={!isAdmin}
                id='doctor_count'
                readOnly={true}
              />
            </FormControl>
          </Box>   
        </Flex> 
        <Flex display={'flex'} flexDirection={{base : 'column' , xl : 'row'}} minHeight={'50px'} padding={'0 10px'} mt={5}>
          <Box flex={1}>
            <FormControl variant="floatingLabel">
              <FormLabel>기본병원명</FormLabel>
              <Input 
                type="text" 
                borderColor={borderColor}
                color={textColor}
                value={inputs?.baseName}
                placeholder='병원명' 
                disabled={!isAdmin}
                id='baseName'
                readOnly={true}
              />
            </FormControl>
          </Box>              
          <Box flex={1} mt={{base : 5, xl : 0}}>
            <FormControl variant="floatingLabel">
              <FormLabel>숏병원명</FormLabel>
              <Input 
                type="text"
                borderColor={borderColor}
                color={textColor} 
                value={inputs?.shortName}
                placeholder='숏병원명' 
                disabled={!isAdmin}
                id='shortName'
                readOnly={true}
              />
            </FormControl>
          </Box> 
        </Flex> 
        <Flex display={'flex'} flexDirection={{base : 'column' , xl : 'row'}} minHeight={'50px'} padding={'0 10px'} mt={5}>
          <Box flex={1}>
            <FormControl variant="floatingLabel">
              <FormLabel>주소</FormLabel>
              <Input 
                type="text" 
                borderColor={borderColor}
                color={textColor}
                placeholder='주소' 
                disabled={!isAdmin}
                id='address'
                value={inputs?.address}
                onChange={(e)=>setInputs({...inputs, address: e.target.value})}
              />
            </FormControl>
          </Box>              
        </Flex> 
        <Flex display={'flex'} flexDirection={{base : 'column' , xl : 'row'}} minHeight={'50px'} padding={'0 10px'} mt={5}>
          <Box flex={1}>
            <FormControl variant="floatingLabel">
              <FormLabel>좌표(위도)</FormLabel>
              <Input 
                type="text" 
                borderColor={borderColor}
                color={textColor}
                placeholder='위도를 입력해주세요' 
                disabled={!isAdmin}
                id='latitude'
                value={inputs?.lat}
                onChange={(e:any)=>setInputs({...inputs, latitude: e.target.value})}
              />
            </FormControl>
          </Box>              
          <Box flex={1} mt={{base : 5, xl : 0}}>
            <FormControl variant="floatingLabel">
              <FormLabel>좌표(경도)</FormLabel>
              <Input 
                type="text"   
                borderColor={borderColor}
                color={textColor}
                placeholder='경도를 입력해주세요' 
                disabled={!isAdmin}
                id='longitude'
                value={inputs?.lon}
                onChange={(e)=>setInputs({...inputs, longitude: e.target.value})}
              />
            </FormControl>
          </Box> 
        </Flex>
        <Flex display={'flex'} flexDirection={{base : 'column' , xl : 'row'}} minHeight={'50px'} padding={'0 10px'} mt={5}>
          <Box flex={1}>
            <FormControl variant="floatingLabel">
              <FormLabel>예약사이트</FormLabel>
              <Input 
                type="text" 
                borderColor={borderColor}
                color={textColor}
                placeholder='예약사이트' 
                disabled={!isAdmin}
                id="reservation_site"
                onChange={(e)=>setInputs({...inputs, reservation_site: e.target.value})}
              />
            </FormControl>
          </Box>              
          <Box flex={1} mt={{base : 5, xl : 0}}>
            <FormControl variant="floatingLabel">
              <FormLabel>예약전화번호</FormLabel>
              <Input 
                type="text"   
                borderColor={borderColor}
                color={textColor}
                placeholder='예약전화번호' 
                disabled={!isAdmin}
                id="telephone"
                value={inputs?.telephone}
                onChange={(e)=>setInputs({...inputs, telephone: e.target.value})}
              />
            </FormControl>
          </Box> 
        </Flex>
        <Flex display={'flex'} flexDirection={{base : 'column' , xl : 'row'}}minHeight={'50px'} padding={'0 10px'}>
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
                disabled={!isAdmin}
                borderColor={borderColor}
                color={textColor}
                id='req_comment'
                onChange={(e)=>setInputs({...inputs, req_comment: e.target.value})}
              />
            </FormControl>
          </Box>   
        </Flex>
        <Flex display={'flex'} flexDirection={{base : 'column' , xl : 'row'}} minHeight={'50px'} padding={'0 10px'} mt={5}>
          <Box flex={1}>
            <FormControl variant="floatingLabel">
              <FormLabel>요양기호</FormLabel>
              <Input 
                type="text" 
                borderColor={borderColor}
                color={textColor}
                placeholder='요양기호' 
                disabled={!isAdmin}
                id='yoyang_giho'
                value={inputs?.yoyang_giho}
                readOnly={true}
              />
            </FormControl>
          </Box>              
        </Flex> 
        <Flex display={'flex'} flexDirection={{base : 'column' , xl : 'row'}} minHeight={'50px'} padding={'0 10px'} mt={5}>           
          <Box flex={1}>
            <FormControl variant="floatingLabel">
              <FormLabel>공개여부</FormLabel>
              <RadioGroup defaultValue={'true'}>
                <Stack spacing={5} direction='row' padding={'10px'}>
                  <Radio colorScheme='red' value={'true'} isDisabled={!isAdmin} onClick={()=>setInputs({...inputs, isOpen: 'true'})}>공개</Radio>
                  <Radio colorScheme='blue' value={'false'} isDisabled={!isAdmin} onClick={()=>setInputs({...inputs, isOpen: 'false'})}>비공개</Radio>
                </Stack>
              </RadioGroup>
            </FormControl>
          </Box>
        </Flex>
        <Box display={isAdmin ? 'flex' : 'none'} flexDirection={{base : 'column' , xl : 'row'}} justifyContent={'center'}  width={'98%'} mt={5}>
          <Button 
            colorScheme='blue' 
            variant='solid' 
            width={'200px'} 
            borderRadius={'10px'}
            onClick={() => setIsShowConfirm(true)}
            id="button_modify"
          >
            수정
          </Button>
        </Box>
        <Box height={'50px'} />
        {
          isShowConfirm && 
          (
            <CustomAlert
              msg="수정하시겠습니까?"
              isOpen={isShowConfirm}
              fnConform={() => {
                onHandleRegistReview(inputs);
                setIsShowConfirm(false)
              }}
              fnCancel={() => setIsShowConfirm(false)}
            />
          )
        }
        
      </>
    )
  }
  
}

export default HospitalDetail;