import React, { useCallback, useEffect, useState } from "react";
import { Box, Flex, HStack, Spacer, Text, Tooltip, useToast, VStack } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { setProjectFiles } from "../../../redux/filesSlice";
import { RootState } from "../../../store";
import { FileDetails } from "../../../types";

type FilesTabProps = {};

const FilesTab: React.FC<FilesTabProps> = ({}) => {
  const projectFiles = useSelector((state: RootState) => state.files.projectFiles);
  const [isDragOver, setIsDragOver] = useState(false);
  const toast = useToast();
  const dispatch = useDispatch();

  useEffect(() => {
    loadProjectFiles();
  }, []);

  const loadProjectFiles = () => {
    window.electron.getAllFiles()
      .then(files => {
        const filesOnly = files.filter(file => file.isDirectory === false);
        // Sort the filesOnly alphabetically by filename
        const sorted = filesOnly.sort((a, b) => {
          return a.filename.localeCompare(b.filename);
        });
        dispatch(setProjectFiles(sorted)); // Dispatch the entire files array
      })
  }


  const onDeleteFileClicked = (file: FileDetails) => {
    console.log('Deleting file', file);
    window.electron.deleteFile(file.path)
      .then(() => {
        toast({
          title: "Success",
          description: `Removed ${file.filename}`,
          status: "info",
          duration: 3000,
          isClosable: true,
        });
        // Re-load the project files
        loadProjectFiles();
      })
  }


  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);  // Update state to true when a file is dragged over
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false); // Update state to false when the file leaves the drop area
  };

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false); // Update state to false when a file is dropped

    const { files } = event.dataTransfer;
    const file = files[0];
    const path = file?.path;
    const fileName = file.name;
    const fileDetails: FileDetails = {
      filename: fileName,
      path: path,
      isActive: true,
      isDirectory: null,
      extension: null,
      createdAt: null,
      lastModifiedAt: null,
    };

    if (path) {
      const statPromise = window.electron.stat(path).then(stat => {
        fileDetails.extension = stat.extension;
        fileDetails.createdAt = stat.birthtime;
        fileDetails.lastModifiedAt = stat.mtime;
      }).catch(error => {
        console.log(error);
      });

      const isDirPromise = window.electron.isDirectory(path).then(isDirectory => {
        if (isDirectory) {
          // TODO - recursively get all of the files in the directory (up to a max count? throw error if it's too large)
        }
        fileDetails.isDirectory = isDirectory;
      }).catch(error => {
        console.log(error);
      });

      Promise.all([statPromise, isDirPromise])
        .then(() => {
          window.electron.upsertFileMetadata(fileDetails)
            .then(() => {
              console.log('Successfully upserted file metadata')
              // Re-load the project files
              loadProjectFiles();
            })
            .catch(error => console.log('Failed to upsert file metadata', error));
        });
    }
  }, []);

  return (
    <Box
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      bg={isDragOver ? 'gray.800' : undefined}  // Change background color based on isDragOver state
      maxHeight="calc(100vh - 300px)"
      overflowY="auto"
    >
      {projectFiles.map(file => {
        return (
          <Box key={file.path} cursor="pointer" _hover={{ backgroundColor: '#3f3f3f' }} paddingX="12px">
            <Spacer height="10px"/>
            <Flex direction="column" justify="space-between">
              <HStack spacing="auto">
                <VStack spacing={1} align="start">
                  <Text fontSize='14px' fontWeight='bold' isTruncated>{file.filename}</Text>
                  <Tooltip label={file.path} fontSize="sm">
                    <Text fontSize='12px' color='#919191' isTruncated>...{file.path.slice(-(20))}</Text>
                  </Tooltip>
                </VStack>
                <Spacer/>
                <Box>
                  <Tooltip label="Remove" fontSize="sm">
                    <FontAwesomeIcon icon={faClose} color="white" onClick={() => onDeleteFileClicked(file)}/>
                  </Tooltip>
                </Box>
              </HStack>
            </Flex>
            <Spacer height="10px"/>
          </Box>
        );
      })}
      <Spacer height="20px"/>
    </Box>
  )
}

export default FilesTab
