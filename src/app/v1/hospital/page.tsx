'use client';
import { Box, SimpleGrid } from '@chakra-ui/react';
import HospitalTable from 'views/v1/dataTables/components/HospitalTable';
import styled from '@emotion/styled';
import * as React from 'react';
import * as HospitalService from "services/hospital/index";
import Pagination from 'components/etc/Pagination';

export default function DataTables() {

  const [ data, setData ] = React.useState<any>([]);
  const [ order, setOrder ] = React.useState('ASC');
  const [ orderName, setOrderName ] = React.useState('hospital.hid');
  const [ isAll, setIsAll ] = React.useState(false);
  const [ totalCount, setTotalCount ] = React.useState(0);
  const [ pageIndex, setPageIndex ] = React.useState(0);
  const [ pageSize, setPageSize ] = React.useState(10);
  const [ page, setPage ] = React.useState(1);

  const resumeCallData = async() => {
    const res:any = await HospitalService.getHospitalList({
      page,
      take: pageSize,
      order,
      orderName,
      isAll
    });
    
    if ( res?.data?.meta?.totalCount > 0 ) {
      setData(res?.data?.data);
      setTotalCount(res?.data.meta?.totalCount)
      setPageIndex(parseInt(res?.data?.meta?.currentPage)+1)
    }else{
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
    },[page,orderName,order,pageSize,isAll]
  );
    
  React.useEffect(() => {
    getData()
  }, [getData]);

  const getDataSortChange = (str:string) => {
    setPage(1);
    setOrderName(str)
    setOrder(order == 'ASC' ? 'DESC' : 'ASC')
  }

  const getDataUpdateChange = (bool:boolean,isNewPage:boolean) => {
    console.log("getDataUpdateChange :" , bool)
    if ( isNewPage ) {
      setPage(1)
      setIsAll(bool)
    }else{
      resumeCallData();
    }
  }

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <SimpleGrid
        mb="20px"
        columns={{ sm: 1, md: 1 }}
        spacing={{ base: '20px', xl: '20px' }}
      >
        <HospitalTable 
          tableData={data} 
          order={order}
          orderName={orderName}
          page={page}
          getDataSortChange={getDataSortChange}
          getDataUpdateChange={getDataUpdateChange}
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