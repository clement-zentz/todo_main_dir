// Tests pour LoginPage.tsx (vitest + @testing-library/react)
// Objectifs:
// 1. Rendu des champs + bouton
// 2. Soumission appelle useLogin.mutate avec credentials
// 3. Etat pending désactive bouton + texte "Login in progress..."
// 4. Succès => saveTokens + navigate('/todo_list')
// 5. Erreur affichée
// 6. Bouton Register redirige vers /register

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPage from './LoginPage';
import { vi } from 'vitest';

// Mocks
const mockMutate = vi.fn();
const mockNavigate = vi.fn();
const mockSaveTokens = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<any>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockLoginHookState: {
  isPending: boolean;
  error: any;
  mutate: typeof mockMutate;
} = {
  isPending: false,
  error: null,
  mutate: mockMutate,
};

vi.mock('@/hooks/useTodoApi', () => ({
  useLogin: () => ({
    mutate: mockLoginHookState.mutate,
    isPending: mockLoginHookState.isPending,
    error: mockLoginHookState.error,
  }),
}));

vi.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    login: mockSaveTokens,
    logout: vi.fn(),
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
  }),
}));

// Helpers
const setup = () => {
  render(<LoginPage />);
  const emailInput = screen.getByLabelText(/username/i);
  const passwordInput = screen.getByLabelText(/password/i);
  const submitBtn = screen.getByRole('button', { name: /login/i });
  return { emailInput, passwordInput, submitBtn };
};

beforeEach(() => {
  mockMutate.mockReset();
  mockNavigate.mockReset();
  mockSaveTokens.mockReset();
  mockLoginHookState.isPending = false;
  mockLoginHookState.error = null;
});

describe('LoginPage', () => {
  it('rend champs et bouton', () => {
    const { emailInput, passwordInput, submitBtn } = setup();
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(submitBtn).toBeInTheDocument();
    expect(submitBtn).toBeEnabled();
  });

  it('soumet credentials et appelle mutate', async () => {
    const user = userEvent.setup();
    const { emailInput, passwordInput, submitBtn } = setup();

    await user.type(emailInput, 'john@example.com');
    await user.type(passwordInput, 'secret');
    await user.click(submitBtn);

    expect(mockMutate).toHaveBeenCalledTimes(1);
    const [passedData, options] = mockMutate.mock.calls[0];
    expect(passedData).toEqual({ email: 'john@example.com', password: 'secret' });
    expect(options.onSuccess).toBeInstanceOf(Function);
  });

  it('affiche état pending', () => {
    mockLoginHookState.isPending = true;
    const { submitBtn } = setup();
    expect(submitBtn).toBeDisabled();
    expect(submitBtn).toHaveTextContent(/login in progress/i);
  });

  it('sur succès: sauvegarde tokens et navigue', async () => {
    const user = userEvent.setup();
    setup();

    // Simuler submit
    await user.type(screen.getByLabelText(/username/i), 'a@b.com');
    await user.type(screen.getByLabelText(/password/i), 'pwd');
    await user.click(screen.getByRole('button', { name: /login/i }));

    // Déclencher onSuccess renvoyé par mutate
    const [, opts] = mockMutate.mock.calls[0];
    opts.onSuccess({ access: 'acc123', refresh: 'ref456' });

    expect(mockSaveTokens).toHaveBeenCalledWith({ access: 'acc123', refresh: 'ref456' });
    expect(mockNavigate).toHaveBeenCalledWith('/todo_list', { replace: true });
  });

  it('affiche message erreur', () => {
    mockLoginHookState.error = { message: 'Invalid credentials' };
    setup();
    expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
  });

  it('bouton Register navigue vers /register', async () => {
    const user = userEvent.setup();
    setup();
    const registerBtn = screen.getByRole('button', { name: /register/i });
    await user.click(registerBtn);
    expect(mockNavigate).toHaveBeenCalledWith('/register');
  });

  it('navigue pas tant que onSuccess pas appelé', async () => {
    const user = userEvent.setup();
    setup();
    await user.type(screen.getByLabelText(/username/i), 'x@y.com');
    await user.type(screen.getByLabelText(/password/i), 'pwd');
    await user.click(screen.getByRole('button', { name: /login/i }));
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});

// Optionnel: support jest auto (si projet lance avec jest, alias vi->jest)
declare global {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  var vi: typeof import('vitest')['vi'];
}