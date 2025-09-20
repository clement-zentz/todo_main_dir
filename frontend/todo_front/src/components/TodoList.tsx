// frontend/todo_front/src/components/todo_list.tsx
import { useEffect, useState } from "react";

type Todo = {
    id: number;
    title: string;
    description: string;
    done: boolean;
    created_at: string;
    updated_at: string;
};

function TodoList(){
    const [todos, setTodos] = useState<Todo[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/todo_list/')
            .then(res => res.json())
            .then(data => {
                setTodos(data);
                setLoading(false)
            });
    }, []);


    if (loading) return <div>Loading...</div>;

    return (
        <ul>
            {todos.map(todo => (
                <li key={todo.id}>
                    <strong>{todo.title}</strong> - 
                    {todo.description} [{todo.done ? '✔️' : '❌'}]
                </li>
            ))}
        </ul>
    )
}

export default TodoList;