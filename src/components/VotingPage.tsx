import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Title, Paper, Button, Grid, Text, Image } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { getCandidates, vote, checkVoteStatus } from '../services/api';
import { Candidate, VoteStatus } from '../types';

const VotingPage: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [hasVoted, setHasVoted] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const voteStatus: VoteStatus = await checkVoteStatus();
        setHasVoted(voteStatus.has_voted);
        if (!voteStatus.has_voted) {
          const candidatesData: Candidate[] = await getCandidates();
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
      <Container size="md" mt="xl" px="xs">
        <Paper shadow="xs" p="md">
          <Title order={2} ta="center">You have already voted</Title>
          <Text ta="center" mt="md">Thank you for participating in the election.</Text>
          <Button fullWidth mt="md" onClick={() => navigate('/')}>Return to Login</Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container size="lg" mt="xl" px="xs">
      <Title order={2} mb="xl">Cast Your Vote</Title>
      <Grid>
        {candidates.map((candidate) => (
          <Grid.Col key={candidate.id} xs={12} sm={6} md={4}>
            <Paper shadow="xs" p="md" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {candidate.image_url && (
                <Image
                  src={candidate.image_url}
                  alt={candidate.name}
                  height={200}
                  fit="cover"
                  onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              )}
              <Title order={3} mt="md">{candidate.name}</Title>
              <Text mt="xs" style={{ flexGrow: 1 }}>{candidate.description}</Text>
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