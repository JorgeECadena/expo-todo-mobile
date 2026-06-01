export interface CreateUserReq {
    name: string;
    email: string;
    password: string;
    role: string;
}

export interface CreateUserResponse {
    id: string;
    name: string;
    email: string;
    active: boolean;
    providerUuid: string;
    role: string;
}
