import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import TodoListPage from './pages/TodoListPage';
import LoginPage from './pages/LoginPage';
import './App.css'

const queryClient = new QueryClient();

const App: React.FC = () => {
  const isAuthentificated = !!localStorage.getItem('access_token');

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route 
            path="/todo_list"
            element={isAuthentificated ? <TodoListPage /> : <Navigate to="/login/"/>}
          />
          <Route 
            path="/login"
            element={isAuthentificated ? <Navigate to="/todo_list" /> : <LoginPage />}
          />
          <Route path='*' element={<Navigate to="/todo_list" />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
};

export default App
