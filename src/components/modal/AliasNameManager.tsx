import React, { useState, useEffect } from 'react';
import { Box, Flex, Button, Input, useToast, FormControl, FormLabel, IconButton } from '@chakra-ui/react';
import { AddIcon, EditIcon, DeleteIcon, CheckIcon, CloseIcon } from '@chakra-ui/icons';
import functions from 'utils/functions';
import * as HospitalService from "services/hospital"; // HospitalService 임포트
import CustomAlert from 'components/etc/CustomAlert'; // CustomAlert 임포트

interface Alias {
  aid: string; // 신규 등록 시 aid를 받아오므로 string으로 변경
  name: string;
}

interface AliasNameManagerProps {
  hospitalId: string;
  isAdmin: boolean;
  textColor: string;
  borderColor: string;
}

const AliasNameManager: React.FC<AliasNameManagerProps> = ({ hospitalId, isAdmin, textColor, borderColor }) => {
  const toast = useToast();
  const [aliases, setAliases] = useState<Alias[]>([]);
  const [newAliasName, setNewAliasName] = useState<string>('');
  const [editingAliasId, setEditingAliasId] = useState<string | null>(null);
  const [editingAliasName, setEditingAliasName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isShowDeleteConfirm, setIsShowDeleteConfirm] = useState<boolean>(false); // 삭제 Confirm 모달 표시 여부
  const [deleteTargetAid, setDeleteTargetAid] = useState<string | null>(null); // 삭제 대상 aid

  useEffect(() => {
    if (hospitalId) {
      fetchAliases();
    }
  }, [hospitalId]);

  const fetchAliases = async () => {
    setIsLoading(true);
    try {
      const response: any = await HospitalService.getHospitalAliasList({ hid: hospitalId });
      console.log("response :", response)
      if (response && Array.isArray(response.data)) {
        const fetchedAliases: Alias[] = response.data.map((item: any) => ({
          aid: item.aid,
          name: item.alias_name,
        }));
        setAliases(fetchedAliases);
      } else {
        setAliases([]); // 데이터가 없거나 형식이 다르면 빈 배열로 초기화
      }
    } catch (error) {
      console.error('Failed to fetch aliases:', error);
      functions.simpleToast(toast, '별칭 정보를 가져오는데 실패했습니다.', 'error');
      setAliases([]); // 에러 발생 시 빈 배열로 초기화
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAlias = async () => {
    if (!newAliasName.trim()) {
      functions.simpleToast(toast, '새로운 별칭을 입력해주세요.', 'warning');
      return;
    }
    setIsLoading(true);
    try {
      const res: any = await HospitalService.postHospitalAlias({
        hid: hospitalId,
        alias_name: newAliasName,
      });

      if (res  && res.data && res.data.aid) {
        setAliases([...aliases, { aid: res.data.aid, name: newAliasName }]);
        functions.simpleToast(toast, '별칭이 등록되었습니다.');
        setNewAliasName('');
      } else {
        functions.simpleToast(toast, `별칭 등록에 실패했습니다: ${res?.message || '알 수 없는 오류'}`, 'error');
      }
    } catch (error) {
      console.error('Failed to add alias:', error);
      functions.simpleToast(toast, '별칭 등록에 실패했습니다.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateAlias = async (aid: string) => {
    if (!editingAliasName.trim()) {
      functions.simpleToast(toast, '별칭을 입력해주세요.', 'warning');
      return;
    }
    setIsLoading(true);
    try {
      const res: any = await HospitalService.putHospitalAlias({
        aid: aid,
        alias_name: editingAliasName,
      });

      if (res && res.success) {
        setAliases(aliases.map(alias => alias.aid === aid ? { ...alias, name: editingAliasName } : alias));
        functions.simpleToast(toast, '별칭이 수정되었습니다.');
        setEditingAliasId(null);
        setEditingAliasName('');
      } else {
        functions.simpleToast(toast, `별칭 수정에 실패했습니다: ${res?.message || '알 수 없는 오류'}`, 'error');
      }
    } catch (error) {
      console.error('Failed to update alias:', error);
      functions.simpleToast(toast, '별칭 수정에 실패했습니다.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // 실제 삭제 로직 (Confirm 후 호출)
  const confirmDeleteAlias = async () => {
    if (!deleteTargetAid) return;

    if (aliases.length <= 1) {
      functions.simpleToast(toast, '최소 1개의 별칭은 존재해야 합니다.', 'warning');
      setIsShowDeleteConfirm(false);
      setDeleteTargetAid(null);
      return;
    }

    setIsLoading(true);
    try {
      const res: any = await HospitalService.deleteHospitalAlias({ aid: deleteTargetAid });

      if (res && res.success) {
        setAliases(aliases.filter(alias => alias.aid !== deleteTargetAid));
        functions.simpleToast(toast, '별칭이 삭제되었습니다.');
      } else {
        functions.simpleToast(toast, `별칭 삭제에 실패했습니다: ${res?.message || '알 수 없는 오류'}`, 'error');
      }
    } catch (error) {
      console.error('Failed to delete alias:', error);
      functions.simpleToast(toast, '별칭 삭제에 실패했습니다.', 'error');
    } finally {
      setIsLoading(false);
      setIsShowDeleteConfirm(false);
      setDeleteTargetAid(null);
    }
  };

  // 삭제 버튼 클릭 시 Confirm 모달을 띄우기 위한 핸들러
  const handleDeleteButtonClick = (aid: string) => {
    if (aliases.length <= 1) {
      functions.simpleToast(toast, '최소 1개의 별칭은 존재해야 합니다.', 'warning');
      return;
    }
    setDeleteTargetAid(aid);
    setIsShowDeleteConfirm(true);
  };

  return (
    <Box mt={5} width={'100%'} border={'1px solid'} borderColor={borderColor} p={4} borderRadius={'md'}>
      <FormLabel fontSize={'md'} fontWeight={'bold'} mb={3}>병원별칭 관리</FormLabel>
      
      {aliases.map(alias => (
        <Flex key={alias.aid} mb={3} alignItems="center">
          {editingAliasId === alias.aid ? (
            <>
              <Input
                value={editingAliasName}
                onChange={(e) => setEditingAliasName(e.target.value)}
                placeholder="별칭명"
                borderColor={borderColor}
                color={textColor}
                isDisabled={!isAdmin || isLoading}
                mr={2}
              />
              <IconButton
                aria-label="Save alias"
                icon={<CheckIcon />}
                onClick={() => handleUpdateAlias(alias.aid)}
                isDisabled={!isAdmin || isLoading}
                colorScheme="green"
                mr={1}
              />
              <IconButton
                aria-label="Cancel edit"
                icon={<CloseIcon />}
                onClick={() => {
                  setEditingAliasId(null);
                  setEditingAliasName('');
                }}
                isDisabled={!isAdmin || isLoading}
                colorScheme="gray"
              />
            </>
          ) : (
            <>
              <Input
                value={alias.name}
                readOnly
                borderColor={borderColor}
                color={textColor}
                variant="filled"
                _focus={{ borderColor: borderColor }}
                mr={2}
              />
              {isAdmin && (
                <>
                  <IconButton
                    aria-label="Edit alias"
                    icon={<EditIcon />}
                    onClick={() => {
                      setEditingAliasId(alias.aid);
                      setEditingAliasName(alias.name);
                    }}
                    isDisabled={isLoading}
                    colorScheme="blue"
                    mr={1}
                  />
                  <IconButton
                    aria-label="Delete alias"
                    icon={<DeleteIcon />}
                    onClick={() => handleDeleteButtonClick(alias.aid)}
                    isDisabled={isLoading || aliases.length <= 1}
                    colorScheme="red"
                  />
                </>
              )}
            </>
          )}
        </Flex>
      ))}

      {isAdmin && (
        <Flex mt={4} alignItems="center">
          <Input
            value={newAliasName}
            onChange={(e) => setNewAliasName(e.target.value)}
            placeholder="새로운 별칭명 입력"
            borderColor={borderColor}
            color={textColor}
            isDisabled={isLoading}
            mr={2}
          />
          <Button
            onClick={handleAddAlias}
            isDisabled={isLoading || !newAliasName.trim()}
            colorScheme="teal"
            leftIcon={<AddIcon />}
          >
            등록
          </Button>
        </Flex>
      )}

      {isShowDeleteConfirm && (
        <CustomAlert
          msg={`'${aliases.find(a => a.aid === deleteTargetAid)?.name}' 별칭을 정말 삭제하시겠습니까?`}
          isOpen={isShowDeleteConfirm}
          fnConform={confirmDeleteAlias}
          fnCancel={() => {
            setIsShowDeleteConfirm(false);
            setDeleteTargetAid(null);
          }}
        />
      )}
    </Box>
  );
};

export default AliasNameManager;
