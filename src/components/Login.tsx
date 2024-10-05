import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextInput, Button, Paper, Title, Container, Box } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { login } from '../services/api';

const Login: React.FC = () => {
  const [personalCode, setPersonalCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await login(personalCode);
      console.log('Login response in component:', response);
      
      if (response && response.token && response.user && response.user.role) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('userRole', response.user.role);
        if (response.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/voting');
        }
      } else {
        setError('Invalid response format from server');
      }
    } catch (error) {
      console.error('Login error in component:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  return (
    <Container size={420} my={40}>
      <Title ta="center" fw={900}>
        School Voting System
      </Title>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={handleLogin}>
          <TextInput
            label="Personal Code"
            placeholder="Enter your personal code"
            required
            value={personalCode}
            onChange={(e) => setPersonalCode(e.target.value)}
          />
          <Button type="submit" fullWidth mt="xl">
            Login
          </Button>
          {error && (
            <Box mt="sm" style={{ color: 'red', fontSize: '14px' }}>
              {error}
            </Box>
          )}
        </form>
      </Paper>
    </Container>
  );
};

export default Login;