import api from "@/services/api";
import { Category, CreateCategoryReq, CreateCategoryRes } from "@/types/categories/categories";

export const getAllCategories = async (): Promise<Category[]> => {
    const categories = await api.get<Category[]>("/categories");

    return categories.data;
};

export const createCategory = async (req: CreateCategoryReq): Promise<CreateCategoryRes> => {
    const res = await api.post<CreateCategoryRes>("/categories", req);

    return res.data;
};