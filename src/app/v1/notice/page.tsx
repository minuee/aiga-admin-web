'use client';
import { Box, SimpleGrid } from '@chakra-ui/react';
import CheckTable from 'views/v1/dataTables/components/CheckTable';
import tableDataCheck from 'views/v1/dataTables/variables/tableDataCheck';
import React from 'react';
import * as NoticeService from "services/notice/index";
import { NoticeDetailModalStore } from 'store/modalStore';

export default function DataTables() {

  const isShow = NoticeDetailModalStore(state => state.isOpenNoticeDetailModal);
  const [ data, setData ] = React.useState<any>();

  const getData = React.useCallback(
		async() => {
			try {
				const res:any = await NoticeService.getNoticeList();
				console.log('res',res)
				return res;
			} catch (error) {
				console.error("Failed to get notice list:", error);
				return null;
			}
		},[]
	)
	
  React.useEffect(() => {
    if (!isShow) {
      getData().then((res) => setData(res?.data?.data));
    }
  }, [getData, isShow]);


  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <SimpleGrid
        mb="20px"
        columns={{ sm: 1, md: 1 }}
        spacing={{ base: '20px', xl: '20px' }}
      >
        <CheckTable tableData={data} />
      </SimpleGrid>
    </Box>
  );
}
