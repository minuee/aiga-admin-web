'use client';
import React, { PropsWithChildren } from 'react';

// chakra imports
import { Box,Flex,Button,SkeletonCircle,SkeletonText,Divider,Icon,Textarea,Input, FormControl, FormLabel, RadioGroup, Radio, Stack, useColorModeValue,Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import Image from 'next/image';
// Assets
import Link from 'next/link';
import { IoLink } from "react-icons/io5";
import functions from 'utils/functions';
import * as DoctorService from "services/doctor/index";
import ListItem from 'components/card/ListItem';
import useCheckAdmin from "store/useCheckAdmin";
const defaultImage = require("../../..//public/img/avatars/no_image01.png");

export interface DoctorDetailProps extends PropsWithChildren {
  isOpen : boolean;
  DoctorData : any;
}

function DoctorDetail(props: DoctorDetailProps) {

  const { isOpen, DoctorData } = props;
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
  });

  const [doctorPapers, setDoctorPapers] = React.useState<any>([]);
  const [currentTab, setCurrentTab] = React.useState<string>('education');
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const skeletonColor = useColorModeValue('white', 'navy.700');
  const tabSelectColor = useColorModeValue('navy.700', 'white');

  const getData = React.useCallback(
    async() => {
      if ( !functions.isEmpty(props.DoctorData?.rid) ) {
        try{
          const res:any = await DoctorService.getDoctorPaperList({
            doctorId: props.DoctorData?.rid
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
        education: careerData['학력'],
        career: careerData['경력'],
        awards: careerData['수상'],
        publications: careerData['논문'],
        articles: careerData['언론'],
        books: careerData['저서'],
        conferences: careerData['학회']
      });
      setIsLoading(false);
    }, 1000);
  }, [DoctorData]);

  const onHandleUpdateBasicInfo = (data:any) => {
    console.log('onHandleUpdateBasicInfo', data);
  }

  const onHandleUpdateCareerInfo = (data:any) => {
    console.log('onHandleUpdateCareerInfo', data);
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
        <Flex flexDirection={{base : 'column' , 'mobile' : 'row'}} minHeight={'50px'} padding={{base : "0", 'mobile' : '0 10px'}} >
          <Flex flex={1} alignItems={'center'} justifyContent={'center'}>
            {
              functions.isEmpty(inputs?.profileimgurl) ?
              <Image width="150" height="150" src={defaultImage} alt={'doctor1'} />
              :
              <Image src={inputs?.profileimgurl.trimEnd()} alt='profile' width={150} height={150} />
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
                  onChange={()=> console.log('')}
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
                소개페이지
                {
                  !functions.isEmpty(inputs?.doctor_url) && (
                    <Link href={inputs?.doctor_url} target='_blank' style={{marginLeft:"10px"}}>
                      <Icon as={IoLink} size={20} />
                    </Link>
                  )
                }
              </FormLabel>
              <Input 
                type="text" 
                borderColor={borderColor}
                color={textColor}
                placeholder='주소' 
                value={inputs?.doctor_url}
                disabled={!isAdmin}
                onChange={()=> console.log('')}
                id='doctor_url'
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
                onChange={()=> console.log('')}
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
                  <Radio colorScheme='red' value='1'  isDisabled={!isAdmin}>
                    공개
                  </Radio>
                  <Radio colorScheme='blue' value='3' isDisabled={!isAdmin}>
                    미공개
                  </Radio>
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
                />
              </TabPanel>
              <TabPanel>
                <ListItem 
                  isTitle={false}
                  title='경력'
                  type='career' 
                  content={inputs?.career}
                  limintView={5}
                />  
              </TabPanel>
              <TabPanel>
                <ListItem 
                  isTitle={false}
                  title='수상'
                  type='awards' 
                  content={inputs?.awards}
                  limintView={5}
                />
              </TabPanel>
              <TabPanel>
                <ListItem 
                  isTitle={false}
                  title='논문'
                  type='publications' 
                  content={inputs?.publications}
                  limintView={5}
                />  
              </TabPanel>
              <TabPanel>
                <ListItem 
                  isTitle={false}
                  title='언론'
                  type='articles' 
                  content={inputs?.articles}
                  limintView={5}
                />
              </TabPanel>
              <TabPanel>
                <ListItem 
                  isTitle={false}
                  title='저서'
                  type='books' 
                  content={inputs?.books}
                  limintView={10}
                />
              </TabPanel>
              <TabPanel>
                <ListItem 
                  isTitle={false}
                  title='학회'
                  type='conferences' 
                  content={inputs?.conferences}
                  limintView={5}
                />
              </TabPanel>
              <TabPanel>
                <ListItem 
                  isTitle={false}
                  title='논문'
                  type='papers' 
                  content={doctorPapers}
                  limintView={10}
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
      </>
    )
  }
}

export default DoctorDetail;

