import axios, { AxiosInstance } from "axios";
import { getItem } from "./storage";
import { ErrorResponse, RegisterRequest, Verify2FARequest, VerifyEmailRequest, VerifyEmailResponse } from "@/types/request";

const handlerError = (error: unknown, setAlert: (message: string, type: string, action: number | (() => void), isOpen: boolean) => void): ErrorResponse => {
    if (axios.isAxiosError(error)) {
        if (error.response && error.response.data && error.response.data.redirect) {
            window.location.href = error.response.data.redirect;
            return {
                status: false,
                message: "Redirecting to " + error.response.data.redirect,
            };
        } else if (error.response && error.response.data && error.response.data.error) {
            setAlert("error", error.response.data.error, () => { }, false);
            return {
                status: false,
                message: error.response.data.error,
            };
        } else {
            setAlert("error", error.message, () => { }, false);
            return {
                status: false,
                message: error.message,
            };
        }
    } else {
        setAlert("An unknown error occurred. Try again!", "error", 0, false);
        return {
            status: false,
            message: "An unknown error occurred. Try again!",
        };
    }
};

export class BackendClient {
    private readonly client: AxiosInstance;
    private readonly setAlert: (message: string, type: string, action: number | (() => void), isOpen: boolean) => void;

    constructor(setAlert: (message: string, type: string, action: number | (() => void), isOpen: boolean) => void) {
        this.setAlert = setAlert;
        this.client = axios.create({
            baseURL: process.env.NEXT_PUBLIC_BACKEND_PATH,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getItem("access_token")}`,
            },
        });
    }

    async register(request: RegisterRequest): Promise<ErrorResponse | RegisterRequest> {
        try {
            const response = await this.client.post("/auth/register", request);
            return response.data;
        } catch (e) {
            return handlerError(e, this.setAlert);
        }
    }

    async verifyEmail(request: VerifyEmailRequest): Promise<ErrorResponse | VerifyEmailResponse> {
        try {
            const response = await this.client.post("/auth/verify-email", request);
            return response.data;
        } catch (e) {
            return handlerError(e, this.setAlert);
        }
    }

    async verify2FA(request: Verify2FARequest): Promise<ErrorResponse | RegisterRequest> {
        try {
            const response = await this.client.post("/auth/verify-2FA", request);
            return response.data;
        } catch (e) {
            return handlerError(e, this.setAlert);
        }
    }

    async login(email: string): Promise<ErrorResponse | void> {
        try {
            const response = await this.client.post("/auth/login", {
                email,
            });
            return response.data;
        } catch (e) {
            return handlerError(e, this.setAlert);
        }
    }
}