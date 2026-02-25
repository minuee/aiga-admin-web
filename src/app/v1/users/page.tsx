'use client';
import { Box, SimpleGrid, useToast } from '@chakra-ui/react';
import MemberTable from 'views/v1/dataTables/components/MemberTable';
import React, { useEffect, useState, useCallback } from 'react';
import { getUserList } from 'services/user';
import Pagination from 'components/etc/Pagination';
import styled from '@emotion/styled';

import { redirect } from 'next/navigation';
import AdminUserStateStore from 'store/userStore';

export default function DataTables() {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const toast = useToast();

  const [order, setOrder] = useState('DESC');
  const [orderName, setOrderName] = useState('createdAt'); // 기본 정렬 기준을 aigaUser_createdAt으로 변경
  const [isAll, setIsAll] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1); // setPage로 대체되므로 필요없을 수 있으나, 일단 유지
  const pageSize = 10;
  const [searchKeyword, setSearchKeyword] = useState(''); // searchKeyword 상태 추가

  // 권한 확인 로직 추가
  const { is_master } = AdminUserStateStore();
  useEffect(() => {
    if (!is_master) { // is_master가 false이면
      redirect('/v1/dashboard'); // 대시보드로 리다이렉트
    }
  }, [is_master]); // is_master 값이 변경될 때마다 실행

  const resumeCallData = async (keyword: string = searchKeyword) => { // keyword 파라미터 추가
    try {
      setLoading(true);
      const response: any = await getUserList({
        page,
        take: pageSize,
        order,
        orderName,
        isAll,
        keyword, // keyword 파라미터 추가
      });
      // console.log("resumeCallData response:", response); // 디버깅용 로그
      const responseTotalCount = response.data.meta?.totalCount ? response.data.meta?.totalCount : response.data.meta?.itemCount ? response.data.meta.itemCount : 0;

      if (response && response.data && response.data.meta && responseTotalCount > 0) {
        setUserData(response.data.data);
        setTotalCount(responseTotalCount);
        // setPage(response.data.meta.page); // 무한 호출 방지를 위해 제거
      } else {
        setUserData([]);
        setTotalCount(0);
        // setPage(1); // 무한 호출 방지를 위해 제거
      }
    } catch (err: any) {
      setUserData([]);
      setTotalCount(0);
      // setPage(1); // 무한 호출 방지를 위해 제거

      // 401 에러 처리
      if (err.response && err.response.status === 401) {
        toast({
          title: '인증 실패',
          description: '일시적인 문제일 수 있으니, 페이지를 새로고침하여 다시 시도해 주세요. 문제가 계속되면 관리자에게 문의해주세요.',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    resumeCallData(searchKeyword); // searchKeyword를 인자로 전달
  }, [page, orderName, order, pageSize, isAll, searchKeyword]); // searchKeyword 추가

  const getDataSortChange = (str: string) => {
    setPage(1);
    setOrderName(str);
    setOrder(order === 'ASC' ? 'DESC' : 'ASC');
  };

  const getDataUpdateChange = (bool: boolean, isNewPage: boolean) => {
    console.log("getDataUpdateChange :", bool);
    if (isNewPage) {
      setPage(1);
      setIsAll(bool);
    } else {
      resumeCallData();
    }
  };

  const handleSearch = (keyword: string) => {
    setPage(1); // 검색 시 페이지 초기화
    setSearchKeyword(keyword);
    // resumeCallData는 useEffect에 의해 searchKeyword가 변경되면 자동으로 호출됩니다.
  };

  if (loading && is_master) {
    return <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>Loading users...</Box>;
  }

  // if (error) {
  //   return <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>Error: {error.message}</Box>;
  // }

  console.log('Final userData to MemberTable:', userData);

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <SimpleGrid
        mb="20px"
        columns={{ sm: 1, md: 1 }}
        spacing={{ base: '20px', xl: '20px' }}
      >
        <MemberTable
          tableData={userData}
          order={order}
          orderName={orderName}
          page={page}
          getDataSortChange={getDataSortChange}
          getDataUpdateChange={getDataUpdateChange}
          onSearch={handleSearch} // onSearch prop 추가
        />
        <Box display={totalCount > 0 ? 'block' : 'none'}>
          <PaginationWrapper
            total={totalCount}
            page={page}
            pageSize={pageSize}
            onPageChange={(newPage: number) => setPage(newPage)}
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

