'use client';
import { Box, SimpleGrid } from '@chakra-ui/react';
import ReviewTable from 'views/v1/dataTables/components/ReviewTable';
import * as ReviewService from "services/review/index";
import styled from '@emotion/styled';
import tableDataReview from 'views/v1/dataTables/variables/tableDataReview';
import React from 'react';
import Pagination from 'components/etc/Pagination';

export default function DataTables() {

  const [ data, setData ] = React.useState<any>([]);
  const [ order, setOrder ] = React.useState('DESC');
  const [ orderName, setOrderName ] = React.useState('tb_review.review_id');
  const [ totalCount, setTotalCount ] = React.useState(0);
  const [ pageIndex, setPageIndex ] = React.useState(0);
  const [ pageSize, setPageSize ] = React.useState(10);
  const [ page, setPage ] = React.useState(1);

  const resumeCallData = async() => {
    const res:any = await ReviewService.getReviewList({
      page,
      take: pageSize,
      order,
      orderName
    });
    console.log("resumeCallData", res?.data)
    if ( res?.data?.meta?.totalCount > 0 ) {
      setData(res?.data?.data);
      setTotalCount(res?.data.meta?.totalCount)
      setPageIndex(parseInt(res?.data?.meta?.currentPage)+1)
    }else{
      console.log("resumeCallData else")
      setData([]);
    }
  }
  const getData = React.useCallback(
    async() => {
      try{
        resumeCallData()
      }catch(e){
        setData([]);
      }
    },[page,orderName,order,pageSize]
  );

  const getDataSortChange = (str:string) => {
    setPage(1);
    setOrderName(str)
    setOrder(order == 'ASC' ? 'DESC' : 'ASC')
  }
    
  React.useEffect(() => {
    getData()
  }, [getData]);

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <SimpleGrid
        mb="20px"
        columns={{ sm: 1, md: 1 }}
        spacing={{ base: '20px', xl: '20px' }}
      >
        <ReviewTable 
          tableData={data} 
          order={order}
          orderName={orderName}
          page={page}
          getDataSortChange={getDataSortChange}
        />
        <Box 
          display={totalCount > 0 ? 'block' : 'none'}
        >
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


const PaginationWrapper = styled(Pagination)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 16px;
  padding-bottom: 64px;
`;