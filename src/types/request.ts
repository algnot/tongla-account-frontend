export interface ErrorResponse {
    status: boolean;
    message: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isErrorResponse = (data: any): data is ErrorResponse => {
    return typeof data.status === "boolean" && typeof data.message === "string";
};

export interface RegisterRequest {
    username: string;
    email: string;
    firstname: string;
    lastname: string;
}

export interface VerifyEmailRequest {
    token: string;
}

export interface VerifyEmailResponse {
    qr_code: string;
}

export interface Verify2FARequest {
    token: string;
    code: string;
}

export interface LoginWithCodeRequest {
    email: string;
    code: string;
}

export interface LoginWithCodeResponse {
    refresh_token: string;
    access_token: string;
}

export interface UserInfo {
    id: string;
    username: string;
    email: string;
    firstname: string;
    lastname: string;
    is_verified: boolean;
}
