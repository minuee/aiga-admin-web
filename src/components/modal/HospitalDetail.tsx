'use client';
import React, { PropsWithChildren } from 'react';

// chakra imports
import { Box,Flex,Button,useToast,SkeletonCircle,SkeletonText,Text, Textarea,Input, FormControl, FormLabel, RadioGroup, Radio, Stack, useColorModeValue,Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import * as HospitalService from "services/hospital/index";
import useCheckAdmin from "store/useCheckAdmin";
import functions from 'utils/functions';
import CustomAlert from 'components/etc/CustomAlert';
import AliasNameManager from './AliasNameManager';
import HospitalEvaluationManager from './HospitalEvaluationManager'; // Import new component

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
  const [currentTab, setCurrentTab] = React.useState<string>('basicInfo'); // Add currentTab state
  const [inputs, setInputs] = React.useState<any>({
    hid : null,
    address : null,
    baseName : null,
    shortName : null,
    lat : null,
    lon : null,
    sidocode_name :  null,
    sigungu_code_name : null,
    eupmyeon : null,
    yoyang_giho : null,
    doctor_count : 0,
    hospital_site : null, 
    reservation_site: null,
    telephone: null,
    req_comment: null,
    open_date : null,
    hospital_class_name : null,
    isOpen : 'true'
  })

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const skeletonColor = useColorModeValue('white', 'navy.700');
  const tabSelectColor = useColorModeValue('navy.700', 'white');
  
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
        sidocode_name : hospitalData?.sidocode_name,
        sigungu_code_name : hospitalData?.sigungu_code_name,
        eupmyeon : hospitalData?.eupmyeon,
        yoyang_giho : hospitalData?.yoyang_giho,
        doctor_count : hospitalData?.doctor_count,
        telephone : hospitalData?.telephone,
        hospital_site : hospitalData?.hospital_site,
        reservation_site : hospitalData?.reservation_site,
        req_comment : hospitalData?.req_comment,
        open_date : hospitalData?.open_date,
        hospital_class_name : hospitalData?.hospital_class_name,
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
        <Tabs variant='enclosed' width={'100%'} isLazy lazyBehavior='keepMounted'>
            <TabList
              overflowY="hidden"
              sx={{
                scrollbarWidth: 'none',
                '::-webkit-scrollbar': {
                  display: 'none',
                },
              }}
            >
              <Tab onClick={()=>setCurrentTab('basicInfo')} _selected={{bg: tabSelectColor,color:skeletonColor}}>기본정보</Tab>
              <Tab onClick={()=>setCurrentTab('aliasManager')} _selected={{bg: tabSelectColor,color:skeletonColor}}>병원별칭관리</Tab>
              <Tab onClick={()=>setCurrentTab('hospitalEvaluation')} _selected={{bg: tabSelectColor,color:skeletonColor}}>병원평가정보현황</Tab>
            </TabList>
            <TabPanels>
              <TabPanel padding={0}>
                <Flex display={'flex'} flexDirection={{base : 'column' , xl : 'row'}} minHeight={'50px'} padding={'0 10px'} mt="20px">
                  <Box flex={1}>
                    <FormControl variant="floatingLabel">
                      <FormLabel>병원코드(HID)</FormLabel>
                      <Input 
                        type="text" 
                        placeholder='병원코드(HID)' 
                        borderColor={borderColor}
                        color={textColor}
                        value={inputs?.hid}
                        disabled={true}
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
                        disabled={true}
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
                        disabled={true}
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
                        disabled={true}
                        id='shortName'
                        readOnly={true}
                      />
                    </FormControl>
                  </Box> 
                </Flex> 
                <Flex display={'flex'} flexDirection={{base : 'column' , xl : 'row'}} minHeight={'50px'} padding={'0 10px'} mt={5}>
                  <Box flex={1}>
                    <FormControl variant="floatingLabel">
                      <FormLabel>등급</FormLabel>
                      <Input 
                        type="text" 
                        borderColor={borderColor}
                        color={textColor}
                        value={inputs?.hospital_class_name}
                        placeholder='등급' 
                        disabled={true}
                        id='hospital_class_name'
                        readOnly={true}
                      />
                    </FormControl>
                  </Box>              
                  <Box flex={1} mt={{base : 5, xl : 0}}>
                    <FormControl variant="floatingLabel">
                      <FormLabel>설립일자</FormLabel>
                      <Input 
                        type="text"
                        borderColor={borderColor}
                        color={textColor} 
                        value={inputs?.open_date}
                        placeholder='설립일자' 
                        disabled={true}
                        id='open_date'
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
                        disabled={true}
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
                        disabled={true}
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
                        disabled={true}
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
                      <FormLabel>시도</FormLabel>
                      <Input 
                        type="text" 
                        borderColor={borderColor}
                        color={textColor}
                        placeholder='시도를 입력해주세요' 
                        disabled={true}
                        id='sidocode_name'
                        value={inputs?.sidocode_name}
                      />
                    </FormControl>
                  </Box>              
                  <Box flex={1} mt={{base : 5, xl : 0}}>
                    <FormControl variant="floatingLabel">
                      <FormLabel>시군구</FormLabel>
                      <Input 
                        type="text"   
                        borderColor={borderColor}
                        color={textColor}
                        placeholder='시군구를 입력해주세요' 
                        disabled={true}
                        id='sigungu_code_name'
                        value={inputs?.sigungu_code_name}
                      />
                    </FormControl>
                  </Box> 
                  <Box flex={1} mt={{base : 5, xl : 0}}>
                    <FormControl variant="floatingLabel">
                      <FormLabel>읍면동</FormLabel>
                      <Input 
                        type="text"   
                        borderColor={borderColor}
                        color={textColor}
                        placeholder='읍면동를 입력해주세요' 
                        disabled={true}
                        id='eupmyeon'
                        value={inputs?.eupmyeon}
                        readOnly
                      />
                    </FormControl>
                  </Box> 
                </Flex>
                <Flex display={'flex'} flexDirection={{base : 'column' , xl : 'row'}} minHeight={'50px'} padding={'0 10px'} mt={5}>
                  <Box flex={1}>
                    <FormControl variant="floatingLabel">
                      <FormLabel>대표사이트</FormLabel>
                      <Input 
                        type="text" 
                        borderColor={borderColor}
                        color={textColor}
                        placeholder='대표사이트' 
                        disabled={!isAdmin}
                        id="hospital_site"
                        value={inputs?.hospital_site}
                        onChange={(e)=>setInputs({...inputs, hospital_site: e.target.value})}
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
                    기본정보 수정
                  </Button>
                </Box>
              </TabPanel>
              <TabPanel padding={0}>
                {/* 병원별칭 관리 컴포넌트 추가 */}
                <AliasNameManager
                  hospitalId={hospitalData?.hid}
                  isAdmin={isAdmin}
                  textColor={textColor}
                  borderColor={borderColor}
                />
              </TabPanel>
              <TabPanel padding={0}>
                {/* 병원평가정보현황 내용은 여기에 추가될 예정 */}
                <HospitalEvaluationManager
                  hospitalId={hospitalData?.hid}
                  textColor={textColor}
                  borderColor={borderColor}
                />
              </TabPanel>
            </TabPanels>
        </Tabs>
        
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