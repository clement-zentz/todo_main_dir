// frontend/todo_front/src/pages/LoginPage.tsx
import React from "react";
import { useForm } from "react-hook-form";
import { useLogin } from "@/hooks/useTodoApi";
import { LoginCredentials } from "@/types";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const LoginPage: React.FC = () => {
    const { register, handleSubmit } = useForm<LoginCredentials>();
    const { mutate: login, isPending, error } = useLogin();
    const navigate = useNavigate();
    const { login: saveTokens } = useAuth();

    const onSubmit = (data: LoginCredentials) => {
        login(data, {
            onSuccess: (tokens) => {
                saveTokens(tokens);
                navigate('/todo_list', { replace: true });
            },
        });
    };
    
    return (
        <div className="login-container">
            <h1>Login</h1>
            {error && <div className="error">{error.message}</div>}
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label htmlFor="login-username">Username</label>
                    <input
                        id="login-username" 
                        {...register('email', 
                        { required: true })} 
                    />
                </div>
                <div>
                    <label htmlFor="login-password">Password</label>
                    <input
                        id="login-password" 
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