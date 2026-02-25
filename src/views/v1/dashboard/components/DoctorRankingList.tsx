import { Box, Text, useColorModeValue, Table, Thead, Tbody, Tr, Th, Td, Flex, Icon, Button } from '@chakra-ui/react';
import Card from 'components/card/Card';
import { FaCrown } from 'react-icons/fa';
import { useState } from 'react';

interface DoctorRankingItem {
  did: number;
  name: string;
  hospitalName?: string;
  deptName?: string;
  count: string;
}

interface DoctorRankingListProps {
  rankingData: DoctorRankingItem[];
}

export default function DoctorRankingList({ rankingData }: DoctorRankingListProps) {
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const crownGold = '#FFD700';
  const crownSilver = '#C0C0C0';
  const crownBronze = '#CD7F32';

  const brandButtonColor = useColorModeValue('brand.500', 'white');

  const initialDisplayLimit = 10;
  const [displayLimit, setDisplayLimit] = useState(initialDisplayLimit);

  const handleShowMore = () => {
    setDisplayLimit(rankingData.length);
  };

  const handleShowLess = () => {
    setDisplayLimit(initialDisplayLimit);
  };

  return (
    <Card p="20px">
      <Flex align="center" mb="20px">
        <Text fontSize="xl" fontWeight="700" color={textColor} me="auto">
          의사 검색 랭킹
        </Text>
        {rankingData.length > initialDisplayLimit && ( // 데이터가 10개 초과일 때만 버튼 표시
          displayLimit === initialDisplayLimit ? (
            <Button onClick={handleShowMore} variant="link" colorScheme="brand" size="sm" color={brandButtonColor}>
              더보기
            </Button>
          ) : (
            <Button onClick={handleShowLess} variant="link" colorScheme="brand" size="sm" color={brandButtonColor}>
              간략히 보기
            </Button>
          )
        )}
      </Flex>
      <Table variant="simple" size="sm">
        <Thead>
          <Tr>
            <Th>순위</Th>
            <Th>병원명</Th>
            <Th>진료과목</Th>
            <Th>의사명</Th>
            <Th isNumeric>건수</Th>
          </Tr>
        </Thead>
        {
          rankingData.length == 0 
          ?
          <Tbody>
            <Tr>
              <Td colSpan={5}>
                <Text fontWeight="normal" color="secondaryGray.700">
                  데이터가 없습니다.
                </Text>
              </Td>
            </Tr>
          </Tbody>
          :
          <Tbody>
            {rankingData.slice(0, displayLimit).map((item, index) => (
              <Tr key={index}>
                <Td>
                  <Flex align="center">
                    {index + 1 === 1 && <Icon as={FaCrown} color={crownGold} w="18px" h="18px" me="8px" />}
                    {index + 1 === 2 && <Icon as={FaCrown} color={crownSilver} w="18px" h="18px" me="8px" />}
                    {index + 1 === 3 && <Icon as={FaCrown} color={crownBronze} w="18px" h="18px" me="8px" />}
                    {index + 1 > 3 && (
                      <Text fontWeight="normal" color="secondaryGray.700">
                        {index + 1}
                      </Text>
                    )}
                  </Flex>
                </Td>
                <Td>{item.hospitalName || '-'}</Td>
                <Td>{item.deptName || '-'}</Td>
                <Td>{item.name}</Td>
                <Td isNumeric>{parseInt(item.count).toLocaleString()}</Td>
              </Tr>
            ))}
          </Tbody>
          }
      </Table>
    </Card>
  );
}