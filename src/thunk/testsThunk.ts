import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/api/api';
import { AnswerItem, TestForAdd, TestsItem } from '@/store/types';

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
  async (
    credentials: { username: string; password: string },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const userData = await api.signin(credentials);
      dispatch(getCurrentUser());
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
      const response = await api.getCurrentUser();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch current user'
      );
    }
  }
);

export const getAllTestsThunk = createAsyncThunk(
  'tests',
  async (
    data: {
      page?: number;
      per?: number;
      search?: string;
      sort?: string;
    } = {},
    { rejectWithValue }
  ) => {
    try {
      const response = await api.getTests(data);
      return response;
    } catch (error) {
      return rejectWithValue('Error fetching tests');
    }
  }
);

export const createTestFlow = createAsyncThunk(
  'test/createTestFlow',
  async (data: TestForAdd, { rejectWithValue }) => {
    try {
      const createdTest = await api.createTest({ title: data.testTitle });
      if (!createdTest || !createdTest.id) {
        throw new Error('Failed to create test');
      }
      const createdQuestions = [];
      for (const question of data.questionList) {
        const createdQuestion = await api.createQuestion(createdTest.id, {
          title: question.title,
          question_type: question.question_type,
          answer: 0,
        });
        createdQuestions.push({
          ...createdQuestion,
          localId: question.id,
        });
      }

      for (const question of createdQuestions) {
        const answersForQuestion = data.answerList.filter(
          answer => answer.questionId === question.localId
        );

        for (const answer of answersForQuestion) {
          await api.createAnswer(question.id, {
            text: answer.text,
            is_right: answer.is_right,
          });
        }
      }

      return { createdTest, createdQuestions };
    } catch (error: any) {
      console.error('Error in createTestFlow:', error);
      return rejectWithValue(
        error.response?.data?.message ||
          'An error occurred during test creation'
      );
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

export const getTestByIdThunk = createAsyncThunk(
  'tests/getTestById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.getTestById(id);
      return response.data;
    } catch (error) {
      console.error('Error fetching test by id:', error);
      return rejectWithValue('Error fetching test');
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

export const createQuestionThunk = createAsyncThunk(
  'questions/createQuestion',
  async (
    {
      testId,
      data,
    }: {
      testId: string;
      data: {
        title: string;
        question_type: string;
        answer: number;
        answers: AnswerItem[];
      };
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.createQuestion(testId, data);
      return response;
    } catch (error) {
      return rejectWithValue('Error creating question');
    }
  }
);

export const deleteQuestionThunk = createAsyncThunk(
  'questions/deleteQuestion',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.deleteQuestion(id);
      return id;
    } catch (error) {
      console.error('Error deleting question:', error);
      return rejectWithValue('Ошибка при удалении вопроса');
    }
  }
);

export const createAnswerThunk = createAsyncThunk(
  'answers/createAnswer',
  async (
    {
      questionId,
      data,
    }: { questionId: string; data: { text: string; is_right: boolean } },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.createAnswer(questionId, data);
      return response;
    } catch (error) {
      console.error('Error creating answer:', error);
      return rejectWithValue(error);
    }
  }
);

// // Редактирование ответа
// export const editAnswerThunk = createAsyncThunk(
//   'answers/editAnswer',
//   async (
//     { id, data }: { id: string; data: { text: string; is_right: boolean } },
//     { rejectWithValue }
//   ) => {
//     try {
//       const response = await api.editAnswer(id, data);
//       return response; // Возвращаем обновленные данные
//     } catch (error) {
//       console.error('Error editing answer:', error);
//       return rejectWithValue(error);
//     }
//   }
// );


export const moveAnswerThunk = createAsyncThunk(
  'answers/moveAnswer',
  async (
    { id, position }: { id: string; position: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.moveAnswer(id, position);
      return response; 
    } catch (error) {
      console.error('Error moving answer:', error);
      return rejectWithValue(error);
    }
  }
);

export const deleteAnswerThunk = createAsyncThunk(
  'answers/deleteAnswer',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.deleteAnswer(id);
      return id;
    } catch (error) {
      console.error('Error deleting answer:', error);
      return rejectWithValue(error);
    }
  }
);
