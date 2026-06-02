import { Category } from "../categories/categories";

export interface Todo {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    priority: string;
    dueDate: string;
    categories: Category;
}

export interface CreateTodoReq {
    categories: string[];
    title: string;
    description: string;
    dueDate: string;
    priority: string;
}

export interface EditTodoReq {
    title: string;
    description: string;
    dueDate: string;
    priority: string;
    categories: string[];
    completed: boolean;
}