import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Title, Paper, Button, Grid, Text, Image, Checkbox, Group } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { getCandidates, vote, checkVoteStatus } from '../services/api';
import { Candidate, VoteStatus } from '../types';

const VotingPage: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [hasVoted, setHasVoted] = useState<boolean>(false);
  const [selectedCandidates, setSelectedCandidates] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
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
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleToggleCandidate = (candidateId: number) => {
    setSelectedCandidates(prev => 
      prev.includes(candidateId)
        ? prev.filter(id => id !== candidateId)
        : [...prev, candidateId]
    );
  };

  const handleSubmitVotes = async () => {
    if (selectedCandidates.length === 0) {
      notifications.show({
        title: 'Error',
        message: 'Please select at least one candidate.',
        color: 'red',
      });
      return;
    }

    try {
      await vote(selectedCandidates);
      notifications.show({
        title: 'Success',
        message: 'Your votes have been cast successfully.',
        color: 'green',
      });
      navigate('/thank-you');
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to cast your votes.',
        color: 'red',
      });
    }
  };

  if (isLoading) {
    return (
      <Container size="md" mt="xl" px="xs">
        <Paper shadow="xs" p="md">
          <Title order={2} ta="center">Loading...</Title>
        </Paper>
      </Container>
    );
  }

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
      <Title order={2} mb="xl">Cast Your Votes</Title>
      <Text mb="md">Select one or more candidates to vote for:</Text>
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
              <Checkbox
                mt="md"
                label={`Vote for ${candidate.name}`}
                checked={selectedCandidates.includes(candidate.id)}
                onChange={() => handleToggleCandidate(candidate.id)}
              />
            </Paper>
          </Grid.Col>
        ))}
      </Grid>
      <Group position="center" mt="xl">
        <Button size="lg" onClick={handleSubmitVotes} disabled={selectedCandidates.length === 0}>
          Submit Votes
        </Button>
      </Group>
    </Container>
  );
};

export default VotingPage;