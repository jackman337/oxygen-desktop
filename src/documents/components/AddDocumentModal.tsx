import React, { FC, useState } from 'react';
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay
} from "@chakra-ui/react";
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
        <ModalCloseButton/>
        <ModalBody marginTop={4}>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              // TODO - add document to backend
            }}
          >
          </form>
        </ModalBody>
        <ModalFooter>
          <Button type="submit" isLoading={isLoading}>
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
