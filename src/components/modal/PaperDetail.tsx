'use client';
import React, { PropsWithChildren } from 'react';

// chakra imports
import { Box,Flex,Button,Text,SkeletonCircle,SkeletonText,Icon,Textarea,Input, FormControl, FormLabel, RadioGroup, Radio, Stack, useColorModeValue } from '@chakra-ui/react';
// Assets
import Link from 'next/link';
import { IoLink } from "react-icons/io5";
import functions from 'utils/functions';

export interface DoctorDetailProps extends PropsWithChildren {
  isOpen : boolean;
  setClose : () => void;
  PaperData : any;
  onHandlePaperModify : (data:any) => void;
}

function DoctorDetail(props: DoctorDetailProps) {
  const { isOpen, setClose, PaperData,onHandlePaperModify } = props;
  const [isLoading, setIsLoading] = React.useState(true);  
  const [inputs, setInputs] = React.useState<any>({
    title: '',
    doi: '',
    pmid: '',
    author: '',
    journal: '',
    year: '',
    volume: '',
    paper_id: '',
    doctorname: '',
    paper_url: '',
    journalName: '',
    specialties: '',
    
  });

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'white.100');
  const skeletonColor = useColorModeValue('white', 'navy.700');

 
  React.useEffect(() => {
    setTimeout(() => {
      setInputs({
        ...PaperData,
      });
      setIsLoading(false);
    }, 500);
  }, [isOpen]);

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
        <Flex display={'flex'} flexDirection={{base : 'column' , 'mobile' : 'row'}} minHeight={'50px'} padding={{base : "0", 'mobile' : '0 10px'}}>
          <Box flex={1} width={'100%'}>
            <FormControl variant="floatingLabel">
              <FormLabel>Paper Id</FormLabel>
              <Input 
                type="text" 
                borderColor={borderColor}
                color={textColor}
                placeholder='PaperId' 
                value={functions.isEmpty(inputs?.paper_id) ? '' : inputs?.paper_id}
                readOnly
              />
            </FormControl>
          </Box>  
          <Box flex={1} width={'100%'} mt={{base : "10px", 'mobile' : '0'}}>
            <FormControl variant="floatingLabel">
              <FormLabel>의사명</FormLabel>
              <Input 
                type="text" 
                borderColor={borderColor}
                color={textColor}
                placeholder='의사명' 
                value={functions.isEmpty(inputs?.doctorName) ? '' : inputs?.doctorName}
                readOnly
              />
            </FormControl>
          </Box>   
        </Flex>
        <Flex display={'flex'} flexDirection={'row'} minHeight={'50px'} padding={{base : "0", 'mobile' : '0 10px'}} mt={5}>
          <Box flex={1}>
            <FormControl variant="floatingLabel">
              <FormLabel>
                페이지 URL
                {
                  !functions.isEmpty(inputs?.paper_url) && (
                    <Link href={inputs?.paper_url} target='_blank' style={{marginLeft:"10px"}}>
                      <Icon as={IoLink} size={20} />
                    </Link>
                  )
                }
              </FormLabel>
              <Input 
                type="text" 
                borderColor={borderColor}
                color={textColor}
                placeholder='페이지 URL' 
                value={functions.isEmpty(inputs?.paper_url) ? '' : inputs?.paper_url}
                readOnly
              />
            </FormControl>
          </Box>              
        </Flex> 
        <Flex display={'flex'} flexDirection={{base : 'column' , 'mobile' : 'row'}} minHeight={'50px'} padding={{base : "0", 'mobile' : '0 10px'}} mt={5}>
          <Box flex={1}>
            <FormControl variant="floatingLabel">
              <FormLabel>저널명</FormLabel>
              <Input 
                type="text" 
                borderColor={borderColor}
                color={textColor}
                placeholder='저널명' 
                value={functions.isEmpty(inputs?.journalName) ? '' : inputs?.journalName}
                readOnly
              />
            </FormControl>
          </Box>              
          <Box flex={1} mt={{base : "10px", 'mobile' : '0'}}>
            <FormControl variant="floatingLabel">
              <FormLabel>PMID</FormLabel>
              <Input 
                type="text"   
                borderColor={borderColor}
                color={textColor}
                placeholder='PMID' 
                value={functions.isEmpty(inputs?.pmid) ? '' : inputs?.pmid}
                readOnly
              />
            </FormControl>
          </Box> 
        </Flex> 
        <Flex display={'flex'} flexDirection={{base : 'column' , 'mobile' : 'row'}} minHeight={'50px'} padding={{base : "0", 'mobile' : '0 10px'}} mt={5}>
          <Box flex={1}>
            <FormControl variant="floatingLabel">
              <FormLabel>ImpactFactor</FormLabel>
              <Input 
                type="text" 
                borderColor={borderColor}
                color={textColor}
                placeholder='ImpactFactor' 
                value={functions.isEmpty(inputs?.impactFactor) ? '' : inputs?.impactFactor}
                readOnly
              />
            </FormControl>
          </Box>              
          <Box flex={1} mt={{base : "10px", 'mobile' : '0'}}>
            <FormControl variant="floatingLabel">
              <FormLabel>인용수</FormLabel>
              <Input 
                type="text"   
                borderColor={borderColor}
                color={textColor}
                placeholder='인용수' 
                value={functions.isEmpty(inputs?.totalCitations) ? '' : inputs?.totalCitations}
                readOnly
              />
            </FormControl>
          </Box> 
        </Flex> 
        <Flex display={'flex'} flexDirection={'row'} minHeight={'50px'} padding={{base : "0", 'mobile' : '0 10px'}}>
          <Box mt={5} width={'100%'}>
            <FormControl variant="floatingLabel">
              <FormLabel>Authors</FormLabel>
              <Textarea 
                variant={'outline'} 
                onChange={(e) => setInputs({...inputs, specialties: e.target.value})} 
                resize={'none'}  
                minH={'100px'}
                width={'100%'}
                size={'sm'} 
                borderColor={borderColor}
                color={textColor}
                value={functions.isEmpty(inputs?.authors) ? '' : inputs?.authors}
              />
            </FormControl>
          </Box>   
        </Flex>
        <Flex display={'flex'} flexDirection={'row'} minHeight={'50px'} padding={{base : "0", 'mobile' : '0 10px'}}>
          <Box mt={5} width={'100%'}>
            <FormControl variant="floatingLabel">
              <FormLabel>Title<span style={{color:"red",fontSize:"10px"}}> * Original Title</span></FormLabel>
              <Textarea 
                variant={'outline'} 
                onChange={(e) => setInputs({...inputs, specialties: e.target.value})} 
                resize={'none'}  
                minH={'100px'}
                width={'100%'}
                size={'sm'} 
                borderColor={borderColor}
                color={textColor}
                value={functions.isEmpty(inputs?.title) ? '' : inputs?.title}
              />
            </FormControl>
          </Box>   
        </Flex>
        <Flex display={'flex'} flexDirection={'row'} minHeight={'50px'} padding={{base : "0", 'mobile' : '0 10px'}}>
          <Box mt={5} width={'100%'}>
            <FormControl variant="floatingLabel">
              <FormLabel>Title<span style={{color:"red",fontSize:"10px"}}> * PubMed Title</span></FormLabel>
              <Textarea 
                variant={'outline'} 
                onChange={(e) => setInputs({...inputs, title_pubmed: e.target.value})} 
                resize={'none'}  
                minH={'100px'}
                width={'100%'}
                size={'sm'} 
                borderColor={borderColor}
                color={textColor}
                value={functions.isEmpty(inputs?.title_pubmed) ? '' : inputs?.title_pubmed}
              />
            </FormControl>
          </Box>   
        </Flex>
        <Flex display={'flex'} flexDirection={'row'} minHeight={'50px'} padding={{base : "0", 'mobile' : '0 10px'}} mt={5}>           
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
              onClick={() => onHandlePaperModify(inputs)}
            >
              수정
            </Button>
        </Box>
        <Box height={'50px'} />
      </>
    )
  }
}


export default DoctorDetail;
