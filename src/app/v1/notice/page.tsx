'use client';
import { Box, SimpleGrid, useToast } from '@chakra-ui/react';
import CheckTable from 'views/v1/dataTables/components/CheckTable';
import tableDataCheck from 'views/v1/dataTables/variables/tableDataCheck';
import React from 'react';
import * as NoticeService from "services/notice/index";
import { NoticeDetailModalStore } from 'store/modalStore';

export default function DataTables() {

  const isShow = NoticeDetailModalStore(state => state.isOpenNoticeDetailModal);
  const [ data, setData ] = React.useState<any>();
  const toast = useToast();

  const getData = React.useCallback(
		async() => {
			try {
				const res:any = await NoticeService.getNoticeList();
				console.log('res',res?.data)
        if ( res.data ) setData(res.data.data)
				return res;
			} catch (error: any) { // e: any로 변경
				console.error("Failed to get notice list:", error);
        if (error.response && error.response.status === 401) {
          toast({
            title: '인증 실패',
            description: '일시적인 문제일 수 있으니, 페이지를 새로고침하여 다시 시도해 주세요. 문제가 계속되면 관리자에게 문의해주세요.',
            status: 'error',
            duration: 9000,
            isClosable: true,
            position: 'top-right',
          });
        }
				return null;
			}
		},[]
	)
	
  React.useEffect(() => {
    getData().then((res) => setData(res?.data?.data));
  }, [getData]);


  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <SimpleGrid
        mb="20px"
        columns={{ sm: 1, md: 1 }}
        spacing={{ base: '20px', xl: '20px' }}
      >
        <CheckTable tableData={data} getData={getData} />
      </SimpleGrid>
    </Box>
  );
}
