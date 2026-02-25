"use client";
import {
  Flex,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Box,
  useColorModeValue,
  Select, Input, Button,
  useToast,
} from '@chakra-ui/react';
import React, { useMemo, useState, useRef, useEffect } from 'react';
import Card from 'components/card/Card';
import { IoCaretUp, IoCaretDown } from "react-icons/io5";
import functions from "utils/functions";
import ConversationDetailModal from './ConversationDetailModal';
import { getMessageDetail } from 'services/common'; // getMessageDetail 임포트

interface ConversationTableProps {
  columns: any[];
  data: any[];
  order: string;
  orderName: string;
  getDataSortChange: (str: string) => void;
  keyword: string;
  handleSearch: (keyword: string) => void;
  handleFilterChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  searchType: '' | 'nickname' | 'session_id' | 'question'; // searchType prop 추가
  isSearchResult : boolean,
  handleSearchReset: () => void;
}

export default function ConversationTable(props: ConversationTableProps) {
  const { columns, data, order, orderName, getDataSortChange, keyword, handleSearch, handleFilterChange, searchType,isSearchResult ,handleSearchReset} = props;

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const tdColorOdd = useColorModeValue('white', 'gray.700');
  const tdColorEven = useColorModeValue('#f4f7fe', 'navy.700');
  const orderTextColor = useColorModeValue('black', 'white');
  const searchButtonTextColor = useColorModeValue('white', 'white'); // 검색 버튼 텍스트 색상
  const resetButtonTextColor = useColorModeValue('gray.700', 'white'); // 초기화 버튼 텍스트 색상
  const inputPlaceHolderColor = useColorModeValue('gray.500', 'gray.400')
  const toast = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [searchTerm, setSearchTerm] = useState(keyword);
  const keywordInputRef = useRef<HTMLInputElement>(null);

  // --- BEGIN: Lifted state from Modal ---
  const [messageDetail, setMessageDetail] = useState(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState(null);
  const [lastFetchedSessionId, setLastFetchedSessionId] = useState<string | null>(null);
  // --- END: Lifted state from Modal ---

  useEffect(() => {
    setSearchTerm(keyword);
  }, [keyword]);

  // --- BEGIN: Data fetching logic ---
  useEffect(() => {
    const fetchMessageDetail = async () => {
      if (selectedConversation && selectedConversation.session_id !== lastFetchedSessionId) {
        setIsDetailLoading(true);
        setDetailError(null);
        try {
          const sessionId = selectedConversation.session_id;
          const response = await getMessageDetail({ session_id: sessionId });

          if (response && response.data) {
            const formattedMessages: any[] = [];
            response.data.forEach((item: any) => {
              if (item.question) {
                formattedMessages.push({ type: 'user', message: item.question });
              }
              if (item.summary) {
                formattedMessages.push({
                  type: 'assistant',
                  message: item.summary,
                  chat_type: item.chat_type,
                  answer: item.answer,
                });
              }
            });
            setMessageDetail(formattedMessages);
            setLastFetchedSessionId(sessionId); // Remember the last successfully fetched ID
          } else {
            const errorMsg = '대화 상세 정보를 불러오는데 실패했습니다.';
            setDetailError(errorMsg);
            setLastFetchedSessionId(null); // Clear cache on failure
            toast({ title: "오류", description: errorMsg, status: "error", duration: 5000, isClosable: true });
          }
        } catch (err: any) {
          const errorMsg = err.message || '알 수 없는 오류가 발생했습니다.';
          setDetailError(err);
          setLastFetchedSessionId(null); // Clear cache on failure
          toast({ title: "오류", description: errorMsg, status: "error", duration: 5000, isClosable: true });
        } finally {
          setIsDetailLoading(false);
        }
      }
    };

    if (isModalOpen) {
      fetchMessageDetail();
    }
  }, [isModalOpen, selectedConversation, lastFetchedSessionId, toast]);
  // --- END: Data fetching logic ---

  const handleRowClick = (rowData: any) => {
    setSelectedConversation(rowData);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Note: We don't clear selectedConversation or cached data here
    // to allow for fast re-opening of the same item.
  };

  return (
    <Card
      flexDirection="column"
      w="100%"
      px="0px"
      overflowX={{ sm: 'scroll', lg: 'hidden' }}
    >
      <Flex px="25px" justify="space-between" mb="20px" align="center" wrap="wrap">
        <Text
          color={textColor}
          fontSize="22px"
          fontWeight="700"
          lineHeight="100%"
          mr="auto"
        >
          대화 목록
        </Text>
        <Select
          width={{ base: '100%', md: '150px' }}
          mr="10px"
          mb={{ base: '10px', md: '0' }}
          onChange={handleFilterChange}
          value={searchType} // searchType prop과 연결
        >
          <option value="nickname">사용자</option>
          <option value="session_id">세션ID</option>
          <option value="question">질문</option>
        </Select>
        <Input
          ref={keywordInputRef}
          placeholder="검색어를 입력하세요."
          width={{ base: '100%', md: '200px' }}
          mr="10px"
          mb={{ base: '10px', md: '0' }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          color={textColor} // 입력 문자색 추가
          _placeholder={{ color: useColorModeValue('gray.500', 'gray.400') }} // 플레이스홀더 색상 추가
          onKeyPress={(e) => {
            if (e.key === 'Enter' && keywordInputRef.current && searchTerm.length > 0) { // 검색어 길이가 0보다 클 때만 엔터키 동작
              handleSearch(searchTerm);
            }
          }}
        />
        <Button
          onClick={() => handleSearch(searchTerm)}
          colorScheme="brand"
          minW="100px"
          color={searchButtonTextColor} // 변수 적용
          isDisabled={searchTerm.length === 0} // 검색어 길이가 0일 때 버튼 비활성화
        >
          검색
        </Button>
        <Box ml={2} display={ (isSearchResult && !functions.isEmpty(keyword) ) ? 'block' : 'none'}>
          <Button
            onClick={() => handleSearchReset()}
            colorScheme="blackAlpha"
            minW="100px"
            color={resetButtonTextColor} // 변수 적용
            isDisabled={searchTerm.length === 0} // 검색어 길이가 0일 때 버튼 비활성화
          >
            초기화
          </Button>
        </Box>
        
      </Flex>
      <Table variant="simple" color="gray.500" mb="24px">
        <Thead>
          <Tr>
            {columns.map((column: any, index: number) => (
              <Th
                pe="10px"
                key={index}
                borderColor={borderColor}
                cursor={column.accessor ? "pointer" : "default"}
                onClick={() => column.accessor && getDataSortChange(column.accessor)}
              >
                <Flex
                  justify="space-between"
                  align="center"
                  fontSize={{ sm: '10px', lg: '12px' }}
                  color={column.accessor === orderName ? orderTextColor : 'gray.400'}
                >
                  {typeof column.Header === 'function' ? column.Header() : column.Header}
                  {column.accessor === orderName && (
                    order === 'ASC' ?
                      <IoCaretUp width={16} height={16} />
                      :
                      <IoCaretDown width={16} height={16} />
                  )}
                </Flex>
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {data.length === 0 ? (
            <Tr>
              <Td colSpan={columns.length} textAlign="center" fontSize="sm" fontWeight="700" color={textColor}>
                데이터가 없습니다.
              </Td>
            </Tr>
          ) : (
            data.map((row: any, rowIndex: number) => (
              <Tr key={rowIndex} onClick={() => handleRowClick(row)} cursor="pointer" backgroundColor={rowIndex % 2 === 0 ? tdColorEven + ' !important' : tdColorOdd + ' !important'}>
                {columns.map((column: any, colIndex: number) => (
                  <Td
                    key={colIndex}
                    fontSize={{ sm: '14px' }}
                    borderColor="transparent"
                  >
                    <Text color={textColor} fontSize="sm" fontWeight="700">
                      {column.renderCell ? column.renderCell(row) : (column.accessor ? row[column.accessor] : '')}
                    </Text>
                  </Td>
                ))}
              </Tr>
            ))
          )}
        </Tbody>
      </Table>

      {selectedConversation && (
        <ConversationDetailModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          conversation={selectedConversation}
          messageDetail={messageDetail}
          isLoading={isDetailLoading}
          error={detailError}
          onDeleteSuccess={handleSearchReset} // Pass onDeleteSuccess prop
        />
      )}
    </Card>
  );
}