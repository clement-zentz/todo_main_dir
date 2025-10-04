import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegisterPage from './RegisterPage';
import { vi } from 'vitest';


const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<any>('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

const fetchMock = vi.fn();
const alertMock = vi.fn();

let consoleErrSpy: any;

beforeAll(() => {
  global.fetch = fetchMock;
  global.alert = alertMock;
  consoleErrSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  consoleErrSpy.mockRestore();
});

beforeEach(() => {
  fetchMock.mockReset();
  alertMock.mockReset();
  mockNavigate.mockReset();
});

const fillAndSubmit = async (user: ReturnType<typeof userEvent['setup']>) => {
  await user.type(screen.getByLabelText(/username/i), 'john');
  await user.type(screen.getByLabelText(/email/i), 'john@example.com');
  await user.type(screen.getByLabelText(/password/i), 'secret123');
  await user.click(screen.getByRole('button', { name: /register/i }));
};

describe('RegisterPage', () => {
  it('rend les champs et boutons', () => {
    render(<RegisterPage />);
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /back to login/i })).toBeInTheDocument();
  });

  it('soumission succès -> fetch + alert succès + navigate /login', async () => {
    fetchMock.mockResolvedValueOnce({ ok: true });
    render(<RegisterPage />);
    const user = userEvent.setup();
    await fillAndSubmit(user);

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:8000/api/register/',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
    );
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body).toEqual({
      username: 'john',
      email: 'john@example.com',
      password: 'secret123',
    });
    expect(alertMock).toHaveBeenCalledWith(expect.stringMatching(/account created/i));
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('réponse non ok -> alert erreur', async () => {
    fetchMock.mockResolvedValueOnce({ ok: false });
    render(<RegisterPage />);
    const user = userEvent.setup();
    await fillAndSubmit(user);
    expect(alertMock).toHaveBeenCalledWith(expect.stringMatching(/something went wrong/i));
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('exception réseau -> alert erreur', async () => {
    fetchMock.mockRejectedValueOnce(new Error('network'));
    render(<RegisterPage />);
    const user = userEvent.setup();
    await fillAndSubmit(user);
    expect(alertMock).toHaveBeenCalledWith(expect.stringMatching(/something went wrong/i));
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('bouton Back to Login navigue sans submit', async () => {
    render(<RegisterPage />);
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /back to login/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/login');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('form vide: pas d\'appel fetch (validation react-hook-form)', async () => {
    render(<RegisterPage />);
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /register/i }));
    expect(fetchMock).not.toHaveBeenCalled();
  });
});