// RightSideBar.tsx

import React from "react";
import { Box, Divider, Heading, Spacer, Tab, TabIndicator, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { BackgroundColor, BorderColor, White } from "../../../styles/colors";
import ChatConfigurationTab from "./ChatConfigurationTab";
import ModelConfigurationTab from "./ModelConfigurationTab";
import { Chat } from "../../../types";

type RightSideBarProps = {
  chat: Chat | null,
};

const RightSideBar: React.FC<RightSideBarProps> = ({ chat }) => {
  return (
    <Box
      w="260px  "
      h="100%"
      borderLeft="1px solid"
      borderColor={BorderColor}
      bg={BackgroundColor}
    >
      <Spacer height="20px"/>
      <Heading as='h5' size='sm' color="gray" paddingLeft="24px">Configuration</Heading>
      <Spacer height="20px"/>
      <Divider/>
      <Tabs variant="unstyled">
        <TabList paddingLeft="12px">
          <Tab>Model</Tab>
          <Tab>Chat</Tab>
        </TabList>
        <TabIndicator height="2px" bg={White}/>
        <TabPanels>
          <TabPanel>
            <ModelConfigurationTab/>
          </TabPanel>
          <TabPanel>
            <ChatConfigurationTab chat={chat}/>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  )
}

export default RightSideBar;
