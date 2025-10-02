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
          <label>Username</label>
          <input {...register("username", { required: true })} />
        </div>
        <div>
          <label>Email</label>
          <input type="email" {...register("email", { required: true })} />
        </div>
        <div>
          <label>Password</label>
          <input type="password" {...register("password", { required: true })} />
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
