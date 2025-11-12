'use client';

import * as React from 'react';
import { AlertDialog,AlertDialogBody,AlertDialogFooter,AlertDialogHeader,AlertDialogContent,AlertDialogOverlay,useDisclosure,Button } from '@chakra-ui/react'


interface AlertProps {
  msg: string;
  isOpen : boolean;
  fnConform: () => any;
  fnCancel: () => any;
}

const CustomAlert = ({ msg,isOpen, fnConform,fnCancel }: AlertProps)=> {
  const {  onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
    <AlertDialogOverlay>
      <AlertDialogContent>
        <AlertDialogHeader fontSize='lg' fontWeight='bold'>
          AIGA ADMIN
        </AlertDialogHeader>

        <AlertDialogBody>
          {msg}
        </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={fnCancel} id="button_no">
              아니요
            </Button>
            <Button colorScheme='red' onClick={fnConform} ml={3} id="button_yes">
              네
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}

export default CustomAlert;