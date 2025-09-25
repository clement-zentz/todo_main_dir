// frontend/todo_front/src/components/TodoModal.tsx
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Todo } from "@/types";

type TodoModalProps = {
    todo: Todo | null;
    onClose: () => void;
    onSubmit: (data: Omit<Todo, 'id' | 'owner' | 'created_at'>) => void;
    isLoading: boolean;
    error?: Error | null;
};

const TodoModal: React.FC<TodoModalProps> = ({ todo, onClose, onSubmit, isLoading}) => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<Omit<Todo, 'id' | 'owner' | 'created_at'>>();

    // Reset form on todo change (ex: open/close)
    useEffect(() => {
        if (todo) {
            reset({
                title: todo.title,
                // ✅ Manage empty string case
                description: todo.description || '',
                done: todo.done,
            });
        }
    }, [todo, reset]);

    if (!todo) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Edit Todo</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                        <label>Title</label>
                        <input
                            {...register('title', { required: 'title is mandatory' })} 
                            defaultValue={todo.title}
                            disabled={isLoading}
                        />
                        {errors.title && <span className="error">{errors.title.message}</span>}
                    </div>
                    <div className="form-group">
                        <label>Description (optionnal)</label>
                        <textarea 
                            {...register('description')}
                            rows={4}
                            placeholder="Add a detailed description..."
                            disabled={isLoading}
                        />
                    </div>
                    <div className="form-group checkbox-group">
                        <label>
                            <input 
                                type="checkbox"
                                {...register('done')}
                                defaultChecked={todo.done}
                                disabled={isLoading}
                            />
                            Done
                        </label>
                    </div>
                    <div className="modal-actions">
                        <button type="button" onClick={onClose} disabled={isLoading}>
                            Cancel
                        </button>
                        <button type="submit" disabled={isLoading}>
                            {isLoading ? 'In progress...': 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TodoModal;