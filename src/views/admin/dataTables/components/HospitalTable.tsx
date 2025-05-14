import { 
	Box, Flex, Stack, Table, Tbody, Td, Text, Th, Thead, Tr, useColorModeValue, Skeleton, Button, SkeletonText,
	 Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Drawer, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody, DrawerFooter, DrawerCloseButton
} from '@chakra-ui/react';
import { createColumnHelper,flexRender,getCoreRowModel,getSortedRowModel,SortingState,useReactTable } from '@tanstack/react-table';
import { renderThumb,renderTrack,renderView } from 'components/scrollbar/Scrollbar';
// Custom components
import Card from 'components/card/Card';
import HospitalDetail from 'components/modal/HospitalDetail';
import DoctorList from 'components/drawer/DoctorList';
import { format } from 'date-fns';
import * as React from 'react';
import functions from 'utils/functions';
import mConstants from 'utils/constants';
import { useRouter } from 'next/navigation';
// Assets
import { IoCaretUp,IoCaretDown } from "react-icons/io5";
import dynamic from 'next/dynamic';
const Scrollbars = dynamic(
	() => import('react-custom-scrollbars-2').then((mod) => mod.Scrollbars),
	{ ssr: true },
);
type RowObj = {
	hid: string;
	baseName: any;
	shortName: string;
	createAt: Date;
	doctor_count: number;
};

const columnHelper = createColumnHelper<RowObj>();

// const columns = columnsDataCheck;
export default function ComplexTable(props: { tableData: any,page:number, order : string , orderName: string ,getDataSortChange : (str: string) => void}) {
	
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
	const tdColorOdd = useColorModeValue('white', 'gray.700');
	const tdColorEven = useColorModeValue('#f4f7fe', 'navy.700');
	const formBtnRef = React.useRef(null);
	const sidebarBackgroundColor = useColorModeValue('white', 'gray.700');
	const btnRef = React.useRef(null);


	const setData = React.useCallback(
		async() => {
			setTableData(tableData);
			setLoading(false);
		},[tableData]
	);

	React.useEffect(() => {
		setData();
	}, [setData]);

	const onHandleOpenModal = (hospitalData: any) => {
		if( !functions.isEmpty(hospitalData?.hid) ) {
			setSelectedHospital(hospitalData);
			setIsOpenModal(true);
		}
	}

	const onHandleDoctors = (hospitalData: any) => {
		setSelectedHospital(hospitalData);
		setIsOpenDrawer(true);
		//router.push(`/admin/hospital/doctors?hospitalId=${hospitalData?.hid}`);
	}

	
	const columns = [
		columnHelper.accessor('hid', {
			id: 'hid',
			header: () => (
				<Box
					width='100%'
					display={'flex'} 
					flexDirection={'row'}
					alignItems={'center'}
					justifyContent={'space-between'}
					onClick={()=> props.getDataSortChange('hospital.hid')}
				>
					<Text
						justifyContent='space-between'
						align='center'
						fontSize={{ sm: '10px', lg: '12px' }}
						color={orderTextColor}
					>
						HID
					</Text>
					{
						orderName == 'hospital.hid' && 
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
		columnHelper.accessor('baseName', {
			id: 'baseName',
			header: () => (
				<Text
					justifyContent='space-between'
					align='center'
					fontSize={{ sm: '10px', lg: '12px' }}
					color='gray.400'>
					기본병원명
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
		columnHelper.accessor('shortName', {
			id: 'shortName',
			header: () => (
				<Text
					justifyContent='space-between'
					align='center'
					fontSize={{ sm: '10px', lg: '12px' }}
					color='gray.400'>
					약칭명
				</Text>
			),
			cell: (info) => (
				<Text color={textColor} fontSize='sm' fontWeight='700'>
					{info.getValue()}
				</Text>
			)
		}),
		columnHelper.accessor('createAt', {
			id: 'createAt',
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
		columnHelper.accessor('doctor_count', {
			id: 'doctor_count',
			header: () => (
				<Box
					width='100%'
					display={'flex'} 
					flexDirection={'row'}
					alignItems={'center'}
					justifyContent={'space-between'}
					onClick={()=> props.getDataSortChange('doctor_count')}
				>
					<Text
						justifyContent='space-between'
						align='center'
						fontSize={{ sm: '10px', lg: '12px' }}
						color={orderTextColor}>
						의사수
					</Text>
					{
						orderName == 'doctor_count' && 
						(
							order == 'ASC' ?
							<IoCaretUp width={16} height={16} />
							:
							<IoCaretDown width={16} height={16} />
						)
					}
				</Box>
			),
			cell: (info:any) => (
				<Flex align='center' onClick={()=> onHandleDoctors(info.row.original)} cursor={'pointer'}>
					<Text me='10px' color={textColor} fontSize='sm' fontWeight='700'>
						{functions.numberWithCommas(info.getValue())}
					</Text>
				</Flex>
			)
		})
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
			<Flex px='25px' mb="8px" justifyContent='space-between' align='center'>
				<Text color={textColor} fontSize='22px' fontWeight='700' lineHeight='100%'>
					병원리스트
				</Text>
			</Flex>
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
						>
						<ModalOverlay />
						<ModalContent maxW={`${mConstants.modalMaxWidth}px`} bg={sidebarBackgroundColor}>
							<ModalHeader>{`${selectedHospital?.baseName} 상세정보`}</ModalHeader>
							<ModalCloseButton />
							<ModalBody >
							<HospitalDetail
								isOpen={isOpenModal}
								setClose={() => 	(false)}
								hospitalData={selectedHospital}
							/>
							</ModalBody>
						</ModalContent>
					</Modal>
				)
			}
			{
				isOpenDrawer && (
				<Drawer
					isOpen={isOpenDrawer}
					onClose={()=>setIsOpenDrawer(false)}
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
					>
					<DrawerCloseButton
						zIndex="3"
						onClick={()=>setIsOpenDrawer(false)}
						_focus={{ boxShadow: 'none' }}
						_hover={{ boxShadow: 'none' }}
					/>
					<DrawerHeader sx={{borderBottom:'1px solid #ebebeb'}}>{selectedHospital?.baseName} 의사리스트</DrawerHeader>
					<DrawerBody w="calc(100% - 20px)"  padding="10px">
						<Scrollbars
							autoHide
							renderTrackVertical={renderTrack}
							renderThumbVertical={renderThumb}
							renderView={renderView}
							universal={true}
						>
							<DoctorList 
								hospitalData={selectedHospital}
							/>
						</Scrollbars>
					</DrawerBody>
					</DrawerContent>
				</Drawer>
				)
			}
		</Card>
	);
}
