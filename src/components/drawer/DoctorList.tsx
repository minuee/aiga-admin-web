'use client';
import { Box, SimpleGrid } from '@chakra-ui/react';
import DoctorsTable from 'views/admin/dataTables/components/DoctorsTable';
import styled from '@emotion/styled';
import * as React from 'react';
import * as DoctorService from "services/doctor/index";
import Pagination from 'components/etc/Pagination';
import dynamic from 'next/dynamic';
import functions from 'utils/functions';

const Scrollbars = dynamic(
  () => import('react-custom-scrollbars-2').then((mod) => mod.Scrollbars),
  { ssr: true },
);

export default function DoctorList(props: { hospitalData: any,inputs : any }) {

  const [ data, setData ] = React.useState<any>([]);
  const [ inputs, setInputs ] = React.useState({
		orderName : "deptname",
		orderBy : "ASC",
		keyword : "",
    pageIndex : 0,
    pageSize : 10,
    page : 1,
    totalCount : 0
	});

  const getData = React.useCallback(
    async() => {
      try{
        console.log("props.inputs 2",inputs)
        const res:any = await DoctorService.getDoctorList({
          hospitalId: props.hospitalData?.hid,
          page: inputs.page,
          take: inputs.pageSize,
          order : inputs.orderBy,
          orderName : inputs.orderName,
          keyword : inputs.keyword
        });
        
        if ( res?.data?.meta?.totalCount > 0 ) {
          setData(res?.data?.data);
          setInputs({...inputs, totalCount : res?.data.meta?.totalCount, pageIndex: parseInt(res?.data?.meta?.currentPage)+1})
        }else{
          setData([]);
        }
      }catch(e){
        setData([]);
      }
    },[props.hospitalData?.hid,inputs.page,inputs.orderName,inputs.orderBy,inputs.keyword]
  );
  
  React.useEffect(() => {
    console.log("props.inputs",props.inputs)
    setInputs({
      ...inputs,
      page : 1,
      orderBy : props.inputs?.orderBy,
      orderName : !functions.isEmpty(props.inputs?.orderName) ? props.inputs?.orderName : "deptname",
      keyword : props.inputs?.keyword
    })
  }, [props.inputs]);

  React.useEffect(() => {
    getData()
  }, [getData]);

  const getDataSortChange = (str:string) => {
    setInputs({
      ...inputs,
      page :  1,
      orderName : str,
      orderBy : inputs.orderBy == 'ASC' ? 'DESC' : 'ASC'
    })
  }

  return (
    <Box>
      <SimpleGrid
        mb="20px"
        columns={{ sm: 1, md: 1 }}
        spacing={{ base: '20px', xl: '20px' }}
      >
        <Scrollbars 
          universal={true} 
          autoHeight={true} 
          autoHeightMin={0} 
          autoHeightMax={'calc( 100vh - 100px )'}
          //renderTrackVertical={renderTrack}
          //renderThumbVertical={renderThumb}
          //renderView={renderView}
        >
        <DoctorsTable 
          hospitalData={props.hospitalData}
          tableData={data} 
          order={inputs.orderBy}
          orderName={inputs.orderName}
          page={inputs.page}
          getDataSortChange={getDataSortChange}
        />
        </Scrollbars>
        <Box 
          display={inputs.totalCount > inputs.pageSize ? 'block' : 'none'}
          position='absolute'
          bottom={0}
          left={0}
          width="100%"
          height={{base : '100px', xl:'50px'}}
          //overflowX={{base : 'auto', xl:'hidden'}}
        >
          
          <PaginationWrapper
            total={inputs.totalCount}
            page={inputs.page}
            pageSize={inputs.pageSize}
            onPageChange={(page:number) => setInputs({...inputs,page})}
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