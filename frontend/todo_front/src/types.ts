// frontend/todo_front/src/types.ts

export interface Todo {
    id: number;
    title: string;
    done: boolean;
    created_at: string;
    updated_at: string;
    owner: number; 
}

export interface User {
    id: number;
    username: string;
}

export interface AuthTokens {
    access: string;
    refresh: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}