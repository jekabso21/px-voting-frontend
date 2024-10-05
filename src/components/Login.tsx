import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextInput, Button, Paper, Title, Container } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { login } from '../services/api';

const Login: React.FC = () => {
  const [personalCode, setPersonalCode] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await login(personalCode);
      localStorage.setItem('token', response.token);
      localStorage.setItem('userRole', response.user.role);
      if (response.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/voting');
      }
    } catch (error) {
      notifications.show({
        title: 'Login Failed',
        message: 'Invalid personal code or you have already voted.',
        color: 'red',
      });
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
        </form>
      </Paper>
    </Container>
  );
};

export default Login;