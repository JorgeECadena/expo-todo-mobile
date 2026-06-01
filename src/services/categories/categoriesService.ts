import api from "@/services/api";
import { Category, CreateCategoryReq, CreateCategoryRes, EditCategory } from "@/types/categories/categories";

export const getAllCategories = async (): Promise<Category[]> => {
    const categories = await api.get<Category[]>("/categories");

    return categories.data;
};

export const createCategory = async (req: CreateCategoryReq): Promise<CreateCategoryRes> => {
    const res = await api.post<CreateCategoryRes>("/categories", req);

    return res.data;
};

export const getCategory = async (id: string): Promise<Category> => {
    const res = await api.get<Category>(`/categories/${id}`);

    return res.data;
};

export const editCategory = async (id: string, req: EditCategory): Promise<Category> => {
    const res = await api.patch<Category>(`/categories/${id}`, req);

    return res.data;
}

export const deleteCategory = async (id: string): Promise<string> => {
    const res = await api.delete<string>(`/categories/${id}`);

    return res.data;
};