import { Box, Flex, Stack, Table, Tbody, Td, Text, Th, Thead, Tr, useColorModeValue, Skeleton, Icon,Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody } from '@chakra-ui/react';
import { createColumnHelper,flexRender,getCoreRowModel,getSortedRowModel,SortingState,useReactTable } from '@tanstack/react-table';
// Custom components
import DoctorDetail from 'components/modal/DoctorDetail';
import Card from 'components/card/Card';
import { format } from 'date-fns';
import * as React from 'react';
import functions from 'utils/functions';
import mConstants from 'utils/constants';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
// Assets
import { IoCaretUp,IoCaretDown,IoPerson} from "react-icons/io5";
import Link from 'next/link';
const defaultImage = require("../../../../../public/img/avatars/no_image01.png");

type RowObj = {
	hid : string;
	deptname: string;
	doctor_id: string;
	doctorname: string;
	createAt: Date;
	updateDt : Date;
	doctor_count: number;
	doctor_url: string;
	profileimgurl: string;
	specialties: string;
};

const columnHelper = createColumnHelper<RowObj>();

// const columns = columnsDataCheck;
export default function DoctorsTable(props: { tableData: any,page:number, order : string , orderName: string ,getDataSortChange : (str: string) => void, hospitalData: any}) {
	
	const { tableData,page ,order,orderName, hospitalData} = props;
	const router = useRouter();
	const [ isLoading, setLoading ] = React.useState(true);
	const [ sorting, setSorting ] = React.useState<SortingState>([]);
	const [ data, setTableData ] = React.useState([]);
	const [ isOpenModal, setIsOpenModal ] = React.useState(false);
	const [ DoctorData, setDoctorData ] = React.useState<any>(null);
	const textColor = useColorModeValue('secondaryGray.900', 'white');
	const orderTextColor = useColorModeValue('black', 'white');
	const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
	const bgColor = useColorModeValue('white', 'gray.700');
	const formBtnRef = React.useRef(null);
	const tdColorOdd = useColorModeValue('white', 'gray.700');
	const tdColorEven = useColorModeValue('#f4f7fe', 'navy.700');
	const sidebarBackgroundColor = useColorModeValue('white', 'gray.700');
	
	const setData = React.useCallback(
		async() => {
			setTableData(tableData);
			setLoading(false);
		},[tableData]
	);

	React.useEffect(() => {
		setData();
	}, [setData]);

	const onHandleOpenModal = (doctorData: any) => {
		if( !functions.isEmpty(doctorData?.doctorname) ) {
			setDoctorData({...hospitalData, ...doctorData});
			setIsOpenModal(true);
		}
	}

	const columns = [
		columnHelper.accessor('deptname', {
			id: 'deptname',
			size: 50,
			header: () => (
				<Box
					width='100%'
					display={'flex'} 
					flexDirection={'row'}
					alignItems={'center'}
					justifyContent={'space-between'}
					onClick={()=> props.getDataSortChange('db.deptname')}
				>
					<Text justifyContent='space-between' align='center' fontSize={{ sm: '10px', lg: '12px' }} color={orderTextColor}>
						진료과목명
					</Text>
					{
						orderName == 'db.deptname' && 
						( 
							order == 'ASC' ?
							<IoCaretUp width={16} height={16} />
							:
							<IoCaretDown width={16} height={16} />
						)
					}
				</Box>
			),
			cell: (info: any) => (
				<Flex align='center'>
					<Text color={textColor} fontSize='sm' fontWeight='700'>
						{info.getValue()}
					</Text>
				</Flex>
			)
		}),
		columnHelper.accessor('doctorname', {
			id: 'doctorname',
			size: 50,
			header: () => (
				<Text justifyContent='space-between' align='center' fontSize={{ sm: '10px', lg: '12px' }} color='gray.400'>
					의사명
				</Text>
			),
			cell: (info) => (
				<Flex align='center' onClick={()=> onHandleOpenModal(info.row.original)} cursor={'pointer'}>
					<Text color={textColor} fontSize='sm' fontWeight='700'>
						{info.getValue()}
					</Text>
				</Flex>
			)
		}),
		columnHelper.accessor('profileimgurl', {
			id: 'profileimgurl',
			size: 50,
			header: () => (
				<Text justifyContent='space-between' align='center' fontSize={{ sm: '10px', lg: '12px' }} color='gray.400'>
					프로필사진
				</Text>
			),
			cell: (info) => (
				functions.isEmpty(info.getValue()) ?
				<Flex alignItems={'center'} justifyContent={'center'}>
					<Icon as={IoPerson} />
				</Flex>
				:
				<Flex alignItems={'center'} justifyContent={'flex-start'} >
					<Link href={info.getValue()} target='_blank'>
						<Image 
							src={info.getValue().trimEnd()} 
							alt='profile' 
							width={50} 
							height={50} 
							//onError={(e) => {e.currentTarget.src = defaultImage;}}
						/>
					</Link>
				</Flex>
			)
		}),
		columnHelper.accessor('doctor_id', {
			id: 'doctor_id',
			size: 50,
			header: () => (
				<Text justifyContent='space-between' align='center' fontSize={{ sm: '10px', lg: '12px' }} color='gray.400'>
					의사ID
				</Text>
			),
			cell: (info) => (
				<Text color={textColor} fontSize='sm' fontWeight='700'>
					{info.getValue()}
				</Text>
			)
		}),
		columnHelper.accessor('specialties', {
			id: 'specialties',
			size: 150,
			maxSize: 150,
			header: () => (
				<Text justifyContent='space-between' align='center' fontSize={{ sm: '10px', lg: '12px' }} color='gray.400'>
					진료분야
				</Text>
			),
			cell: (info) => (
				<Box maxW="250px">
					<Text color={textColor} fontSize='sm' fontWeight='700' noOfLines={2}>
						{info.getValue()}
					</Text>
				</Box>
			)
		}),
		columnHelper.accessor('createAt', {
			id: 'createAt',
			size: 50,
			header: () => (
				<Text justifyContent='space-between' align='center' fontSize={{ sm: '10px', lg: '12px' }} color='gray.400'>
					등록일
				</Text>
			),
			cell: (info:any) => (
				<Flex align='center'>
					<Text me='10px' color={textColor} fontSize='sm' fontWeight='700'>
						{info.getValue() ? format(info.getValue(), 'yyyy-MM-dd') : ""}
					</Text>
				</Flex>
			)
		}),
		columnHelper.accessor('updateDt', {
			id: 'updateDt',
			size: 50,
			header: () => (
				<Text justifyContent='space-between' align='center' fontSize={{ sm: '10px', lg: '12px' }} color='gray.400'>
					수정일
				</Text>
			),
			cell: (info:any) => (
				<Flex align='center'>
					<Text me='10px' color={textColor} fontSize='sm' fontWeight='700'>
						{info.getValue() ? format(info.getValue(), 'yyyy-MM-dd') : ""}
					</Text>
				</Flex>
			)
		}),
	];
	
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
	return (
		<Card flexDirection='column' w='100%' px='0px' overflowX={{ sm: 'scroll', lg: 'hidden' }} mb="100px">
			{
				isLoading ?
				<Flex px='25px' mb="30px" mt="30px">
					<Stack width={"100%"} height={"auto"} >
						<Skeleton height='20px' width={'100%'} />
						<Skeleton height='20px' width={'100%'} />
						<Skeleton height='20px' width={'100%'} />
						<Skeleton height='20px' width={'100%'} />
						<Skeleton height='20px' width={'100%'} />
						<Skeleton height='20px' width={'100%'} />
						<Skeleton height='20px' width={'100%'} />
					</Stack>
				</Flex>
				:
				<Box>
					<Table variant='striped' colorScheme='blackAlpha' mb='24px' size={{sm:'sm',md:'md'}}>
						<Thead>
							{table.getHeaderGroups().map((headerGroup) => (
								<Tr key={headerGroup.id}>
									{headerGroup.headers.map((header) => {
										return (
											<Th
												key={header.id}
												colSpan={header.colSpan}
												pe='10px'
												borderColor={borderColor}
												cursor='pointer'
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
									<Th colSpan={7} >
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
										<Tr key={index}>
											{row.getVisibleCells().map((cell) => {
												return (
													<Td
														key={cell.id}
														fontSize={{ sm: '14px' }}
														minW={{ sm: '150px', md: '200px', lg: 'auto' }}
														borderColor='transparent'
														backgroundColor={index % 2 == 0 ? tdColorEven+ ' !important' : tdColorOdd+ ' !important'}
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
			}
			{
				isOpenModal && (    
					<Modal
						onClose={() => setIsOpenModal(false)}
						finalFocusRef={formBtnRef}
						isOpen={isOpenModal}
						scrollBehavior={'inside'}
						size={'full'}
					>
					<ModalOverlay />
					<ModalContent maxW={`${mConstants.modalMaxWidth}px`} bg={sidebarBackgroundColor}>
						<ModalHeader>{`${DoctorData?.doctorname?.replace('의사', '')} 의사  상세정보`}</ModalHeader>
						<ModalCloseButton />
						<ModalBody >
						<DoctorDetail
							isOpen={isOpenModal}
							setCloseModal={() => setIsOpenModal(false)}
							DoctorData={DoctorData}
						/>
						</ModalBody>
					</ModalContent>
					</Modal>
				)
			}
		</Card>
	);
}
