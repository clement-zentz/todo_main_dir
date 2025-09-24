// frontend/todo_front/src/hooks/useModal.ts
import { useState } from "react";
import { Todo } from "@/types";

export const useModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentTodo, setCurrentTodo] = useState<Todo | null>(null);

    const openModal = (todo: Todo) => {
        setCurrentTodo(todo);
        setIsOpen(true);
    }

    const closeModal = () => {
        setIsOpen(false);
        setCurrentTodo(null);
    }

    return {
        isOpen,
        currentTodo,
        openModal,
        closeModal,
    };
};
