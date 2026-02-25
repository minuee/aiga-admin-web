import * as React from 'react';
import { Box,Button,Switch,Flex,Icon,Input,FormControl,FormLabel,FormErrorMessage,Text,InputGroup,InputLeftElement,Modal,ModalOverlay,ModalContent,ModalHeader,ModalFooter,ModalBody,ModalCloseButton,useColorMode,useColorModeValue } from '@chakra-ui/react'
// The below import defines which components come from formik
import { Field, Form, Formik } from 'formik';
import { MdChevronLeft,MdChevronRight, MdOutlineEventAvailable } from 'react-icons/md';
import Calendar from 'react-calendar';
import { format } from 'date-fns';
import Editor from "components/editor";
import NextImage from 'next/legacy/image';
import ProcessingBar from "img/processing2x.gif";

interface ViewFormProps {
    onHandSaveNotice: (data: any) => void;
    data: any;
    isReceiving : boolean;
}
export default function ViewForm(props: ViewFormProps) {
    const { colorMode, toggleColorMode } = useColorMode();
    const [defaultDate, setDefaultDate] = React.useState(format(new Date(), 'yyyy-MM-dd') );
    const [isShowCalendar, setShowCalendar] = React.useState(false);
    const [openDate, onDateChange] = React.useState(new Date());
    const [saveContent, setSaveContent] = React.useState(new Date());
    const [inputs, setInputs] = React.useState<any>({
        noticeId : '',
        title : '',
        isOpen : false,
        content : '',
        regDate : '',
        openDate : ''
    });
    const textColor = useColorModeValue('secondaryGray.900', 'white');
    const validateName = (value:any) => {
      let error
      if (!value) {
        error = 'Name is required'
      } else if (value.toLowerCase() !== 'naruto') {
        error = "Jeez! You're not a fan 😱"
      }
      return error
    }

    const onSelectDate = () => {
        setDefaultDate(format(openDate, 'yyyy-MM-dd'));
        setInputs({
            ...inputs,
            openDate : format(openDate, 'yyyy-MM-dd')
        })
        setShowCalendar(false);
    }

    React.useEffect(() => {
        setInputs({
            ...inputs,
            ...props.data,
            noticeId :  props.data?.notice_id,
            isOpen : props.data?.is_active,
            openDate :  props.data?.open_date,
            title : props.data?.title,
            content :  props.data?.content
        })
    }, [props.data]);

    React.useEffect(() => {
        props.onHandSaveNotice({
            ...inputs,
            content : saveContent
        })
    }, [inputs, saveContent]);

    
  
    return (
        
        <Box sx={{width:'99%',height:'100%',padding:'10px 10px 40px 10px' , overflow:'auto'}} overflowY="auto">
            {
                props.isReceiving && (
                <Flex position='absolute' left={0} top={0} width='100%' height='100%'  justifyContent={'center'}  backgroundColor={'#000000'} opacity={0.7} zIndex="100">
                    <Box padding='6' boxShadow='lg' width={"300px"} height={"calc( 100vh / 2 )"} display={'flex'} flexDirection={'column'}  justifyContent={'center'} alignItems={'center'}>
                    <NextImage width="60" height="20" src={ProcessingBar} alt={'loading'} />
                    </Box>
                </Flex>
                )
            }
            <Formik
                initialValues={{ name: '홍길동' }}
                onSubmit={(values, actions) => {
                setTimeout(() => {
                    alert(JSON.stringify(values, null, 2))
                    actions.setSubmitting(false)
                }, 1000)
                }}
            >
                {(props) => (
                <Form>
                    <Box>
                        <Field name='title' validate={validateName}>
                        {({ field, form }:any) => (
                            <FormControl isInvalid={form.errors.name && form.touched.name}>
                            <FormLabel>제목</FormLabel>
                            <Input 
                                {...field} 
                                placeholder='공지사항 제목을 입력해주세요'  
                                value={inputs?.title || ''} 
                                color={textColor} 
                                required
                                onChange={(e:any) => setInputs({...inputs,title:e.target.value})}
                                //readOnly={!functions.isEmpty(inputs.noticeId)}
                                id='title'
                            />
                            <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                            </FormControl>
                        )}
                        </Field>
                    </Box>
                    <Flex flexDirection={{ sm: 'column', md: 'row' }} justifyContent={'space-between'}>
                        <Box>
                            <FormLabel htmlFor='email-alerts' mt='5'>
                                공개여부
                            </FormLabel>
                            <Switch id='email-alerts' isChecked={inputs.isOpen} onChange={() => setInputs({...inputs, isOpen : !inputs.isOpen})}/>
                        </Box>
                        <Box>
                            <FormLabel mt='5'>
                                공개일자
                            </FormLabel>
                            <InputGroup onClick={()=> setShowCalendar(true)}>
                                <InputLeftElement pointerEvents='none' >
                                    <MdOutlineEventAvailable color={textColor}  />
                                </InputLeftElement>
                                <Input 
                                    type='text' 
                                    placeholder='공개일자' 
                                    readOnly  
                                    value={inputs?.openDate || defaultDate} 
                                    color={textColor} 
                                    id='openDate'
                                />
                            </InputGroup>
                        </Box>
                    </Flex>
                    <Flex flexDirection={'column'}>
                        <FormLabel mt='5'>
                            내용
                        </FormLabel>
                        <Editor 
                            onHandSaveContent={(data:any) => setSaveContent(data)}
                            height={700}
                            colorMode={colorMode}
                            content={inputs?.content}
                        />
                    </Flex>
                </Form>
                )}
            </Formik>
            {
                isShowCalendar && (
                    <Modal isOpen={isShowCalendar} onClose={()=>setShowCalendar(false)}>
                        <ModalOverlay />
                        <ModalContent>
                        <ModalHeader>공개일 설정</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <Calendar
                                locale='ko'
                                onChange={onDateChange}
                                value={openDate}
                                //selectRange={selectRange}
                                calendarType="US"
                                view={'month'}
                                tileContent={<Text color="brand.500" />}
                                prevLabel={<Icon as={MdChevronLeft} w="24px" h="24px" mt="4px" />}
                                nextLabel={<Icon as={MdChevronRight} w="24px" h="24px" mt="4px" />}
                            />
                        </ModalBody>

                        <ModalFooter>
                            <Button colorScheme='gray' mr={3} onClick={()=>setShowCalendar(false)} id="button_cancel">취소</Button>
                            <Button variant='ghost'  onClick={onSelectDate} id="button_select">선택</Button>
                        </ModalFooter>
                        </ModalContent>
                    </Modal>
                )
            }
        </Box>
    )
}