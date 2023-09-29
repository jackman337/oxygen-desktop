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

type DocumentRow = {
  ticker: string;
  num_documents: number;
  documents: Document[];
}

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
    api.delete(`/documents/${document.id}`)
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

  const getDocumentRows = (documents: Document[]): DocumentRow[] => {
    const documentRows: DocumentRow[] = [];
    documents.forEach(document => {
      const documentRow = documentRows.find(row => row.ticker === document.ticker);
      if (documentRow) {
        documentRow.num_documents += 1;
        documentRow.documents.push(document);
      } else {
        documentRows.push({
          ticker: document.ticker,
          num_documents: 1,
          documents: [document],
        });
      }
    });
    return documentRows;
  }

  const documentRows = getDocumentRows(documents);

  return (
    <Box maxHeight="calc(100vh - 300px)" overflowY="auto">
      <Spacer height="10px"/>
      <Button variant='outlinedWhite' onClick={onAddDocumentClicked} width="100%">Add document</Button>
      <Spacer height="10px"/>
      {documentRows.map(documentRow => {
        return (
          <Box
            // onContextMenu={(event) => handleRightClick(event, documentData)}
            key={documentRow.ticker}
            cursor="pointer"
            _hover={{ backgroundColor: '#3f3f3f' }}
            paddingX="12px"
          >
            <Spacer height="10px"/>
            <Flex direction="column" justify="space-between">
              <HStack spacing="auto">
                <VStack spacing={1} align="start">
                  <Text fontSize='14px' fontWeight='bold' isTruncated>
                    {documentRow.ticker}
                  </Text>
                  <Text fontSize='14px' color='#919191' isTruncated>
                    {documentRow.num_documents > 1 ?
                      `${documentRow.num_documents} documents` :
                      `${documentRow.num_documents} document`}
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
        <AddDocumentModal isOpen={showAddDocumentModal} onClose={onCloseAddDocumentModal}
                          onDocumentAdded={onDocumentAdded}/>
      )}
    </Box>
  )
}

export default DocumentsTab
