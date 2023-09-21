// DocumentsTab.tsx

import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Divider, Flex, HStack, Spacer, Text, useToast, VStack } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { Document } from "../../types";
import { AddDocumentModal } from "./AddDocumentModal";
import api from "../../auth/apiService";
import { BackgroundColor } from "../../styles/colors";
import { getDocuments } from "../../redux/documentsSlice";

type DocumentsTabProps = {};

const DocumentsTab: React.FC<DocumentsTabProps> = ({}) => {
  const dispatch = useDispatch<AppDispatch>();
  const toast = useToast();
  const documents = useSelector((state: RootState) => state.documents.documents);
  const [showAddDocumentModal, setShowAddDocumentModal] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: '0px', y: '0px' });
  const menuRef = useRef<HTMLDivElement | null>(null);

  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  useEffect(() => {
    dispatch(getDocuments());
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeContextMenu();
      }
    };

    if (showContextMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showContextMenu]);

  const handleRightClick = (event: React.MouseEvent, document: Document) => {
    event.preventDefault();
    setSelectedDocument(document); // Set the selected document
    setShowContextMenu(true);
    setContextMenuPosition({ x: `${event.clientX}px`, y: `${event.clientY}px` });
  };

  const closeContextMenu = () => {
    setSelectedDocument(null);
    setShowContextMenu(false);
  };

  const onDeleteDocumentClicked = (document: Document) => {
    api.delete(`/documents/${document.id}/`)
      .then(() => {
        dispatch(getDocuments());
        toast({
          title: `${document.name} deleted`,
          status: "info",
          duration: 3000,
          isClosable: true,
        });
      }).catch(error => {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    })
  }

  const onDocumentAdded = (document: Document) => {
    dispatch(getDocuments());
    toast({
      title: `${document.name} added`,
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  }

  const onAddDocumentClicked = () => {
    setShowAddDocumentModal(true)
  }

  const onCloseAddDocumentModal = () => {
    setShowAddDocumentModal(false)
  }

  return (
    <Box maxHeight="calc(100vh - 300px)" overflowY="auto">
      <Spacer height="10px"/>
      <Button variant='outlinedWhite' onClick={onAddDocumentClicked} width="100%">Add document</Button>
      <Spacer height="10px"/>
      {documents.map(document => {
        return (
          <Box
            onContextMenu={(event) => handleRightClick(event, document)}
            key={document.id}
            cursor="pointer"
            _hover={{ backgroundColor: '#3f3f3f' }}
            paddingX="12px"
          >
            <Spacer height="10px"/>
            <Flex direction="column" justify="space-between">
              <HStack spacing="auto">
                <VStack spacing={1} align="start">
                  <Text fontSize='14px' fontWeight='bold' isTruncated>
                    {document.name}
                  </Text>
                  <Text fontSize='12px' color='#919191' isTruncated>
                    {document.name.slice(0, 30)}{document.name.length > 30 ? '...' : ''}
                  </Text>
                </VStack>
                <Spacer/>
              </HStack>
            </Flex>
            <Spacer height="10px"/>
          </Box>
        );
      })}
      {showContextMenu && (
        <Box
          ref={menuRef}
          position="fixed"
          left={contextMenuPosition.x}
          top={contextMenuPosition.y}
          zIndex="popover"
          borderWidth="1px"
          borderColor="#3f3f3f"
          minWidth="200px"
        >
          <Divider/>
          <Box
            _hover={{ bg: '#3f3f3f', color: 'white' }}
            bg={BackgroundColor}
            padding="5px"
            cursor="pointer"
            onClick={() => {
              // Delete the selected document
              if (selectedDocument) {
                onDeleteDocumentClicked(selectedDocument);
              }
              closeContextMenu();
            }}
          >
            <Text marginLeft="12px" fontSize="14px">
              Delete
            </Text>
          </Box>
        </Box>
      )}
      <Spacer height="20px"/>
      {showAddDocumentModal && (
        <AddDocumentModal isOpen={showAddDocumentModal} onClose={onCloseAddDocumentModal} onDocumentAdded={onDocumentAdded}/>
      )}
    </Box>
  )
}

export default DocumentsTab
