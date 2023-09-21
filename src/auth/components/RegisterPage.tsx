// RegisterComponent.tsx
import { Box, Button, FormControl, FormLabel, Heading, Input, useToast, VStack } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useDispatch } from "react-redux";
import { registerUser } from '../../redux/userSlice';
import { AppDispatch } from "../../store";
import { useNavigate } from "react-router-dom";
import { AxiosError } from 'axios';
import styled from "@emotion/styled";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";

interface ErrorResponse {
  username: string | null;
}

export const RegisterPage: React.FC = () => {
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
      await dispatch(registerUser({username, password})).unwrap();
      toast({
        title: "Welcome!",
        status: "info",
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
          description: errorData.username, // use the server's error message
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
          <VStack as="form" onSubmit={handleSubmit} spacing={6}>
            <Heading as='h3' size='lg' color='white'>Register</Heading>
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
        </Box>
      </Container>
    </>
  );
};

const Container = styled(Box)`
  flex: 1;
  overflow: auto; // new
`;