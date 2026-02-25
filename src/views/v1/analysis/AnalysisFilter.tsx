'use client';
import React, { useState } from 'react';
import {
  Flex,
  Input,
  Button,
  FormControl,
  FormLabel,
  useColorModeValue,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Icon,
} from '@chakra-ui/react';
import { MdOutlineEventAvailable, MdChevronLeft, MdChevronRight } from 'react-icons/md';
import Calendar from 'react-calendar';
import { format } from 'date-fns';
import 'styles/MiniCalendar.css'; // 프로젝트 표준 달력 스타일 적용

interface AnalysisFilterProps {
  showKeyword?: boolean;
  onSearch: (startDate: string, endDate: string, keyword?: string) => void;
}

const AnalysisFilter: React.FC<AnalysisFilterProps> = ({ showKeyword = true, onSearch }) => {
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const iconColor = useColorModeValue('secondaryGray.700', 'white'); // 라이트모드에선 어두운 회색, 다크모드에선 흰색
  const bg = useColorModeValue('white', 'navy.700');
  const modalBg = useColorModeValue('white', 'navy.800');
  const inputBg = useColorModeValue('secondaryGray.300', 'navy.900');
  
  // 버튼 컬러 (CodeManage 스타일)
  const btnBg = useColorModeValue('navy.700', 'white');
  const btnText = useColorModeValue('white', 'navy.700');

  const today = new Date();
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);

  const [startDate, setStartDate] = useState<Date>(lastWeek);
  const [endDate, setEndDate] = useState<Date>(today);
  const [keyword, setKeyword] = useState('');

  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);

  const handleSearch = () => {
    let finalStart = startDate;
    let finalEnd = endDate;

    // 시작일이 종료일보다 늦을 경우 두 값을 스왑
    if (finalStart > finalEnd) {
      finalStart = endDate;
      finalEnd = startDate;
      
      // UI 상태도 업데이트하여 사용자에게 보여줌
      setStartDate(finalStart);
      setEndDate(finalEnd);
    }

    const diffTime = Math.abs(finalEnd.getTime() - finalStart.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 93) {
      alert('최대 3개월까지만 조회가 가능합니다.');
      return;
    }

    onSearch(
      format(finalStart, 'yyyy-MM-dd'),
      format(finalEnd, 'yyyy-MM-dd'),
      keyword
    );
  };

  return (
    <Flex
      p="20px"
      bg={bg}
      borderRadius="15px"
      mb="20px"
      boxShadow="sm"
      alignItems="flex-end"
      flexWrap="wrap"
      gap="20px"
    >
      <FormControl w="auto">
        <FormLabel color={textColor} fontSize="sm" fontWeight="bold">시작일</FormLabel>
        <InputGroup onClick={() => setShowStartCalendar(true)} cursor="pointer">
          <InputLeftElement pointerEvents="none">
            <Icon as={MdOutlineEventAvailable} color={iconColor} w="20px" h="20px" />
          </InputLeftElement>
          <Input
            readOnly
            value={format(startDate, 'yyyy-MM-dd')}
            color={textColor}
            bg={inputBg}
            border="none"
            _focus={{ border: '1px solid', borderColor: 'brand.500' }}
          />
        </InputGroup>
      </FormControl>

      <FormControl w="auto">
        <FormLabel color={textColor} fontSize="sm" fontWeight="bold">종료일</FormLabel>
        <InputGroup onClick={() => setShowEndCalendar(true)} cursor="pointer">
          <InputLeftElement pointerEvents="none">
            <Icon as={MdOutlineEventAvailable} color={iconColor} w="20px" h="20px" />
          </InputLeftElement>
          <Input
            readOnly
            value={format(endDate, 'yyyy-MM-dd')}
            color={textColor}
            bg={inputBg}
            border="none"
            _focus={{ border: '1px solid', borderColor: 'brand.500' }}
          />
        </InputGroup>
      </FormControl>

      {showKeyword && (
        <FormControl w="300px">
          <FormLabel color={textColor} fontSize="sm" fontWeight="bold">키워드</FormLabel>
          <Input
            placeholder="검색어 입력..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            color={textColor}
            bg={inputBg}
            border="none"
          />
        </FormControl>
      )}

      <Button 
        bg={btnBg} 
        color={btnText} 
        _hover={{ opacity: 0.8 }} 
        _active={{ opacity: 0.9 }}
        onClick={handleSearch}
        px="30px"
        fontWeight="700"
      >
        검색
      </Button>

      {/* 시작일 달력 모달 */}
      <Modal isOpen={showStartCalendar} onClose={() => setShowStartCalendar(false)} isCentered>
        <ModalOverlay />
        <ModalContent bg={modalBg}>
          <ModalHeader color={textColor}>시작일 선택</ModalHeader>
          <ModalCloseButton color={textColor} />
          <ModalBody pb="30px">
            <Calendar
              locale="ko"
              onChange={(date: Date) => {
                setStartDate(date);
                setShowStartCalendar(false);
              }}
              value={startDate}
              maxDate={today}
              calendarType="US"
              prevLabel={<Icon as={MdChevronLeft} w="24px" h="24px" />}
              nextLabel={<Icon as={MdChevronRight} w="24px" h="24px" />}
            />
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* 종료일 달력 모달 */}
      <Modal isOpen={showEndCalendar} onClose={() => setShowEndCalendar(false)} isCentered>
        <ModalOverlay />
        <ModalContent bg={modalBg}>
          <ModalHeader color={textColor}>종료일 선택</ModalHeader>
          <ModalCloseButton color={textColor} />
          <ModalBody pb="30px">
            <Calendar
              locale="ko"
              onChange={(date: Date) => {
                setEndDate(date);
                setShowEndCalendar(false);
              }}
              value={endDate}
              maxDate={today}
              calendarType="US"
              prevLabel={<Icon as={MdChevronLeft} w="24px" h="24px" />}
              nextLabel={<Icon as={MdChevronRight} w="24px" h="24px" />}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default AnalysisFilter;
