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
  Tag,
  Input,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { getStandardDeptSpec } from 'services/common';

interface StandardDeptSpecItem { // API 응답 데이터 타입 정의
  dept_spec_id: number;
  standard_dept: string;
  standard_spec: string[];
}

function StandardMedicalField() {
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const extrTrBgColor = useColorModeValue('gray.100', 'whiteAlpha.200') 
  const extraThreadBgColor = useColorModeValue('gray.50', 'whiteAlpha.100')
  const [originalData, setOriginalData] = useState<StandardDeptSpecItem[]>([]);
  const [filteredData, setFilteredData] = useState<StandardDeptSpecItem[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  
  useEffect(() => {
    const fetchStandardDeptSpec = async () => {
      try {
        const response = await getStandardDeptSpec();
        if (response && response.data) {
          setOriginalData(response.data);
          setFilteredData(response.data);
        }
      } catch (error) {
        console.error('표준진료분야 API 호출 중 에러 발생:', error);
      }
    };
    fetchStandardDeptSpec();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = event.target.value;
    setSearchKeyword(keyword);

    if (keyword === '') {
      setFilteredData(originalData);
    } else {
      const lowerKeyword = keyword.toLowerCase();
      const newFilteredData = originalData.filter(item => 
        item.standard_dept.toLowerCase().includes(lowerKeyword) ||
        item.standard_spec.some(spec => spec.toLowerCase().includes(lowerKeyword))
      );
      setFilteredData(newFilteredData);
    }
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

  return (
    <Box>
      <Flex flexDirection="column" pt={{ base: '20px', md: '20px' }}>
        <Flex justifyContent="space-between" mb="20px">
          <Text fontSize="2xl" fontWeight="bold" color={textColor}>
            표준 진료 분야
          </Text>
          <Box>
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
          </Box>
        </Flex>
        <Box overflowX="auto">
          <Table variant="simple" colorScheme="gray" >
            <Thead bg={extraThreadBgColor}>
              <Tr>
                <Th width="10%" fontWeight="bold" fontSize="sm">ID</Th>
                <Th width="15%" fontWeight="bold" fontSize="sm">표준진료과</Th>
                <Th width="75%" fontWeight="bold" fontSize="sm">진료분야</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <Tr key={item.dept_spec_id}  _hover={{ bg: extrTrBgColor}}>
                    <Td py={3}>{item.dept_spec_id}</Td>
                    <Td py={3}>{highlightText(item.standard_dept, searchKeyword)}</Td>
                    <Td py={3}>
                      <Flex wrap="wrap">
                        {item.standard_spec.map((spec, index) => (
                          <Tag key={index} size="md" m="2px" colorScheme="gray">
                            {highlightText(spec, searchKeyword)}
                          </Tag>
                        ))}
                      </Flex>
                    </Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan={3} textAlign="center">
                    {searchKeyword ? '검색 결과가 없습니다.' : '데이터가 없습니다.'}
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </Box>
      </Flex>
    </Box>
  );
}

export default StandardMedicalField;
