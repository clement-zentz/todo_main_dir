// frontend/todo_front/src/pages/TodoListPage.tsx

// this is the main page: Todo list + forms

import React from "react";
import TodoList from "@/components/TodoList";
import TodoForm from "@/components/TodoForm";
import { useLogout } from "@/hooks/useTodoApi";

const TodoListPage: React.FC = () => {
    const logout = useLogout();

    return (
        <div className="container">
            <header>
                <h1>Todo App</h1>
                <button onClick={logout}>Logout</button>
            </header>
            <TodoForm />
            <TodoList />
        </div>
    );
};

export default TodoListPage;