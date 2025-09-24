// frontend/todo_front/src/components/TodoForm.tsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useCreateTodo } from "@/hooks/useTodoApi";

type FormData = {
    title: string;
    description?: string;
};

const TodoForm: React.FC = () => {
    const { register, handleSubmit, reset } = useForm<FormData>();
    const { mutate: createTodo, isPending } = useCreateTodo();
    const [showDescription, setShowDescription] = useState(false);

    const onSubmit = (data: FormData) => {
        createTodo({ 
            title: data.title,
            // ✅ Send empty string
            description: data.description || "",
            done: false
        });
        reset(); // reset form after submiting
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="todo-form">
            <input 
                {...register('title', { required: 'The title is mandatory' })}
                placeholder="Write a todo title..."
                disabled={isPending}
            />
            {showDescription && (
                <textarea 
                    {...register('description')}
                    placeholder="Description (optionnal)..."
                    rows={3}
                    disabled={isPending}
                />
            )}
            <div className="form-actions">
                <button 
                    type="button"
                    onClick={() => setShowDescription(!showDescription)}
                    className="description-toggle"
                    id="description-btn"
                >
                    {showDescription ? 'Hide': 'Write description'}
                </button>
                <button type="submit" disabled={isPending}>
                    {isPending ? 'In progress...': 'Add todo'}
                </button>
            </div>
        </form>
    );
};

export default TodoForm