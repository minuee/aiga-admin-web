"use client";
import { Box, SimpleGrid, Select, Input, Button, Flex, useToast } from '@chakra-ui/react';
import React from 'react';
import ConversationTable from './components/ConversationTable';
import Pagination from 'components/etc/Pagination';
import styled from '@emotion/styled';
import { getMessageList } from 'services/common';
import functions from "utils/functions";

interface QueryOptions {
  page: number;
  take: number;
  order: 'ASC' | 'DESC';
  orderName: string;
  searchType: '' | 'nickname' | 'session_id' | 'question'; // 검색 기준 필드 추가
  keyword: string;
}

export default function Conversations() {
  const [data, setData] = React.useState<any[]>([]);
  const [totalCount, setTotalCount] = React.useState(0);
  const [queryOptions, setQueryOptions] = React.useState<QueryOptions>({
    page: 1,
    take: 10,
    order: 'DESC',
    orderName: 'lastUsedAt', // API 필드명으로 변경
    searchType: 'nickname', // 검색 기준 초기값 추가
    keyword: '',
  });
  const [isSearchResult, setSearchResult] = React.useState(false);

  const toast = useToast();

    const conversationColumns = [
      {
        Header: '사용자',
        accessor: 'nickname', // API 필드명으로 변경
      },
      {
        Header: 'Session ID',
        accessor: 'session_id', // API 필드명으로 변경
      },
      {
        Header: '사용 토큰 수',
        accessor: 'usedTokenSum', // API 필드명으로 변경
        renderCell: (row: any) => functions.numberWithCommas(row.usedTokenSum),
      },
      {
        Header: '대화 수',
        accessor: 'chatCount', // API 필드명으로 변경
      },
      {
        Header: '마지막 사용 일자',
        accessor: 'lastUsedAt', // API 필드명으로 변경
        renderCell: (row: any) => functions.castToDateString(new Date(row.lastUsedAt), 'yyyy-MM-dd HH:mm:ss'),
      },
    ];


  const fetchData = React.useCallback(async () => {
    try {
      const res = await getMessageList({
        page: queryOptions.page,
        take: queryOptions.take,
        order: queryOptions.order,
        orderName: queryOptions.orderName,
        searchType: queryOptions.searchType, // searchType 추가
        keyword: queryOptions.keyword, // keyword 추가
      });
      console.log("API Response:", res); // API 응답 로그 출력
      setSearchResult(true)
      if (res?.data?.data && res?.data?.meta) { // API 응답이 유효할 때만 데이터 설정
        setData(res.data.data);
        setTotalCount(res.data.meta.itemCount);
        
      } else {
        setData([]);
        setTotalCount(0);
      }

    } catch (e: any) {
      setData([]);
      setTotalCount(0);
      setSearchResult(true)
      toast({
        title: '데이터 로드 실패',
        description: '데이터를 불러오는 중 오류가 발생했습니다.',
        status: 'error',
        duration: 9000,
        isClosable: true,
        position: 'top-right',
      });
    }
  }, [queryOptions]);

  const handleSearchReset = () => {
    setQueryOptions(prev => ({ 
      ...prev, 
      page: 1,
      take: 10,
      order: 'DESC',
      orderName: 'lastUsedAt', // API 필드명으로 변경
      searchType: 'nickname', // 검색 기준 초기값 추가
      keyword: '',
    }));
  }

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSortChange = (newOrderName: string) => {
    setQueryOptions(prev => ({
      ...prev,
      page: 1,
      orderName: newOrderName,
      order: prev.orderName === newOrderName && prev.order === 'ASC' ? 'DESC' : 'ASC',
    }));
  };

  const handlePageChange = (newPage: number) => {
    setQueryOptions(prev => ({ ...prev, page: newPage }));
  };

  const handleSearch = (newKeyword: string) => {
    setQueryOptions(prev => ({ ...prev, page: 1, keyword: newKeyword }));
  };

  // Select box change handler (placeholder for now)
  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newSearchType = event.target.value as QueryOptions['searchType'];
    setQueryOptions(prev => ({ ...prev, page: 1, searchType: newSearchType }));
  };


  const keywordInputRef = React.useRef<HTMLInputElement>(null);

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <SimpleGrid mb="20px" columns={{ sm: 1, md: 1 }} spacing={{ base: '20px', xl: '20px' }}>
        <ConversationTable
          columns={conversationColumns}
          data={data}
          order={queryOptions.order}
          orderName={queryOptions.orderName}
          getDataSortChange={handleSortChange}
          keyword={queryOptions.keyword}
          handleSearch={handleSearch}
          handleFilterChange={handleFilterChange}
          searchType={queryOptions.searchType} // searchType prop 추가
          isSearchResult={isSearchResult}
          handleSearchReset={handleSearchReset}
        />
        <Box display={totalCount > 0 ? 'block' : 'none'}>
          <PaginationWrapper
            total={totalCount}
            page={queryOptions.page}
            pageSize={queryOptions.take}
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

