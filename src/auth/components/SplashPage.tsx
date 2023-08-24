import React from 'react';
import { Box, Button, Heading, HStack, Spacer, VStack, useBreakpointValue } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { Green } from "../../styles/colors";

export const SplashPage = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  const headingSize = useBreakpointValue({ base: '2xl', md: '4xl' });
  const subHeadingSize = useBreakpointValue({ base: 'md', md: 'lg' });

  return (
    <Box bg="dark" minHeight="100vh" display="flex" justifyContent="center" alignItems="center" px={{base: 4, md: 0}}>
      <VStack spacing={8}>
        <VStack align="center" spacing={4}>
          <HStack>
            <Heading as='h1' size={headingSize} color='white'>Project </Heading>
            <Heading as='h1' size={headingSize} color={Green}>Oxygen</Heading>
          </HStack>
          <Heading as='h3' size={subHeadingSize} color="white">Build, test, and deploy your AI agents</Heading>
        </VStack>
        <HStack>
          <Button onClick={handleLoginClick}>Login</Button>
          <Spacer/>
          <Button colorScheme="green" onClick={handleRegisterClick}>Register</Button>
        </HStack>
      </VStack>
    </Box>
  );
};
