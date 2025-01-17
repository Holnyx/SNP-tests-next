import { getCurrentUser, signinThunk, signupThunk } from '@/thunk/testsThunk';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  user: null | {
    username: string;
    password: string;
    password_confirmation: string;
    is_admin: boolean;
  };
  isLoading: boolean;
  errors: string[];
}

const initialState: AuthState = {
  user: null,
  isLoading: false,
  errors: [],
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.errors = [];
    },
    removeError(state, action) {
        state.errors = state.errors.filter((_, index) => index !== action.payload)
    },
  },
  extraReducers: builder => {
    builder
      .addCase(signupThunk.pending, state => {
        state.isLoading = true;
        state.errors = [];
      })
      .addCase(signupThunk.fulfilled, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(signupThunk.rejected, (state, action) => {
        state.isLoading = false;
        if (action.error.message) {
          state.errors.push(action.error.message);
        } else {
          state.errors.push('An unknown error occurred');
        }
      })
      .addCase(signinThunk.pending, state => {
        state.isLoading = true;
        state.errors = [];
      })
      .addCase(signinThunk.fulfilled, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.user = action.payload; 
      })
      .addCase(signinThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.errors.push(action.payload as string);
      });

      builder
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
        state.errors = [];
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = [action.payload as string]
      });
  },
});

export const { logout, removeError } = authSlice.actions;
export default authSlice.reducer;
