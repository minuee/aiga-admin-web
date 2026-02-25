'use client';
import React, { PropsWithChildren, useState, useEffect } from 'react';

// chakra imports
import {
  Box,
  Flex,
  useColorModeValue,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td
} from '@chakra-ui/react';
import StandardMedicalField from './StandardMedicalField';
import MedicalField from './MedicalField';
import { getDataVersion } from 'services/common'; // getDataVersion 임포트

export interface CodeManageProps extends PropsWithChildren {
}

function CodeManage(props: CodeManageProps) {
  const { } = props;
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const skeletonColor = useColorModeValue('white', 'navy.700');
  const tabSelectColor = useColorModeValue('navy.700', 'white');
  const extraBgColor = useColorModeValue('gray.100', 'whiteAlpha.200') 

  const [selectedTabIndex, setSelectedTabIndex] = useState(0); // 탭 인덱스 상태 추가
  const [versionData, setVersionData] = useState<any[]>([]); // 버전 데이터를 저장할 상태 추가

  useEffect(() => {
    if (selectedTabIndex === 0) { // "버전관리" 탭이 선택되었을 때
      const fetchVersion = async () => {
        try {
          const response = await getDataVersion();
          console.log('버전관리 API 응답:', response);
          if (response && response.data) {
            setVersionData(response.data); // API 응답 데이터를 상태에 저장
          }
        } catch (error) {
          console.error('버전관리 API 호출 중 에러 발생:', error);
        }
      };
      fetchVersion();
    }
  }, [selectedTabIndex]);

  return (
    <Flex flexDirection="column" height="100vh"> 
      <Tabs variant='enclosed' width={'100%'} isLazy lazyBehavior='keepMounted' onChange={(index) => setSelectedTabIndex(index)}
        display="flex" flexDirection="column" flex="1" height="100%">
        <TabList
          overflowY="hidden"
          sx={{
            scrollbarWidth: 'none',
            '::-webkit-scrollbar': {
              display: 'none',
            },
          }}
          flexShrink={0} 
          pt={{ base: '130px', md: '80px', xl: '80px' }}
        >
          <Tab _selected={{ bg: tabSelectColor, color: skeletonColor }}>버전관리</Tab>
          <Tab _selected={{ bg: tabSelectColor, color: skeletonColor }}>표준진료분야</Tab>
          <Tab _selected={{ bg: tabSelectColor, color: skeletonColor }}>진료분야</Tab>
        </TabList>
        <Box flex="1" overflowY="auto" minH={0}>
          <TabPanels>
            <TabPanel padding={0}>
              <Flex flexDirection={'column'} pt={{ base: '20px', md: '20px' }}>
                <Box overflowX="auto">
                  <Table variant="simple" colorScheme="gray">
                    <Thead>
                      <Tr>
                        <Th fontWeight="bold" fontSize="sm">Data Ver ID</Th>
                        <Th fontWeight="bold" fontSize="sm">작업내용</Th>
                        <Th fontWeight="bold" fontSize="sm">수집시작일</Th>
                        <Th fontWeight="bold" fontSize="sm">수집종료일</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {versionData.length > 0 ? (
                        versionData.map((item) => (
                          <Tr key={item.data_version_id} _hover={{ bg: extraBgColor}}>
                            <Td py={3}>{item.data_version_id}</Td>
                            <Td py={3}>{item.title}</Td>
                            <Td py={3}>{new Date(item.collect_start).toLocaleDateString()}</Td>
                            <Td py={3}>{new Date(item.collect_end).toLocaleDateString()}</Td>
                          </Tr>
                        ))
                      ) : (
                        <Tr>
                          <Td colSpan={4} textAlign="center" py={3}>
                            데이터가 없습니다.
                          </Td>
                        </Tr>
                      )}
                    </Tbody>
                  </Table>
                </Box>
              </Flex>
            </TabPanel>
            <TabPanel padding={0}>
              <StandardMedicalField />
            </TabPanel>
            <TabPanel padding={0}>
              <MedicalField />
            </TabPanel>
          </TabPanels>
        </Box>
      </Tabs>
    </Flex>
  );
}

export default CodeManage;
