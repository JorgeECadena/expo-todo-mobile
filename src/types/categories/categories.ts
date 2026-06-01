export interface Category {
    id: string;
    name: string;
    description: string;
    color: string;
}

export interface CreateCategoryReq {
    name: string;
    description: string;
    color: string;
}

export interface CreateCategoryRes {
    id: string;
    name: string;
    description: string;
    color: string;
}

export interface EditCategory {
    name: string;
    description: string;
    color: string;
}