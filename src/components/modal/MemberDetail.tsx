'use client';
import React, { PropsWithChildren, useEffect, useState } from 'react';

// chakra imports
import { Box, Flex, Button, Text, SkeletonCircle, SkeletonText, Input, FormControl, FormLabel, useColorModeValue, useToast } from '@chakra-ui/react';
import functions from 'utils/functions';
import CustomAlert from 'components/etc/CustomAlert';
import * as UserService from 'services/user/index';
import AdminUserStateStore from 'store/userStore'; // AdminUserStateStore 임포트
import useCheckAdmin from "store/useCheckAdmin";

export interface MemberDetailProps extends PropsWithChildren {
  isOpen : boolean;
  setClose : () => void;
  memberData: any;
  toast: any;
  onUpdate: (updatedData: any) => void;
}

function MemberDetail(props: MemberDetailProps) {
  const { isOpen, setClose, memberData, toast, onUpdate } = props;
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(memberData);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const { staff_id } = AdminUserStateStore(); // staff_id 가져오기
  const isAdmin = useCheckAdmin();
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const skeletonColor = useColorModeValue('white', 'navy.700');

  useEffect(() => {
    setUserData(memberData);
  }, [memberData]);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  }, [isOpen]);

  const handleOpenAlert = () => {
    setIsAlertOpen(true);
  };

  const handleCloseAlert = () => {
    setIsAlertOpen(false);
  };

  const handleConfirmReset = async () => {
    try {
      if (!staff_id) {
        functions.simpleToast(toast, '관리자 정보가 없습니다. 다시 로그인해주세요.', 'error');
        handleCloseAlert();
        return;
      }
      const res: any = await UserService.resetRestrictedTime(userData.user_id, staff_id); // staff_id 전달
      console.log("handleConfirmReset",res)
      if (res.data?.success) { // API 응답 형식에 따라 success 또는 state 확인
        functions.simpleToast(toast, '토큰 제한이 초기화되었습니다.', 'success');
        const updatedUserData = { ...userData, restricted_time: 0 };
        setUserData(updatedUserData);
        onUpdate(updatedUserData);
      } else {
        functions.simpleToast(toast, '제한 풀기에 실패했습니다. 관리자에게 문의하세요.', 'error');
      }
    } catch (e) {
      functions.simpleToast(toast, '제한 풀기 중 오류가 발생했습니다.', 'error');
      console.error(e);
    } finally {
      handleCloseAlert();
    }
  };

  if (isLoading || !userData) {
    return (
      <Box padding='6' boxShadow='lg' bg={skeletonColor}>
        <SkeletonCircle size='10' />
        <SkeletonText mt='4' noOfLines={8} spacing='4' skeletonHeight='2' />
      </Box>
    );
  }

  return (
    <>
      <Flex display={'flex'} flexDirection={{base : 'column', md : 'row'}} minHeight={'50px'} padding={{base : '0', md : '0 10px'}} mt={5}>
        <Box flex={1} mr={{base: 0, md: 2}}>
          <FormControl variant="floatingLabel">
            <FormLabel>회원 ID</FormLabel>
            <Input 
              type="text"
              value={userData.user_id || ''}
              isReadOnly
              color={textColor}
            />
          </FormControl>
        </Box>              
        <Box flex={1} mt={{base : '10px', md : '0'}}>
          <FormControl variant="floatingLabel">
            <FormLabel>닉네임</FormLabel>
            <Input 
              type="text" 
              value={userData.nickname || ''}
              isReadOnly
              color={textColor}
            />
          </FormControl>
        </Box>
      </Flex>
      <Flex display={'flex'} flexDirection={{base : 'column', md : 'row'}} minHeight={'50px'} padding={{base : '0', md : '0 10px'}} mt={5}>
        <Box flex={1} mr={{base: 0, md: 2}}>
          <FormControl variant="floatingLabel">
            <FormLabel>이메일</FormLabel>
            <Input 
              type="text"
              value={userData.email || ''}
              isReadOnly
              color={textColor}
            />
          </FormControl>
        </Box>              
        <Box flex={1} mt={{base : '10px', md : '0'}}>
            <FormControl variant="floatingLabel">
              <FormLabel>가입 경로</FormLabel>
              <Input 
                type="text"
                value={userData.sns_type || ''}
                isReadOnly
                color={textColor}
              />
            </FormControl>
        </Box>
      </Flex> 
      <Flex display={'flex'} flexDirection={{base : 'column', md : 'row'}} minHeight={'50px'} padding={{base : '0', md : '0 10px'}} mt={5}>
        <Box flex={1} mr={{base: 0, md: 2}}>
          <FormControl variant="floatingLabel">
            <FormLabel>가입일</FormLabel>
            <Input 
              type="text"
              value={userData.regist_date ? functions.castToDateString(new Date(userData.regist_date), 'yyyy-MM-dd HH:mm:ss') : ''}
              isReadOnly
              color={textColor}
            />
          </FormControl>
        </Box>              
        <Box flex={1} mt={{base : '10px', md : '0'}}>
          <FormControl variant="floatingLabel">
            <FormLabel>마지막 로그인</FormLabel>
            <Input 
              type="text" 
              value={userData.lastLoginAt ? functions.castToDateString(new Date(userData.lastLoginAt), 'yyyy-MM-dd HH:mm:ss') : ''}
              isReadOnly
              color={textColor}
            />
          </FormControl>
        </Box>
      </Flex> 
      <Flex display={'flex'} flexDirection={{base : 'column', md : 'row'}} minHeight={'50px'} padding={{base : '0', md : '0 10px'}} mt={5}>
        <Box flex={1} mr={{base: 0, md: 2}}>
          <FormControl variant="floatingLabel">
            <FormLabel>탈퇴일</FormLabel>
            <Input 
              type="text"
              value={userData.unregist_date ? functions.castToDateString(new Date(userData.unregist_date), 'yyyy-MM-dd HH:mm:ss') : '활동중'}
              isReadOnly
              color={textColor}
            />
          </FormControl>
        </Box>              
        <Box flex={1} mt={{base : '10px', md : '0'}}>
            <FormControl variant="floatingLabel">
              <FormLabel>최근 24시간 사용 토큰</FormLabel>
              <Input 
                type="text"
                value={functions.numberWithCommas(userData.total_token_usage) || '0'}
                isReadOnly
                color={textColor}
              />
            </FormControl>
        </Box>
      </Flex>

      {( userData.restricted_time > Date.now() && isAdmin ) && (
        <Flex display={'flex'} flexDirection={'row'} justifyContent={'center'}  width={'100%'} mt={10}>
          <Button 
            colorScheme='red' 
            variant='solid' 
            width={'200px'} 
            borderRadius={'10px'}
            onClick={handleOpenAlert}
          >
            제한 풀기
          </Button>
        </Flex>
      )}

      <Box height={'50px'} />

      {isAlertOpen && (
        <CustomAlert
          msg={`'${userData.nickname}' 사용자의 토큰 제한을 초기화 하시겠습니까?`}
          isOpen={isAlertOpen}
          fnConform={handleConfirmReset}
          fnCancel={handleCloseAlert}
        />
      )}
    </>
  );
}

export default MemberDetail;
