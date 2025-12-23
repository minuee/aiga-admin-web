'use client';
import { Box, SimpleGrid } from '@chakra-ui/react';
import MemberTable from 'views/v1/dataTables/components/MemberTable';
import React, { useEffect, useState, useCallback } from 'react';
import { getUserList } from 'services/user';
import Pagination from 'components/etc/Pagination';
import styled from '@emotion/styled';

export default function DataTables() {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [order, setOrder] = useState('ASC');
  const [orderName, setOrderName] = useState('createdAt'); // 기본 정렬 기준을 aigaUser_createdAt으로 변경
  const [isAll, setIsAll] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1); // setPage로 대체되므로 필요없을 수 있으나, 일단 유지
  const pageSize = 10;
  const resumeCallData = async () => {
    try {
      setLoading(true);
      const response: any = await getUserList({
        page,
        take: pageSize,
        order,
        orderName,
        isAll,
      });
      // console.log("resumeCallData response:", response); // 디버깅용 로그

      if (response && response.data && response.data.meta && response.data.meta.totalCount > 0) {
        setUserData(response.data.data);
        setTotalCount(response.data.meta.totalCount);
        // setPage(response.data.meta.page); // 무한 호출 방지를 위해 제거
      } else {
        setUserData([]);
        setTotalCount(0);
        // setPage(1); // 무한 호출 방지를 위해 제거
      }
    } catch (err: any) {
      setError(err);
      console.error('Failed to fetch users:', err);
      setUserData([]);
      setTotalCount(0);
      // setPage(1); // 무한 호출 방지를 위해 제거
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    resumeCallData();
  }, [page, orderName, order, pageSize, isAll]);

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

  if (loading) {
    return <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>Loading users...</Box>;
  }

  if (error) {
    return <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>Error: {error.message}</Box>;
  }

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

