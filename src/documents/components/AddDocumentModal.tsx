import React, { FC, useState } from 'react';
import {
  Box,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Text
} from "@chakra-ui/react";
import { Document } from "../../types";

interface AddDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDocumentAdded: (document: Document) => void;
}

export const AddDocumentModal: FC<AddDocumentModalProps> = ({ isOpen, onClose, onDocumentAdded }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [documentType, setDocumentType] = useState<string>("COMPANY_10K_FILING");
  const [documentUrl, setDocumentUrl] = useState<string>("");

  const onSaveClicked = (event: React.FormEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsLoading(true);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay/>
      <ModalContent>
        <ModalHeader>Add a document</ModalHeader>
        <ModalCloseButton/>
        <ModalBody marginTop={4}>
          <Box marginBottom={2}>
            <Text fontSize="14px">Type</Text>
          </Box>
          <Box marginBottom={4}>
            <Select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              iconColor="white"
            >
              <option value="COMPANY_10K_FILING">Annual Report (10-K)</option>
              <option value="COMPANY_10Q_FILING">Quarterly Report (10-Q)</option>
            </Select>
          </Box>
          <Box marginBottom={2}>
            <Text fontSize="14px">URL</Text>
          </Box>
          <Box marginBottom={4}>
            <Input
              placeholder="https://www.sec.gov/Archives/edgar/data/..."
              value={documentUrl}
              onChange={(e) => setDocumentUrl(e.target.value)}
            />
          </Box>
        </ModalBody>
        <ModalFooter>
          <Button type="submit" isLoading={isLoading} onClick={onSaveClicked}>
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
