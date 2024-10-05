import axios, { AxiosInstance } from 'axios';

const API_URL = 'http://65.108.46.30:3003/api';

// Create a function to generate an API instance
const createApiInstance = (token?: string): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_URL,
  });

  // Add interceptor to include token if available
  instance.interceptors.request.use((config) => {
    if (!config.url?.includes('/auth/login') && token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return instance;
};

// Create a default instance for client-side use
const api = createApiInstance();

export const login = async (personalCode: string) => {
  try {
    const response = await api.post('/auth/login', { personal_code: personalCode });
    console.log('Raw login response:', response);
    console.log('Login response data:', response.data);
    
    if (response.data && response.data.token) {
      // Extract user information from the JWT token
      const payload = JSON.parse(atob(response.data.token.split('.')[1]));
      return {
        token: response.data.token,
        user: {
          id: payload.id,
          role: payload.role
        }
      };
    }
    
    console.error('Invalid response format:', response.data);
    throw new Error('Invalid response format from server');
  } catch (error) {
    console.error('Login error:', error);
    if (axios.isAxiosError(error) && error.response) {
      console.error('Error data:', error.response.data);
      console.error('Error status:', error.response.status);
      console.error('Error headers:', error.response.headers);
      throw new Error(`Server error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
    } else if (error instanceof Error) {
      throw error;
    } else {
      throw new Error('An unexpected error occurred during login');
    }
  }
};

export const getCandidates = async () => {
  const token = localStorage.getItem('token');
  try {
    const response = await api.get('/candidates', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching candidates:', error);
    throw error;
  }
};

export const getCandidateStats = async () => {
  const token = localStorage.getItem('token');
  try {
    const response = await api.get('/candidates/stats', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching candidate stats:', error);
    throw error;
  }
};

export const vote = async (candidate_id: number) => {
  const token = localStorage.getItem('token');
  try {
    const response = await api.post('/vote', { candidate_id }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error voting:', error);
    throw error;
  }
};

export const addCandidate = async (candidateData: { name: string; description: string; image_url: string }) => {
  const token = localStorage.getItem('token');
  try {
    const response = await api.post('/candidates', candidateData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error adding candidate:', error);
    throw error;
  }
};

export const editCandidate = async (id: number, candidateData: { name: string; description: string; image_url: string }) => {
  const token = localStorage.getItem('token');
  try {
    const response = await api.put(`/candidates/${id}`, candidateData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error editing candidate:', error);
    throw error;
  }
};

export const deleteCandidate = async (id: number) => {
  const token = localStorage.getItem('token');
  try {
    const response = await api.delete(`/candidates/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting candidate:', error);
    throw error;
  }
};

export const removeAllVotes = async () => {
  const token = localStorage.getItem('token');
  try {
    const response = await api.delete('/vote', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error removing all votes:', error);
    throw error;
  }
};

export const checkVoteStatus = async () => {
  const token = localStorage.getItem('token');
  try {
    const response = await api.get('/vote/status', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error checking vote status:', error);
    throw error;
  }
};

export default api;