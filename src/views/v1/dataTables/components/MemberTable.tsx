import dayjs from 'dayjs';
import * as React from 'react';
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable
} from '@tanstack/react-table';
import {
	Flex,
	Box,
	Table,
	Checkbox,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tr,
	useColorModeValue,
	Select,
	Input,
	Button,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody
} from '@chakra-ui/react';
// Custom components
import Card from 'components/card/Card';
import MemberDetail from 'components/modal/MemberDetail';
import functions from 'utils/functions';
import mConstants from 'utils/constants';

interface RowObj {
  user_id: string;
  sns_type: string;
  sns_id: string;
  email: string;
  nickname: string;
  profile_img: string;
  restricted_time: number | null;
  agreement: number;
  regist_date: string;
  unregist_date: string | null;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null; // lastLoginAt이 null일 수 있으므로 string | null
  total_token_usage: number | string; // total_token_usage가 문자열 "0"으로 오므로 string | number
}

const columnHelper = createColumnHelper<RowObj>();

export default function MemberTable(props: {
	tableData: any[];
	order: string;
	orderName: string;
	page: number;
	getDataSortChange: (str: string) => void;
	getDataUpdateChange: (bool: boolean, isNewPage: boolean) => void;
}) {
	const { tableData } = props;
	const [ sorting, setSorting ] = React.useState<SortingState>([]);
	const [ isOpenRequestModal, setIsOpenRequestModal ] = React.useState(false);
	const [ selectedUserId, setSelectedUserId ] = React.useState('');
	const [ selectedUserNickname, setSelectedUserNickname ] = React.useState('');
	const textColor = useColorModeValue('secondaryGray.900', 'white');
	const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
	const sidebarBackgroundColor = useColorModeValue('white', 'navy.800');
	const formBtnRef = React.useRef(null);

	const [ checkedRows, setCheckedRows ] = React.useState<Set<string>>(new Set());

	const handleHeaderCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const isChecked = e.target.checked;
		if (isChecked) {
			const newCheckedRows = new Set(tableData.map((row: any) => row.user_id));
			setCheckedRows(newCheckedRows);
		} else {
			setCheckedRows(new Set());
		}
	};

	const handleRowCheckboxChange = (rowId: string, isChecked: boolean) => {
		setCheckedRows(prev => {
			const newCheckedRows = new Set(prev);
			if (isChecked) {
				newCheckedRows.add(rowId);
			} else {
				newCheckedRows.delete(rowId);
			}
			return newCheckedRows;
		});
	};

	const columns = [
		columnHelper.accessor('nickname', {
			size: 200,
			id: 'nickname',
			header: () => (
				<Flex align='center'>
					<Checkbox
						isChecked={checkedRows.size === tableData.length && tableData.length > 0}
						onChange={handleHeaderCheckboxChange}
						colorScheme='brandScheme'
						mr='10px'
					/>
					<Text justifyContent='space-between' align='center' fontSize={{ sm: '10px', lg: '12px' }} color='gray.400' >
						이름
					</Text>
				</Flex>
			),
			cell: (info: any) => (
				<Flex align='center'>
					<Checkbox
						isChecked={checkedRows.has(info.row.original.user_id)}
						onChange={(e) => handleRowCheckboxChange(info.row.original.user_id, e.target.checked)}
						colorScheme='brandScheme'
						mr='10px'
					/>
					<Text color={textColor} fontSize='sm' fontWeight='700'>
						{info.getValue()}
					</Text>
				</Flex>
			)
		}),
		columnHelper.accessor('sns_type', {
			id: 'joinType',
			header: () => (
				<Text justifyContent='space-between' align='center' fontSize={{ sm: '10px', lg: '12px' }} color='gray.400'>
					가입경로
				</Text>
			),
			cell: (info) => (
				<Text color={textColor} fontSize='sm' fontWeight='700'>
					{info.getValue()}
				</Text>
			)
		}),
		/* columnHelper.accessor('grade', {
			id: 'grade',
			header: () => (
				<Text justifyContent='space-between' align='center' fontSize={{ sm: '10px', lg: '12px' }} color='gray.400'>
					등급
				</Text>
			),
			cell: (info) => (
				<Text color={textColor} fontSize='sm' fontWeight='700'>
					{info.getValue()}
				</Text>
			)
		}), */
		columnHelper.accessor('total_token_usage', {
			size: 50,
			id: 'useTokens',
			header: () => (
				<Text justifyContent='space-between' align='center' fontSize={{ sm: '10px', lg: '12px' }} color='gray.400'>
					사용토큰수
				</Text>
			),
			cell: (info) => (
				<Flex align='center' justifyContent='flex-end'>
					<Text color={textColor} fontSize='sm' fontWeight='700'>
						{functions.numberWithCommas(info.getValue())}
					</Text>
				</Flex>
			)
		}),
		columnHelper.accessor('lastLoginAt', {
			id: 'isActive',
			header: () => (
				<Text justifyContent='space-between' align='center' fontSize={{ sm: '10px', lg: '12px' }} color='gray.400'>
					활성
				</Text>
			),
			cell: (info) => {
				const lastLogin = info.getValue() ? dayjs(info.getValue()) : null;
				const oneMonthAgo = dayjs().subtract(1, 'month');
				const isActive = lastLogin ? lastLogin.isAfter(oneMonthAgo) : false;
				return (
					<Checkbox defaultChecked={isActive} colorScheme='brandScheme' mr='10px' isReadOnly />
				);
			}
		}),
		columnHelper.accessor('unregist_date', {
			id: 'isEntire',
			header: () => (
				<Text justifyContent='space-between' align='center' fontSize={{ sm: '10px', lg: '12px' }} color='gray.400'>
					탈퇴
				</Text>
			),
			cell: (info) => (
				<Checkbox defaultChecked={info.getValue() !== null} colorScheme='brandScheme' mr='10px' isReadOnly />
			)
		}),
		columnHelper.accessor('lastLoginAt', {
			size: 200,
			id: 'regDate',
			header: () => (
				<Text justifyContent='space-between' align='center' fontSize={{ sm: '10px', lg: '12px' }} color='gray.400'>
					마지막 로그인일
				</Text>
			),
			cell: (info) => (
				<Text color={textColor} fontSize='sm' fontWeight='700'>
					{info.getValue() ? functions.castToDateString(new Date(info.getValue()), 'yyyy-MM-dd HH:mm:ss') : ''}
				</Text>
			)
		})
	];

	const table = useReactTable({
		data: tableData,
		columns,
		state: {
			sorting
		},
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		debugTable: true,
		enableRowSelection: true
	});

	const onHandleOpenDetail = (userId: string, nickname: string) => {
		if ( !functions.isEmpty(userId) ) {
			setSelectedUserId(userId);
			setSelectedUserNickname(nickname);
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
						회원 리스트
					</Text>
				</Box>
				<Box display='flex' alignItems={'flex-end'} width={{base : '100%', xl : 'auto'}}>
					<Select placeholder='정렬기준'>
						<option value='option1'>최신 등록순</option>
						<option value='option2'>이름순</option>
						<option value='option3'>사용토큰 많은순</option>
					</Select>
					<Input placeholder='키워드를 입력하세요' id='keyword' />
					<Button
						size='md'
						loadingText='Loading'
						variant="solid"
						colorScheme='blue'
						sx={{borderRadius:'5px'}}
					>
						검색
					</Button>
				</Box>
			</Flex>
			<Box>
				<Table variant='simple' color='gray.500' mb='24px' mt="12px">
					<Thead>
						{table.getHeaderGroups().map((headerGroup) => (
							<Tr key={headerGroup.id} >
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
						{table.getRowModel().rows.length === 0 ? (
							<Tr>
								<Td colSpan={columns.length} textAlign="center">
									<Text color={textColor} fontSize='sm' fontWeight='700'>
										데이터가 없습니다.
									</Text>
								</Td>
							</Tr>
						) : (
							table.getRowModel().rows.map((row) => {
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
													onClick={() => onHandleOpenDetail(row.original.user_id, row.original.nickname)}
												>
													{flexRender(cell.column.columnDef.cell, cell.getContext())}
												</Td>
											);
										})}
									</Tr>
								);
							})
						)}
					</Tbody>
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
							<ModalHeader>{selectedUserNickname}</ModalHeader>
							<ModalCloseButton />
							<ModalBody >
							<MemberDetail
								isOpen={isOpenRequestModal}
								setClose={() => setIsOpenRequestModal(false)}
								memberId={selectedUserId}
								memberNickname={selectedUserNickname}
							/>
							</ModalBody>
						</ModalContent>
					</Modal>
				)
			}
		</Card>
	);
}