'use client';
import { Box, SimpleGrid } from '@chakra-ui/react';
import InquiryTable from 'views/v1/dataTables/components/InquiryTable';
import styled from '@emotion/styled';
import React from 'react';
import * as OpinionService from "services/opinion/index";
import Pagination from 'components/etc/Pagination';

// Define a type for our query parameters for better type-safety
interface QueryOptions {
  page: number;
  take: number;
  order: 'ASC' | 'DESC';
  orderName: string;
  status: '' | '0' | '1' | '9'; // Filter states as numerical strings
  keyword: string;
}

export default function DataTables() {
  const [data, setData] = React.useState<any[]>([]);
  const [totalCount, setTotalCount] = React.useState(0);
  const [queryOptions, setQueryOptions] = React.useState<QueryOptions>({
    page: 1,
    take: 10,
    order: 'DESC',
    orderName: 'tb_opinion.createAt',
    status: '',
    keyword: '',
  });

  // Centralized data fetching function
  const fetchData = React.useCallback(async () => {
    try {
      const res: any = await OpinionService.getOpinionList({
        page: queryOptions.page,
        take: queryOptions.take,
        order: queryOptions.order,
        orderName: queryOptions.orderName,
        status: queryOptions.status,
        keyword: queryOptions.keyword,
      });

      if (res?.data?.meta?.totalCount > 0) {
        setData(res.data.data);
        setTotalCount(res.data.meta.totalCount);
      } else {
        setData([]);
        setTotalCount(0);
      }
    } catch (e) {
      console.error("Failed to fetch data:", e);
      setData([]);
      setTotalCount(0);
    }
  }, [queryOptions]); // Depends only on the single queryOptions state

  // Effect to fetch data whenever queryOptions change
  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handler for sorting
  const handleSortChange = (newOrderName: string) => {
    setQueryOptions(prev => ({
      ...prev,
      page: 1, // Reset page to 1 on sort change
      orderName: newOrderName,
      order: prev.orderName === newOrderName && prev.order === 'ASC' ? 'DESC' : 'ASC',
    }));
  };

  // Handler for page changes
  const handlePageChange = (newPage: number) => {
    setQueryOptions(prev => ({ ...prev, page: newPage }));
  };
  
  // Example handlers for new features
  const handleFilterChange = (newStatus: QueryOptions['status']) => {
    setQueryOptions(prev => ({ ...prev, page: 1, status: newStatus }));
  };

  const handleSearch = (newKeyword: string) => {
    setQueryOptions(prev => ({ ...prev, page: 1, keyword: newKeyword }));
  };

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      {/* TODO: Add UI elements for filtering and search here */}
      {/* e.g., <FilterComponent onFilterChange={handleFilterChange} onSearch={handleSearch} /> */}
      <SimpleGrid
        mb="20px"
        columns={{ sm: 1, md: 1 }}
        spacing={{ base: '20px', xl: '20px' }}
      >
        <InquiryTable
          tableData={data}
          order={queryOptions.order}
          orderName={queryOptions.orderName}
          page={queryOptions.page}
          status={queryOptions.status}
          keyword={queryOptions.keyword}
          getDataSortChange={handleSortChange}
          handleFilterChange={handleFilterChange}
          handleSearch={handleSearch}
          refetchData={fetchData} // Pass the refetch function down
        />
        <Box
          display={totalCount > 0 ? 'block' : 'none'}
        >
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