"use client";
import React from 'react';
import { Modal,ModalOverlay,ModalContent,ModalHeader,ModalFooter,ModalBody,ModalCloseButton,Button,Text,VStack,HStack,Box,Spinner,Alert,AlertIcon,Flex,useColorModeValue,useToast } from '@chakra-ui/react';
import mConstants from 'utils/constants';
import functions from 'utils/functions';
import useCheckAdmin from "store/useCheckAdmin"; // Added useCheckAdmin
import { removeMessageData } from 'services/common/index'; // Added removeMessageData
import CustomAlert from 'components/etc/CustomAlert'; // Added CustomAlert

// 대화 메시지 타입 정의
interface ConversationDetailMessage {
  type: 'user' | 'assistant';
  message: string;
  chat_type?: string;
  answer?: string;
}

// conversation prop의 상세 타입
interface ConversationMessage {
  nickname: string;
  session_id: string;
  usedTokenSum: number;
  chatCount: number;
  lastUsedAt: string;
}

interface ConversationDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversation: ConversationMessage | null;
  // --- Lifted state props ---
  messageDetail: ConversationDetailMessage[] | null;
  isLoading: boolean;
  error: string | null;
  onDeleteSuccess?: () => void; // Added onDeleteSuccess prop
}

const AnswerDetails = ({ chat_type, answer }: { chat_type?: string; answer?: string }) => {
  const extraInfoOuterBg  = useColorModeValue('gray.300', 'navy.700');
  
  const extraInfoTextColor = useColorModeValue('gray.900', '#fff');
  
  if (!answer || !chat_type) {
    return null;
  }

  let parsedAnswer;
  try {
    parsedAnswer = JSON.parse(answer);
  } catch (e) {
    console.error("Failed to parse answer JSON:", e);
    return (
      <Box mt={3} p={2} bg={extraInfoOuterBg} borderRadius="md">
        <Text fontSize="xs" color="red.500">
          (추가 정보 파싱 오류)
        </Text>
      </Box>
    );
  }

  if (chat_type === 'recommand_hospital' && parsedAnswer?.hospitals?.length > 0) {
    return (
      <Box mt={3} p={3} bg={extraInfoOuterBg} borderRadius="lg">
        <Text fontSize="sm" fontWeight="bold" color={extraInfoTextColor} mb={2}>
          추천 병원
        </Text>
        <VStack align="stretch" spacing={1}>
          {parsedAnswer.hospitals.map((hospital: any, index: number) => (
            <Text key={index} fontSize="sm" color={extraInfoTextColor}>
              - {hospital.name}
            </Text>
          ))}
        </VStack>
      </Box>
    );
  }

  if ((chat_type === 'recommand_doctor' || chat_type === 'search_doctor') && parsedAnswer?.doctors?.length > 0) {
    return (
      <Box mt={3} p={3} bg={extraInfoOuterBg} borderRadius="lg">
        <Text fontSize="sm" fontWeight="bold" color={extraInfoTextColor} mb={2}>
          추천/검색 의사
        </Text>
        <VStack align="stretch" spacing={1}>
          {parsedAnswer.doctors.map((doctor: any, index: number) => (
            <Text key={index} fontSize="sm" color={extraInfoTextColor}>
              - [{doctor.hospital}] {doctor.deptname} 소속 {doctor.name} 의사
            </Text>
          ))}
        </VStack>
      </Box>
    );
  }

  return null;
};

