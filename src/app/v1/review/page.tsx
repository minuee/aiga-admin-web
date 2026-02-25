'use client';
import { Box, SimpleGrid, useToast } from '@chakra-ui/react';
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
  const toast = useToast();

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
        await resumeCallData()
      }catch(e: any){
        setData([]);
        // 401 에러 처리
        if (e.response && e.response.status === 401) {
          toast({
            title: '인증 실패',
            description: '일시적인 문제일 수 있으니, 페이지를 새로고침하여 다시 시도해 주세요. 문제가 계속되면 관리자에게 문의해주세요.',
            status: 'error',
            duration: 9000,
            isClosable: true,
            position: 'top-right',
          });
        }
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