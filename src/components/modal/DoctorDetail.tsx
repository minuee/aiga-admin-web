'use client';
import React, { PropsWithChildren } from 'react';

// chakra imports
import { useToast,Box,Flex,Button,SkeletonCircle,SkeletonText,Divider,Icon,Textarea,Input, FormControl, FormLabel, RadioGroup, Radio, Stack, useColorModeValue,Tabs, TabList, TabPanels, Tab, TabPanel, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody } from '@chakra-ui/react';
import Image from 'next/image';
// Assets
import Link from 'next/link';
import { IoLink } from "react-icons/io5";
import functions from 'utils/functions';
import * as DoctorService from "services/doctor/index";
import ListItem from 'components/card/ListItem';
import useCheckAdmin from "store/useCheckAdmin";
import { setIn } from 'formik';
import PaperDetail from 'components/modal/PaperDetail';
import mConstants from 'utils/constants';
const defaultImage = require("../../..//public/img/avatars/no_image01.png");

export interface DoctorDetailProps extends PropsWithChildren {
  isOpen : boolean;
  DoctorData : any;
  setCloseModal : () => void;
}

function DoctorDetail(props: DoctorDetailProps) {

  const { isOpen, DoctorData,setCloseModal } = props;
  const toast = useToast();
  const isAdmin = useCheckAdmin();
  const [isLoading, setIsLoading] = React.useState(true);  
  const [inputs, setInputs] = React.useState<any>({
    hid: null,
    baseName: null,
    doctor_id: null,
    shortName: null,
    address: null,
    reservation_site: null,
    reservation_phone: null,
    doctorname: null,
    profileimgurl: null,
    doctor_url: null,
    deptname: null,
    specialties: null,
    education: [],
    career: [],
    awards: [],
    publications: [],
    articles: [],
    books: [],
    conferences: [],
    is_active : '1'
  });

  const [doctorPapers, setDoctorPapers] = React.useState<any>([]);
  const [currentTab, setCurrentTab] = React.useState<string>('education');
  const [selectedPaper, setSelectedPaper] = React.useState<any>(null);
  const formBtnRef = React.useRef();

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const skeletonColor = useColorModeValue('white', 'navy.700');
  const tabSelectColor = useColorModeValue('navy.700', 'white');

  const getData = React.useCallback(
    async() => {
      if ( !functions.isEmpty(props.DoctorData?.rid) ) {
        try{
          const res:any = await DoctorService.getDoctorPaperList({
            doctorId: props.DoctorData?.rid_long
          });
          setDoctorPapers(res?.data);
        }catch(e){
          setDoctorPapers([]);
        }
      }
    },[props.DoctorData?.rid]
  );
  
  React.useEffect(() => {
    getData()
  }, [getData]);
  
  React.useEffect(() => {
    let careerData:any = [];
    if ( !functions.isEmpty(DoctorData?.dc_jsondata) ) {
      careerData = functions.categorizeByDynamicType(JSON.parse(DoctorData?.dc_jsondata));
    }
    setTimeout(() => {
      setInputs({
        ...DoctorData,
        education: careerData['학력'] || [],
        career: careerData['경력'] || [],
        awards: careerData['수상'] || [],
        publications: careerData['논문'] || [],
        articles: careerData['언론'] || [],
        books: careerData['저서'] || [],
        conferences: careerData['학회'] || []
      });
      setIsLoading(false);
    }, 1000);
  }, [DoctorData]);

  const onHandleUpdateBasicInfo = async(data:any) => {
    console.log('onHandleUpdateBasicInfo', data);
    try{
      const bodyData = {
        rid : data?.rid,
        doctorname : data?.doctorname,
        profileimgurl : data?.profileimgurl,
        specialties : data?.specialties,
        new_doctor_url : data?.new_doctor_url,
        is_active : data?.is_active
      }

      const res:any = await DoctorService.putDoctorBasic(bodyData);
      console.log('res', res);
      if ( res.success ) {
        functions.simpleToast(toast,`기본정보 수정성공`);
        setTimeout(() => {
          props.setCloseModal()
        }, 1000);
      }else{
        functions.simpleToast(toast,`기본정보 수정실패, 관리자에게 문의하세요`);
      }
    }catch(e){
      console.log('eeeee', e);
    }
  }

  const onHandleUpdateCareerInfo = async(data:any) => {
    console.log('onHandleUpdateCareerInfo', data);

    try{
      const bodyData = {
        rid : data?.rid,
        jsondata : JSON.stringify(data?.education.concat(data?.career).concat(data?.awards).concat(data?.publications).concat(data?.articles).concat(data?.books).concat(data?.conferences)),
        education : JSON.stringify(data?.education),
        career : JSON.stringify(data?.career),
        etc : JSON.stringify(data?.awards.concat(data?.publications).concat(data?.articles).concat(data?.books).concat(data?.conferences)),
      }

      const res:any = await DoctorService.putDoctorCareer(bodyData);
      console.log('res', res);
      if ( res.success ) {
        functions.simpleToast(toast,`경력정보 수정성공`);
        setTimeout(() => {
          props.setCloseModal()
        }, 1000);
      }else{
        functions.simpleToast(toast,`경력정보 수정실패, 관리자에게 문의하세요`);
      }
    }catch(e){
      console.log('eeeee', e);
    }
  }

  const handleContentChange = (type: string, content: any) => {
    setInputs({
      ...inputs,
      [type]: content
    });
  }

  const handleAddItem = (type: string) => {
    const newItem = {
      targetDate: '',
      text: '',
      type: type,
      url: '',
      issuer: ''
    };
    setInputs({
      ...inputs,
      [type]: [...(inputs[type] || []), newItem]
    });
  }

  const handlePaperDelete = async (itemToDelete: any) => {
    console.log("Deleting paper:", itemToDelete);
    window.alert("작업중입니다");
    return;
    try {
      // TODO: API 연동
      const res:any = await DoctorService.deleteDoctorPaper({ paperId: itemToDelete.paper_id });
      if (res?.success) {
        setDoctorPapers(doctorPapers.filter((paper: any) => paper.rid !== itemToDelete.rid));
        functions.simpleToast(toast, "논문이 삭제되었습니다.", "success");
      } else {
         functions.simpleToast(toast, "논문 삭제에 실패했습니다.", "error");
      }
    } catch (error) {
      console.error("Error deleting paper:", error);
      functions.simpleToast(toast, "논문 삭제 중 오류가 발생했습니다.", "error");
    }
  };

  const handlePaperUpdate = async (updatedPaper: any) => {
    console.log("Updating paper:", updatedPaper);
    window.alert("작업중입니다");
    return;
    try {
      // TODO: API 연동
      // const res = await DoctorService.updateDoctorPaper(updatedPaper);
      // if (res.success) {
        functions.simpleToast(toast, "논문 정보가 수정되었습니다.", "success");
        await getData(); // 데이터 새로고침
        setSelectedPaper(null); // 모달 닫기
      // } else {
      //   functions.simpleToast(toast, "논문 정보 수정에 실패했습니다.", "error");
      // }
    } catch (error) {
      console.error("Error updating paper:", error);
      functions.simpleToast(toast, "논문 정보 수정 중 오류가 발생했습니다.", "error");
    }
  };

  React.useEffect(() => {
    console.log("inputs",inputs)
  }, [inputs]);

  const [hasImageError, setHasImageError] = React.useState(false);
  
  React.useEffect(() => {
    setHasImageError(false); // Reset error state when image URL changes
  }, [inputs?.profileimgurl]);

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
        <Flex flexDirection={{base : 'column' , 'mobile' : 'row'}} minHeight={'50px'} padding={{base : "0", 'mobile' : '0 10px'}} >
          <Flex flex={1} alignItems={'center'} justifyContent={'center'}>
            {
              ( functions.isEmpty(inputs?.profileimgurl) || hasImageError ) ?
              <Image width="150" height="150" src={defaultImage} alt={'doctor1'} />
              :
              <Image src={inputs?.profileimgurl.trimEnd()} alt='profile' width={150} height={150} onError={() => setHasImageError(true)} />
            }
          </Flex>
          <Flex flex={2} flexDirection={'column'} minHeight={'50px'} padding={{base : "0", 'mobile' : '0 10px'}} >
            <Box flex={1}>
              <FormControl variant="floatingLabel">
                <FormLabel>의사ID</FormLabel>
                <Input 
                  type="text" 
                  borderColor={borderColor}
                  color={textColor}
                  value={inputs?.doctor_id || ''}
                  placeholder='의사ID' 
                  disabled={!isAdmin}
                  onChange={()=> console.log('')}
                  id='doctor_id'
                />
              </FormControl>
            </Box>              
            <Box flex={1} mt={2}>
              <FormControl variant="floatingLabel">
                <FormLabel>의사명</FormLabel>
                <Input 
                  type="text"
                  borderColor={borderColor}
                  color={textColor} 
                  value={inputs?.doctorname}
                  placeholder='의사명' 
                  disabled={!isAdmin}
                  onChange={(e)=> setInputs({...inputs, doctorname: e.target.value})} 
                  id='doctorname'
                />
              </FormControl>
            </Box>
            <Box flex={1} mt={2}>
              <FormControl variant="floatingLabel">
                <FormLabel>병원코드(HID)</FormLabel>
                <Input 
                  type="text" 
                  placeholder='이름' 
                  borderColor={borderColor}
                  color={textColor}
                  value={inputs?.hid}
                  disabled={!isAdmin}
                  onChange={()=> console.log('')}
                  id='hid'
                />
              </FormControl>
            </Box>
            <Box flex={1} mt={2}>
              <FormControl variant="floatingLabel">
                <FormLabel>병원명</FormLabel>
                <Input 
                  type="text" 
                  borderColor={borderColor}
                  color={textColor}
                  placeholder='병원명' 
                  value={inputs?.baseName}
                  disabled={!isAdmin}
                  onChange={()=> console.log('')}
                  id='baseName'
                />
              </FormControl>
            </Box>   
          </Flex> 
        </Flex>
        <Flex display={'flex'} flexDirection={'row'} minHeight={'50px'} padding={{base : "0", 'mobile' : '0 10px'}} mt={5}>
          <Box flex={1}>
            <FormControl variant="floatingLabel">
              <FormLabel>
                소개페이지(RID용)
              </FormLabel>
              <Input 
                type="text" 
                borderColor={borderColor}
                color={textColor}
                placeholder='소개페이지' 
                value={inputs?.doctor_url}
                disabled={!isAdmin}
                onChange={()=> console.log('')}
                id='doctor_url'
              />
            </FormControl>
          </Box>              
        </Flex> 
        <Flex display={'flex'} flexDirection={'row'} minHeight={'50px'} padding={{base : "0", 'mobile' : '0 10px'}} mt={5}>
          <Box flex={1}>
            <FormControl variant="floatingLabel">
              <FormLabel>
                소개페이지
                {
                  !functions.isEmpty(inputs?.new_doctor_url) && (
                    <Link href={inputs?.new_doctor_url} target='_blank' style={{marginLeft:"10px"}}>
                      <Icon as={IoLink} size={20} />
                    </Link>
                  )
                }
              </FormLabel>
              <Input 
                type="text" 
                borderColor={borderColor}
                color={textColor}
                placeholder='소개페이지' 
                value={inputs?.new_doctor_url}
                disabled={!isAdmin}
                onChange={(e)=> setInputs({...inputs, new_doctor_url: e.target.value})} 
                id='new_doctor_url'
              />
            </FormControl>
          </Box>              
        </Flex> 
        <Flex display={'flex'} flexDirection={'row'} minHeight={'50px'} padding={{base : "0", 'mobile' : '0 10px'}} mt={5}>
          <Box flex={1}>
            <FormControl variant="floatingLabel">
              <FormLabel>
                프로필URL
              </FormLabel>
              <Input 
                type="text" 
                borderColor={borderColor}
                color={textColor}
                placeholder='소개페이지' 
                value={inputs?.profileimgurl || ''}
                disabled={!isAdmin}
                onChange={(e)=> setInputs({...inputs, profileimgurl: e.target.value})} 
                id='profileimgurl'
              />
            </FormControl>
          </Box>              
        </Flex> 
        <Flex display={'flex'} flexDirection={{base : 'column' , 'mobile' : 'row'}} minHeight={'50px'} padding={{base : "0", 'mobile' : '0 10px'}} mt={5}>
          <Box flex={1}>
            <FormControl variant="floatingLabel">
              <FormLabel>진료과</FormLabel>
              <Input 
                type="text" 
                borderColor={borderColor}
                color={textColor}
                placeholder='진료분야' 
                value={inputs?.deptname}
                disabled={!isAdmin}
                onChange={()=> console.log('')}
                id='deptname'
              />
            </FormControl>
          </Box>              
          <Box flex={1} mt={{base : 5, 'mobile' : 0}}>
            <FormControl variant="floatingLabel">
              <FormLabel>예약전화번호<span style={{color:"red",fontSize:"10px"}}> * 수정가능</span></FormLabel>
              <Input 
                type="text"   
                borderColor={borderColor}
                color={textColor}
                placeholder='예약전화번호' 
                id='reservation_tel'
                disabled={!isAdmin}
                onChange={(e)=> setInputs({...inputs, reservation_tel: e.target.value})} 
                value={inputs?.reservation_phone  || ''}
              />
            </FormControl>
          </Box> 
        </Flex> 
        
        <Flex display={'flex'} flexDirection={'row'} minHeight={'50px'} padding={{base : "0", 'mobile' : '0 10px'}}>
          <Box mt={5} width={'100%'}>
            <FormControl variant="floatingLabel">
              <FormLabel>진료분야<span style={{color:"red",fontSize:"10px"}}> * 수정가능</span></FormLabel>
              <Textarea 
                variant={'outline'} 
                onChange={(e) => setInputs({...inputs, specialties: e.target.value})} 
                resize={'none'}  
                minH={'100px'}
                width={'100%'}
                size={'sm'} 
                borderColor={borderColor}
                color={textColor}
                value={inputs?.specialties}
                id='specialties'
                disabled={!isAdmin}
              />
            </FormControl>
          </Box>   
        </Flex>
        <Flex display={'flex'} flexDirection={'row'} minHeight={'50px'} padding={{base : "0", 'mobile' : '0 10px'}} mt={5}>           
          <Box flex={1}>
            <FormControl variant="floatingLabel">
              <FormLabel>공개여부<span style={{color:"red",fontSize:"10px"}}> * 수정가능</span></FormLabel>
              <RadioGroup defaultValue='1'>
                <Stack spacing={5} direction='row' padding={'10px'}>
                  <Radio colorScheme='blue' value='0' isDisabled={!isAdmin} checked={inputs?.is_active == '0'} onClick={()=> setInputs({...inputs, is_active: '0'})}>미사용</Radio>
                  <Radio colorScheme='blue' value='1' isDisabled={!isAdmin} checked={inputs?.is_active == '1'} onClick={()=> setInputs({...inputs, is_active: '1'})}>사용(유지)</Radio>
                  <Radio colorScheme='blue' value='2' isDisabled={!isAdmin} checked={inputs?.is_active == '2'} onClick={()=> setInputs({...inputs, is_active: '2'})}>사용(신규)</Radio>
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
            onClick={() => onHandleUpdateBasicInfo(inputs)}
            id="button_modify2"
          >
            기본정보 수정
          </Button>
        </Box>
        <Divider my={5} />
        <Flex
          position="sticky"
          top="0"
          bgColor="primary.100"
          zIndex="sticky"
          //height="60px"
          alignItems="center"
          flexWrap="nowrap"
          overflowX="auto"
          px={{base : 0, 'mobile': "2"}}
          css={{
            WebkitOverflowScrolling: "touch",
            msOverflowStyle: "-ms-autohiding-scrollbar"
          }}
        >
          <Tabs variant='enclosed' width={'100%'}>
            <TabList
              overflowY="hidden"
              sx={{
                //borderBottom: "0px",
                scrollbarWidth: 'none',
                '::-webkit-scrollbar': {
                  display: 'none',
                },
              }}
            >
              <Tab onClick={()=>setCurrentTab('education')} _selected={{bg: tabSelectColor,color:skeletonColor}}>학력({inputs?.education?.length > 0 ? inputs?.education?.length : 0})</Tab>
              <Tab onClick={()=>setCurrentTab('career')} _selected={{bg: tabSelectColor,color:skeletonColor}}>경력({inputs?.career?.length > 0 ? inputs?.career?.length : 0})</Tab>
              <Tab onClick={()=>setCurrentTab('awards')} _selected={{bg: tabSelectColor,color:skeletonColor}}>수상({inputs?.awards?.length > 0 ? inputs?.awards?.length : 0})</Tab>
              <Tab onClick={()=>setCurrentTab('publications')} _selected={{bg: tabSelectColor,color:skeletonColor}}>학술({inputs?.publications?.length > 0 ? inputs?.publications?.length : 0})</Tab>
              <Tab onClick={()=>setCurrentTab('articles')} _selected={{bg: tabSelectColor,color:skeletonColor}}>언론({inputs?.articles?.length > 0 ? inputs?.articles?.length : 0})</Tab>
              <Tab onClick={()=>setCurrentTab('books')} _selected={{bg: tabSelectColor,color:skeletonColor}}>저서({inputs?.books?.length > 0 ? inputs?.books?.length : 0})</Tab>
              <Tab onClick={()=>setCurrentTab('conferences')} _selected={{bg: tabSelectColor,color:skeletonColor}}>학회({inputs?.conferences?.length > 0 ? inputs?.conferences?.length : 0})</Tab>
              <Tab onClick={()=>setCurrentTab('papers')} _selected={{bg: tabSelectColor,color:skeletonColor}}>논문({doctorPapers?.length > 0 ? doctorPapers?.length : 0})</Tab>
            </TabList>
            <TabPanels>
              <TabPanel padding={0}>
                <ListItem 
                  isTitle={false}
                  title='학력'
                  type='education' 
                  content={inputs?.education}
                  limintView={5}
                  onContentChange={(content) => handleContentChange('education', content)}
                  onAddItem={() => handleAddItem('education')}
                />
              </TabPanel>
              <TabPanel>
                <ListItem 
                  isTitle={false}
                  title='경력'
                  type='career' 
                  content={inputs?.career}
                  limintView={5}
                  onContentChange={(content) => handleContentChange('career', content)}
                  onAddItem={() => handleAddItem('career')}
                />  
              </TabPanel>
              <TabPanel>
                <ListItem 
                  isTitle={false}
                  title='수상'
                  type='awards' 
                  content={inputs?.awards}
                  limintView={5}
                  onContentChange={(content) => handleContentChange('awards', content)}
                  onAddItem={() => handleAddItem('awards')}
                />
              </TabPanel>
              <TabPanel>
                <ListItem 
                  isTitle={false}
                  title='논문'
                  type='publications' 
                  content={inputs?.publications}
                  limintView={5}
                  onContentChange={(content) => handleContentChange('publications', content)}
                  onAddItem={() => handleAddItem('publications')}
                />  
              </TabPanel>
              <TabPanel>
                <ListItem 
                  isTitle={false}
                  title='언론'
                  type='articles' 
                  content={inputs?.articles}
                  limintView={5}
                  onContentChange={(content) => handleContentChange('articles', content)}
                  onAddItem={() => handleAddItem('articles')}
                />
              </TabPanel>
              <TabPanel>
                <ListItem 
                  isTitle={false}
                  title='저서'
                  type='books' 
                  content={inputs?.books}
                  limintView={10}
                  onContentChange={(content) => handleContentChange('books', content)}
                  onAddItem={() => handleAddItem('books')}
                />
              </TabPanel>
              <TabPanel>
                <ListItem 
                  isTitle={false}
                  title='학회'
                  type='conferences' 
                  content={inputs?.conferences}
                  limintView={5}
                  onContentChange={(content) => handleContentChange('conferences', content)}
                  onAddItem={() => handleAddItem('conferences')}
                />
              </TabPanel>
              <TabPanel>
                <ListItem 
                  isTitle={false}
                  title='논문'
                  type='papers' 
                  content={doctorPapers}
                  limintView={10}
                  onContentChange={() => {}}
                  onAddItem={() => {}}
                  onDeleteItem={handlePaperDelete}
                  onShowPaperDetail={setSelectedPaper}
                />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Flex>
        <Box display={isAdmin ? 'flex' : 'none'} flexDirection={'row'} justifyContent={'center'}  width={'98%'} mt={5}>
          {
            currentTab !== 'papers' && ( 
              <Button 
                colorScheme='blue' 
                variant='solid' 
                width={'200px'} 
                borderRadius={'10px'}
                onClick={() => onHandleUpdateCareerInfo(inputs)}
                id="button_modify"
              >
                경력정보 수정
              </Button>
            )
          }
        </Box>
        <Box height={'50px'} />

        {
            !functions.isEmpty(selectedPaper) && (    
                <Modal
                    onClose={() => setSelectedPaper(null)}
                    finalFocusRef={formBtnRef}
                    isOpen={!functions.isEmpty(selectedPaper)}
                    scrollBehavior={'inside'}
                >
                <ModalOverlay />
                <ModalContent maxW={`${mConstants.modalMaxWidth}px`}>
                    <ModalHeader>{`논문 상세정보`}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody >
                    <PaperDetail
                        isOpen={!functions.isEmpty(selectedPaper)}
                        setClose={() => setSelectedPaper(null)}
                        PaperData={selectedPaper}
                        onHandlePaperModify={handlePaperUpdate}
                    />
                    </ModalBody>
                </ModalContent>
                </Modal>
            )
        }
      </>
    )
  }
}

export default DoctorDetail;