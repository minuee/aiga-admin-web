
import * as React from 'react';
import { createColumnHelper,flexRender,getCoreRowModel,getSortedRowModel,SortingState,useReactTable } from '@tanstack/react-table';
import { useToast,Flex,Box,Table,Checkbox,Tbody,Td,Text,Th,Thead,Tr,useColorModeValue,Drawer,DrawerBody,DrawerFooter,DrawerHeader,DrawerOverlay,DrawerContent,DrawerCloseButton,Button,useDisclosure } from '@chakra-ui/react';
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
	notice_id: number; // notice_id 추가
	title: string;
	writer: string;
	createAt: string;
	is_active: boolean;
	open_date : string;
};
 
const columnHelper = createColumnHelper<RowObj>();

// const columns = columnsDataCheck;
import CustomAlert from 'components/etc/CustomAlert'; // CustomAlert 임포트
// ...
export default function CheckTable(props: { tableData: RowObj[], getData: () => Promise<any> }) { // tableData prop 타입 업데이트, getData prop 추가
	const { tableData, getData } = props;
	console.log("tableData",tableData)
	const toast = useToast();
	const [ isReceiving, setIsReceiving ] = React.useState(false);
	const [ sorting, setSorting ] = React.useState<SortingState>([]);
	const { nickName, ...userInfo } = AdminUserStateStore(state => state);
	const [ data, setData ] = React.useState(tableData ?? []);
	const [ selectedData, setSelectedData ] = React.useState(null);
	const [ savedData, setSaveData ] = React.useState(null);

	React.useEffect(() => {
		// tableData prop이 변경될 때마다 내부 data 상태를 업데이트합니다.
		setData(tableData ?? []);
	}, [tableData]);
	
	const setShow = NoticeDetailModalStore((state) => state.setOpenNoticeDetailModal);
	const isShow = NoticeDetailModalStore(state => state.isOpenNoticeDetailModal);
	const btnRef = React.useRef();
	
	const textColor = useColorModeValue('secondaryGray.900', 'white');
	const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
	const bgColor = useColorModeValue(' .300', 'navy.900');

	const [ checkedRows, setCheckedRows ] = React.useState<Set<number>>(new Set()); // checkedRows 상태 추가

	const { isOpen: isAlertOpen, onOpen: onAlertOpen, onClose: onAlertClose } = useDisclosure(); // CustomAlert 제어 훅 추가

	const onDeleteSelected = async () => {
		if (checkedRows.size === 0) {
			functions.simpleToast(toast, '삭제할 항목을 1개 이상 선택해주세요.');
			return;
		}
		onAlertOpen(); // CustomAlert 열기
	};

	const onConfirmDelete = async () => {
		try {
			setIsReceiving(true);
			onAlertClose();
			const noticeIdsToDelete = Array.from(checkedRows);
			const res:any = await NoticeService.deleteNotices(noticeIdsToDelete);

			if (res && res.data.success ) {
				functions.simpleToast(toast, '선택한 공지사항이 삭제되었습니다.', 'top-right', 'success');
				setCheckedRows(new Set()); // 선택된 항목 초기화
				await getData(); // 테이블 데이터 새로고침
				console.log("After getData() in onConfirmDelete. Data should be refreshed."); // 로그 추가
			} else {
				functions.simpleToast(toast, '공지사항 삭제에 실패했습니다.', 'top-right', 'error');
			}
		} catch (error) {
			console.error("Failed to delete notices:", error);
			functions.simpleToast(toast, '공지사항 삭제 중 오류가 발생했습니다.', 'top-right', 'error');
		} finally {
			setIsReceiving(false);
		}
	};
	
	const handleHeaderCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const isChecked = e.target.checked;
		if (isChecked) {
			const newCheckedRows = new Set(data.map((row: RowObj) => row.notice_id));
			setCheckedRows(newCheckedRows);
		} else {
			setCheckedRows(new Set());
		}
	};

	const handleRowCheckboxChange = (noticeId: number, isChecked: boolean) => {
		setCheckedRows(prev => {
			const newCheckedRows = new Set(prev);
			if (isChecked) {
				newCheckedRows.add(noticeId);
			} else {
				newCheckedRows.delete(noticeId);
			}
			return newCheckedRows;
		});
	};
	
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
		console.log("onHandSaveNoticeAction",savedData);
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
				if ( res.success ) {
					functions.simpleToast(toast,`성공`);
					await getData(); // 데이터 저장 성공 후 리스트 새로고침
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
					<Checkbox
						isChecked={checkedRows.size === data.length && data.length > 0} // 전체 선택 여부
						onChange={handleHeaderCheckboxChange} // 핸들러 연결
						colorScheme='brandScheme'
						mr='10px'
					/>
					<Text justifyContent='space-between' align='center' fontSize={{ sm: '10px', lg: '12px' }} color='gray.400' >
						제목
					</Text>
				</Flex>
			),
			cell: (info: any) => (
				<Flex align='center'>
					<Checkbox
						isChecked={checkedRows.has(info.row.original.notice_id)} // 개별 행 선택 여부
						onChange={(e) => handleRowCheckboxChange(info.row.original.notice_id, e.target.checked)} // 핸들러 연결
						colorScheme='brandScheme'
						mr='10px'
						onClick={(e) => e.stopPropagation()} // 이벤트 전파 중단
					/>
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
				<Checkbox defaultChecked={info.getValue()} colorScheme='brandScheme' mr='10px'  readOnly />
			)
		}),
		columnHelper.accessor('open_date', {
			id: 'open_date',
			header: () => (
				<Text justifyContent='space-between' align='center' fontSize={{ sm: '10px', lg: '12px' }} color='gray.400'>
					공개일자
				</Text>
			),
			cell: (info) => (
				<Text color={textColor} fontSize='sm' fontWeight='700'>
					{info.getValue()}
				</Text>
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
					{functions.dateToDateTime(new Date(info.getValue()))}
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
		debugTable: true,
		enableRowSelection: true // 행 선택 기능 활성화
	});

	return (
		<Card flexDirection='column' w='100%' px='0px' overflowX={{ sm: 'scroll', lg: 'hidden' }}>
			<Flex px='25px' mb="8px" justifyContent='space-between' align='center'>
				<Text color={textColor} fontSize='22px' mb="4px" fontWeight='700' lineHeight='100%'>
					리스트
				</Text>
				<TableMenu 
					onHandleToggle={onHandleToggle}
					onDeleteSelected={onDeleteSelected} // onDeleteSelected prop 전달
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
					!tableData || tableData.length === 0
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
												sx={{borderBottom:'1px', borderBottomColor:borderColor}}
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
				isAlertOpen && 
				(
				<CustomAlert
					isOpen={isAlertOpen}
					msg="선택된 공지사항을 삭제하시겠습니까?"
					fnConform={onConfirmDelete}
					fnCancel={onAlertClose}
				/>
				)
			}
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