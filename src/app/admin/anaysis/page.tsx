'use client';
import { Box, SimpleGrid } from '@chakra-ui/react';
import DevelopmentTable from 'views/admin/dataTables/components/DevelopmentTable';
import styled from '@emotion/styled';
import * as React from 'react';
import * as NoticeService from "services/notice/index";
import Pagination from 'components/etc/Pagination';

export default function DataTables() {

  const [ data, setData ] = React.useState<any>([]);
  const [ pageCount, setPageCount ] = React.useState(10);
  const [ pageIndex, setPageIndex ] = React.useState(0);
  const [ pageSize, setPageSize ] = React.useState(10);
  const [ page, setPage ] = React.useState(1);

  const getData = React.useCallback(
      async() => {
        const res:any = await NoticeService.getHospitalList({
          page,
          take:pageCount,
          order:'ASC',
          orderName:'hid'
        });
        console.log("res",res?.data)
        if ( res?.data?.length > 0 ) {
          return res?.data?.data;
        }else{
          return [{
            data : [],
            meta : {
              totalCount : 0,
              currentPage : 1
            }
          }]
        }
      },[]
      );
    
    React.useEffect(() => {
      getData().then((res:any) => {
        setData(res?.data);
        setPageCount(res?.meta?.totalCount)
        setPage(res?.meta?.currentPage)
      });
    }, [getData]);

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <SimpleGrid
        mb="20px"
        columns={{ sm: 1, md: 1 }}
        spacing={{ base: '20px', xl: '20px' }}
      >
        <DevelopmentTable 
          tableData={data} 
        />
        <Box>
          <PaginationWrapper
            total={pageCount}
            page={pageIndex + 1}
            pageSize={pageSize}
            onPageChange={(page:number) => setPage(page - 1)}
          />
        </Box>
      </SimpleGrid>
    </Box>
  );
}

export const PaginationWrapper = styled(Pagination)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 16px;
  padding-bottom: 64px;
`;