'use client';
import React, { useState, useEffect } from 'react';
import {
  Flex,
  Box,
  Text,
  useColorModeValue,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { getStandardSpecialty, getStandardSpecialtyForDoctors, updateStandardSpecialty } from 'services/common';
import DoctorDetail from 'components/modal/DoctorBasicDetail';
import mConstants from 'utils/constants';
import functions from 'utils/functions';
import { useToast } from '@chakra-ui/react';

const defaultImage = '/img/avatars/no_image01.png';

interface StandardSpecialtyItem {
  spec_id: number;
  standard_group: string;
  standard_spec: string;
}

interface Doctor {
  doctor_id: number;
  deptname: string;
  doctorname: string;
  shortName: string;
  profileimgurl: string;
}

function MedicalField() {
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const toast = useToast();
  const [originalData, setOriginalData] = useState<StandardSpecialtyItem[]>([]);
  const [filteredData, setFilteredData] = useState<StandardSpecialtyItem[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('전체');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedStandardSpec, setSelectedStandardSpec] = useState<string | null>(null);
  const [doctorList, setDoctorList] = useState<Doctor[]>([]);
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(false);
  const btnRef = React.useRef(null);
  const [errorImageUrls, setErrorImageUrls] = useState<string[]>([]);
  const [isOpenDoctorDetailModal, setIsOpenDoctorDetailModal] = useState<boolean>(false);
  const [selectedDoctorData, setSelectedDoctorData] = useState<any | null>(null);
  const sidebarBackgroundColor = useColorModeValue('white', 'gray.700');
  const extraTrBgColor =  useColorModeValue('gray.100', 'whiteAlpha.200') 
  const extraThreadBgColor =useColorModeValue('gray.50', 'whiteAlpha.100');

  // 수정 모드 관련 상태 추가
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedValues, setEditedValues] = useState<{ [key: number]: string }>({});

  const fetchStandardSpecialty = async () => {
    try {
      const response = await getStandardSpecialty();
      if (response && response.data) {
        setOriginalData(response.data);
        setFilteredData(response.data);
      }
    } catch (error) {
      console.error('진료분야 API 호출 중 에러 발생:', error);
    }
  };

  useEffect(() => {
    fetchStandardSpecialty();
  }, []);

  // 그룹 목록 추출
  const groups = React.useMemo(() => {
    const uniqueGroups = Array.from(new Set(originalData.map(item => item.standard_group))).filter(Boolean);
    return ['전체', ...uniqueGroups];
  }, [originalData]);

  // 필터링 로직 통합
  useEffect(() => {
    let filtered = originalData;

    if (selectedGroup !== '전체') {
      filtered = filtered.filter(item => item.standard_group === selectedGroup);
    }

    if (searchKeyword.trim() !== '') {
      const lowerKeyword = searchKeyword.toLowerCase();
      filtered = filtered.filter(item =>
        item.standard_spec.toLowerCase().includes(lowerKeyword)
      );
    }

    setFilteredData(filtered);
  }, [searchKeyword, selectedGroup, originalData]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(event.target.value);
  };

  const handleGroupChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGroup(event.target.value);
  };

  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) {
      return text;
    }
    const regex = new RegExp(`(${highlight})`, 'gi');
    const parts = text.split(regex);
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <Text as="span" key={i} color="red.500">
              {part}
            </Text>
          ) : (
            part
          )
        )}
      </>
    );
  };

  const handleViewDoctors = async (standardSpec: string) => {
    setSelectedStandardSpec(standardSpec);
    onOpen();
    setIsLoadingDoctors(true);
    setErrorImageUrls([]);
    try {
      const response = await getStandardSpecialtyForDoctors({ standard_spec: standardSpec });
      if (response && response.data) {
        setDoctorList(response.data);
      } else {
        setDoctorList([]);
      }
    } catch (error) {
      console.error('의사 목록 API 호출 중 에러 발생:', error);
      setDoctorList([]);
    } finally {
      setIsLoadingDoctors(false);
    }
  };

  const handleImageError = (imageUrl: string) => {
    if (imageUrl && !errorImageUrls.includes(imageUrl)) {
      setErrorImageUrls((prev) => [...prev, imageUrl]);
    }
  };

  const handleOpenDoctorDetailModal = (doctor: Doctor) => {
    setSelectedDoctorData(doctor);
    setIsOpenDoctorDetailModal(true);
  };

  // 수정 모드 변경 핸들러
  const handleEditValueChange = (spec_id: number, value: string) => {
    setEditedValues((prev) => ({
      ...prev,
      [spec_id]: value,
    }));
  };

  // 수정 API 호출 핸들러
  const handleUpdate = async (item: StandardSpecialtyItem) => {
    const newValue = editedValues[item.spec_id];
    if (newValue === undefined || newValue === item.standard_group) {
        toast({
            title: '변경사항이 없습니다.',
            status: 'info',
            duration: 2000,
            isClosable: true,
        });
        return;
    }

    try {
      const response = await updateStandardSpecialty({
        spec_id: item.spec_id,
        standard_group: newValue,
      });

      if (response && response.status === 200) {
        toast({
          title: '수정되었습니다.',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
        // 수정된 항목의 임시 상태 초기화
        setEditedValues((prev) => {
          const newState = { ...prev };
          delete newState[item.spec_id];
          return newState;
        });
        // 데이터 재요청
        fetchStandardSpecialty();
      } else {
        throw new Error('수정 실패');
      }
    } catch (error) {
      console.error('수정 API 호출 중 에러 발생:', error);
      toast({
        title: '수정 중 에러가 발생했습니다.',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <Box>
      <Flex flexDirection="column" pt={{ base: '20px', md: '20px' }}>
        <Flex justifyContent="space-between" mb="20px">
          <Text fontSize="2xl" fontWeight="bold" color={textColor}>
            진료 분야별 의사 관리
          </Text>
          <Flex gap="10px">
            <Button
              onClick={() => setIsEditMode(!isEditMode)}
              variant={isEditMode ? 'outline' : 'solid'}
            >
              {isEditMode ? '조회 모드' : '수정 모드'}
            </Button>
            <Select
              value={selectedGroup}
              onChange={handleGroupChange}
              width="180px"
              color={textColor}
            >
              {groups.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </Select>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.300" />
              </InputLeftElement>
              <Input
                placeholder="진료분야 검색..."
                value={searchKeyword}
                onChange={handleSearchChange}
                width="300px"
                color={textColor}
              />
            </InputGroup>
          </Flex>
        </Flex>
        <Box overflowX="auto">
          <Table variant="simple" colorScheme="gray">
            <Thead bg={extraThreadBgColor}>
              <Tr>
                <Th fontWeight="bold" fontSize="sm">spec_id</Th>
                <Th fontWeight="bold" fontSize="sm">standard_group</Th>
                <Th fontWeight="bold" fontSize="sm">standard_spec</Th>
                <Th fontWeight="bold" fontSize="sm">등록의사</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <Tr key={item.spec_id} _hover={{ bg: extraTrBgColor}}>
                    <Td py={3}>{item.spec_id}</Td>
                    <Td py={3}>
                      {isEditMode ? (
                        <Flex gap="5px">
                          <Input
                            size="sm"
                            value={editedValues[item.spec_id] ?? item.standard_group}
                            onChange={(e) => handleEditValueChange(item.spec_id, e.target.value)}
                            colorScheme="whiteAlpha"
                            color={textColor}
                          />
                          <Button
                            size="sm"
                            onClick={() => handleUpdate(item)}
                            flexShrink={0}
                          >
                            수정
                          </Button>
                        </Flex>
                      ) : (
                        item.standard_group
                      )}
                    </Td>
                    <Td py={3}>{highlightText(item.standard_spec, searchKeyword)}</Td>
                    <Td py={3}>
                      <Button size="sm" onClick={() => handleViewDoctors(item.standard_spec)}>
                        보기
                      </Button>
                    </Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan={4} textAlign="center">
                    {searchKeyword ? '검색 결과가 없습니다.' : '데이터가 없습니다.'}
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </Box>
      </Flex>

      {/* 의사 목록 Modal (기존 Drawer에서 변경) */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        finalFocusRef={btnRef}
        scrollBehavior={'inside'}
        size="full"
      >
        <ModalOverlay />
        <ModalContent maxW={`${mConstants.modalMaxWidth}px`} bg={sidebarBackgroundColor}>
          <ModalCloseButton />
          <ModalHeader borderBottomWidth="1px">
            {selectedStandardSpec} 의사리스트
          </ModalHeader>

          <ModalBody overflowY={isOpenDoctorDetailModal ? 'hidden' : 'auto'}>
            {isLoadingDoctors ? (
              <Text>의사 목록을 불러오는 중...</Text>
            ) : (
              <Table variant="simple" colorScheme="gray">
                <Thead>
                  <Tr>
                    <Th>프로필</Th>
                    <Th>의사ID</Th>
                    <Th>진료과</Th>
                    <Th>의사명</Th>
                    <Th>병원명</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {doctorList.length > 0 ? (
                    doctorList.map((doctor,index) => (
                      <Tr key={`${doctor.doctor_id}_${index+1}`} cursor="pointer" onClick={() => handleOpenDoctorDetailModal(doctor)}>
                        <Td>
                          <Image
                            src={(functions.isEmpty(doctor.profileimgurl) || errorImageUrls.includes(doctor.profileimgurl?.trim())) ? defaultImage : doctor.profileimgurl.trim()}
                            alt={doctor.doctorname}
                            boxSize="50px"
                            objectFit="cover"
                            borderRadius="full"
                            onError={() => handleImageError(doctor.profileimgurl?.trim())}
                          />
                        </Td>
                        <Td>{doctor.doctor_id}</Td>
                        <Td>{doctor.deptname}</Td>
                        <Td>{doctor.doctorname}</Td>
                        <Td>{doctor.shortName}</Td>
                      </Tr>
                    ))
                  ) : (
                    <Tr>
                      <Td colSpan={5} textAlign="center">
                        의사 데이터가 없습니다.
                      </Td>
                    </Tr>
                  )}
                </Tbody>
              </Table>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* DoctorDetail 모달 */}
      {isOpenDoctorDetailModal && (    
        <Modal
          onClose={() => setIsOpenDoctorDetailModal(false)}
          finalFocusRef={btnRef}
          isOpen={isOpenDoctorDetailModal}
          scrollBehavior={'inside'}
          trapFocus={false} 
          blockScrollOnMount={true}
          size={'full'}
        >
          <ModalOverlay />
          <ModalContent 
            maxW={`${mConstants.modalMaxWidth}px`} 
            bg={sidebarBackgroundColor}
            h="100vh"
            display="flex"
            flexDirection="column"
          >
            <ModalHeader borderBottomWidth="1px">{`${selectedDoctorData?.doctorname?.replace('의사', '')} 의사 상세정보`}</ModalHeader>
            <ModalCloseButton />
            <ModalBody 
              p={0} 
              flex="1" 
              overflow="hidden"
              display="flex"
              flexDirection="column"
            >
              <Box 
                flex="1" 
                overflowY="auto" 
                p={4}
                sx={{
                  '&::-webkit-scrollbar': { width: '8px' },
                  '&::-webkit-scrollbar-track': { background: 'transparent' },
                  '&::-webkit-scrollbar-thumb': { background: '#cbd5e0', borderRadius: '4px' },
                }}
              >
                <DoctorDetail
                  isOpen={isOpenDoctorDetailModal}
                  setCloseModal={() => setIsOpenDoctorDetailModal(false)}
                  doctorId={selectedDoctorData?.doctor_id || selectedDoctorData?.rid_long}
                  DoctorData={selectedDoctorData}
                  sourceName="MedicalField" 
                />
              </Box>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
}

export default MedicalField;
