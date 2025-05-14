'use client';
import { Box, SimpleGrid } from '@chakra-ui/react';
import DoctorsTable from 'views/admin/dataTables/components/DoctorsTable';
import styled from '@emotion/styled';
import * as React from 'react';
import * as DoctorService from "services/doctor/index";
import Pagination from 'components/etc/Pagination';
import dynamic from 'next/dynamic';

const Scrollbars = dynamic(
  () => import('react-custom-scrollbars-2').then((mod) => mod.Scrollbars),
  { ssr: true },
);

export default function DoctorList(props: { hospitalData: any }) {

  const [ data, setData ] = React.useState<any>([]);
  const [ order, setOrder ] = React.useState('ASC');
  const [ orderName, setOrderName ] = React.useState('deptname');
  const [ totalCount, setTotalCount ] = React.useState(0);
  const [ pageIndex, setPageIndex ] = React.useState(0);
  const [ pageSize, setPageSize ] = React.useState(10);
  const [ page, setPage ] = React.useState(1);

  const getData = React.useCallback(
      async() => {
        try{
          const res:any = await DoctorService.getDoctorList({
            hospitalId: props.hospitalData?.hid,
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
        }catch(e){
          setData([]);
        }
      },[page,orderName,order]
    );
    
    React.useEffect(() => {
      getData()
    }, [getData]);

  const getDataSortChange = (str:string) => {
    setPage(1);
    setOrderName(str)
    setOrder(order == 'ASC' ? 'DESC' : 'ASC')
  }

  return (
    <Box>
      <SimpleGrid
        mb="20px"
        columns={{ sm: 1, md: 1 }}
        spacing={{ base: '20px', xl: '20px' }}
      >
        <Scrollbars 
          universal={true} autoHeight={true} autoHeightMin={0} autoHeightMax={600}
          //renderTrackVertical={renderTrack}
          //renderThumbVertical={renderThumb}
          //renderView={renderView}
        >
        <DoctorsTable 
          hospitalData={props.hospitalData}
          tableData={data} 
          order={order}
          orderName={orderName}
          page={page}
          getDataSortChange={getDataSortChange}
        />
        
        </Scrollbars>
        <Box 
          display={totalCount > pageSize ? 'block' : 'none'}
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