'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Box,Flex,Button,useColorModeValue,useDisclosure,Modal,ModalOverlay,ModalContent,ModalHeader,ModalCloseButton,ModalBody,Text } from '@chakra-ui/react';
import Card from 'components/card/Card';
import AnalysisFilter from './AnalysisFilter';
import DoctorRankingTable from './components/DoctorRankingTable';
import { getAnalysisStatistics } from 'services/common';
import DoctorDetail from 'components/modal/DoctorBasicDetail';
import mConstants from 'utils/constants';

const DoctorTab = () => {
  // API 응답 데이터 ( [{ standard_group: '...', standard_spec: [...] }, ...] )
  const [analysisData, setAnalysisData] = useState<any[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>('');
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
        // API 리턴 포맷: [ { standard_group: '...', specs: [ { standard_spec: '...', doctors: [...] } ] }, ... ]
        const data = response.data;
        setAnalysisData(data);

        if (data.length > 0) {
          const firstGroup = data[0];
          setSelectedGroup(firstGroup.standard_group);
          
          if (firstGroup.specs && firstGroup.specs.length > 0) {
            const firstSpec = firstGroup.specs[0];
            setSelectedDisease(firstSpec.standard_spec);
            setDoctorRanking(firstSpec.doctors || []);
          } else {
            setSelectedDisease('');
            setDoctorRanking([]);
          }
        } else {
          setSelectedGroup('');
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

  const handleGroupClick = (groupName: string) => {
    setSelectedGroup(groupName);
    const group = analysisData.find(item => item.standard_group === groupName);
    if (group && group.specs && group.specs.length > 0) {
      const firstSpec = group.specs[0];
      setSelectedDisease(firstSpec.standard_spec);
      setDoctorRanking(firstSpec.doctors || []);
    } else {
      setSelectedDisease('');
      setDoctorRanking([]);
    }
  };

  const handleDiseaseClick = (specName: string) => {
    setSelectedDisease(specName);
    const group = analysisData.find(item => item.standard_group === selectedGroup);
    const spec = group?.specs?.find((s: any) => s.standard_spec === specName);
    setDoctorRanking(spec?.doctors || []);
  };

  const handleSearch = (startDate: string, endDate: string, keyword?: string) => {
    setCurrentDates({ start: startDate, end: endDate });
    fetchData(startDate, endDate, keyword);
  };

  const handleDoctorClick = (doctor: any) => {
    setSelectedDoctor(doctor);
    onOpen();
  };

  const currentGroupData = analysisData.find(item => item.standard_group === selectedGroup);

  return (
    <Box>
      <AnalysisFilter onSearch={handleSearch} />
      
      <Card mb="20px" p="20px">
        <Flex justify="space-between" align="center" mb="15px">
          <Text fontSize="lg" fontWeight="bold" color={textColor}>
            질환별 검색랭킹 {isLoading && <Text as="span" fontSize="sm" fontWeight="normal" ml="2" color="brand.500">(로딩중...)</Text>}
          </Text>
        </Flex>

        {/* 1단계: 질환 그룹 버튼 */}
        <Flex flexWrap="wrap" gap="10px" mb="15px" borderBottom="1px solid" borderColor="gray.100" pb="15px">
          {analysisData.length > 0 ? (
            analysisData.map((item, idx) => (
              <Button
                key={`group-${idx}`}
                size="sm"
                variant={selectedGroup === item.standard_group ? 'brand' : 'outline'}
                onClick={() => handleGroupClick(item.standard_group)}
              >
                {item.standard_group}
              </Button>
            ))
          ) : (
            <Text fontSize="sm" color="secondaryGray.600">
              {isLoading ? '데이터를 불러오는 중입니다...' : '검색 결과가 없습니다.'}
            </Text>
          )}
        </Flex>

        {/* 2단계: 세부 질환 버튼 */}
        {currentGroupData && currentGroupData.specs && currentGroupData.specs.length > 0 && (
          <Flex flexWrap="wrap" gap="10px">
            {currentGroupData.specs.map((item: any, idx: number) => (
              <Button
                key={`spec-${idx}`}
                size="sm"
                variant={selectedDisease === item.standard_spec ? 'brand' : 'outline'}
                onClick={() => handleDiseaseClick(item.standard_spec)}
                colorScheme="gray"
              >
                {item.standard_spec}
              </Button>
            ))}
          </Flex>
        )}
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
