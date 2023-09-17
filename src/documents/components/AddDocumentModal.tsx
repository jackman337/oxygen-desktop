import React, { FC, useState } from 'react';
import { Box, Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import { Document } from "../../types";

interface AddDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDocumentAdded: (document: Document) => void;
}

export const AddDocumentModal: FC<AddDocumentModalProps> = ({ isOpen, onClose, onDocumentAdded }) => {
  const [isLoading, setIsLoading] = useState(false)

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay/>
      <ModalContent>
        <ModalHeader>Add a document</ModalHeader>
        <ModalBody marginTop={4}>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              // TODO - add document to backend
            }}
          >
            <ModalFooter>
              <Box>
                <Button type="submit" colorScheme="blue" ml={3} isLoading={isLoading}>
                  Save
                </Button>
              </Box>
            </ModalFooter>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
