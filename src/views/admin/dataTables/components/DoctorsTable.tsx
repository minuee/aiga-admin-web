import { 
	Box, Flex, Stack, Table, Tbody, Td, Text, Th, Thead, Tr, useColorModeValue, Skeleton, Icon
} from '@chakra-ui/react';
import { createColumnHelper,flexRender,getCoreRowModel,getSortedRowModel,SortingState,useReactTable } from '@tanstack/react-table';
// Custom components
import Card from 'components/card/Card';
import { format } from 'date-fns';
import * as React from 'react';
import functions from 'utils/functions';
import mConstants from 'utils/constants';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
// Assets
import { IoCaretUp,IoCaretDown,IoPerson} from "react-icons/io5";


type RowObj = {
	hid : string;
	deptname: string;
	doctor_id: string;
	doctorname: string;
	createAt: Date;
	doctor_count: number;
	doctor_url: string;
	profileimgurl: string;
	specialties: string;
};

const columnHelper = createColumnHelper<RowObj>();

// const columns = columnsDataCheck;
export default function DoctorsTable(props: { tableData: any,page:number, order : string , orderName: string ,getDataSortChange : (str: string) => void}) {
	
	const { tableData,page ,order,orderName} = props;
	const router = useRouter();
	const [ isLoading, setLoading ] = React.useState(true);
	const [ sorting, setSorting ] = React.useState<SortingState>([]);
	const [ data, setTableData ] = React.useState([]);
	const [ isOpenDrawer, setIsOpenDrawer ] = React.useState(false);
	const [ isOpenModal, setIsOpenModal ] = React.useState(false);
	const [ selectedHospital, setSelectedHospital ] = React.useState<any>(null);
	const textColor = useColorModeValue('secondaryGray.900', 'white');
	const orderTextColor = useColorModeValue('black', 'white');
	const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
	const bgColor = useColorModeValue('white', 'gray.700');
	const formBtnRef = React.useRef(null);
	const sidebarBackgroundColor = useColorModeValue('white', 'gray.700');

	const setData = React.useCallback(
		async() => {
			console.log("tableData 222",tableData)
			setTableData(tableData);
			setLoading(false);
		},[tableData]
	);

	React.useEffect(() => {
		setData();
	}, [setData]);

	const onHandleOpenModal = (hospitalData: any) => {
		console.log("hospitalId",hospitalData?.hid)
		if( !functions.isEmpty(hospitalData?.hid) ) {
			setSelectedHospital(hospitalData);
			setIsOpenModal(true);
		}
	}

	const onHandleDoctors = (hospitalData: any) => {
		console.log("hospitalData",hospitalData)
		setSelectedHospital(hospitalData);
		setIsOpenDrawer(true);
		//router.push(`/admin/hospital/doctors?hospitalId=${hospitalData?.hid}`);
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
					<Text
						justifyContent='space-between'
						align='center'
						fontSize={{ sm: '10px', lg: '12px' }}
						color={orderTextColor}
					>
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
				<Text
					justifyContent='space-between'
					align='center'
					fontSize={{ sm: '10px', lg: '12px' }}
					color='gray.400'>
					의사명
				</Text>
			),
			cell: (info) => (
				<Flex align='center' onClick={()=> onHandleOpenModal(info.row.original)}>
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
				<Text
					justifyContent='space-between'
					align='center'
					fontSize={{ sm: '10px', lg: '12px' }}
					color='gray.400'>
					프로필사진
				</Text>
			),
			cell: (info) => (
				functions.isEmpty(info.getValue()) ?
				<Flex display={'flex'} alignItems={'center'} justifyContent={'center'}>
					<Icon as={IoPerson} />
				</Flex>
				:
				<Flex display={'flex'} alignItems={'center'} justifyContent={'center'}>
					<Icon as={IoPerson} />
					{/* <Image src={info.getValue()} alt='profile' width={50} height={50} /> */}
				</Flex>
			)
		}),
		columnHelper.accessor('doctor_id', {
			id: 'doctor_id',
			size: 50,
			header: () => (
				<Text
					justifyContent='space-between'
					align='center'
					fontSize={{ sm: '10px', lg: '12px' }}
					color='gray.400'>
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
				<Text
					justifyContent='space-between'
					align='center'
					fontSize={{ sm: '10px', lg: '12px' }}
					color='gray.400'>
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
				<Text
					justifyContent='space-between'
					align='center'
					fontSize={{ sm: '10px', lg: '12px' }}
					color='gray.400'>
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
		<Card flexDirection='column' w='100%' px='0px' overflowX={{ sm: 'scroll', lg: 'hidden' }}>
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
					<Table variant='striped' colorScheme='blackAlpha' mb='24px' mt="12px" size={{sm:'sm',md:'md'}}>
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
									<Th colSpan={5} >
										<Box
											display={'flex'}
											width={'100%'}
											height={{base : "100px" , md : '200px'}}
											justifyContent={'center'}
											alignItems={'center'}
											bg="#ffffff"
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
														borderColor='transparent'>
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
		</Card>
	);
}
