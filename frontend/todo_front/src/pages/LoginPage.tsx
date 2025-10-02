// frontend/todo_front/src/pages/LoginPage.tsx
import React from "react";
import { useForm } from "react-hook-form";
import { useLogin } from "@/hooks/useTodoApi";
import { LoginCredentials } from "@/types";
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
    const { register, handleSubmit } = useForm<LoginCredentials>();
    const { mutate: login, isPending, error } = useLogin();
    const navigate = useNavigate();

    const onSubmit = (data: LoginCredentials) => {
        login(data, {
            onSuccess: (tokens) => {
                localStorage.setItem('access_token', tokens.access);
                localStorage.setItem('refresh_token', tokens.refresh);
                // TODO: replace page reload with navigate.
                // Force reload to update App's auth state
                window.location.href = '/todo_list';
                // TODO: fix navigate.
                // Manage authentication state in a React context.
                navigate('/todo_list') // Redirect to list after login
            },
        });
    };
    
    return (
        <div className="login-container">
            <h1>Login</h1>
            {error && <div className="error">{error.message}</div>}
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label>Username</label>
                    <input {...register('email', { required: true })} />
                </div>
                <div>
                    <label>Password</label>
                    <input 
                        type="password"
                        {...register('password', { required: true })}
                    />
                </div>
                <button type="submit" disabled={isPending}>
                    {isPending ? 'Login in progress...' : 'Login'}
                </button>
                <button type="button" onClick={() => navigate("/register")} style={{ marginTop: "1rem" }}>
                    Register
                </button>
            </form>
        </div>
    );
};

export default LoginPage;