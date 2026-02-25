'use client';
import React, { useState, useEffect } from 'react';
import {
  Box,
  SimpleGrid,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import { MdBarChart, MdFileCopy, MdUpdate, MdHistory } from 'react-icons/md';
import AnalysisFilter from './AnalysisFilter';
import TokenUsageChart from './components/TokenUsageChart';
import TokenUsageTable from './components/TokenUsageTable';
import MiniStatistics from 'components/card/MiniStatistics';
import IconBox from 'components/icons/IconBox';
import { getAnalysisStatistics } from 'services/common';
import { dailyTokenUsageOptions as initialDailyOptions } from 'variables/charts';

const TokenTab = () => {
  const brandColor = useColorModeValue('brand.500', 'white');
  const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');

  const [dashboardData, setDashboardData] = useState<any>(null);
  const [dailyTokenChart, setDailyTokenChart] = useState<{ chartData: any[]; chartOptions: any }>({ 
    chartData: [], 
    chartOptions: initialDailyOptions 
  });

  const today = new Date();
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);

  const fetchData = async (start: string, end: string) => {
    try {
      const response = await getAnalysisStatistics({
        start_date: start,
        end_date: end,
        limit: 100,
        searchType: 'token',
        keyword: ''
      });
      
      if (response && response.data) {
        const data = response.data;
        
        // --- 날짜 채우기(Date Filling) 로직 ---
        const filledTrend: any[] = [];
        const startDate = new Date(start);
        const endDate = new Date(end);
        
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
          const dateStr = d.toISOString().split('T')[0];
          const found = data.dailyTrend?.find((item: any) => item.date === dateStr);
          
          filledTrend.push({
            date: dateStr,
            total: found ? Number(found.total) : 0
          });
        }

        setDashboardData({
          ...data,
          dailyTrend: [...filledTrend].reverse()
        });

        const dailyCategories = filledTrend.map((item: any) => item.date);
        const dailyTokens = filledTrend.map((item: any) => item.total);
        
        setDailyTokenChart({
          chartData: [{ name: '일별 토큰 사용량', data: dailyTokens }],
          chartOptions: {
            ...initialDailyOptions,
            xaxis: {
              ...initialDailyOptions.xaxis,
              categories: dailyCategories,
            },
          },
        });
      }
    } catch (error) {
      console.error('Token Analysis API Error:', error);
    }
  };

  useEffect(() => {
    fetchData(
      lastWeek.toISOString().split('T')[0],
      today.toISOString().split('T')[0]
    );
  }, []);

  const handleSearch = (startDate: string, endDate: string) => {
    fetchData(startDate, endDate);
  };

  return (
    <Box>
      <AnalysisFilter showKeyword={false} onSearch={handleSearch} />
      
      {/* 상단 통계 카드 4개 노출 */}
      <SimpleGrid columns={{ base: 1, md: 2, '2xl': 4 }} gap="20px" mb="20px">
        <MiniStatistics
          startContent={<IconBox w="56px" h="56px" bg={boxBg} icon={<Icon w="32px" h="32px" as={MdHistory} color={brandColor} />} />}
          name="최근 1시간 사용량"
          value={dashboardData?.hourlyTokenUsage?.toLocaleString() || '0'}
        />
        <MiniStatistics
          startContent={<IconBox w="56px" h="56px" bg={boxBg} icon={<Icon w="32px" h="32px" as={MdHistory} color={brandColor} />} />}
          name="최근 24시간 사용량"
          value={dashboardData?.dailyTokenUsage?.toLocaleString() || '0'}
        />
        <MiniStatistics
          startContent={<IconBox w="56px" h="56px" bg={boxBg} icon={<Icon w="32px" h="32px" as={MdHistory} color={brandColor} />} />}
          name="기간 합산 사용량"
          value={dashboardData?.cumulativeTokenUsage?.toLocaleString() || '0'}
        />
        <MiniStatistics
          startContent={<IconBox w="56px" h="56px" bg={boxBg} icon={<Icon w="32px" h="32px" as={MdHistory} color={brandColor} />} />}
          name="누적 사용량"
          value={dashboardData?.totalTokenUsageAllTime?.toLocaleString() || '0'}
        />
      </SimpleGrid>

      <Box mb="20px">
        <TokenUsageChart chartData={dailyTokenChart.chartData} chartOptions={dailyTokenChart.chartOptions} />
      </Box>

      <TokenUsageTable usageData={dashboardData?.dailyTrend || []} />
    </Box>
  );
};

export default TokenTab;
