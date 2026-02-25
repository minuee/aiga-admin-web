'use client';
import React, { PropsWithChildren } from 'react';
import { Box, Flex, useColorModeValue, Text, Stack, FormLabel, SkeletonText, SkeletonCircle } from '@chakra-ui/react';
import * as HospitalService from "services/hospital/index";
import functions from 'utils/functions';

export interface HospitalEvaluationManagerProps extends PropsWithChildren {
  hospitalId: string;
  textColor: string;
  borderColor: string; // borderColor는 사용되지 않지만, AliasNameManager의 일관성을 위해 추가
}

function HospitalEvaluationManager(props: HospitalEvaluationManagerProps) {
  const { hospitalId, textColor } = props;
  const [hospitalEvaluation, setHospitalEvaluation] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true); // isLoading 상태 추가

  const getHospitalEvaluation = React.useCallback(
    async() => {
      if ( !functions.isEmpty(hospitalId) ) {
        setIsLoading(true); // 로딩 시작
        try{
          const res:any = await HospitalService.getHospitalEvaluationList({
            hid: hospitalId
          });
          console.log('병원평가정보현황 API 결과:', res?.data); // 콘솔로 결과 출력
          setHospitalEvaluation(res?.data);

        }catch(e){
          console.error("Error fetching hospital evaluation:", e);
          setHospitalEvaluation(null);
        } finally {
          setIsLoading(false); // 로딩 종료
        }
      } else {
        setIsLoading(false); // hospitalId 없으면 로딩 종료
      }
    },[hospitalId]
  );

  React.useEffect(() => {
    getHospitalEvaluation();
  }, [getHospitalEvaluation]);

  return (
    <Box p={4}>
      {isLoading ? (
        <Box padding='6' boxShadow='lg'>
          <SkeletonText mt='4' noOfLines={4} spacing='4' skeletonHeight='2' />
        </Box>
      ) : (
        <>
          {hospitalEvaluation && hospitalEvaluation.length > 0 ? (
            <Box>
              {/* 테이블 헤더 (th 개념) */}
              <Flex
                borderBottom="1px"
                borderColor={props.borderColor}
                py={2}
                px={4}
                fontWeight="bold"
                textAlign="center"
              >
                <Text w="50%" color={textColor}>진료과목</Text> {/* 2 비율 */}
                <Text w="20%" color={textColor}>구분</Text> {/* 1 비율 */}
                <Text w="30%" color={textColor}>점수</Text> {/* 2 비율 */}
              </Flex>
              {/* 테이블 내용 (tr, td 개념) */}
              <Stack>
                {hospitalEvaluation.map((evaluation: any, index: number) => (
                  <Flex
                    key={index}
                    borderBottom="1px"
                    borderColor={props.borderColor}
                    py={2}
                    px={4}
                    alignItems="center"
                    textAlign="center"
                  >
                    <Text w="50%" color={textColor}>{evaluation.matchedDept || 'N/A'}</Text>
                    <Text w="20%" color={textColor}>공개</Text> {/* 구분 컬럼 추가 */}
                    <Text w="30%" color={textColor}>{evaluation.publicScore !== null ? evaluation.publicScore : 'N/A'}</Text>
                  </Flex>
                ))}
              </Stack>
            </Box>
          ) : (
            <Text color={textColor}>평가 정보가 없습니다.</Text>
          )}
        </>
      )}
    </Box>
  );
}

export default HospitalEvaluationManager;