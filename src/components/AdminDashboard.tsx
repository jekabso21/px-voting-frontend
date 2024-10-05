import React, { useState, useEffect } from 'react';
import { Container, Title, Paper, Button, Grid, Text, TextInput, Textarea, Modal } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { getCandidates, getCandidateStats, addCandidate, editCandidate, deleteCandidate, removeAllVotes } from '../services/api';

interface Candidate {
  id: number;
  name: string;
  description: string;
  image_url: string;
}

interface CandidateStats {
  id: number;
  name: string;
  votes: number;
}

const AdminDashboard: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [stats, setStats] = useState<{ total_votes: number; candidates: CandidateStats[] }>({ total_votes: 0, candidates: [] });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
  const [newCandidate, setNewCandidate] = useState({ name: '', description: '', image_url: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [candidatesData, statsData] = await Promise.all([getCandidates(), getCandidateStats()]);
      setCandidates(candidatesData);
      setStats(statsData);
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to fetch data.',
        color: 'red',
      });
    }
  };

  const handleAddCandidate = async () => {
    try {
      await addCandidate(newCandidate);
      setIsAddModalOpen(false);
      setNewCandidate({ name: '', description: '', image_url: '' });
      fetchData();
      notifications.show({
        title: 'Success',
        message: 'Candidate added successfully.',
        color: 'green',
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to add candidate.',
        color: 'red',
      });
    }
  };

  const handleEditCandidate = async () => {
    if (!editingCandidate) return;
    try {
      await editCandidate(editingCandidate.id, editingCandidate);
      setIsEditModalOpen(false);
      setEditingCandidate(null);
      fetchData();
      notifications.show({
        title: 'Success',
        message: 'Candidate updated successfully.',
        color: 'green',
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to update candidate.',
        color: 'red',
      });
    }
  };

  const handleDeleteCandidate = async (id: number) => {
    try {
      await deleteCandidate(id);
      fetchData();
      notifications.show({
        title: 'Success',
        message: 'Candidate deleted successfully.',
        color: 'green',
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to delete candidate.',
        color: 'red',
      });
    }
  };

  const handleRemoveAllVotes = async () => {
    try {
      await removeAllVotes();
      fetchData();
      notifications.show({
        title: 'Success',
        message: 'All votes have been removed.',
        color: 'green',
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to remove votes.',
        color: 'red',
      });
    }
  };

  return (
    <Container size="lg" mt="xl">
      <Title order={2} mb="xl">Admin Dashboard</Title>
      
      <Paper shadow="xs" p="md" mb="xl">
        <Title order={3} mb="md">Voting Statistics</Title>
        <Text>Total Votes: {stats.total_votes}</Text>
        {stats.candidates.map((candidate) => (
          <Text key={candidate.id}>
            {candidate.name}: {candidate.votes} votes
          </Text>
        ))}
      </Paper>

      <Button onClick={() => setIsAddModalOpen(true)} mb="xl">Add New Candidate</Button>
      <Button onClick={handleRemoveAllVotes} color="red" ml="md" mb="xl">Remove All Votes</Button>

      <Grid>
        {candidates.map((candidate) => (
          <Grid.Col key={candidate.id} span={4}>
            <Paper shadow="xs" p="md">
              <Title order={3}>{candidate.name}</Title>
              <Text mt="xs">{candidate.description}</Text>
              <Button onClick={() => { setEditingCandidate(candidate); setIsEditModalOpen(true); }} mt="md" fullWidth>
                Edit
              </Button>
              <Button onClick={() => handleDeleteCandidate(candidate.id)} mt="xs" color="red" fullWidth>
                Delete
              </Button>
            </Paper>
          </Grid.Col>
        ))}
      </Grid>

      <Modal opened={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Candidate">
        <TextInput
          label="Name"
          value={newCandidate.name}
          onChange={(e) => setNewCandidate({ ...newCandidate, name: e.target.value })}
          mb="md"
        />
        <Textarea
          label="Description"
          value={newCandidate.description}
          onChange={(e) => setNewCandidate({ ...newCandidate, description: e.target.value })}
          mb="md"
        />
        <TextInput
          label="Image URL"
          value={newCandidate.image_url}
          onChange={(e) => setNewCandidate({ ...newCandidate, image_url: e.target.value })}
          mb="md"
        />
        <Button onClick={handleAddCandidate} fullWidth>Add Candidate</Button>
      </Modal>

      <Modal opened={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Candidate">
        {editingCandidate && (
          <>
            <TextInput
              label="Name"
              value={editingCandidate.name}
              onChange={(e) => setEditingCandidate({ ...editingCandidate, name: e.target.value })}
              mb="md"
            />
            <Textarea
              label="Description"
              value={editingCandidate.description}
              onChange={(e) => setEditingCandidate({ ...editingCandidate, description: e.target.value })}
              mb="md"
            />
            <TextInput
              label="Image URL"
              value={editingCandidate.image_url}
              onChange={(e) => setEditingCandidate({ ...editingCandidate, image_url: e.target.value })}
              mb="md"
            />
            <Button onClick={handleEditCandidate} fullWidth>Update Candidate</Button>
          </>
        )}
      </Modal>
    </Container>
  );
};

export default AdminDashboard;