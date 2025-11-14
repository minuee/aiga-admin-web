'use client';
import { Box, SimpleGrid, Flex, Select, Input, Button, Text, useColorModeValue } from '@chakra-ui/react';
import DoctorsTable from 'views/v1/dataTables/components/DoctorsTable';
import styled from '@emotion/styled';
import * as React from 'react';
import * as DoctorService from "services/doctor/index";
import Pagination from 'components/etc/Pagination';
import dynamic from 'next/dynamic';
import { isDesktop } from "react-device-detect";

const Scrollbars = dynamic(
  () => import('react-custom-scrollbars-2').then((mod) => mod.Scrollbars),
  { ssr: true },
);

export default function DoctorList(props: { hospitalData: any }) {

  const [ data, setData ] = React.useState<any>([]);
  const [ inputs, setInputs ] = React.useState({
		orderName : "deptname",
		orderBy : "ASC",
		keyword : "",
    is_active: "",
    page: 1,
    pageSize : 10,
    totalCount : 0
	});
  const textColor = useColorModeValue('secondaryGray.900', 'white');

  const getData = React.useCallback(
    async(page: number = 1, currentInputs?: typeof inputs) => {
      const effectiveInputs = currentInputs || inputs;
      try{
        const res:any = await DoctorService.getDoctorList({
          hospitalId: props.hospitalData?.hid,
          page: page,
          take: effectiveInputs.pageSize,
          order : effectiveInputs.orderBy,
          orderName : effectiveInputs.orderName,
          keyword : effectiveInputs.keyword,
          is_active: effectiveInputs.is_active
        });
        
        if ( res?.data?.meta?.totalCount > 0 ) {
          setData(res?.data?.data);
          setInputs(prev => ({...prev, totalCount : res?.data.meta?.totalCount, page: parseInt(res?.data?.meta?.currentPage)}));
        }else{
          setData([]);
          setInputs(prev => ({...prev, totalCount: 0, page: 1}));
        }
      }catch(e){
        setData([]);
        setInputs(prev => ({...prev, totalCount: 0, page: 1}));
      }
    },[props.hospitalData?.hid, inputs.pageSize]
  );
  
  React.useEffect(() => {
    getData(1, inputs);
  }, [inputs.orderBy, inputs.orderName, inputs.keyword, inputs.is_active, getData]);

  const onHandleSubmit = () => {
    getData(1, inputs);
  }

  const getDataSortChange = (str:string) => {
    setInputs(prev => {
      const newInputs = {
        ...prev,
        page :  1,
        orderName : str,
        orderBy : prev.orderBy === 'ASC' ? 'DESC' : 'ASC'
      };
      getData(1, newInputs); // Call getData with the new inputs immediately
      return newInputs;
    });
  }

  const handlePageChange = (page: number) => {
    getData(page, inputs);
  }

  return (
    <Box>
      <Flex 
        px='25px'
        mb="20px"
        flexDirection={{base : 'column', 'mobile':'row'}}
        justifyContent='space-between' 
        alignItems='center'
      >
        <Text color={textColor} fontSize='22px' fontWeight='700' lineHeight='100%'>
          검색 의사수 : {inputs.totalCount}명
        </Text>
        <Box display='flex' flexDirection={{base : 'column', 'mobile':'row'}} mr={{base : '0', 'mobile':'10'}} justifyContent={'center'} alignItems={'center'}>
          <Select value={inputs.orderName} placeholder='정렬기준' onChange={(e:any) =>setInputs({...inputs,orderName : e.target.value})} size={'sm'}>
            <option value='deptname'>진료과목명순</option>
            <option value='doctorname'>의사명</option>
            <option value='updatedate'>수정일자순</option>
          </Select>
          <Select value={inputs.orderBy} placeholder='오름기준' onChange={(e:any) =>setInputs({...inputs,orderBy : e.target.value})} size={'sm'}>
            <option value='ASC'>순차적</option>
            <option value='DESC'>역순적</option>
          </Select>
          <Select value={inputs.is_active} placeholder='공개여부' onChange={(e:any) =>setInputs({...inputs,is_active : e.target.value})} size={'sm'}>
            <option value=''>전체</option>
            <option value='9'>공개(전체)</option>
            <option value='1'>공개(유지)</option>
            <option value='2'>공개(신규)</option>
            <option value='0'>비공개</option>
          </Select>
          <Input 
            placeholder='키워드를 입력하세요' 
            value={inputs.keyword} 
            onChange={(e:any) => setInputs({...inputs, keyword: e.target.value})} 
            color={textColor}
            size='sm'
            id='keyword'
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onHandleSubmit();
              }
            }}
          />
          <Button
            size='sm'
            loadingText='Loading'
            variant="solid"
            colorScheme='blue'
            sx={{borderRadius:'5px',width:'140px'}}
            onClick={onHandleSubmit}
          >
            검색
          </Button>
        </Box>
      </Flex>
      <SimpleGrid
        mb="20px"
        columns={{ sm: 1, md: 1 }}
        spacing={'20px'}
      >
        <Scrollbars 
          universal={true} 
          autoHeight={true} 
          autoHeightMin={0} 
          autoHeightMax={'calc( 100vh - 100px )'}
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
          bottom={isDesktop ? 2 : 5}
          left={0}
          width="100%"
          height={{base : '100px', xl:'50px'}}
        >
          <PaginationWrapper
            total={inputs.totalCount}
            page={inputs.page}
            pageSize={inputs.pageSize}
            onPageChange={handlePageChange}
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