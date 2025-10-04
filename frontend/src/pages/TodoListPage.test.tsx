import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TodoListPage from './TodoListPage';
import { vi } from 'vitest';

// Mocks
const mockCreate = vi.fn();
const mockUpdate = vi.fn();
const mockDelete = vi.fn();
const mockLogout = vi.fn();

const sampleTodos = [
  {
    id: 1,
    title: 'First',
    description: 'Desc 1',
    done: false,
    created_at: '',
    updated_at: '',
    owner: 1,
  },
  {
    id: 2,
    title: 'Second',
    description: '',
    done: true,
    created_at: '',
    updated_at: '',
    owner: 1,
  },
];

let mockTodosState: {
  data: any;
  isLoading: boolean;
  error: any;
} = {
  data: sampleTodos,
  isLoading: false,
  error: null,
};

vi.mock('@/hooks/useTodoApi', () => ({
  useTodos: () => mockTodosState,
  useCreateTodo: () => ({ mutate: mockCreate, isPending: false }),
  useUpdateTodo: () => ({ mutate: mockUpdate, isPending: false }),
  useDeleteTodo: () => ({ mutate: mockDelete }),
}));

vi.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    logout: mockLogout,
    isAuthenticated: true,
    accessToken: 't',
    refreshToken: 'r',
    login: vi.fn(),
  }),
}));

// Stub confirm
const confirmSpy = vi.spyOn(window, 'confirm').mockImplementation(() => true);

beforeEach(() => {
  mockCreate.mockReset();
  mockUpdate.mockReset();
  mockDelete.mockReset();
  mockLogout.mockReset();
  mockTodosState = { data: sampleTodos, isLoading: false, error: null };
  confirmSpy.mockClear();
});

const renderPage = () => render(<TodoListPage />);

describe('TodoListPage', () => {
  it('rend header, formulaire et liste', () => {
    renderPage();
    expect(screen.getByText(/todo app/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/write a todo title/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add todo/i })).toBeInTheDocument();
    expect(screen.getByText(/my todos/i)).toBeInTheDocument();
  });

  it('affiche loading', () => {
    mockTodosState.isLoading = true;
    mockTodosState.data = undefined;
    renderPage();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('affiche erreur', () => {
    mockTodosState.error = new Error('Boom');
    renderPage();
    expect(screen.getByText(/error : boom/i)).toBeInTheDocument();
  });

  it('affiche todos et classes done', () => {
    renderPage();
    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();
    // Second est done -> li a class "done"
    const doneItem = screen.getByText('Second').closest('li');
    expect(doneItem).toHaveClass('done');
  });

  it('création todo: envoie mutate avec valeur', async () => {
    renderPage();
    const user = userEvent.setup();
    const input = screen.getByPlaceholderText(/write a todo title/i);
    await user.type(input, 'New Task');
    await user.click(screen.getByRole('button', { name: /add todo/i }));
    expect(mockCreate).toHaveBeenCalledWith({
      title: 'New Task',
      description: '',
      done: false,
    });
  });

  it('toggle done appelle update mutate avec inversion', async () => {
    renderPage();
    const user = userEvent.setup();
    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[0]);
    expect(mockUpdate).toHaveBeenCalledWith({ id: 1, updatedTodo: { done: true } });
  });

  it('delete confirme et appelle delete mutation', async () => {
    renderPage();
    const user = userEvent.setup();
    const delButtons = screen.getAllByRole('button', { name: /delete/i });
    await user.click(delButtons[0]);
    expect(confirmSpy).toHaveBeenCalled();
    expect(mockDelete).toHaveBeenCalledWith(1);
  });

  it('edit ouvre modal, submit appelle update + onSuccess ferme modal', async () => {
    renderPage();
    const user = userEvent.setup();
    await user.click(screen.getAllByRole('button', { name: /edit/i })[0]);
    expect(await screen.findByText(/edit todo/i)).toBeInTheDocument();

    const titleInput = screen.getByLabelText(/title/i);
    await user.clear(titleInput);
    await user.type(titleInput, 'First Updated');
    await user.click(screen.getByRole('button', { name: /save/i }));

    const [, opts] = mockUpdate.mock.calls.at(-1)!;
    act(() => {
      opts?.onSuccess?.();
    });

    await waitFor(() =>
      expect(screen.queryByText(/edit todo/i)).not.toBeInTheDocument()
    );
  });

  it('logout bouton appelle logout()', async () => {
    renderPage();
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /logout/i }));
    expect(mockLogout).toHaveBeenCalled();
  });
});