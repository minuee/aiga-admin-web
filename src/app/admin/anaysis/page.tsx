'use client';
import { Box, SimpleGrid } from '@chakra-ui/react';
import DevelopmentTable from 'views/admin/dataTables/components/DevelopmentTable';
import styled from '@emotion/styled';
import * as React from 'react';
import * as NoticeService from "services/notice/index";
import Pagination from 'components/etc/Pagination';

export default function DataTables() {

  const [ data, setData ] = React.useState<any>([]);
  const [ order, setOrder ] = React.useState('ASC');
  const [ orderName, setOrderName ] = React.useState('hospital.hid');
  const [ totalCount, setTotalCount ] = React.useState(0);
  const [ pageIndex, setPageIndex ] = React.useState(0);
  const [ pageSize, setPageSize ] = React.useState(10);
  const [ page, setPage ] = React.useState(1);

  const getData = React.useCallback(
      async() => {
        console.log("getData",page,
          pageSize,
          order,
          orderName
        )
        const res:any = await NoticeService.getHospitalList({
          page,
          take: pageSize,
          order,
          orderName
        });
        
        if ( res?.data?.meta?.totalCount > 0 ) {
          setData(res?.data?.data);
          setTotalCount(res?.data.meta?.totalCount)
          setPageIndex(parseInt(res?.data?.meta?.currentPage)+1)
        }else{
          setData([]);
        }
      },[page,order]
    );
    
    React.useEffect(() => {
      getData()
    }, [getData]);

  const getDataSortChange = (str:string) => {
    setOrder(order == 'ASC' ? 'DESC' : 'ASC')
    setTimeout(() => {
      setPage(1);
      setOrderName(str)
    }, 600)

  }

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <SimpleGrid
        mb="20px"
        columns={{ sm: 1, md: 1 }}
        spacing={{ base: '20px', xl: '20px' }}
      >
        <DevelopmentTable 
          tableData={data} 
          order={order}
          orderName={orderName}
          page={page}
          getDataSortChange={getDataSortChange}
        />
        <Box>
          <PaginationWrapper
            total={totalCount}
            page={page}
            pageSize={pageSize}
            onPageChange={(page:number) => setPage(page)}
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