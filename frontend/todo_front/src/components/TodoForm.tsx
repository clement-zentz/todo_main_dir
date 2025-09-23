// frontend/todo_front/src/components/TodoForm.tsx
import React from "react";
import { useForm } from "react-hook-form";
import { useCreateTodo } from "@/hooks/useTodoApi";

type FormData = {
    title: string
}

const TodoForm: React.FC = () => {
    const { register, handleSubmit, reset } = useForm<FormData>();
    const { mutate: createTodo, isPending } = useCreateTodo();

    const onSubmit = (data: FormData) => {
        createTodo({ title: data.title, done: false });
        reset(); // reset form after submiting
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="todo-form">
            <input 
                {...register('title', { required: 'The title is mandatory' })}
                placeholder="Add a todo..."
                disabled={isPending}
            />
            <button type="submit" disabled={isPending}>
                {isPending ? 'In progress...': 'Add'}
            </button>
        </form>
    );
};

export default TodoForm