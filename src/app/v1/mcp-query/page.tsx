
'use client';

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Textarea,
  Text,
  Spinner,
  useToast,
  VStack,
  Card,
  CardBody,
  CardHeader,
  Flex,
  useColorModeValue,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { redirect } from 'next/navigation';
import AdminUserStateStore from 'store/userStore';

export default function MCPQueryPage() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const { is_master } = AdminUserStateStore();
  useEffect(() => {
    if (!is_master) {
      redirect('/v1/dashboard');
    }
  }, [is_master]);

  const handleSubmit = async () => {
    if (!query.trim()) {
      toast({
        title: '질문을 입력해주세요.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    setResult('');

    try {
      const response = await fetch('/api/mcp-query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error('서버에서 오류가 발생했습니다.');
      }

      const data = await response.json();
      setResult(data.result);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
      toast({
        title: '오류 발생',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const bgColor = useColorModeValue('gray.50', 'navy.900'); // 다크 모드 배경색 정의
  const cardBgColor = useColorModeValue('white', 'navy.900'); // Card 컴포넌트 배경색 (예상)

  if (isLoading && is_master) {
    return (
      <Box pt={{ base: '130px', md: '80px', xl: '80px' }} display="flex" justifyContent="center" alignItems="center" minH="50vh">
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }} bg={bgColor}>
      <VStack spacing={8} align="stretch">
        <Text>
          병원, 의사 정보 등 데이터베이스에 있는 정보를 자연어로 질문해보세요.
        </Text>

        <Card bg={cardBgColor}>
          <CardHeader>
            <Heading size='md'>질문 입력</Heading>
          </CardHeader>
          <CardBody>
            <FormControl>
              <FormLabel>질문 내용</FormLabel>
              <Textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="예: 서울시에 있는 내과 의사 목록을 보여주세요."
                size="md"
                minHeight="100px"
              />
            </FormControl>
            <Button
              mt={4}
              colorScheme="blue"
              onClick={handleSubmit}
              isLoading={isLoading}
              loadingText="조회 중..."
            >
              조회하기
            </Button>
          </CardBody>
        </Card>

        {isLoading && (
          <Box display="flex" justifyContent="center" my={8}>
            <Spinner size="xl" />
          </Box>
        )}

        {result && (
          <Card>
            <CardHeader>
              <Flex justifyContent="space-between" alignItems="center">
                <Heading size='md'>조회 결과</Heading>
                <Button
                  size="sm"
                  colorScheme="red"
                  variant="outline"
                  onClick={() => setResult('')}
                >
                  초기화
                </Button>
              </Flex>
            </CardHeader>
            <CardBody>
              <Text whiteSpace="pre-wrap">{result}</Text>
            </CardBody>
          </Card>
        )}
      </VStack>
    </Box>
  );
}
