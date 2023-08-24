import React from "react";
import { Box, Divider, Heading, HStack, Spacer } from "@chakra-ui/react";
import { Green } from "../styles/colors";

const ProjectOxygenHeader: React.FC = () => {
  const appVersion = localStorage.getItem("appVersion")
  if (appVersion == null) {
    return <div/>
  }

  return (
    <Box width="100%">
      <Spacer height="20px"/>
      <HStack justifyContent="center" spacing={1}>
        <Heading as='h5' size='sm'>Project</Heading>
        <Heading as='h5' size='sm' color={Green}> Oxygen</Heading>
      </HStack>
      <Spacer height="20px"/>
      <Divider/>
    </Box>
  )
}

export default ProjectOxygenHeader
