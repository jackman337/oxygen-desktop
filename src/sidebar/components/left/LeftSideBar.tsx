// LeftSideBar.tsx

import React from "react";
import {
  Box,
  Divider,
  Flex,
  Heading,
  Link,
  Spacer,
  Tab,
  TabIndicator,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text
} from "@chakra-ui/react";
import { BorderColor, Green, White } from "../../../styles/colors";
import { store } from "../../../store";
import { logout } from "../../../redux/userSlice";
import { useNavigate } from "react-router-dom";
import FilesTab from "./FilesTab";
import PromptsTab from "./PromptsTab";

type LeftSideBarProps = {};

const LeftSideBar: React.FC<LeftSideBarProps> = ({}) => {
  const appVersion = localStorage.getItem("appVersion");
  const navigate = useNavigate();

  const onLogoutClick = () => {
    store.dispatch(logout());
    navigate("/");
  };

  return (
    <Flex
      direction="column"
      justify="space-between"
      w="260px"
      h="100%"
      borderRight="1px solid"
      borderColor={BorderColor}
    >
      <Box>
        <Spacer height="20px"/>
        <Heading as="h5" size="sm" color="gray" paddingLeft="24px">
          Context
        </Heading>
        <Spacer height="20px"/>
        <Divider/>
        <Tabs variant="unstyled">
          <TabList paddingLeft="12px">
            <Tab>Files</Tab>
            <Tab>Prompts</Tab>
          </TabList>
          <TabIndicator height="2px" background={White}/>
          <Box>
            <TabPanels>
              <TabPanel>
                <FilesTab/>
              </TabPanel>
              <TabPanel>
                <PromptsTab/>
              </TabPanel>
              <TabPanel>
              </TabPanel>
            </TabPanels>
          </Box>
        </Tabs>
      </Box>
      <Box maxHeight="200px">
        <Divider/>
        <Spacer height="20px"/>
        <Box paddingLeft="32px">
          <Link
            color="#FFFFFF"
            _hover={{ color: Green }}
            display="inline"
            fontWeight="semibold"
            fontSize="14px"
          >
            Request feature
          </Link>
        </Box>
        <Spacer height="4px"/>
        <Box paddingLeft="32px">
          <Link
            color="#FFFFFF"
            _hover={{ color: Green }}
            display="inline"
            fontWeight="semibold"
            fontSize="14px"
            onClick={onLogoutClick}
          >
            Log out
          </Link>
        </Box>
        <Spacer height="20px"/>
        <Box paddingLeft="32px">
          <Text fontSize="xs" color="gray" fontWeight="semibold">
            v {appVersion}
          </Text>
        </Box>
        <Spacer height="20px"/>
      </Box>
    </Flex>
  );
};

export default LeftSideBar;
