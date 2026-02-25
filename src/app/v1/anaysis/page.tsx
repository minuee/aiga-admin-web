'use client';

import {
  Box,
  Flex,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorModeValue,
} from '@chakra-ui/react';
import { useState } from 'react';

// New Components
import DoctorTab from 'views/v1/analysis/DoctorTab';
import HospitalTab from 'views/v1/analysis/HospitalTab';
import KeywordTab from 'views/v1/analysis/KeywordTab';
import TokenTab from 'views/v1/analysis/TokenTab';

export default function AnalysisPage() {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  // CodeManage 스타일 컬러 정의
  const skeletonColor = useColorModeValue('white', 'navy.700');
  const tabSelectColor = useColorModeValue('navy.700', 'white');

  return (
    <Flex flexDirection="column" height="100vh">
      <Tabs 
        variant='enclosed' 
        width={'100%'} 
        isLazy 
        lazyBehavior='keepMounted' 
        onChange={(index) => setSelectedTabIndex(index)}
        display="flex" 
        flexDirection="column" 
        flex="1" 
        height="100%"
      >
        <TabList
          overflowY="hidden"
          sx={{
            scrollbarWidth: 'none',
            '::-webkit-scrollbar': {
              display: 'none',
            },
          }}
          flexShrink={0} 
          pt={{ base: '130px', md: '80px', xl: '80px' }}
        >
          <Tab _selected={{ bg: tabSelectColor, color: skeletonColor }} fontWeight="700">의사 분석</Tab>
          <Tab _selected={{ bg: tabSelectColor, color: skeletonColor }} fontWeight="700">병원 분석</Tab>
          <Tab _selected={{ bg: tabSelectColor, color: skeletonColor }} fontWeight="700">키워드 분석</Tab>
          <Tab _selected={{ bg: tabSelectColor, color: skeletonColor }} fontWeight="700">토큰 관리</Tab>
        </TabList>

        <Box flex="1" overflowY="auto" minH={0} p={{ base: '20px', md: '20px' }}>
          <TabPanels>
            {/* 1번째 탭: 의사 */}
            <TabPanel p="0">
              <DoctorTab />
            </TabPanel>

            {/* 2번째 탭: 병원 */}
            <TabPanel p="0">
              <HospitalTab />
            </TabPanel>

            {/* 3번째 탭: 키워드 */}
            <TabPanel p="0">
              <KeywordTab />
            </TabPanel>

            {/* 4번째 탭: 토큰 관리 */}
            <TabPanel p="0">
              <TokenTab />
            </TabPanel>
          </TabPanels>
        </Box>
      </Tabs>
    </Flex>
  );
}
