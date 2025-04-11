import * as React from 'react';
import {
    Box,
    Button,
    Switch,
    Flex,
    Icon,
    Input,
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Text,
    InputGroup,
    InputLeftElement,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useColorMode
  } from '@chakra-ui/react'
// The below import defines which components come from formik
import { Field, Form, Formik } from 'formik';
import { MdChevronLeft,MdChevronRight, MdOutlineEventAvailable } from 'react-icons/md';
import Calendar from 'react-calendar';

import { format } from 'date-fns';

import Editor from "components/editor";

interface ViewFormProps {
    data: any;
}
export default function ViewForm(props: ViewFormProps) {
    const { colorMode, toggleColorMode } = useColorMode();
    const [defaultDate, setDefaultDate] = React.useState(format(new Date(), 'yyyy-MM-dd') );
    const [isShowCalendar, setShowCalendar] = React.useState(false);
    const [openDate, onDateChange] = React.useState(new Date());
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
        setShowCalendar(false);
    }
  
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
                            <Input {...field} placeholder='title' />
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
                            <Switch id='email-alerts' />
                        </Box>
                        <Box>
                            <FormLabel mt='5'>
                                공개일자
                            </FormLabel>
                            <InputGroup onClick={()=> setShowCalendar(true)}>
                                <InputLeftElement pointerEvents='none' >
                                    <MdOutlineEventAvailable color={colorMode === 'light'? '#555' : '#ffffff'} />
                                </InputLeftElement>
                                <Input 
                                    type='text' 
                                    placeholder='공개일자' 
                                    readOnly  
                                    value={defaultDate} 
                                    color={colorMode === 'light'? '#555' : '#ffffff'} 
                                />
                            </InputGroup>
                            
                        </Box>
                    </Flex>
                    <Flex flexDirection={'column'}>
                        <FormLabel mt='5'>
                            내용
                        </FormLabel>
                        <Editor 
                            height={500}
                            colorMode={colorMode}
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
                            <Button variant='ghost' onClick={()=>onSelectDate()}>선택</Button>
                        </ModalFooter>
                        </ModalContent>
                    </Modal>
                )
            }
        </Box>
    )
  }