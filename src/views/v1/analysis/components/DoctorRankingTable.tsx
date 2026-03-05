'use client';
import { Box,Text,useColorModeValue,Table,Thead,Tbody,Tr,Th,Td,Flex,Icon } from '@chakra-ui/react';
import Card from 'components/card/Card';
import { FaCrown } from 'react-icons/fa';

interface DoctorItem {
  info_did: number;
  info_name: string;
  info_hospital_name: string;
  info_deptname: string;
  info_hid: string;
  search_count: number;
}

interface DoctorRankingTableProps {
  rankingData: DoctorItem[];
  onDoctorClick: (doctor: any) => void;
}

export default function DoctorRankingTable({ rankingData, onDoctorClick }: DoctorRankingTableProps) {
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const brandColor = useColorModeValue('brand.500', 'brand.400');
  const crownGold = '#FFD700';
  const crownSilver = '#C0C0C0';
  const crownBronze = '#CD7F32';
  const hoverBg = useColorModeValue('gray.50', 'whiteAlpha.100');

  return (
    <Card p="20px" overflowX="auto">
      <Table variant="simple" size="md">
        <Thead>
          <Tr>
            <Th w="80px">순위</Th>
            <Th>병원명</Th>
            <Th>진료과목</Th>
            <Th>의사명</Th>
            <Th isNumeric>검색건수</Th>
          </Tr>
        </Thead>
        <Tbody>
          {rankingData.length === 0 ? (
            <Tr>
              <Td colSpan={5} textAlign="center" py="40px">
                데이터가 없습니다.
              </Td>
            </Tr>
          ) : (
            rankingData.map((item, index) => (
              <Tr
                key={`${item.info_did}_${index}`}
                cursor="pointer"
                _hover={{ bg: hoverBg }}
                onClick={() => onDoctorClick({
                  doctor_id: item.info_did,
                  doctorname: item.info_name,
                  shortName: item.info_hospital_name,
                  deptname: item.info_deptname,
                  hid: item.info_hid
                })}
              >
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
                <Td color={textColor}>{item.info_hospital_name || '-'}</Td>
                <Td color={textColor}>{item.info_deptname || '-'}</Td>
                <Td fontWeight="bold" color={textColor}>{item.info_name}</Td>
                <Td isNumeric fontWeight="bold" color={brandColor}>
                  {item.search_count.toLocaleString()}
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>
    </Card>
  );
}
