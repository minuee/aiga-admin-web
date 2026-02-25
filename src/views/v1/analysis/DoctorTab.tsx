'use client';
import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Flex,
  Button,
  useColorModeValue,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Text,
} from '@chakra-ui/react';
import Card from 'components/card/Card';
import AnalysisFilter from './AnalysisFilter';
import DoctorRankingTable from './components/DoctorRankingTable';
import { getAnalysisStatistics } from 'services/common';
import DoctorDetail from 'components/modal/DoctorBasicDetail';
import mConstants from 'utils/constants';

const DoctorTab = () => {
  // API 응답 데이터 ( [{ disease: '...', doctors: [...] }, ...] )
  const [analysisData, setAnalysisData] = useState<any[]>([]);
  const [selectedDisease, setSelectedDisease] = useState<string>('');
  const [doctorRanking, setDoctorRanking] = useState<any[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const sidebarBackgroundColor = useColorModeValue('white', 'gray.700');

  const today = new Date();
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);
  
  const [currentDates, setCurrentDates] = useState({
    start: lastWeek.toISOString().split('T')[0],
    end: today.toISOString().split('T')[0]
  });

  const fetchData = useCallback(async (start: string, end: string, keyword?: string) => {
    setIsLoading(true);
    try {
      const response = await getAnalysisStatistics({
        start_date: start,
        end_date: end,
        limit: 100,
        searchType: 'doctor',
        keyword: keyword || ''
      });

      if (response && response.data) {
        // API 리턴 포맷: [ { disease: '간암', doctors: [...] }, ... ]
        const data = response.data;
        setAnalysisData(data);

        if (data.length > 0) {
          const firstItem = data[0];
          setSelectedDisease(firstItem.disease);
          setDoctorRanking(firstItem.doctors || []);
        } else {
          setSelectedDisease('');
          setDoctorRanking([]);
        }
      }
    } catch (error) {
      console.error('Doctor Analysis API Error:', error);
      setAnalysisData([]);
      setDoctorRanking([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(currentDates.start, currentDates.end);
  }, []);

  const handleDiseaseClick = (diseaseName: string) => {
    setSelectedDisease(diseaseName);
    const selectedGroup = analysisData.find(item => item.disease === diseaseName);
    setDoctorRanking(selectedGroup?.doctors || []);
  };

  const handleSearch = (startDate: string, endDate: string, keyword?: string) => {
    setCurrentDates({ start: startDate, end: endDate });
    fetchData(startDate, endDate, keyword);
  };

  const handleDoctorClick = (doctor: any) => {
    setSelectedDoctor(doctor);
    onOpen();
  };

  return (
    <Box>
      <AnalysisFilter onSearch={handleSearch} />
      
      <Card mb="20px" p="20px">
        <Flex justify="space-between" align="center" mb="15px">
          <Text fontSize="lg" fontWeight="bold" color={textColor}>
            질환별 검색랭킹 {isLoading && <Text as="span" fontSize="sm" fontWeight="normal" ml="2" color="brand.500">(로딩중...)</Text>}
          </Text>
        </Flex>
        <Flex flexWrap="wrap" gap="10px">
          {analysisData.length > 0 ? (
            analysisData.map((item, idx) => (
              <Button
                key={idx}
                size="sm"
                variant={selectedDisease === item.disease ? 'brand' : 'outline'}
                onClick={() => handleDiseaseClick(item.disease)}
              >
                {item.disease}
              </Button>
            ))
          ) : (
            <Text fontSize="sm" color="secondaryGray.600">
              {isLoading ? '데이터를 불러오는 중입니다...' : '검색 결과가 없습니다.'}
            </Text>
          )}
        </Flex>
      </Card>

      <DoctorRankingTable 
        rankingData={doctorRanking} 
        onDoctorClick={handleDoctorClick} 
      />

      {isOpen && (
        <Modal onClose={onClose} isOpen={isOpen} scrollBehavior={'inside'} size={'full'}>
          <ModalOverlay />
          <ModalContent maxW={`${mConstants.modalMaxWidth}px`} bg={sidebarBackgroundColor}>
            <ModalHeader>{`${selectedDoctor?.doctorname?.replace('의사', '')} 의사 상세정보`}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <DoctorDetail 
                isOpen={isOpen} 
                setCloseModal={onClose} 
                doctorId={selectedDoctor?.doctor_id || selectedDoctor?.rid_long}
                DoctorData={selectedDoctor} 
              />
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
};

export default DoctorTab;
