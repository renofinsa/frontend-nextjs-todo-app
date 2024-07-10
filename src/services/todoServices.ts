import { Todo } from '@/interface/todo.types';
import axios from 'axios';

const API_URL = 'http://localhost:3000/todos';

export const fetchTodos = async (): Promise<Todo[]> => {
  try {
    const response = await axios.get<Todo[]>(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching todos:', error);
    throw error;
  }
};

export const fetchTodoById = async (id: number): Promise<Todo> => {
  try {
    const response = await axios.get<Todo>(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching todo with id ${id}:`, error);
    throw error;
  }
};

export const updateTodoStatus = async (id: number): Promise<Todo> => {
  try {
    const response = await axios.patch<Todo>(`${API_URL}/change-status/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error updating status for todo with id ${id}:`, error);
    throw error;
  }
};

export const deleteTodo = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error(`Error deleting todo with id ${id}:`, error);
    throw error;
  }
};

export const deleteTodosByIds = async (ids: number[]): Promise<void> => {
  try {
    await axios.delete(`${API_URL}?ids=${ids.join(',')}`);
  } catch (error) {
    console.error('Error deleting todos:', error);
    throw error;
  }
};

export const addTodo = async (todo: Partial<Todo>): Promise<Todo> => {
  try {
    const response = await axios.post<Todo>(API_URL, todo);
    return response.data;
  } catch (error) {
    console.error('Error adding todo:', error);
    throw error;
  }
};

export const updateTodo = async (id: number, todo: Partial<Todo>): Promise<Todo> => {
  const response = await axios.patch<Todo>(`${API_URL}/${id}`, todo);
  return response.data;
};