import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Title, Paper, Button, Grid, Text, Image } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { getCandidates, vote, checkVoteStatus } from '../services/api';

interface Candidate {
  id: number;
  name: string;
  description: string;
  image_url: string;
}

const VotingPage: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [hasVoted, setHasVoted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const voteStatus = await checkVoteStatus();
        setHasVoted(voteStatus.has_voted);
        if (!voteStatus.has_voted) {
          const candidatesData = await getCandidates();
          setCandidates(candidatesData);
        }
      } catch (error) {
        notifications.show({
          title: 'Error',
          message: 'Failed to fetch voting data.',
          color: 'red',
        });
      }
    };
    fetchData();
  }, []);

  const handleVote = async (candidateId: number) => {
    try {
      await vote(candidateId);
      notifications.show({
        title: 'Success',
        message: 'Your vote has been cast successfully.',
        color: 'green',
      });
      navigate('/thank-you');
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to cast your vote.',
        color: 'red',
      });
    }
  };

  if (hasVoted) {
    return (
      <Container size="md" mt="xl">
        <Paper shadow="xs" p="md">
          <Title order={2} ta="center">You have already voted</Title>
          <Text ta="center" mt="md">Thank you for participating in the election.</Text>
          <Button fullWidth mt="md" onClick={() => navigate('/')}>Return to Login</Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container size="lg" mt="xl">
      <Title order={2} mb="xl">Cast Your Vote</Title>
      <Grid>
        {candidates.map((candidate) => (
          <Grid.Col key={candidate.id} span={4}>
            <Paper shadow="xs" p="md">
              <Image src={candidate.image_url} alt={candidate.name} height={200} fit="cover" />
              <Title order={3} mt="md">{candidate.name}</Title>
              <Text mt="xs">{candidate.description}</Text>
              <Button fullWidth mt="md" onClick={() => handleVote(candidate.id)}>
                Vote for {candidate.name}
              </Button>
            </Paper>
          </Grid.Col>
        ))}
      </Grid>
    </Container>
  );
};

export default VotingPage;