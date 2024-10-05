import axios from 'axios';

const API_URL = 'http://65.108.46.30:3003/api';

const api = axios.create({
  baseURL: API_URL,
});

// Interceptor to add Authorization header to all requests except login
api.interceptors.request.use((config) => {
  if (!config.url?.includes('/login')) {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = token;
    }
  }
  return config;
});

export const login = async (personal_code: string) => {
  const response = await api.post('/login', { personal_code });
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

export const getCandidates = async () => {
  const response = await api.get('/candidates');
  return response.data;
};

export const getCandidateStats = async () => {
  const response = await api.get('/candidates/stats');
  return response.data;
};

export const vote = async (candidate_id: number) => {
  const response = await api.post('/vote', { candidate_id });
  return response.data;
};

export const addCandidate = async (candidateData: { name: string; description: string; image_url: string }) => {
  const response = await api.post('/candidates', candidateData);
  return response.data;
};

export const editCandidate = async (id: number, candidateData: { name: string; description: string; image_url: string }) => {
  const response = await api.put(`/candidates/${id}`, candidateData);
  return response.data;
};

export const deleteCandidate = async (id: number) => {
  const response = await api.delete(`/candidates/${id}`);
  return response.data;
};

export const removeAllVotes = async () => {
  const response = await api.delete('/votes');
  return response.data;
};

export const checkVoteStatus = async () => {
  const response = await api.get('/vote/status');
  return response.data;
};

export default api;