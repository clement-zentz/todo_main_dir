// frontend/todo_front/src/api/hooks/useTodoApi.ts

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from '../api/axios';
import { Todo, AuthTokens, LoginCredentials } from "../types";

// Get todo list
export const useTodos = () => {
    return useQuery<Todo[]>({
        queryKey: ['todos'],
        queryFn: async () => {
            const response = await api.get('todo_list/');
            return response.data;
        }
    });
};

export const useCreateTodo = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newTodo: Omit<Todo, 'id' | 'created_at' | 'updated_at' | 'owner'>) =>
            api.post('todo_list/', newTodo),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['todos'] });
        }
    });
};

export const useUpdateTodo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updatedTodo }: { id: number; updatedTodo: Partial<Todo> }) =>
      api.patch(`todo_list/${id}/`, updatedTodo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
};

export const useDeleteTodo = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => api.delete(`todo_list/${id}/`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['todos'] });
        }
    });
};

export const useLogin = () => {
    return useMutation<AuthTokens, Error, LoginCredentials>({
        mutationFn: (credentials: LoginCredentials) =>
            api.post('login/', credentials).then((res) => res.data),    
    });
};

export const useLogout = () => {
    return () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
    };
};