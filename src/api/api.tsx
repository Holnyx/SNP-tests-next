import { TestsOptionsForSelect } from '@/store/types';
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  headers: {
    'scope-key': process.env.REACT_APP_SCOPE_KEY,
  },
});

// Регистрация
export const signUp = async (data: {
  username: string;
  password: string;
  password_confirmation: string;
  is_admin: boolean;
}) => {
  try {
    const response = await api.post('/signup', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Авторизация
export const signIn = async (data: { username: string; password: string }) => {
  try {
    const response = await api.post('/signin', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Получение текущего пользователя
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/users/current');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Выход
export const logout = async () => {
  try {
    await api.delete('/logout');
  } catch (error) {
    throw error;
  }
};

// Создание теста
export const createTest = async (data: { title: string }) => {
  try {
    const response = await api.post('/tests', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Редактирование теста
export const editTest = async (testId: string, title: string) => {
  try {
    const response = await api.patch(`/tests/${testId}`, { title });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Удаление теста
export const deleteTest = async (testId: string) => {
  try {
    await api.delete(`/tests/${testId}`);
  } catch (error) {
    throw error;
  }
};

// Получение теста
export const getTest = async (testId: string) => {
  try {
    const response = await api.get(`/tests/${testId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Получение списка тестов с пагинацией
export const getTests = async (
  page: number = 1,
  per: number = 5,
  search: string = '',
  sort: string = 'created_at_desc'
) => {
  try {
    const response = await api.get('/tests', {
      params: { page, per, search, sort },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Создание вопроса
export const createQuestion = async (
  testId: string,
  title: string,
  question_type: TestsOptionsForSelect,
  answer: number
) => {
  try {
    const response = await api.post(`/tests/${testId}/questions`, {
      title,
      question_type,
      answer,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Редактирование вопроса
export const editQuestion = async (
  questionId: string,
  title: string,
  question_type: TestsOptionsForSelect,
  answer: number
) => {
  try {
    const response = await api.patch(`/questions/${questionId}`, {
      title,
      question_type,
      answer,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Удаление вопроса
export const deleteQuestion = async (questionId: string) => {
  try {
    await api.delete(`/questions/${questionId}`);
  } catch (error) {
    throw error;
  }
};

// Создание ответа
export const createAnswer = async (
  questionId: string,
  text: string,
  is_right: boolean
) => {
  try {
    const response = await api.post(`/questions/${questionId}/answers`, {
      text,
      is_right,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Редактирование ответа
export const editAnswer = async (
  answerId: string,
  text: string,
  is_right: boolean
) => {
  try {
    const response = await api.patch(`/answers/${answerId}`, {
      text,
      is_right,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Перемещение ответа
export const moveAnswer = async (answerId: string, position: number) => {
  try {
    const response = await api.patch(
      `/answers/${answerId}/insert_at/${position}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Удаление ответа
export const deleteAnswer = async (answerId: string) => {
  try {
    await api.delete(`/answers/${answerId}`);
  } catch (error) {
    throw error;
  }
};

export default api;
