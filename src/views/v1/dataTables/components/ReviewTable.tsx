
import * as React from 'react';
import { createColumnHelper,flexRender,getCoreRowModel,getSortedRowModel,SortingState,useReactTable } from '@tanstack/react-table';
import { 
	Flex, Box, Table, Checkbox, Tbody, Td, Text, Th, Thead, Tr, useColorModeValue,Drawer,DrawerBody,DrawerFooter,
	DrawerHeader,DrawerOverlay,Input,DrawerContent,DrawerCloseButton,Button,Select,Modal,ModalOverlay,ModalContent,ModalHeader,ModalCloseButton,ModalBody
} from '@chakra-ui/react';
// Custom components
import Card from 'components/card/Card';

import { RowObj } from 'views/v1/dataTables/variables/tableDataReview';
import { renderThumb,renderTrack,renderView } from 'components/scrollbar/Scrollbar';
import dynamic from 'next/dynamic';
const Scrollbars = dynamic(
  () => import('react-custom-scrollbars-2').then((mod) => mod.Scrollbars),
  { ssr: true },
);

import ReviewDetail from 'components/modal/ReviewDetail';
import NoticeForm from "views/v1/notice/View";
import functions from 'utils/functions';
import mConstants from 'utils/constants';

const columnHelper = createColumnHelper<RowObj>();

// const columns = columnsDataCheck;

// const columns = columnsDataCheck;
export default function ReviewTable(props: { tableData: any,page:number, order : string , orderName: string ,getDataSortChange : (str: string) => void }) {

	const { tableData,page ,order,orderName} = props;
	const [ isLoading, setLoading ] = React.useState(true);
	const [ sorting, setSorting ] = React.useState<SortingState>([]);
	const [ data, setTableData ] = React.useState([]);
	const [ selectedData, setSelectedData ] = React.useState(null);
	const [ inputs, setInputs ] = React.useState({
		orderName : "deptname",
		orderBy : "ASC",
		isAll : false,
		keyword : ""
	});
	console.log("resumeCallData ddd", tableData)
	const [ isOpenRequestModal, setIsOpenRequestModal ] = React.useState(false);
	const textColor = useColorModeValue('secondaryGray.900', 'white');
	const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
	const bgColor = useColorModeValue(' .300', 'navy.900');
	const sidebarBackgroundColor = useColorModeValue('white', 'navy.800');
	const formBtnRef = React.useRef(null)

	let defaultData= tableData;
	const columns = [
		columnHelper.accessor('nickname', {
			size: 200,
			id: 'nickname',
			header: () => (
				<Flex align='center'>
					<Checkbox defaultChecked={false} colorScheme='brandScheme' mr='10px' />
					<Text justifyContent='space-between' align='center' fontSize={{ sm: '10px', lg: '12px' }} color='gray.400' >
						작성자 
					</Text>
				</Flex>
			),
			cell: (info: any) => (
				<Flex align='center'>
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
		columnHelper.accessor('kindness_score', {
			id: 'kindness_score',
			header: () => (
				<Text justifyContent='space-between' align='center' fontSize={{ sm: '10px', lg: '12px' }} color='gray.400'>
					친절•배려
				</Text>
			),
			cell: (info) => (
				<Text color={textColor} fontSize='sm' fontWeight='700'>
					{info.getValue()}
				</Text>
			)
		}),
		columnHelper.accessor('explaination_score', {
			id: 'explaination_score',
			header: () => (
				<Text justifyContent='space-between' align='center' fontSize={{ sm: '10px', lg: '12px' }} color='gray.400' >
					치료 결과 만족도
				</Text>
			),
			cell: (info) => (
				<Text color={textColor} fontSize='sm' fontWeight='700'>
					{info.getValue()}
				</Text>
			)
		}),
		columnHelper.accessor('satisfaction_score', {
			id: 'satisfaction_score',
			header: () => (
				<Text justifyContent='space-between' align='center' fontSize={{ sm: '10px', lg: '12px' }} color='gray.400' >
					쉽고 명쾌한 설명
				</Text>
			),
			cell: (info) => (
				<Text color={textColor} fontSize='sm' fontWeight='700'>
					{info.getValue()}
				</Text>
			)
		}),
		columnHelper.accessor('recommand_score', {
			id: 'recommand_score',
			header: () => (
				<Text justifyContent='space-between' align='center' fontSize={{ sm: '10px', lg: '12px' }} color='gray.400' >
					추천 여부
				</Text>
			),
			cell: (info) => (
				<Text color={textColor} fontSize='sm' fontWeight='700'>
					{info.getValue()}
				</Text>
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
	const [ isShow, setShow ] = React.useState(false);
	const btnRef = React.useRef();
	const setData = React.useCallback(
		async() => {
			setTableData(tableData);
			setLoading(false);
		},[tableData]
	);

	React.useEffect(() => {
		setData();
		setInputs({
			orderName : "deptname",
			orderBy : "ASC",
			isAll : false,
			keyword : ""
		})
	}, [setData]);

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

	const onHandleOpenDetail = async(data:any) => {
		if ( !functions.isEmpty(data?.review_id) ) {
			await setSelectedData(data);
			setIsOpenRequestModal(true);
		}
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
						리뷰리스트
					</Text>
				</Box>
				<Box display='flex' alignItems={'flex-end'} width={{base : '100%', xl : 'auto'}}>
					<Select placeholder='정렬기준'>
						<option value='option1'>최신 등록순</option>
						<option value='option2'>작성자이름순</option>
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
			<Box>
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
												color='gray.400'>
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
							<ModalHeader>{"리뷰 상세정보"}</ModalHeader>
							<ModalCloseButton />
							<ModalBody >
							<ReviewDetail
								isOpen={isOpenRequestModal}
								setClose={() => setIsOpenRequestModal(false)}
								reviewId={selectedData}
							/>
							</ModalBody>
						</ModalContent>
					</Modal>
				)
			}
		</Card>
	);
} 