import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Title, Text, Button, Paper, Grid, Modal, TextInput, Textarea, Group, Card, Image, MediaQuery, useMantineTheme } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
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

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const AdminDashboard: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [stats, setStats] = useState<{ total_votes: number; candidates: CandidateStats[] }>({ total_votes: 0, candidates: [] });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
  const [newCandidate, setNewCandidate] = useState({ name: '', description: '', image_url: '' });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const theme = useMantineTheme();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      const [candidatesData, statsData] = await Promise.all([getCandidates(), getCandidateStats()]);
      setCandidates(candidatesData);
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred');
      }
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

  if (error) {
    return (
      <Container>
        <Title order={2}>Error</Title>
        <Text color="red">{error}</Text>
        <Button onClick={() => navigate('/')}>Back to Login</Button>
      </Container>
    );
  }

  return (
    <Container size="xl" mt="xl" px="xs">
      <Title order={2} mb="xl">Admin Dashboard</Title>
      
      <Grid>
        <Grid.Col xs={12} md={6}>
          <Paper shadow="xs" p="md" mb="xl">
            <Title order={3} mb="md">Voting Statistics</Title>
            <Text size="lg" weight={700} mb="md">Total Votes: {stats.total_votes}</Text>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.candidates}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="votes" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid.Col>
        <Grid.Col xs={12} md={6}>
          <Paper shadow="xs" p="md" mb="xl">
            <Title order={3} mb="md">Vote Distribution</Title>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.candidates}
                  dataKey="votes"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                >
                  {stats.candidates.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid.Col>
      </Grid>

      <Group position="apart" mb="xl">
        <Button onClick={() => setIsAddModalOpen(true)}>Add New Candidate</Button>
        <Button onClick={handleRemoveAllVotes} color="red">Remove All Votes</Button>
      </Group>

      <Grid>
        {candidates.map((candidate) => (
          <Grid.Col key={candidate.id} xs={12} sm={6} md={4}>
            <Card shadow="sm" p="lg" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Card.Section>
                {candidate.image_url && (
                  <Image
                    src={candidate.image_url}
                    alt={candidate.name}
                    height={160}
                    fit="cover"
                    onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                )}
              </Card.Section>
              <Title order={3} mt="md">{candidate.name}</Title>
              <Text mt="xs" color="dimmed" style={{ flexGrow: 1 }}>{candidate.description}</Text>
              <Button onClick={() => { setEditingCandidate(candidate); setIsEditModalOpen(true); }} mt="md" fullWidth>
                Edit
              </Button>
              <Button onClick={() => handleDeleteCandidate(candidate.id)} mt="xs" color="red" fullWidth>
                Delete
              </Button>
            </Card>
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