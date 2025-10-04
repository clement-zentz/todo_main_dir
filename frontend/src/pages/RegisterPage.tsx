// frontend/todo_front/src/pages/RegisterPage.tsx
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

type RegisterForm = {
  username: string;
  email: string;
  password: string;
};

const RegisterPage: React.FC = () => {
  const { register, handleSubmit } = useForm<RegisterForm>();
  const navigate = useNavigate();

  const onSubmit = async (data: RegisterForm) => {
    try {
      const response = await fetch("http://localhost:8000/api/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      alert("✅ Account created! You can now log in.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("❌ Something went wrong.");
    }
  };

  return (
    <div className="register-container">
      <h1>Register</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="reg-username">Username</label>
          <input id="reg-username" {...register("username", { required: true })} />
        </div>
        <div>
          <label htmlFor="reg-email">Email</label>
          <input id="reg-email" type="email" {...register("email", { required: true })} />
        </div>
        <div>
          <label htmlFor="reg-password">Password</label>
          <input id="reg-password" type="password" {...register("password", { required: true })} />
        </div>
        <button type="submit">Register</button>
        <button type="button" onClick={() => navigate("/login")} style={{ marginTop: "1rem" }}>
            Back to Login
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
