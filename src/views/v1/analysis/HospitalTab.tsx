'use client';
import React, { useState, useEffect } from 'react';
import { Box } from '@chakra-ui/react';
import AnalysisFilter from './AnalysisFilter';
import HospitalRankingTable from './components/HospitalRankingTable';
import { getAnalysisStatistics } from 'services/common';

const HospitalTab = () => {
  const [hospitalRanking, setHospitalRanking] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const today = new Date();
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);

  const fetchData = async (start: string, end: string, keyword?: string) => {
    setIsLoading(true);
    try {
      const response = await getAnalysisStatistics({
        start_date: start,
        end_date: end,
        limit: 100,
        searchType: 'hospital',
        keyword: keyword || ''
      });
      
      if (response && response.data) {
        // 병원 분석의 경우 response.data 자체가 배열일 가능성이 높으므로 체크
        setHospitalRanking(Array.isArray(response.data) ? response.data : response.data.hospitalRanking || []);
      }
    } catch (error) {
      console.error('Hospital Analysis API Error:', error);
      setHospitalRanking([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(
      lastWeek.toISOString().split('T')[0],
      today.toISOString().split('T')[0]
    );
  }, []);

  const handleSearch = (startDate: string, endDate: string, keyword?: string) => {
    fetchData(startDate, endDate, keyword);
  };

  return (
    <Box>
      <AnalysisFilter onSearch={handleSearch} />
      <HospitalRankingTable rankingData={hospitalRanking} />
    </Box>
  );
};

export default HospitalTab;
