// frontend/todo_front/src/components/todo_list.tsx
import React from "react";
import { useTodos, useDeleteTodo, useUpdateTodo } from "@/hooks/useTodoApi";
import { Todo } from "@/types";
import TodoModal from "./TodoModal";
import { useModal } from "@/hooks/useModal";


const TodoList: React.FC = () => {
    const { data: todos, isLoading, error } = useTodos();
    const { mutate: deleteTodo } = useDeleteTodo();
    const { mutate: updateTodo, isPending: isUpdating } = useUpdateTodo();
    const { isOpen, currentTodo, openModal, closeModal } = useModal();

    const handleToggleComplete = (todo: Todo) => {
        updateTodo({ id: todo.id, updatedTodo: { done: !todo.done } });
    }

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this todo ?')) {
            deleteTodo(id);
        }
    };

    const handleUpdateTodo = (data: Omit<Todo, 'id' | 'owner' | 'created_at'>) => {
        if (currentTodo) {
            updateTodo(
                {id: currentTodo.id, updatedTodo: data},
                // close modal after success
                { onSuccess: () => closeModal(), }
            );
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
                            <div className="todo-content">
                                <span className={todo.done ? 'strikethrough' : ''}>{todo.title}</span>
                                {todo.description && (
                                    <p className={`todo-description ${todo.done ? 'strikethrough' : ''}`}>
                                        {todo.description}
                                    </p>
                                )}
                            </div>
                            <div className="todo-actions">
                                <button onClick={() => openModal(todo)}>Edit</button>
                                <button onClick={() => handleDelete(todo.id)}>Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            {/* Editing modal */}
            <TodoModal
                todo={currentTodo}
                onClose={closeModal}
                onSubmit={handleUpdateTodo}
                isLoading={isUpdating}
            />
        </div>
    );
};

export default TodoList;