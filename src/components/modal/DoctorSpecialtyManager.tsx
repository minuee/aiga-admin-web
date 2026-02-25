'use client';
import React, { PropsWithChildren } from 'react';
import { Box, Flex, useColorModeValue, Text, Stack, SkeletonText, Button, ButtonGroup } from '@chakra-ui/react';
import * as DoctorService from "services/doctor/index";
import functions from 'utils/functions';
import useCheckAdmin from "store/useCheckAdmin";

export interface DoctorSpecialtyManagerProps extends PropsWithChildren {
  doctorId: string;
  textColor: string;
  borderColor: string;
}

function DoctorSpecialtyManager(props: DoctorSpecialtyManagerProps) {
  const { doctorId, textColor } = props;
  const isAdmin = useCheckAdmin();
  const [specialtyData, setSpecialtyData] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const handleEdit = (specialty: any) => {
    console.log("Edit specialty:", specialty);
    // TODO: Implement edit functionality
    window.alert(`수정 기능 구현 필요: ${specialty.specialty} (ID: ${specialty.specialty_id})`);
  };

  const handleDelete = async (specialty: any) => {
    console.log("Delete specialty:", specialty);
    // TODO: Implement delete functionality
     window.alert(`삭제 기능 구현 필요: ${specialty.specialty} (ID: ${specialty.specialty_id})`);
  };

  const getDoctorSpecialties = React.useCallback(
    async() => {
      if ( !functions.isEmpty(doctorId) ) {
        setIsLoading(true);
        try{
          const res:any = await DoctorService.getDoctorSpecialtyList({
            doctorId: doctorId
          });
          console.log('세부진료분야 API 결과:', res?.data);
          setSpecialtyData(res?.data || []);
        }catch(e){
          console.error("Error fetching doctor specialties:", e);
          setSpecialtyData([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
        setSpecialtyData([]);
      }
    },[doctorId]
  );

  React.useEffect(() => {
    getDoctorSpecialties();
  }, [getDoctorSpecialties]);

  return (
    <Box p={4}>
      {isLoading ? (
        <Box padding='6' boxShadow='lg'>
          <SkeletonText mt='4' noOfLines={4} spacing='4' skeletonHeight='2' />
        </Box>
      ) : (
        <>
          {specialtyData && specialtyData.length > 0 ? (
            <Box>
              <Flex
                borderBottom="1px"
                borderColor={props.borderColor}
                py={2}
                px={4}
                fontWeight="bold"
                textAlign="center"
              >
                <Text w={isAdmin ? "70%" : "100%"} color={textColor} textAlign="left" pl={2}>세부진료분야</Text>
                {isAdmin && <Text w="30%" color={textColor}>관리</Text>}
              </Flex>
              <Stack>
                {specialtyData.map((specialty: any, index: number) => (
                  <Flex
                    key={index}
                    borderBottom="1px"
                    borderColor={props.borderColor}
                    py={2}
                    px={4}
                    alignItems="center"
                  >
                    <Text w={isAdmin ? "70%" : "100%"} color={textColor} textAlign="left" pl={2}>{specialty.specialty || 'N/A'}</Text>
                    {isAdmin && (
                      <Box w="30%" textAlign="center">
                        <ButtonGroup size="sm" isAttached variant="outline">
                          <Button onClick={() => handleEdit(specialty)}>수정</Button>
                          <Button onClick={() => handleDelete(specialty)}>삭제</Button>
                        </ButtonGroup>
                      </Box>
                    )}
                  </Flex>
                ))}
              </Stack>
            </Box>
          ) : (
            <Text color={textColor} textAlign="center" py={10}>세부 진료분야 정보가 없습니다.</Text>
          )}
        </>
      )}
    </Box>
  );
}

export default DoctorSpecialtyManager;
