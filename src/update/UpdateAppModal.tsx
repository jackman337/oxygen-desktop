import React, { FC } from 'react';
import { Box, Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text } from "@chakra-ui/react";

interface UpdateAppModalProps {
  isOpen: boolean;
  // onClose: () => void;
  onUpdateClick: () => void;
}

export const UpdateAppModalModal: FC<UpdateAppModalProps> = ({isOpen, onUpdateClick}) => {
  return (
    <Modal isOpen={isOpen} onClose={() => {}}>
      <ModalOverlay/>
      <ModalContent>
        <ModalHeader>Update Available</ModalHeader>
        <ModalBody marginTop={4}>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              onUpdateClick();
            }}
          >
            <Text>Please update to continue.</Text>
            <ModalFooter>
              <Box>
                <Button type="submit" colorScheme="green">
                  Update
                </Button>
              </Box>
            </ModalFooter>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
