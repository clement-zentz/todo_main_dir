// frontend/todo_front/src/components/todo_list.tsx
import React from "react";
import { useTodos, useDeleteTodo, useUpdateTodo } from "@/hooks/useTodoApi";
import { Todo } from "@/types";


const TodoList: React.FC = () => {
    const { data: todos, isLoading, error } = useTodos();
    const { mutate: deleteTodo } = useDeleteTodo();
    const { mutate: updateTodo } = useUpdateTodo();

    const handleToggleComplete = (todo: Todo) => {
        updateTodo({ id: todo.id, updatedTodo: { done: !todo.done } });
    }

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this todo ?')) {
            deleteTodo(id);
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error : {error.message}</div>

    return (
        <div className="todo-list">
            <h2>My Todos</h2>
            {todos?.length === 0 ? (
                <p>No todo for the moment.</p>
            ) : (
                <ul>
                    {todos?.map((todo) => (
                        <li key={todo.id} className={todo.done ? 'done' : ''}>
                            <input 
                                type="checkbox"
                                checked={todo.done}
                                onChange={() => handleToggleComplete(todo)}
                            />
                            <span>{todo.title}</span>
                            <button onClick={() => handleDelete(todo.id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default TodoList;