'use client';
import { Box, Flex, FormControl, FormLabel, Input, useColorModeValue, Text, Stack, SkeletonText, SkeletonCircle, Button, ButtonGroup } from '@chakra-ui/react';
import functions from 'utils/functions';
import * as DoctorService from "services/doctor/index"; // DoctorService import
import useCheckAdmin from "store/useCheckAdmin"; // useCheckAdmin 임포트
import * as React from 'react';

export interface DoctorEvaluationManagerProps {
  doctorId: string;
  textColor: string;
  borderColor: string;
}

function DoctorEvaluationManager(props: DoctorEvaluationManagerProps) {
  const { doctorId, textColor, borderColor } = props;
  const isAdmin = useCheckAdmin(); // isAdmin 추가
  const [doctorEvaluation, setDoctorEvaluation] = React.useState<any>(null);
  const [evaluationData, setEvaluationData] = React.useState<any>({});
  const [editableEvaluationData, setEditableEvaluationData] = React.useState<any>({}); // editable 상태 추가
  const [isLoading, setIsLoading] = React.useState(true); 
  
  const getDoctorEvaluation = React.useCallback(
    async() => {
      if ( !functions.isEmpty(doctorId) ) {
        setIsLoading(true); // 로딩 시작
        try{
          const res:any = await DoctorService.getDoctorEvaluationList({
            doctorId: doctorId
          });
          console.log('의사평가정보현황 API 결과:', res?.data); // 콘솔로 결과 출력
          setDoctorEvaluation(res?.data);

          // 여기서 데이터 가공 및 evaluationData 설정
          if (res?.data && Array.isArray(res.data)) {
            const processedData: any = {};
            res.data.forEach((evaluation: any) => {
              const spec = evaluation.standardSpec || '값없음'; // standardSpec이 없을 경우 '기타'로 분류
              if (!processedData[spec]) {
                processedData[spec] = [];
              }
              processedData[spec].push(evaluation);
            });
            setEvaluationData(processedData);
            // evaluationData가 설정될 때 editableEvaluationData도 함께 초기화
            const initialEditableData: any = {};
            for (const spec in processedData) {
              initialEditableData[spec] = [{ ...processedData[spec][0] }]; // 깊은 복사
            }
            setEditableEvaluationData(initialEditableData);
          } else {
            setEvaluationData({});
            setEditableEvaluationData({});
          }

        }catch(e){
          console.error("Error fetching doctor evaluation:", e);
          setDoctorEvaluation(null);
          setEvaluationData({}); // 에러 발생 시 초기화
          setEditableEvaluationData({}); // 에러 발생 시 초기화
        } finally {
          setIsLoading(false); // 로딩 종료
        }
      } else {
        setIsLoading(false); // doctorId 없으면 로딩 종료
      }
    },[doctorId]
  );

  React.useEffect(() => {
    getDoctorEvaluation();
  }, [getDoctorEvaluation]);

  const getScoreDisplay = (score: any) => {
    if (score === null || score === undefined || score === '') {
      return 0;
    }
    if (typeof score === 'string' && !isNaN(parseFloat(score))) {
      return parseFloat(score).toFixed(5);
    }
    if (typeof score === 'number') {
      if ( score == 0 ) return score.toFixed(0);
      else return score.toFixed(5);
    }
    return 'N/A'; // 예상치 못한 타입일 경우
  };

  const handleInputChange = (spec: string, field: string, value: string) => {
    setEditableEvaluationData((prevData: any) => {
      const newData = { ...prevData };
      if (newData[spec] && newData[spec][0]) {
        const parsedValue = value === 'N/A' || value === '' ? null : parseFloat(value);
        newData[spec][0] = {
          ...newData[spec][0],
          [field]: isNaN(parsedValue as number) ? value : parsedValue, // 숫자로 변환할 수 없으면 문자열 그대로 유지
        };
      }
      return newData;
    });
  };

  const onHandleUpdateEvaluationInfo = (spec: string, evaluation: any) => {
    console.log(`[${spec}] 평가정보 수정 요청:`, evaluation);
    window.alert(`[${spec}] 평가정보 수정 기능은 현재 개발 중입니다.`);
    // TODO: 여기에 실제 API 연동 로직 추가 (putDoctorEvaluation 등)
  };

  const onHandleDeleteEvaluationInfo = (doctorEvalId: number) => {
    console.log(`평가정보 삭제 요청 (doctorEvalId: ${doctorEvalId})`);
    window.alert(`평가정보 삭제 기능은 현재 개발 중입니다.`);
    // TODO: 여기에 실제 API 연동 로직 추가 (deleteDoctorEvaluation 등)
  };

  return (
    <Box pt={4}>
      {isLoading ? (
        <Box padding='6' boxShadow='lg'>
          <SkeletonText mt='4' noOfLines={4} spacing='4' skeletonHeight='2' />
        </Box>
      ) : (
        <>
          {Object.keys(editableEvaluationData).length > 0 ? (
            <Stack spacing={4}>
              {Object.entries(editableEvaluationData as [string, any[]][]).map(([spec, evaluations], specIndex: number) => {
                const evaluation:any = evaluations[0]; // 각 standardSpec별 첫 번째 평가 항목을 사용
                
                return (
                  <Box key={specIndex} p={4} borderBottom="1px" borderBottomColor={borderColor} borderRadius="lg">
                    <Flex justifyContent="space-between" alignItems="center" mb={4}>
                      <Text fontSize="xl" fontWeight="bold" color={textColor}>
                        {spec ?? '값없음'}
                      </Text>
                      {isAdmin && (
                        <ButtonGroup size="sm" isAttached variant="outline">
                          <Button onClick={() => onHandleUpdateEvaluationInfo(spec, evaluation)}>수정</Button>
                          <Button onClick={() => onHandleDeleteEvaluationInfo(evaluation?.doctorEvalId)}>삭제</Button>
                        </ButtonGroup>
                      )}
                    </Flex>
                    <Flex wrap="wrap">
                      <FormControl width={{ base: '100%', md: '50%' }} pr={{ base: 0, md: 2 }} mb={2}>
                        <FormLabel color={textColor}>설명점수</FormLabel>
                        <Input
                          type="text"
                          value={getScoreDisplay(evaluation?.explanation)}
                          readOnly={!isAdmin}
                          borderColor={borderColor}
                          color={textColor}
                          onChange={(e) => handleInputChange(spec, 'explanation', e.target.value)}
                        />
                      </FormControl>
                      <FormControl width={{ base: '100%', md: '50%' }} pl={{ base: 0, md: 2 }} mb={2}>
                        <FormLabel color={textColor}>논문 점수</FormLabel>
                        <Input
                          type="text"
                          value={getScoreDisplay(evaluation?.paperScore)}
                          readOnly={!isAdmin}
                          borderColor={borderColor}
                          color={textColor}
                          onChange={(e) => handleInputChange(spec, 'paperScore', e.target.value)}
                        />
                      </FormControl>
                      <FormControl width={{ base: '100%', md: '50%' }} pr={{ base: 0, md: 2 }} mb={2}>
                        <FormLabel color={textColor}>친절점수</FormLabel>
                        <Input
                          type="text"
                          value={getScoreDisplay(evaluation?.kindness)}
                          readOnly={!isAdmin}
                          borderColor={borderColor}
                          color={textColor}
                          onChange={(e) => handleInputChange(spec, 'kindness', e.target.value)}
                        />
                      </FormControl>
                      <FormControl width={{ base: '100%', md: '50%' }} pl={{ base: 0, md: 2 }} mb={2}>
                        <FormLabel color={textColor}>환자 점수</FormLabel>
                        <Input
                          type="text"
                          value={getScoreDisplay(evaluation?.patientScore)}
                          readOnly={!isAdmin}
                          borderColor={borderColor}
                          color={textColor}
                          onChange={(e) => handleInputChange(spec, 'patientScore', e.target.value)}
                        />
                      </FormControl>
                      <FormControl width={{ base: '100%', md: '50%' }} pr={{ base: 0, md: 2 }} mb={2}>
                        <FormLabel color={textColor}>진료만족도</FormLabel>
                        <Input
                          type="text"
                          value={getScoreDisplay(evaluation?.satisfaction)}
                          readOnly={!isAdmin}
                          borderColor={borderColor}
                          color={textColor}
                          onChange={(e) => handleInputChange(spec, 'satisfaction', e.target.value)}
                        />
                      </FormControl>
                      <FormControl width={{ base: '100%', md: '50%' }} pl={{ base: 0, md: 2 }} mb={2}>
                        <FormLabel color={textColor}>대중 평가 점수</FormLabel>
                        <Input
                          type="text"
                          value={getScoreDisplay(evaluation?.publicScore)}
                          readOnly={!isAdmin}
                          borderColor={borderColor}
                          color={textColor}
                          onChange={(e) => handleInputChange(spec, 'publicScore', e.target.value)}
                        />
                      </FormControl>
                      <FormControl width={{ base: '100%', md: '50%' }} pr={{ base: 0, md: 2 }} mb={2}>
                        <FormLabel color={textColor}>추천 점수</FormLabel>
                        <Input
                          type="text"
                          value={getScoreDisplay(evaluation?.recommendation)}
                          readOnly={!isAdmin}
                          borderColor={borderColor}
                          color={textColor}
                          onChange={(e) => handleInputChange(spec, 'recommendation', e.target.value)}
                        />
                      </FormControl>
                      <FormControl width={{ base: '100%', md: '50%' }} pl={{ base: 0, md: 2 }} mb={2}>
                        <FormLabel color={textColor}>동료 평가 점수</FormLabel>
                        <Input
                          type="text"
                          value={getScoreDisplay(evaluation?.peerScore)}
                          readOnly={!isAdmin}
                          borderColor={borderColor}
                          color={textColor}
                          onChange={(e) => handleInputChange(spec, 'peerScore', e.target.value)}
                        />
                      </FormControl>
                    </Flex>
                  </Box>
                );
              })}

            </Stack>
          ) : (
            <Text color={textColor}>평가 정보가 없습니다.</Text>
          )}
        </>
      )}
    </Box>
  );
}

export default DoctorEvaluationManager;
