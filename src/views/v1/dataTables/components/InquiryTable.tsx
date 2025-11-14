
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
export default function InquiryTable(props: {
	tableData: any,
	page:number, 
	order : string ,
	orderName: string,
	status: '' | '0' | '1' | '9',
	keyword: string,
	getDataSortChange : (str: string) => void,
	handleFilterChange: (newStatus: '' | '0' | '1' | '9') => void,
	handleSearch: (keyword: string) => void,
	refetchData: () => void 
}) {
	const { tableData, status, keyword, handleFilterChange, handleSearch } = props;
	const [ sorting, setSorting ] = React.useState<SortingState>([]);
	const [ data, setTableData ] = React.useState([]);
	const [ selectedData, setSelectedData ] = React.useState(null);
	const [ localKeyword, setLocalKeyword ] = React.useState('');
	const [ isOpenRequestModal, setIsOpenRequestModal ] = React.useState(false);
	const textColor = useColorModeValue('secondaryGray.900', 'white');
	const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
	const bgColor = useColorModeValue(' .300', 'navy.900');
	const sidebarBackgroundColor = useColorModeValue('white', 'navy.800');
	const formBtnRef = React.useRef(null)
	
	// Sync local keyword state if prop changes from parent
	React.useEffect(() => {
		setLocalKeyword(keyword);
	}, [keyword]);

	const columns = [
		columnHelper.accessor('nickname', {
			size: 200,
			id: 'nickname',
			header: () => (
				<Flex align='center' alignItems={'center'} justifyContent={'center'}>
					<Text fontSize={{ sm: '10px', lg: '12px' }} color='gray.400' >
						작성자 
					</Text>
				</Flex>
			),
			cell: (info: any) => (
				<Flex align='center' alignItems={'center'} justifyContent={'center'}>
					<Text color={textColor} fontSize='sm' fontWeight='700'>
						{info.getValue() || '-' }
					</Text>
				</Flex>
			)
		}),
		columnHelper.accessor(row => row.doctor_basic?.hospital?.shortName, {
			id: 'hospitalName',
			header: () => (
				<Text justifyContent='space-between' align='center' fontSize={{ sm: '10px', lg: '12px' }} color='gray.400' >
					병원명
				</Text>
			),
			cell: (info) => {
				const hospitalName = info.row.original.doctor_basic?.hospital?.shortName;
				return <Text color={textColor} fontSize='sm' fontWeight='700'>{hospitalName || '-'}</Text>;
			},
		}),
		columnHelper.accessor(row => row?.doctor_basic?.doctorname, {
			id: 'doctorName',
			header: () => (
			  <Text
				justifyContent='space-between'
				align='center'
				fontSize={{ sm: '10px', lg: '12px' }}
				color='gray.400'
			  >
				의사명
			  </Text>
			),
			cell: (info) => {
				const doctorName = info.row.original.doctor_basic?.doctorname;
				return <Text color={textColor} fontSize='sm' fontWeight='700'>{doctorName || '-'}</Text>;
			},
		}),
		columnHelper.accessor('is_clear', {
			id: 'is_clear',
			header: () => (
				<Text justifyContent='space-between' align='center' fontSize={{ sm: '10px', lg: '12px' }} color='gray.400'>
					처리
				</Text>
			),
			cell: (info) => (
				<>
				{
					info.getValue() == '1'
					? 
					<Text color={textColor} fontSize='sm' fontWeight='700'>완료</Text>
					:
					info.getValue() == '9'
					?
					<Text color={textColor} fontSize='sm' fontWeight='700'>보류</Text>
					:
					<Text color={textColor} fontSize='sm' fontWeight='700'>대기</Text>
				}
				</>
			)
		}),
		columnHelper.accessor('createAt', {
			size: 200,
			id: 'createAt',
			header: () => (
				<Text justifyContent='space-between' align='center' fontSize={{ sm: '10px', lg: '12px' }} color='gray.400'>
					등록일자
				</Text>
			),
			cell: (info) => (
				<Text color={textColor} fontSize='sm' fontWeight='700'>
					{info.getValue() ? functions.dateToDateTime(info.getValue() as any) : '-'}
				</Text>
			)
		})
	];

	React.useEffect(() => {
		setTableData(tableData);
	}, [tableData]);

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

	const onHandleOpenDetail = (data:any) => {
		if ( !functions.isEmpty(data?.opinion_id) ) {
			setSelectedData(data)
			setIsOpenRequestModal(true);
		}
	}

	const onSearch = () => {
		handleSearch(localKeyword);
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
					<Select placeholder='정렬기준' mr={2}>
						<option value='option1'>최신 등록순</option>
						<option value='option2'>이름순</option>
						<option value='option3'>관계순</option>
					</Select>
					<Select 
						mr={2} 
						value={status} 
						onChange={(e) => handleFilterChange(e.target.value as any)}
					>
						<option value=''>전체</option>
						<option value='0'>대기</option>
						<option value='1'>완료</option>
						<option value='9'>보류</option>
					</Select>
					<Input 
						placeholder='키워드를 입력하세요' 
						id='keyword' 
						mr={2} 
						value={localKeyword}
						onChange={(e) => setLocalKeyword(e.target.value)}
						onKeyDown={(e) => e.key === 'Enter' && onSearch()}
					/>
					<Button
						size='md'
						loadingText='Loading'
						variant="solid"
						colorScheme='blue'
						sx={{borderRadius:'5px'}}
						id="button_search"
						onClick={onSearch}
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
					
					{
					data.length == 0
					?
					<Tbody >
						<Tr >
							<Th colSpan={8} >
								<Box
									display={'flex'}
									width={'100%'}
									height={{base : "100px" , md : '200px'}}
									justifyContent={'center'}
									alignItems={'center'}
									bg={bgColor}
								>
									<Text color={textColor} fontSize={{base : "15px", md:'20px'}} fontWeight='normal' lineHeight='100%'>
										데이터가 없습니다.
									</Text>
								</Box>
							</Th>
						</Tr>
					</Tbody>
					:
					<Tbody>
						{table.getRowModel().rows.map((row,index) => {
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
												onClick={() => onHandleOpenDetail(row.original)}
											>
												{flexRender(cell.column.columnDef.cell, cell.getContext())}
											</Td>
										);
									})}
								</Tr>
							);
						})}
					</Tbody>
				}
				</Table>
			</Box>
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
								data={selectedData}
								refetchData={props.refetchData}
							/>
							</ModalBody>
						</ModalContent>
					</Modal>
				)
			}
		</Card>
	);
} 