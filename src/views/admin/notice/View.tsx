import * as React from 'react';
import { Box,Button,Switch,Flex,Icon,Input,FormControl,FormLabel,FormErrorMessage,Text,InputGroup,InputLeftElement,Modal,ModalOverlay,ModalContent,ModalHeader,ModalFooter,ModalBody,ModalCloseButton,useColorMode,useColorModeValue } from '@chakra-ui/react'
// The below import defines which components come from formik
import { Field, Form, Formik } from 'formik';
import { MdChevronLeft,MdChevronRight, MdOutlineEventAvailable } from 'react-icons/md';
import Calendar from 'react-calendar';
import { format } from 'date-fns';
import Editor from "components/editor";
import functions from 'utils/functions';
const dummyContent = `<p style="width:100%;min-width:600px;text-align: center;"><h2>공지할 내용입니다.</h2><h1><span style="background-color: rgb(255, 255, 255); color: rgb(0, 0, 0); ">What is </span><span style="background - color: rgb(255, 255, 255); color: rgb(230, 0, 0); ">Lorem</span><span style="background - color: rgb(255, 153, 0); color: rgb(0, 0, 0); "> Ipsum</span><span style="background - color: rgb(255, 255, 255); color: rgb(0, 0, 0); ">?</span></h1><p><strong style="background - color: rgb(255, 255, 255); color: rgb(0, 0, 0); "><u>Lorem Ipsum</u></strong><span style="background-color: rgb(255, 255, 255); color: rgb(0, 0, 0); ">&nbsp;is</span><s style="background-color: rgb(255, 255, 255); color: rgb(0, 0, 0); "> simply</s><em style="background-color: rgb(255, 255, 255); color: rgb(0, 0, 0); "> dummy<a href="https://www.naver.com/" rel="noopener noreferrer" target="_blank"> </a></em><a href="https://www.naver.com/" rel="noopener noreferrer" target="_blank" style="background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);">text </a><span style="background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);">of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem</span> Ipsum.</p><p><br></p><p style="text-align: center;"><img src="https://img1.daumcdn.net/thumb/R1280x0.fjpg/?fname=http://t1.daumcdn.net/brunch/service/user/cnoC/image/66LHXQZY2bFLKR7SEO_KJjOnX6M" width="133" style=""></p><p><br></p><p><br></p></p>`

interface ViewFormProps {
    data: any;
}
export default function ViewForm(props: ViewFormProps) {
    const { colorMode, toggleColorMode } = useColorMode();
    const [defaultDate, setDefaultDate] = React.useState(format(new Date(), 'yyyy-MM-dd') );
    const [isShowCalendar, setShowCalendar] = React.useState(false);
    const [openDate, onDateChange] = React.useState(new Date());
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
        console.log("dddddd",props.data)
        setInputs({
            ...inputs,
            ...props.data,
            isOpen : props.data?.info,
            openDate :  props.data?.date,
            title : props.data?.name[0],
            content :  dummyContent
        })
    }, [props.data]);
  
    return (
        
        <Box sx={{width:'99%',height:'100%',padding:'10px 10px 40px 10px' , overflow:'auto'}} overflowY="auto">
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
                                onChange={(e:any) => setInputs({...inputs,title:e.target.value})}
                                //readOnly={!functions.isEmpty(inputs.noticeId)}
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
                                />
                            </InputGroup>
                            
                        </Box>
                    </Flex>
                    <Flex flexDirection={'column'}>
                        <FormLabel mt='5'>
                            내용
                        </FormLabel>
                        <Editor 
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
                            <Button colorScheme='gray' mr={3} onClick={()=>setShowCalendar(false)}>취소</Button>
                            <Button variant='ghost'  onClick={onSelectDate}>선택</Button>
                        </ModalFooter>
                        </ModalContent>
                    </Modal>
                )
            }
        </Box>
    )
}