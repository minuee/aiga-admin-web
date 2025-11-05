
import * as React from 'react';
import { createColumnHelper,flexRender,getCoreRowModel,getSortedRowModel,SortingState,useReactTable } from '@tanstack/react-table';
import { useToast,Flex,Box,Table,Checkbox,Tbody,Td,Text,Th,Thead,Tr,useColorModeValue,Drawer,DrawerBody,DrawerFooter,DrawerHeader,DrawerOverlay,DrawerContent,DrawerCloseButton,Button } from '@chakra-ui/react';
// Custom components
import mConstants from 'utils/constants';
import Card from 'components/card/Card';
import TableMenu from 'components/menu/TableMenu';
import { renderThumb,renderTrack,renderView } from 'components/scrollbar/Scrollbar';
import dynamic from 'next/dynamic';
const Scrollbars = dynamic(
  () => import('react-custom-scrollbars-2').then((mod) => mod.Scrollbars),
  { ssr: true },
);
import { NoticeDetailModalStore } from 'store/modalStore';
import AdminUserStateStore from 'store/userStore';
import functions from 'utils/functions';
import * as NoticeService from "services/notice/index";
import NoticeForm from "views/v1/notice/View";

type RowObj = {
	title: string;
	writer: string;
	createAt: string;
	is_active: boolean;
};
 
const columnHelper = createColumnHelper<RowObj>();

// const columns = columnsDataCheck;
export default function CheckTable(props: { tableData: any }) {
	const { tableData } = props;
	console.log("tableData",tableData)
	const toast = useToast();
	const [ isReceiving, setIsReceiving ] = React.useState(false);
	const [ sorting, setSorting ] = React.useState<SortingState>([]);
	const { nickName, ...userInfo } = AdminUserStateStore(state => state);
	const [ data, setData ] = React.useState(tableData?.notice ?? []);
	const [ selectedData, setSelectedData ] = React.useState(null);
	const [ savedData, setSaveData ] = React.useState(null);
	
	const setShow = NoticeDetailModalStore((state) => state.setOpenNoticeDetailModal);
	const isShow = NoticeDetailModalStore(state => state.isOpenNoticeDetailModal);
	const btnRef = React.useRef();
	
	const textColor = useColorModeValue('secondaryGray.900', 'white');
	const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
	const bgColor = useColorModeValue(' .300', 'navy.900');
	const onHandleToggle = (bool:boolean) => {
		setShow(bool)
	}

	const onHandleOpenData = ( data : any ) => {
		setSelectedData(data);
		setTimeout(() => setShow(true), 300);
	}
	
	const onHandSaveNotice = async(data:any) => {
		setSaveData(data);
	}

	const onHandSaveNoticeAction = async() => {
		console.log("savedData",savedData);
		if ( functions.isEmpty(savedData?.title) || functions.isEmpty(savedData?.content)  ) {
			functions.simpleToast(toast,`필수항목이 누락되었습니다.`);
			return;
		}else{

			try{
				const nowdateTime = new Date();
				const nowdate = functions.dateToDate(nowdateTime.getTime());
				console.log("nowdateTime",nowdateTime);
				console.log("nowdate",nowdate);
				setIsReceiving(true);
				const sendData = {
					noticeId :  savedData?.noticeId,
					title :  savedData?.title || "공지사항입니다.",
					content : savedData?.content || "공지사항입니다.",
					is_active : savedData?.isOpen  || savedData?.openDate <= nowdate ? true : false,
					open_date :  savedData?.openDate || nowdate,
					writer : nickName || "관리자"
				} 
				const res:any = await NoticeService.postNoticeData(sendData);
				console.log('res',res)
				if ( mConstants.apiSuccessCode.includes(res?.statusCode) ) {
					functions.simpleToast(toast,`성공`);
					setTimeout(() => {
						setShow(false);
						setIsReceiving(false)
					}, 500);
				}else{
					functions.simpleToast(toast,`실패`);
					setTimeout(() => {
						setIsReceiving(false)
					}, 500);
				}	
			}catch(e:any){
				console.log('eeee',e)
			}
		}
	}

	
	const columns = [
		columnHelper.accessor('title', {
			id: 'title',
			header: () => (
				<Flex align='center'>
					<Checkbox defaultChecked={false} colorScheme='brandScheme' mr='10px' />
					<Text justifyContent='space-between' align='center' fontSize={{ sm: '10px', lg: '12px' }} color='gray.400' >
						제목
					</Text>
				</Flex>
			),
			cell: (info: any) => (
				<Flex align='center'>
					{/* <Checkbox defaultChecked={info.row.original?.is_active} colorScheme='brandScheme' mr='10px' /> */}
					<Box  onClick={()=> onHandleOpenData(info.row.original)} cursor={"pointer"}>
						<Text color={textColor} fontSize='sm' fontWeight='700'>
							{info.getValue()}
						</Text>
					</Box>
				</Flex>
			)
		}),
		columnHelper.accessor('is_active', {
			id: 'is_active',
			header: () => (
				<Text justifyContent='space-between' align='center' fontSize={{ sm: '10px', lg: '12px' }} color='gray.400'>
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
				<Text justifyContent='space-between' align='center' fontSize={{ sm: '10px', lg: '12px' }} color='gray.400'>
					작성자
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
				<Text justifyContent='space-between' align='center' fontSize={{ sm: '10px', lg: '12px' }} color='gray.400'>
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
					{
					tableData?.notice?.length == 0 
					?
					<Tbody >
						<Tr >
							<Th colSpan={4} >
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
					}
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
							onHandSaveNotice={(data:any) =>  onHandSaveNotice(data)}
							isReceiving={isReceiving}
						/>
						</Scrollbars>
					</DrawerBody>
					<DrawerFooter sx={{borderTop:'1px solid #ebebeb'}}>
						<Button variant='outline' mr={3} onClick={()=>setShow(false)} id="buttin_cancel">Cancel</Button>
						<Button colorScheme='blue' id="button_save" onClick={()=> onHandSaveNoticeAction()}>
							Save
						</Button>
					</DrawerFooter>
					</DrawerContent>
				</Drawer>
				)
			}
		</Card>
	);
} 