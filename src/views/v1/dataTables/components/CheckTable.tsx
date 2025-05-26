
import * as React from 'react';
import { createColumnHelper,flexRender,getCoreRowModel,getSortedRowModel,SortingState,useReactTable } from '@tanstack/react-table';
import { Flex, Box, Table, Checkbox, Tbody, Td, Text, Th, Thead, Tr, useColorModeValue,Drawer,DrawerBody,DrawerFooter,DrawerHeader,DrawerOverlay,DrawerContent,DrawerCloseButton,Button } from '@chakra-ui/react';
// Custom components
import Card from 'components/card/Card';
import TableMenu from 'components/menu/TableMenu';
import { renderThumb,renderTrack,renderView } from 'components/scrollbar/Scrollbar';
import dynamic from 'next/dynamic';
const Scrollbars = dynamic(
  () => import('react-custom-scrollbars-2').then((mod) => mod.Scrollbars),
  { ssr: true },
);
import * as NoticeService from "services/notice/index";
import NoticeForm from "views/v1/notice/View";

type RowObj = {
	name: [string, boolean];
	writer: string;
	quantity: number;
	date: string;
	info: boolean;
};
 
const columnHelper = createColumnHelper<RowObj>();

// const columns = columnsDataCheck;
export default function CheckTable(props: { tableData: any }) {
	const { tableData } = props;
	const [ sorting, setSorting ] = React.useState<SortingState>([]);
	const [ data_9, setData9 ] = React.useState<any>([]);
	const textColor = useColorModeValue('secondaryGray.900', 'white');
	const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
	const bgColor = useColorModeValue(' .300', 'navy.900');
	let defaultData= tableData;
	const [ data, setData ] = React.useState(() => [ ...defaultData ]);
	const [ selectedData, setSelectedData ] = React.useState(null);
	
	const [ isShow, setShow ] = React.useState(false);
	const btnRef = React.useRef();
	
	const onHandleToggle = (bool:boolean) => {
		setShow(bool)
	}

	const onHandleOpenData = ( data : any ) => {
		setSelectedData(data);
		setTimeout(() => setShow(true), 300);
	}

	const getData = React.useCallback(
		async() => {
			const res:any = await NoticeService.getHospitalList({
				page:1,
				take:10,
				order:'ASC',
				orderName:'hospital.hid'
			});
		},[tableData]
	)
	
	React.useEffect(() => {
		getData().then((res) => setData9(res));
	}, [getData]);
	
	const columns = [
		columnHelper.accessor('name', {
			id: 'title',
			header: () => (
				<Flex align='center'>
					<Checkbox defaultChecked={false} colorScheme='brandScheme' mr='10px' />
					<Text
						justifyContent='space-between'
						align='center'
						fontSize={{ sm: '10px', lg: '12px' }}
						color='gray.400'
					>
						제목
					</Text>
				</Flex>
			),
			cell: (info: any) => (
				<Flex align='center'>
					<Checkbox defaultChecked={info.getValue()[1]} colorScheme='brandScheme' mr='10px' />
					<Box  onClick={()=> onHandleOpenData(info.row.original)} cursor={"pointer"}>
						<Text color={textColor} fontSize='sm' fontWeight='700'>
							{info.getValue()[0]}
						</Text>
					</Box>
				</Flex>
			)
		}),
		columnHelper.accessor('info', {
			id: 'info',
			header: () => (
				<Text
					justifyContent='space-between'
					align='center'
					fontSize={{ sm: '10px', lg: '12px' }}
					color='gray.400'>
					공개
				</Text>
			),
			cell: (info) => (
				<Checkbox defaultChecked={info.getValue()} colorScheme='brandScheme' mr='10px' />
			)
		}),
		columnHelper.accessor('writer', {
			id: 'writer',
			header: () => (
				<Text
					justifyContent='space-between'
					align='center'
					fontSize={{ sm: '10px', lg: '12px' }}
					color='gray.400'>
					작성자
				</Text>
			),
			cell: (info) => (
				<Text color={textColor} fontSize='sm' fontWeight='700'>
					{info.getValue()}
				</Text>
			)
		}),

		columnHelper.accessor('quantity', {
			id: 'quantity',
			header: () => (
				<Text
					justifyContent='space-between'
					align='center'
					fontSize={{ sm: '10px', lg: '12px' }}
					color='gray.400'>
					조회수
				</Text>
			),
			cell: (info) => (
				<Text color={textColor} fontSize='sm' fontWeight='700'>
					{info.getValue()}
				</Text>
			)
		}),
		columnHelper.accessor('date', {
			id: 'date',
			header: () => (
				<Text
					justifyContent='space-between'
					align='center'
					fontSize={{ sm: '10px', lg: '12px' }}
					color='gray.400'>
					작성일
				</Text>
			),
			cell: (info) => (
				<Text color={textColor} fontSize='sm' fontWeight='700'>
					{info.getValue()}
				</Text>
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
				<Text color={textColor} fontSize='22px' mb="4px" fontWeight='700' lineHeight='100%'>
					리스트
				</Text>
				<TableMenu 
					onHandleToggle={onHandleToggle}
				/>
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
												borderColor='transparent'>
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
							data={selectedData}
						/>
						</Scrollbars>
					</DrawerBody>
					<DrawerFooter sx={{borderTop:'1px solid #ebebeb'}}>
						<Button variant='outline' mr={3} onClick={()=>setShow(false)} id="buttin_cancel">Cancel</Button>
						<Button colorScheme='blue' id="button_save">Save</Button>
					</DrawerFooter>
					</DrawerContent>
				</Drawer>
				)
			}
		</Card>
	);
} 