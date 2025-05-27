import React from 'react';
import { Flex,Text,Divider,Box,List,ListItem,FormControl,Input, useColorModeValue, SkeletonText, Icon ,Modal,ModalOverlay,ModalContent,ModalHeader,ModalCloseButton,ModalBody } from '@chakra-ui/react';
import { MdDelete,MdAssignment } from 'react-icons/md';
import mConstants from 'utils/constants';
import functions from 'utils/functions';
import PaperDetail from 'components/modal/PaperDetail';
import useCheckAdmin from "store/useCheckAdmin";
type ListItemScreenProps = {
    isTitle: boolean;
    title: string;
    type: string;
    content: any;
    limintView: number;
    marginTop?: number;
};

const ListItemScreen = ({ isTitle = true, title = "", type = "", content, limintView = 3, marginTop = 2 }:ListItemScreenProps) => {
    const [expandedCount, setExpandedCount] = React.useState<any>(content?.length > limintView ? limintView : undefined);
    const isAdmin = useCheckAdmin();
    const handleToggle = () => setExpandedCount(expandedCount ? undefined : limintView);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [isOpenModal, setIsOpenModal] = React.useState<any>(null);
    const textColor = useColorModeValue('secondaryGray.900', 'white');
    const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
    const skeletonColor = useColorModeValue('white', 'navy.700');
    const formBtnRef = React.useRef();

    const [inputs, setInputs] = React.useState<any>([{
        targetData: '',
        text: '',
        type: type,
        url: '',
        issuer : ''
    }]);

    React.useEffect(() => {
        setInputs(content);
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);   
    }, [content]);

    React.useEffect(() => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);   
    }, [inputs?.length]);

    const onHandlePaperModify = (data:any) => {
        
    }

    if ( isLoading ) {
        return (
            <Box padding='6' boxShadow='lg' bg={skeletonColor}>
              <SkeletonText mt='4' noOfLines={4} spacing='4' skeletonHeight='2' />
            </Box>
        )
    }
    return (
        <Flex  display={'flex'} flexDirection={'column'} justifyContent={'center'} mt={marginTop}>
            {
                isTitle && (
                    <>
                        <Text>{title}</Text>
                        <Divider orientation='horizontal' my={2}/>
                    </>
                )
            }
            {
                inputs?.length > 0 ? (
                    <Box 
                        minH={'150px'}
                        noOfLines={100}
                    >
                        {
                        type === 'papers' ? (
                            <List spacing={{base : 0,'mobile' : 2}}>
                            {inputs?.map((item:any, index:number) => (
                                <ListItem key={index}>
                                    <FormControl variant="floatingLabel" display={'flex'} flexDirection={'row'}>
                                        <Input 
                                            flex={1}
                                            type="text" 
                                            borderColor={borderColor}
                                            color={textColor}
                                            placeholder='doi' 
                                            value={functions.isEmpty(item?.doi) ? '' : item?.doi}
                                            size='sm'
                                            onChange={(e) => {
                                               setInputs(inputs.map((input:any,idx:number) => idx === index ? {...input, doi: e.target.value} : input));
                                            }}
                                            id={`doi_${index}`}
                                            disabled={!isAdmin}
                                        />
                                        <Input                                           
                                            flex={3}
                                            type="text" 
                                            borderColor={borderColor}
                                            color={textColor}
                                            placeholder="제목" 
                                            value={functions.isEmpty(item?.title) ? '' : item?.title}
                                            size='sm'
                                            onChange={(e) => {
                                               setInputs(inputs.map((input:any,idx:number) => idx === index ? {...input, title: e.target.value} : input));
                                            }}
                                            id={`title_${index}`}
                                            disabled={!isAdmin}
                                        />
                                        <Input 
                                            flex={1}
                                            type="text" 
                                            borderColor={borderColor}
                                            color={textColor}
                                            placeholder='pmId' 
                                            value={functions.isEmpty(item?.pmid) ? '' : item?.pmid}
                                            size='sm'
                                            onChange={(e) => {
                                               setInputs(inputs.map((input:any,idx:number) => idx === index ? {...input, pmid: e.target.value} : input));
                                            }}
                                            id={`pmid_${index}`}
                                            disabled={!isAdmin}
                                        />
                                        <Box 
                                            flex={0.5} 
                                            display={ isAdmin ? 'flex' : 'none'} 
                                            justifyContent={'center'} 
                                            alignItems={'center'}
                                            onClick={() => {
                                                setInputs(inputs.filter((input:any,idx:number) => idx !== index));
                                            }}
                                            cursor={'pointer'}
                                        >
                                            <Icon as={MdDelete} />
                                        </Box>
                                        <Box 
                                            flex={0.5} 
                                            display={ isAdmin ? 'flex' : 'none'} 
                                            justifyContent={'center'} 
                                            alignItems={'center'}
                                            onClick={() => setIsOpenModal(item)}
                                            cursor={'pointer'}
                                        >
                                            <Icon as={MdAssignment} />
                                        </Box>
                                    </FormControl>
                                </ListItem>
                            ))}
                        </List>
                        )
                        :
                            <List spacing={2}>
                            {inputs?.map((item:any, index:number) => (
                                <ListItem key={index}>
                                    <FormControl variant="floatingLabel" display={'flex'} flexDirection={'row'}>
                                        <Input 
                                            flex={1}
                                            type="text" 
                                            borderColor={borderColor}
                                            color={textColor}
                                            placeholder='일자' 
                                            value={functions.isEmpty(item?.targetDate) ? "" : item?.targetDate}
                                            size='sm'
                                            onChange={(e) => {
                                               setInputs(inputs.map((input:any,idx:number) => idx === index ? {...input, targetDate: e.target.value} : input));
                                            }}
                                            id={`targetDate_${index}`}
                                            disabled={!isAdmin}
                                        />
                                        <Input                                           
                                            flex={3}
                                            type="text" 
                                            borderColor={borderColor}
                                            color={textColor}
                                            placeholder='내용' 
                                            value={functions.isEmpty(item?.text) ? "" : item?.text}
                                            size='sm'
                                            onChange={(e) => {
                                               setInputs(inputs.map((input:any,idx:number) => idx === index ? {...input, text: e.target.value} : input));
                                            }}
                                            id={`text_${index}`}
                                            disabled={!isAdmin}
                                        />
                                        <Input 
                                            flex={1}
                                            type="text" 
                                            borderColor={borderColor}
                                            color={textColor}
                                            placeholder='발행처' 
                                            value={functions.isEmpty(item?.issuer) ? "" : item?.issuer}
                                            size='sm'
                                            onChange={(e) => {
                                               setInputs(inputs.map((input:any,idx:number) => idx === index ? {...input, issuer: e.target.value} : input));
                                            }}
                                            id={`issuer_${index}`}
                                            disabled={!isAdmin}
                                        />
                                        <Box 
                                            flex={0.5} 
                                            display={ isAdmin ? 'flex' : 'none'} 
                                            justifyContent={'center'} 
                                            alignItems={'center'}
                                            onClick={() => {
                                                setInputs(inputs.filter((input:any,idx:number) => idx !== index));
                                            }}
                                            cursor={'pointer'}
                                        >
                                            <Icon as={MdDelete} />
                                        </Box>
                                        
                                    </FormControl>
                                </ListItem>
                            ))}
                        </List>
                    }
                    </Box>   
                ) : (
                    <Flex justifyContent={'center'} alignItems={'center'} minH={'150px'}>
                        <Text>등록된 내용이 없습니다.</Text>
                    </Flex>
                )
            }     
            {
				!functions.isEmpty(isOpenModal) && (    
					<Modal
                        onClose={() => setIsOpenModal(null)}
                        finalFocusRef={formBtnRef}
                        isOpen={!functions.isEmpty(isOpenModal)}
                        scrollBehavior={'inside'}
					>
					<ModalOverlay />
					<ModalContent maxW={`${mConstants.modalMaxWidth}px`}>
						<ModalHeader>{`논문 상세정보`}</ModalHeader>
						<ModalCloseButton />
						<ModalBody >
						<PaperDetail
							isOpen={!functions.isEmpty(isOpenModal)}
							setClose={() => setIsOpenModal(null)}
							PaperData={isOpenModal}
                            onHandlePaperModify={(data:any) => onHandlePaperModify(data)}
						/>
						</ModalBody>
					</ModalContent>
					</Modal>
				)
			}
        </Flex>
    )
};

export default React.memo(ListItemScreen);