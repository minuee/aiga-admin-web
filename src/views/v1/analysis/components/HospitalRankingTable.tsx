'use client';
import { Text,useColorModeValue,Table,Thead,Tbody,Tr,Th,Td,Flex,Icon } from '@chakra-ui/react';
import Card from 'components/card/Card';
import { FaCrown } from 'react-icons/fa';

interface HospitalRankingItem {
  hid: string;
  name: string;
  count: string | number;
}

interface HospitalRankingTableProps {
  rankingData: HospitalRankingItem[];
}

export default function HospitalRankingTable({ rankingData }: HospitalRankingTableProps) {
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const brandColor = useColorModeValue('brand.500', 'brand.400');
  const crownGold = '#FFD700';
  const crownSilver = '#C0C0C0';
  const crownBronze = '#CD7F32';

  return (
    <Card p="20px" overflowX="auto">
      <Table variant="simple" size="md">
        <Thead>
          <Tr>
            <Th w="80px">순위</Th>
            <Th>병원명</Th>
            <Th isNumeric>검색건수</Th>
          </Tr>
        </Thead>
        <Tbody>
          {rankingData.length === 0 ? (
            <Tr>
              <Td colSpan={3} textAlign="center" py="40px">
                데이터가 없습니다.
              </Td>
            </Tr>
          ) : (
            rankingData.map((item, index) => (
              <Tr key={`${item.hid}_${index}`}>
                <Td>
                  <Flex align="center">
                    {index + 1 === 1 && <Icon as={FaCrown} color={crownGold} w="18px" h="18px" me="8px" />}
                    {index + 1 === 2 && <Icon as={FaCrown} color={crownSilver} w="18px" h="18px" me="8px" />}
                    {index + 1 === 3 && <Icon as={FaCrown} color={crownBronze} w="18px" h="18px" me="8px" />}
                    {index + 1 > 3 && (
                      <Text fontWeight="bold" color={textColor} ms="4px">
                        {index + 1}
                      </Text>
                    )}
                  </Flex>
                </Td>
                <Td fontWeight="bold" color={textColor}>{item.name || '-'}</Td>
                <Td isNumeric fontWeight="bold" color={brandColor}>
                  {Number(item.count).toLocaleString()}
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>
    </Card>
  );
}
