
import * as React from 'react';
import { createColumnHelper,flexRender,getCoreRowModel,getSortedRowModel,SortingState,useReactTable } from '@tanstack/react-table';
import { 
	Flex, Box, Table, Checkbox, Tbody, Td, Text, Th, Thead, Tr, useColorModeValue,Drawer,DrawerBody,DrawerFooter,Tooltip,
	DrawerHeader,DrawerOverlay,Input,DrawerContent,DrawerCloseButton,Button,Select,Modal,ModalOverlay,ModalContent,ModalHeader,ModalCloseButton,ModalBody
} from '@chakra-ui/react';
// Custom components
import Card from 'components/card/Card';

import { RowObj } from 'views/v1/dataTables/variables/tableDataInquirys';
import { renderThumb,renderTrack,renderView } from 'components/scrollbar/Scrollbar';
import dynamic from 'next/dynamic';
const Scrollbars = dynamic(
  () => import('react-custom-scrollbars-2').then((mod) => mod.Scrollbars),
  { ssr: true },
);

import InquiryDetail from 'components/modal/InquiryDetail';
import NoticeForm from "views/v1/notice/View";
import functions from 'utils/functions';
import mConstants from 'utils/constants';

const columnHelper = createColumnHelper<RowObj>();

// const columns = columnsDataCheck;
export default function InquiryTable(props: { tableData: any }) {
	const { tableData } = props;
	const [ sorting, setSorting ] = React.useState<SortingState>([]);
	const [ isOpenRequestModal, setIsOpenRequestModal ] = React.useState(false);
	const [ data_9, setData9 ] = React.useState<any>([]);
	const textColor = useColorModeValue('secondaryGray.900', 'white');
	const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
	const bgColor = useColorModeValue(' .300', 'navy.900');
	const sidebarBackgroundColor = useColorModeValue('white', 'navy.800');
	const formBtnRef = React.useRef(null)

	let defaultData= tableData;
	const columns = [
		columnHelper.accessor('name', {
			size: 200,
			id: 'name',
			header: () => (
				<Flex align='center'>
					<Checkbox defaultChecked={false} colorScheme='brandScheme' mr='10px' />
					<Text justifyContent='space-between' align='center' fontSize={{ sm: '10px', lg: '12px' }} color='gray.400' >
						이름 
					</Text>
				</Flex>
			),
			cell: (info: any) => (
				<Flex align='center'>
					<Checkbox defaultChecked={info.getValue()[1]} colorScheme='brandScheme' mr='10px' />
					<Text color={textColor} fontSize='sm' fontWeight='700'>
						{info.getValue()}
					</Text>
				</Flex>
			)
		}),
		columnHelper.accessor('contactInfo', {
			id: 'contactInfo',
			header: () => (
				<Text justifyContent='space-between' align='center' fontSize={{ sm: '10px', lg: '12px' }} color='gray.400' >
					연락정보
				</Text>
			),
			cell: (info) => (
				<Text color={textColor} fontSize='sm' fontWeight='700'>
					{info.getValue()}
				</Text>
			)
		}),
		columnHelper.accessor('relation', {
			id: 'relation',
			header: () => (
				<Text justifyContent='space-between' align='center' fontSize={{ sm: '10px', lg: '12px' }} color='gray.400' >
					관계
				</Text>
			),
			cell: (info) => (
				<Text color={textColor} fontSize='sm' fontWeight='700'>
					{info.getValue()}
				</Text>
			)
		}),
		columnHelper.accessor('isCleared', {
			id: 'isCleared',
			header: () => (
				<Text justifyContent='space-between' align='center' fontSize={{ sm: '10px', lg: '12px' }} color='gray.400'>
					처리
				</Text>
			),
			cell: (info) => (
				<>
				{
					info.getValue() 
					? 
					(
						<Tooltip label="관리자 | 2025.05.09" aria-label='A tooltip'>
							<Checkbox defaultChecked={info.getValue()} colorScheme='brandScheme' />
						</Tooltip>
					)
					:
					<Checkbox defaultChecked={info.getValue()} colorScheme='brandScheme' />
				}
				</>
			)
		}),
		columnHelper.accessor('regDate', {
			size: 200,
			id: 'regDate',
			header: () => (
				<Text justifyContent='space-between' align='center' fontSize={{ sm: '10px', lg: '12px' }} color='gray.400'>
					등록일자
				</Text>
			),
			cell: (info) => (
				<Text color={textColor} fontSize='sm' fontWeight='700'>
					{info.getValue()}
				</Text>
			)
		})
	];
	const [ data, setData ] = React.useState(() => [ ...defaultData ]);
	const [ isShow, setShow ] = React.useState(false);
	const btnRef = React.useRef();
	const table = useReactTable({
		data,
		columns,
		state: {
			sorting
		},
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		debugTable: true
	});

	const onHandleOpenDetail = (id:string) => {
		if ( !functions.isEmpty(id) ) setIsOpenRequestModal(true);
	}

	return (
		<Card flexDirection='column' w='100%' px='0px' overflowX={{ sm: 'scroll', lg: 'hidden' }}>
			<Flex 
				flexDirection={{base : 'column', md : 'row'}}
				px={{base : '10px', xl : '25px'}}
				mb="8px" 
				justifyContent={{base : 'center', md : 'space-between' }}
				align='center'
			>
				<Box display='flex' alignItems='center' width={{base : '100%', xl : 'auto'}}>
					<Text color={textColor} fontSize='22px' mb="4px" fontWeight='700' lineHeight='100%'>
						수정요청 리스트
					</Text>
				</Box>
				<Box display='flex' alignItems={'flex-end'} width={{base : '100%', xl : 'auto'}}>
					<Select placeholder='정렬기준'>
						<option value='option1'>최신 등록순</option>
						<option value='option2'>이름순</option>
						<option value='option3'>관계순</option>
					</Select>
					<Input placeholder='키워드를 입력하세요' id='keyword' />
					<Button
						size='md'
						loadingText='Loading'
						variant="solid"
						colorScheme='blue'
						sx={{borderRadius:'5px'}}
						id="button_search"
					>
						검색
					</Button>
				</Box>
			</Flex>
			<Box minHeight={{base : "200px" , xl : "400px"}}>
				<Table variant='simple' color='gray.500' mb='24px' mt="12px">
					<Thead>
						{table.getHeaderGroups().map((headerGroup) => (
							<Tr  key={headerGroup.id} >
								{headerGroup.headers.map((header) => {
									return (
										<Th
											key={header.id}
											colSpan={header.colSpan}
											pe='10px'
											borderColor={borderColor}
											//cursor='pointer'
											//onClick={header.column.getToggleSortingHandler()}
										>
											<Flex
												justifyContent='space-between'
												align='center'
												fontSize={{ sm: '10px', lg: '12px' }}
												color='gray.400'
											>
												{flexRender(header.column.columnDef.header, header.getContext())}{{
													asc: '',
													desc: '',
												}[header.column.getIsSorted() as string] ?? null}
											</Flex>
										</Th>
									);
								})}
							</Tr>
						))}
					</Thead>
					<Tbody>
						{table.getRowModel().rows.slice(0, 11).map((row) => {
							return (
								<Tr key={row.id}>
									{row.getVisibleCells().map((cell) => {
										return (
											<Td
												key={cell.id}
												sx={{borderBottom:'1px', borderBottomColor:'#ebebeb'}}
												fontSize={{ sm: '14px' }}
												minW={{ sm: '150px', md: '200px', lg: 'auto' }}
												borderColor='transparent'
												onClick={() => onHandleOpenDetail(row.original.name)}
											>
												{flexRender(cell.column.columnDef.cell, cell.getContext())}
											</Td>
										);
									})}
								</Tr>
							);
						})}
					</Tbody>
				</Table>
			</Box>
			{
				isShow && (
				<Drawer
					isOpen={isShow}
					onClose={()=>setShow(false)}
					placement={'bottom'}
					finalFocusRef={btnRef}
					closeOnOverlayClick={false}
					size={'full'}
				>
					<DrawerOverlay />
					<DrawerContent 
						h="calc( 100vh - 30px)" 
						overflow='scroll'
						backgroundColor={bgColor}
						//w="285px" 
						//maxW="300px"  
						/* ms={{
							sm: '300px',
						}}
						my={{
							sm: '0',
						}}
						borderRadius="16px" */
					>
					<DrawerCloseButton
						zIndex="3"
						onClick={()=>setShow(false)}
						_focus={{ boxShadow: 'none' }}
						_hover={{ boxShadow: 'none' }}
					/>
					<DrawerHeader sx={{borderBottom:'1px solid #ebebeb'}}>공지사항 등록</DrawerHeader>
					<DrawerBody w="calc(100% - 20px)"  padding="10px">
						<Scrollbars
							autoHide
							renderTrackVertical={renderTrack}
							renderThumbVertical={renderThumb}
							renderView={renderView}
							universal={true}
						>
						<NoticeForm
							data={null}
						/>
						</Scrollbars>
					</DrawerBody>
					<DrawerFooter sx={{borderTop:'1px solid #ebebeb'}}>
						<Button variant='outline' mr={3} onClick={()=>setShow(false)} id="button_cancel">
						Cancel
						</Button>
						<Button colorScheme='blue' id='button_save'>Save</Button>
					</DrawerFooter>
					</DrawerContent>
				</Drawer>
				)
			}
			{
				isOpenRequestModal && (    
					<Modal
						onClose={() => setIsOpenRequestModal(false)}
						finalFocusRef={formBtnRef}
						isOpen={isOpenRequestModal}
						scrollBehavior={'inside'}
						>
						<ModalOverlay />
						<ModalContent maxW={`${mConstants.modalMaxWidth}px`} bg={sidebarBackgroundColor}>
							<ModalHeader>{"수정요청 상세정보"}</ModalHeader>
							<ModalCloseButton />
							<ModalBody >
							<InquiryDetail
								isOpen={isOpenRequestModal}
								setClose={() => setIsOpenRequestModal(false)}
								inquiryId={'1'}
							/>
							</ModalBody>
						</ModalContent>
					</Modal>
				)
			}
		</Card>
	);
} 