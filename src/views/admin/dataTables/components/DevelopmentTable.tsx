import { Box, Flex, Stack, Table, Tbody, Td, Text, Th, Thead, Tr, useColorModeValue, Skeleton, SkeletonCircle, SkeletonText  } from '@chakra-ui/react';
import { createColumnHelper,flexRender,getCoreRowModel,getSortedRowModel,SortingState,useReactTable } from '@tanstack/react-table';
// Custom components
import Card from 'components/card/Card';
import Menu from 'components/menu/MainMenu';
import { AndroidLogo, AppleLogo, WindowsLogo } from 'components/icons/Icons';

import * as React from 'react';

// Assets

type RowObj = {
	hid: string;
	baseName: any;
	shortName: string;
	createAt: Date;
	updateAt: Date;
};

const columnHelper = createColumnHelper<RowObj>();

// const columns = columnsDataCheck;
export default function ComplexTable(props: { tableData: any }) {
	
	const { tableData } = props;
	const [ isLoading, setLoading ] = React.useState(true);
	const [ sorting, setSorting ] = React.useState<SortingState>([]);
	const textColor = useColorModeValue('secondaryGray.900', 'white');
	const iconColor = useColorModeValue('secondaryGray.500', 'white');
	const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
	const [ data, setData ] = React.useState([]);
	console.log("tableData",tableData)

	React.useEffect(() => {
		setData(tableData);
		setTimeout(() => setLoading(false), 1000);
	}, [tableData]);
	const columns = [
		columnHelper.accessor('hid', {
			id: 'hid',
			header: () => (
				<Text
					justifyContent='space-between'
					align='center'
					fontSize={{ sm: '10px', lg: '12px' }}
					color='gray.400'>
					HID
				</Text>
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
				<Flex align='center'>
					<Text color={textColor} fontSize='sm' fontWeight='700'>
						{info.getValue()}
					</Text>
					{/* {info.getValue().map((item: string, key: number) => {
						if (item === 'apple') {
							return <AppleLogo key={key} color={iconColor} me='16px' h='18px' w='15px' />;
						} else if (item === 'android') {
							return <AndroidLogo key={key} color={iconColor} me='16px' h='18px' w='16px' />;
						} else if (item === 'windows') {
							return <WindowsLogo key={key} color={iconColor} h='18px' w='19px' />;
						}
					})} */}
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
						{info.getValue()}%
					</Text>
				</Flex>
			)
		}),
		columnHelper.accessor('updateAt', {
			id: 'updateAt',
			header: () => (
				<Text
					justifyContent='space-between'
					align='center'
					fontSize={{ sm: '10px', lg: '12px' }}
					color='gray.400'>
					수정일
				</Text>
			),
			cell: (info:any) => (
				<Flex align='center'>
					<Text me='10px' color={textColor} fontSize='sm' fontWeight='700'>
						{info.getValue()}
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

						<Tbody>
							{table.getRowModel().rows.slice(0, 11).map((row) => {
								return (
									<Tr key={row.id}>
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
					</Table>
				</Box>
			}
		</Card>
	);
}
