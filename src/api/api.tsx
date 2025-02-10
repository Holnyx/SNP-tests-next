import axios, { AxiosInstance } from 'axios';

const api: AxiosInstance = axios.create({
  baseURL: '/api/v1/',
  headers: {
    'scope-key': process.env.NEXT_PUBLIC_SCOPE_KEY,
  },
});

api.defaults.withCredentials = true;

const testApi = {
  signup: async (data: {
    username: string;
    password: string;
    password_confirmation: string;
    is_admin: boolean;
  }) => {
    try {
      const response = await api.post('/signup', data);
      return response.data;
    } catch (error) {
      console.error('Error during signup:', error);
      throw error;
    }
  },

  signin: async (data: { username: string; password: string }) => {
    try {
      const response = await api.post('/signin', data);
      return response.data;
    } catch (error) {
      console.error('Error during signin:', error);
      throw error;
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get('/users/current');
      return response.data;
    } catch (error) {
      console.error('Error fetching current user:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      await api.delete('/logout');
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  },

  createTest: async (data: { title: string }) => {
    try {
      const response = await api.post('/tests', data);
      return response.data;
    } catch (error) {
      console.error('Error creating test:', error);
      throw error;
    }
  },

  updateTest: async (id: string, data: { title: string }) => {
    try {
      const response = await api.patch(`/tests/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error editing test:', error);
      throw error;
    }
  },

  deleteTest: async (id: string) => {
    try {
      await api.delete(`/tests/${id}`);
    } catch (error) {
      console.error('Error deleting test:', error);
      throw error;
    }
  },

  getTestById: async (id: string) => {
    try {
      const response = await api.get(`/tests/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching test by id:', error);
      throw error;
    }
  },

  getTests: async (data: {
    page?: number;
    per?: number;
    search?: string;
    sort?: string;
  }) => {
    try {
      const timestamp = new Date().getTime();
      const response = await api.get('/tests', {
        params: {
          ...data,
          timestamp,
        },
        headers: {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching tests:', error);
      throw error;
    }
  },

  createQuestion: async (
    testId: string,
    data: { title: string; question_type: string; answer: number }
  ) => {
    try {
      const response = await api.post(`/tests/${testId}/questions`, data);
      return response.data;
    } catch (error) {
      console.error('Error creating question:', error);
      throw error;
    }
  },

  editQuestion: async (
    id: string,
    data: { title: string; question_type: string; answer: number }
  ) => {
    try {
      const response = await api.patch(`/questions/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error editing question:', error);
      throw error;
    }
  },

  deleteQuestion: async (id: string) => {
    try {
      await api.delete(`/questions/${id}`);
    } catch (error) {
      console.error('Error deleting question:', error);
      throw error;
    }
  },

  createAnswer: async (
    questionId: string,
    data: { text: string; is_right: boolean }
  ) => {
    try {
      const response = await api.post(`/questions/${questionId}/answers`, data);
      return response.data;
    } catch (error) {
      console.error('Error creating answer:', error);
      throw error;
    }
  },

  editAnswer: async (id: string, data: { text: string; is_right: boolean }) => {
    try {
      const response = await api.patch(`/answers/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error editing answer:', error);
      throw error;
    }
  },

  moveAnswer: async (id: string, position: number) => {
    try {
      const response = await api.patch(`/answers/${id}/insert_at/${position}`);
      return response.data;
    } catch (error) {
      console.error('Error moving answer:', error);
      throw error;
    }
  },

  deleteAnswer: async (id: string) => {
    try {
      await api.delete(`/answers/${id}`);
    } catch (error) {
      console.error('Error deleting answer:', error);
      throw error;
    }
  },

  getQuestions: async (testId: string) => {
    try {
      const response = await axios.get(`/tests/${testId}/questions`);
      return response.data;
    } catch (error) {
      console.error('Error fetching questions:', error);
      throw error;
    }
  },
};

export default testApi;
