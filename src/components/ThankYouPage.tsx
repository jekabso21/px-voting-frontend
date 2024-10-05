import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Title, Text, Button, Paper } from '@mantine/core';

const ThankYouPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container size="sm" mt="xl">
      <Paper shadow="md" p="xl" radius="md">
        <Title order={2} ta="center" mb="md">Thank You for Voting!</Title>
        <Text ta="center" mb="xl">Your vote has been successfully recorded. We appreciate your participation in the school election.</Text>
        <Button fullWidth onClick={() => navigate('/')}>Return to Login</Button>
      </Paper>
    </Container>
  );
};

export default ThankYouPage;