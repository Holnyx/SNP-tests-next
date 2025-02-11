import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import api from '@/api/api';

import { getCurrentUser } from './testsThunk';

export const signupThunk = createAsyncThunk(
  'auth/signup',
  async (
    userData: {
      username: string;
      password: string;
      password_confirmation: string;
      is_admin: boolean;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.signup(userData);
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.username?.[0] === 'has already been taken'
            ? 'User already exists'
            : error.response?.data?.password_confirmation?.[0] ===
                `doesn't match Password`
              ? `Doesn't match Password`
              : error.response?.data.message || 'Registration error';
        return rejectWithValue(errorMessage);
      } else {
        return rejectWithValue('Unknown error');
      }
    }
  }
);

export const signinThunk = createAsyncThunk(
  'auth/signin',
  async (
    credentials: { username: string; password: string },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const userData = await api.signin(credentials);
      dispatch(getCurrentUser());
      return userData;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error === 'username or password is invalid'
          ? 'Username or password is invalid'
          : error.response?.data.message || 'Login failed';
      return rejectWithValue(errorMessage);
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
      return rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
  }
);
