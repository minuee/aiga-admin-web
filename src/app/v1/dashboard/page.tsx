'use client';

import { Box,Flex,FormLabel,Image,Icon,Select,SimpleGrid,useColorModeValue } from '@chakra-ui/react';
// Custom components
// import MiniCalendar from 'components/calendar/MiniCalendar';
import MiniStatistics from 'components/card/MiniStatistics';
import IconBox from 'components/icons/IconBox';
import { MdAddTask,MdAttachMoney,MdBarChart,MdFileCopy } from 'react-icons/md';
import DailyTokenUsage from 'views/v1/dashboard/components/DailyTokenUsage'; // 변경된 컴포넌트 이름
import MonthlyTokenUsage from 'views/v1/dashboard/components/MonthlyTokenUsage'; // 새로운 컴포넌트
import DoctorRankingList from 'views/v1/dashboard/components/DoctorRankingList';
import HospitalRankingList from 'views/v1/dashboard/components/HospitalRankingList';
import KeywordRankingList from 'views/v1/dashboard/components/KeywordRankingList';
import { useEffect, useState } from 'react'; // useState 추가
import { getDashBoardStatistics } from 'services/common';
import {
  dailyTokenUsageOptions as initialDailyOptions, // charts.ts에서 가져온 임시 옵션
  monthlyTokenUsageOptions as initialMonthlyOptions, // charts.ts에서 가져온 임시 옵션
} from 'variables/charts'; // charts.ts 파일 임포트

export default function Default() {
  // Chakra Color Mode

  const brandColor = useColorModeValue('brand.500', 'white');
  const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');

  const [dashboardData, setDashboardData] = useState<any | null>(null); // dashboardData 상태 추가
  const [dailyTokenChart, setDailyTokenChart] = useState<{ chartData: any[]; chartOptions: any }>({ chartData: [], chartOptions: initialDailyOptions });
  const [monthlyTokenChart, setMonthlyTokenChart] = useState<{ chartData: any[]; chartOptions: any }>({ chartData: [], chartOptions: initialMonthlyOptions });


  useEffect(() => {
    const fetchStats = async () => {
      const response = await getDashBoardStatistics();
      if (response && response.data) {
        setDashboardData(response.data);
        console.log('Dashboard Statistics:', response.data);

        // 일별 토큰 사용량 데이터 처리
        if (response.data.dailyTokenUsageSummary && Array.isArray(response.data.dailyTokenUsageSummary)) {
          const dailyCategories = response.data.dailyTokenUsageSummary.map((item: any) => item.date);
          const dailyTokens = response.data.dailyTokenUsageSummary.map((item: any) => item.tokens);
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

        // 월별 토큰 사용량 데이터 처리
        if (response.data.monthlyTokenUsageSummary && Array.isArray(response.data.monthlyTokenUsageSummary)) {
          const monthlyCategories = response.data.monthlyTokenUsageSummary.map((item: any) => item.date);
          const monthlyTokens = response.data.monthlyTokenUsageSummary.map((item: any) => item.tokens);
          setMonthlyTokenChart({
            chartData: [{ name: '월별 토큰 사용량', data: monthlyTokens }],
            chartOptions: {
              ...initialMonthlyOptions,
              xaxis: {
                ...initialMonthlyOptions.xaxis,
                categories: monthlyCategories,
              },
            },
          });
        }
      }
    };
    fetchStats();
  }, []);

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 3, '2xl': 6 }}
        gap="20px"
        mb="20px"
      >
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={<Icon w="32px" h="32px" as={MdBarChart} color={brandColor} />}
            />
          }
          name="총 회원수"
          value={dashboardData?.totalUsers?.toLocaleString() || '0'}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={ <Icon w="32px" h="32px" as={MdBarChart} color={brandColor} />}
            />
          }
          name="신규 회원수"
          value={dashboardData?.recentUsers?.toLocaleString() || '0'}
        />
        
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={<Icon w="32px" h="32px" as={MdBarChart} color={brandColor} />}
            />
          } 
          name="탈퇴 회원수"
          value={dashboardData?.withdrawnUsers?.toLocaleString() || '0'}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={<Icon w="32px" h="32px" as={MdBarChart} color={brandColor} />}
            />
          }
          name="일일 토큰 사용량"
          value={dashboardData?.dailyTokenUsage?.toLocaleString() || '0'}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={ <Icon w="32px" h="32px" as={MdFileCopy} color={brandColor} />}
            />
          }
          name="최근1시간토큰"
          value={dashboardData?.hourlyTokenUsage?.toLocaleString() || '0'}
        />
        
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={<Icon w="32px" h="32px" as={MdFileCopy} color={brandColor} />}
            />
          }
          name="누적 토큰 사용량"
          value={dashboardData?.totalTokenUsage?.toLocaleString() || '0'}
        />
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap="20px" mb="20px">
        <DailyTokenUsage
          chartData={dailyTokenChart.chartData}
          chartOptions={dailyTokenChart.chartOptions}
        />
        <MonthlyTokenUsage
          chartData={monthlyTokenChart.chartData}
          chartOptions={monthlyTokenChart.chartOptions}
        />
      </SimpleGrid>

      {/* New: Ranking Section Grid */}
      <SimpleGrid columns={{ base: 1, md: 1, xl: 3 }} gap="20px" mb="20px">
        <DoctorRankingList rankingData={dashboardData?.doctorRanking || []} />
        <HospitalRankingList rankingData={dashboardData?.hospitalRanking || []} />
        <KeywordRankingList rankingData={dashboardData?.keywordRanking || []} />
      </SimpleGrid>
    </Box>
  );
}
