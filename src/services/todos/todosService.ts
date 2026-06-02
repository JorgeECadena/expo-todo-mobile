import { CreateTodoReq, EditTodoReq, Todo } from "@/types/todos/todos";
import api from "@/services/api";

export const getAllTodos = async (): Promise<Todo[]> => {
    const res = await api.get<Todo[]>('/todos');

    return res.data;
};

export const createTodo = async (req: CreateTodoReq): Promise<Todo> => {
    const res = await api.post<Todo>('/todos', req);

    return res.data;
};

export const getTodo = async (id: string): Promise<Todo> => {
    const res = await api.get<Todo>(`/todos/${id}`);

    return res.data;
};

export const editTodo = async (id: string, req: EditTodoReq): Promise<Todo> => {
    const res = await api.patch<Todo>(`/todos/${id}`, req);

    return res.data;
};

export const deleteTodo = async (id: string): Promise<string> => {
    const res = await api.delete<string>(`/todos/${id}`);

    return res.data;
};