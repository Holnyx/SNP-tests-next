import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/api/api';
import { TestsItem } from '@/store/types';
import testApi from '@/api/api';

export const signupThunk = createAsyncThunk(
  'auth/signup',
  async (userData: {
    username: string;
    password: string;
    password_confirmation: string;
    is_admin: boolean;
  }) => {
    try {
      const response = await api.signup(userData);
      return response.data;
    } catch (error) {
      throw new Error('Registration failed');
    }
  }
);


export const signinThunk = createAsyncThunk(
  'auth/signin',
  async (credentials: { username: string; password: string }, { rejectWithValue }) => {
    try {
      const userData = await testApi.signin(credentials);
      return userData;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);
export const logoutThunk = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await api.logout();
      return 'Logged out successfully';
    } catch (error: any) {
      console.error('Error during logout:', error);
      return rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await testApi.getCurrentUser()
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch current user');
    }
  }
);

export const getAllTestsThunk = createAsyncThunk(
  'tests',
  async (
    params: {
      page?: number;
      per?: number;
      search?: string;
      sort?: string;
    } = {},
    { rejectWithValue }
  ) => {
    try {
      const response = await api.getTests(params);
      return response;
    } catch (error) {
      console.error('Error fetching tests:', error);
      return rejectWithValue('Error fetching tests');
    }
  }
);

export const addTestThunk = createAsyncThunk(
  'tests/add',
  async (testData: TestsItem, { rejectWithValue }) => {
    try {
      const response = await api.createTest(testData);
      return response;
    } catch (error) {
      console.error('Error adding test:', error);
      return rejectWithValue('Error adding test');
    }
  }
);

export const deleteTestThunk = createAsyncThunk(
  'tests/delete',
  async (testId: string, { rejectWithValue }) => {
    try {
      await api.deleteTest(testId);
      return testId;
    } catch (error) {
      console.error('Error deleting test:', error);
      return rejectWithValue('Error deleting test');
    }
  }
);

export const updateTestThunk = createAsyncThunk(
  'tests/update',
  async (
    { id, updatedTest }: { id: string; updatedTest: TestsItem },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.updateTest(id, updatedTest);
      return response;
    } catch (error) {
      console.error('Error updating test:', error);
      return rejectWithValue('Error updating test');
    }
  }
);

export const getQuestionsThunk = createAsyncThunk(
  'questions/getAll',
  async (testId: string, { rejectWithValue }) => {
    try {
      const response = await api.getQuestions(testId);
      return response;
    } catch (error) {
      console.error('Error fetching questions:', error);
      return rejectWithValue('Error fetching questions');
    }
  }
);

