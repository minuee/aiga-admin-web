import React from 'react';
import { Flex,Text,Divider,Box,List,ListItem,FormControl,Input, useColorModeValue, SkeletonText, Icon , Button } from '@chakra-ui/react';
import { MdDelete,MdAssignment, MdAdd } from 'react-icons/md';
import functions from 'utils/functions';
import useCheckAdmin from "store/useCheckAdmin";
import CustomAlert from 'components/etc/CustomAlert';

type ListItemScreenProps = {
    isTitle: boolean;
    title: string;
    type: string;
    content: any;
    limintView: number;
    marginTop?: number;
    onContentChange: (content: any) => void;
    onAddItem: () => void;
    onDeleteItem?: (item: any) => void;
    onShowPaperDetail?: (paper: any) => void;
};

const ListItemScreen = ({ isTitle = true, title = "", type = "", content, limintView = 3, marginTop = 2, onContentChange, onAddItem, onDeleteItem, onShowPaperDetail }:ListItemScreenProps) => {
    const [expandedCount, setExpandedCount] = React.useState<any>(content?.length > limintView ? limintView : undefined);
    const isAdmin = useCheckAdmin();
    const handleToggle = () => setExpandedCount(expandedCount ? undefined : limintView);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [itemToDelete, setItemToDelete] = React.useState<any>(null);
    const textColor = useColorModeValue('secondaryGray.900', 'white');
    const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
    const skeletonColor = useColorModeValue('white', 'navy.700');

    React.useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 500);   
    }, [content]);

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
                content?.length > 0 ? (
                    <Box minH={'150px'} noOfLines={100}>
                        {
                        type === 'papers' ? (
                            <List spacing={{base : 0,'mobile' : 2}}>
                            {content?.map((item:any, index:number) => (
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
                                            readOnly
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
                                            readOnly
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
                                            readOnly
                                            id={`pmid_${index}`}
                                            disabled={!isAdmin}
                                        />
                                        <Box 
                                            flex={0.5} 
                                            display={ isAdmin ? 'flex' : 'none'} 
                                            justifyContent={'center'} 
                                            alignItems={'center'}
                                            onClick={() => setItemToDelete(item)}
                                            cursor={'pointer'}
                                        >
                                            <Icon as={MdDelete} />
                                        </Box>
                                        <Box 
                                            flex={0.5} 
                                            display={ isAdmin ? 'flex' : 'none'} 
                                            justifyContent={'center'} 
                                            alignItems={'center'}
                                            onClick={() => onShowPaperDetail && onShowPaperDetail(item)}
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
                            {content?.map((item:any, index:number) => (
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
                                                const newContent = [...content];
                                                newContent[index].targetDate = e.target.value;
                                                onContentChange(newContent);
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
                                                const newContent = [...content];
                                                newContent[index].text = e.target.value;
                                                onContentChange(newContent);
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
                                                const newContent = [...content];
                                                newContent[index].issuer = e.target.value;
                                                onContentChange(newContent);
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
                                                const newContent = content.filter((_:any, idx:number) => idx !== index);
                                                onContentChange(newContent);
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
            <Flex display={isAdmin && type !== 'papers' ? 'flex' : 'none'} justifyContent={'flex-end'} mt={2}>
                <Button leftIcon={<MdAdd />} colorScheme='blue' size={'sm'} onClick={onAddItem}>
                    추가
                </Button>
            </Flex>
            {
                itemToDelete && (
                    <CustomAlert
                        msg="논문을 삭제하시겠습니까?"
                        isOpen={!!itemToDelete}
                        fnConform={() => {
                            if (onDeleteItem) {
                                onDeleteItem(itemToDelete);
                            }
                            setItemToDelete(null);
                        }}
                        fnCancel={() => setItemToDelete(null)}
                    />
                )
            }
        </Flex>
    )
};

export default React.memo(ListItemScreen);