export default function ConversationDetailModal(props: ConversationDetailModalProps) {
  const { isOpen, onClose, conversation, messageDetail, isLoading, error, onDeleteSuccess } = props;
  const sidebarBackgroundColor = useColorModeValue('white', 'navy.800');
  const extraUsercolor =  useColorModeValue('navy.400', 'gray.700')
  const extraAIColor =  useColorModeValue('gray.600', 'navy.600')
  const isAdmin = useCheckAdmin(); // Use useCheckAdmin hook
  const toast = useToast(); // Use useToast hook

  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false); // State to control CustomAlert visibility

  const confirmAndDelete = async () => {
    setIsConfirmOpen(false); // Close the confirmation dialog first

    if (!conversation?.session_id) {
      toast({
        title: "오류",
        description: "세션 ID를 찾을 수 없습니다.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      const response = await removeMessageData({ session_id: conversation.session_id });
      if (response) { // Assuming any non-null response indicates success
        toast({
          title: "삭제 성공",
          description: "대화 내용이 성공적으로 삭제되었습니다.",
          status: "success",
          duration: 3000,
          position: 'top-right',
          isClosable: true,
        });
        onDeleteSuccess?.(); // Notify parent of successful deletion
        onClose(); // Close main modal
      } else {
        // If response is null/undefined, it might indicate an error or an issue from the service.
        throw new Error("API 응답이 비어있습니다. 삭제에 실패했을 수 있습니다.");
      }
    } catch (err: any) {
      toast({
        title: "삭제 오류",
        description: err.message || "대화 내용 삭제 중 오류가 발생했습니다.",
        status: "error",
        position: 'top-right',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const cancelDelete = () => {
    setIsConfirmOpen(false); // Just close the confirmation dialog
  };

  const triggerDeleteConfirmation = () => {
    setIsConfirmOpen(true); // Open the confirmation dialog
  };


  return (
    <>
      <CustomAlert
        msg="이 대화내용을 정말로 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
        isOpen={isConfirmOpen}
        fnConform={confirmAndDelete}
        fnCancel={cancelDelete}
      />
      <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent maxW={`${mConstants.modalMaxWidth}px`} bg={sidebarBackgroundColor} height={'90%'} display="flex" flexDirection="column">
        <ModalHeader>대화 상세 보기</ModalHeader>
        <ModalCloseButton />
        <ModalBody display="flex" flexDirection="column" flex="1" minH={0}>
          {/* 정보 표시 영역 */}
          <VStack align="flex-start" spacing={4} flexShrink={0} mb={4}>
            <HStack>
              <Text fontWeight="bold">사용자:</Text>
              <Text>{conversation?.nickname}</Text>
            </HStack>
            <HStack>
              <Text fontWeight="bold">Session ID:</Text>
              <Text>{conversation?.session_id}</Text>
            </HStack>
            <HStack>
              <Text fontWeight="bold">전체 사용 토큰 수:</Text>
              <Text>{functions.numberWithCommas(conversation?.usedTokenSum)}</Text>
            </HStack>
            <HStack>
              <Text fontWeight="bold">대화 수:</Text>
              <Text>{conversation?.chatCount}</Text>
            </HStack>
            <HStack>
              <Text fontWeight="bold">마지막 사용 일자:</Text>
              <Text>{conversation?.lastUsedAt ? functions.castToDateString(new Date(conversation.lastUsedAt), 'yyyy-MM-dd HH:mm:ss') : "-"}</Text>
            </HStack>
            <HStack>
              <Text fontWeight="bold">대화 내용</Text>
            </HStack>
          </VStack>

          {/* 대화 내용 영역 */}
          <Box w="100%" flex="1" borderWidth="1px" borderRadius="lg" p={4} overflowY="auto" minH={0} >
            {isLoading ? (
              <Flex justify="center" align="center" height="100%">
                <Spinner size="xl" />
              </Flex>
            ) : error ? (
              <Alert status="error">
                <AlertIcon />
                {error}
              </Alert>
            ) : messageDetail && messageDetail.length > 0 ? (
              <VStack spacing={2} align="stretch">
                {messageDetail.map((msg, index) => (
                  <Box
                    key={index}
                    p={3}
                    borderRadius="lg"
                    alignSelf={msg.type === 'user' ? 'flex-start' : 'flex-end'}
                    bg={msg.type === 'user' ? extraUsercolor : extraAIColor}
                    maxWidth="80%"
                  >
                    <Text
                      whiteSpace="pre-wrap"
                      color={'white'}
                    >
                      {msg.message}
                    </Text>
                    {msg.type === 'assistant' && (
                        <AnswerDetails chat_type={msg.chat_type} answer={msg.answer} />
                    )}
                  </Box>
                ))}
              </VStack>
            ) : (
              <Text>대화 내용이 없습니다.</Text>
            )}
          </Box>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            닫기
          </Button>
          {isAdmin && (
            <Button colorScheme="red" onClick={triggerDeleteConfirmation}>
              삭제
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
    </>
  );
}