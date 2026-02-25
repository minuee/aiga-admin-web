'use client';
import { Box, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import Card from 'components/card/Card';
import LineChart from 'components/charts/LineChart';
import { useEffect, useState } from 'react';

interface TokenUsageChartProps {
  chartData: any[];
  chartOptions: any;
}

export default function TokenUsageChart({ chartData, chartOptions }: TokenUsageChartProps) {
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Card p="20px" w="100%">
      <Text color={textColor} fontSize="xl" fontWeight="700" mb="20px">
        일별 토큰 사용 추이
      </Text>
      <Box minH="300px">
        {mounted && <LineChart chartData={chartData} chartOptions={chartOptions} />}
      </Box>
    </Card>
  );
}
