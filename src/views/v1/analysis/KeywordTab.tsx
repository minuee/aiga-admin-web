'use client';
import React, { useState, useEffect } from 'react';
import { Box } from '@chakra-ui/react';
import AnalysisFilter from './AnalysisFilter';
import KeywordRankingTable from './components/KeywordRankingTable';
import { getAnalysisStatistics } from 'services/common';

const KeywordTab = () => {
  const [keywordRanking, setKeywordRanking] = useState<any[]>([]);
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
        searchType: 'keyword',
        keyword: keyword || ''
      });
      if (response && response.data) {
        // 키워드 분석 결과 배열 처리
        setKeywordRanking(Array.isArray(response.data) ? response.data : response.data.keywordRanking || []);
      }
    } catch (error) {
      console.error('Keyword Analysis API Error:', error);
      setKeywordRanking([]);
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
      <KeywordRankingTable rankingData={keywordRanking} />
    </Box>
  );
};

export default KeywordTab;
