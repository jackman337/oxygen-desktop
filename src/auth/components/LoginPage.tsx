// LoginComponent.tsx
import { Box, Button, Flex, FormControl, FormLabel, Heading, Input, useToast, VStack } from '@chakra-ui/react';
import { AxiosError } from 'axios';
import React, { useState } from 'react';
import { useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../redux/userSlice';
import { AppDispatch } from '../../store';
import styled from "@emotion/styled";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleLeft } from '@fortawesome/free-solid-svg-icons';


interface ErrorResponse {
  detail: string;
}

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false)

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true)
    try {
      await dispatch(loginUser({ username, password })).unwrap();
      toast({
        title: "Welcome back!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setIsLoading(false)
      navigate('/');
    } catch (err) {
      const axiosError = err as AxiosError;
      if (axiosError.response) {
        const errorData = axiosError.response.data as ErrorResponse;
        toast({
          title: "Error",
          description: errorData.detail, // use the server's error message
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
      setIsLoading(false)
    }
  }

  return (
    <>
      <Button
        leftIcon={<FontAwesomeIcon icon={faArrowCircleLeft}/>}
        onClick={() => navigate('/')}
        position="absolute"
        top={4}
        left={4}
      >
        Back
      </Button>
      <Container>
        <Box bg="dark" minHeight="100vh" display="flex" justifyContent="center" alignItems="center">
          <Flex
            as="form"
            onSubmit={handleSubmit}
            direction="column"
            align="center"
            position="relative" // To position the Back button
            width="100%" // To take full width
            maxWidth="400px" // Or your preferred width
          >
            <VStack spacing={6}>
              <Heading as='h3' size='lg' color='white'>Login</Heading>

              <FormControl isRequired>
                <FormLabel>Username</FormLabel>
                <Input placeholder="Enter username" value={username} onChange={(e) => setUsername(e.target.value)}/>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <Input placeholder="Enter password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
              </FormControl>
              <Button type="submit" isLoading={isLoading}>Submit</Button>
            </VStack>
          </Flex>
        </Box>
      </Container>
    </>
  );
};

const Container = styled(Box)`
  flex: 1;
  overflow: auto; // new
`;
