'use client';
import { Box, SimpleGrid } from '@chakra-ui/react';
import ReviewTable from 'views/v1/dataTables/components/ReviewTable';
import tableDataReview from 'views/v1/dataTables/variables/tableDataReview';
import React from 'react';


export default function DataTables() {
  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <SimpleGrid
        mb="20px"
        columns={{ sm: 1, md: 1 }}
        spacing={{ base: '20px', xl: '20px' }}
      >
        <ReviewTable tableData={tableDataReview} />
      </SimpleGrid>
    </Box>
  );
}
