// ...existing code...
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navigate, Routes, Route, BrowserRouter } from 'react-router-dom';
import TodoListPage from './pages/TodoListPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();
// ...existing code...

const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();
  return (
    <Routes>
      <Route path="/todo_list" element={
        <ProtectedRoute><TodoListPage /></ProtectedRoute>
      } />
      <Route path="/login" element={
        isAuthenticated ? <Navigate to="/todo_list" replace /> : <LoginPage />
      } />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="*" element={<Navigate to="/todo_list" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};
// ...existing code...
export default App