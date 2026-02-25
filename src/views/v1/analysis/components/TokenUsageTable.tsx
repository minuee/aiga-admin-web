'use client';
import {
  Text,
  useColorModeValue,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@chakra-ui/react';
import Card from 'components/card/Card';

interface TokenUsageItem {
  date: string;
  total: string | number;
}

interface TokenUsageTableProps {
  usageData: TokenUsageItem[];
}

export default function TokenUsageTable({ usageData }: TokenUsageTableProps) {
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  // 다크모드에서는 가독성을 위해 숫자를 흰색으로 표시
  const dataValueColor = useColorModeValue('brand.500', 'white'); 

  return (
    <Card p="20px" overflowX="auto">
      <Text color={textColor} fontSize="xl" fontWeight="700" mb="20px">
        일자별 토큰 사용 내역
      </Text>
      <Table variant="simple" size="md">
        <Thead>
          <Tr>
            <Th>일자</Th>
            <Th isNumeric>사용 토큰량</Th>
          </Tr>
        </Thead>
        <Tbody>
          {usageData.length === 0 ? (
            <Tr>
              <Td colSpan={2} textAlign="center" py="40px">
                데이터가 없습니다.
              </Td>
            </Tr>
          ) : (
            usageData.map((item, index) => (
              <Tr key={index}>
                <Td fontWeight="bold" color={textColor}>
                  {item.date}
                </Td>
                <Td isNumeric fontWeight="bold" color={dataValueColor}>
                  {Number(item.total).toLocaleString()}
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>
    </Card>
  );
}
