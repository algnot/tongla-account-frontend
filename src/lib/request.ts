import axios, { AxiosInstance, isAxiosError } from "axios";
import { getItem, removeItem, setItem } from "./storage";
import { ErrorResponse, GetAllDeviceResponse, GetServiceRequest, GetServiceResponse, LoginWithCodeRequest, LoginWithCodeResponse, RegisterRequest, UpdateUserInfo, UserInfo, Verify2FARequest, VerifyEmailRequest, VerifyEmailResponse } from "@/types/request";
import DeviceDetector from "device-detector-js";

const handlerError = (error: unknown, setAlert: (message: string, type: string, action: number | (() => void), isOpen: boolean) => void): ErrorResponse => {
    if (axios.isAxiosError(error)) {
        if (error.status === 401) {
            return {
                status: false,
                message: "Session expired. Please login again.",
            };
        } else if (error.response && error.response.data && error.response.data.redirect) {
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
                message: error.response?.data ?? error.message,
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

export const getDeviceModel = (): string => {
    const detector = new DeviceDetector();
    const userAgent = navigator.userAgent;
    const result = detector.parse(userAgent);

    const device = result.device?.model ?? "unknown-device";
    const brand = result.device?.brand ?? "";
    return brand ? `${brand} ${device}` : device;
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
                "Device-ID": getDeviceModel()
            },
        });

        this.client.interceptors.response.use(
            response => response,
            async (error) => {
                if (error.response && error.response.status === 401) {
                    if (getItem("refresh_token")) {
                        const refreshed = await this.refreshAccessTokenSilently();
                        if (refreshed) {
                            error.config.headers["Authorization"] = `Bearer ${getItem("access_token")}`;
                            return this.client.request(error.config);
                        } else {
                            removeItem("refresh_token");
                            removeItem("access_token");
                        }
                    }
                }
                throw error;
            }
        );
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

    async loginWithCode(request: LoginWithCodeRequest): Promise<ErrorResponse | LoginWithCodeResponse> {
        try {
            const response = await this.client.post("/auth/login-with-code", request);
            setItem("access_token", response.data.access_token);
            setItem("refresh_token", response.data.refresh_token);
            return response.data;
        } catch (e) {
            return handlerError(e, this.setAlert);
        }
    }

    async getUserInfo(): Promise<ErrorResponse | UserInfo> {
        try {
            const response = await this.client.get("/account/me");
            return response.data;
        } catch (e) {
            console.log(e);
            return {
                id: "",
                username: "",
                email: "",
                firstname: "",
                lastname: "",
                phone: "",
                address: "",
                birthdate: "",
                gender: "notToSay",
                is_verified: false,
            }
        }
    }

    private async refreshAccessTokenSilently(): Promise<boolean> {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_PATH}/auth/refresh`, {}, {
                headers: {
                    "Authorization": `Bearer ${getItem("refresh_token")}`,
                },
            });
            setItem("access_token", response.data.access_token);
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    async requestLoginLink(email: string): Promise<ErrorResponse | void> {
        try {
            const response = await this.client.post("/auth/request-email-login", {
                email,
            });
            return response.data;
        } catch (e) {
            return handlerError(e, this.setAlert);
        }
    }

    async loginWithToken(token: string): Promise<ErrorResponse | LoginWithCodeResponse> {
        try {
            const response = await this.client.post("/auth/login-with-token", {
                token,
            });
            setItem("access_token", response.data.access_token);
            setItem("refresh_token", response.data.refresh_token);
            return response.data;
        } catch (e) {
            return handlerError(e, this.setAlert);
        }
    }

    async updateUserInfo(payload: UpdateUserInfo): Promise<ErrorResponse | UserInfo> {
        try {
            const response = await this.client.put("/account/update-user", payload);
            return response.data;
        } catch (e) {
            return handlerError(e, this.setAlert);
        }
    }

    async getAllDevice(): Promise<ErrorResponse | GetAllDeviceResponse> {
        try {
            const response = await this.client.get("/account/all-device");
            return response.data;
        } catch (e) {
            return handlerError(e, this.setAlert);
        }
    }

    async logout(): Promise<ErrorResponse | void> {
        try {
            const response = await this.client.post("/auth/logout", {}, {
                headers: {
                    "Authorization": `Bearer ${getItem("refresh_token")}`,
                },
            });
            return response.data;
        } catch (e) {
            return handlerError(e, this.setAlert);
        }
    }

    async deleteDevice(sessionId: string): Promise<ErrorResponse | void> {
        try {
            const response = await this.client.delete("/account/delete-device", {
                data: {
                    session_id: sessionId
                }
            });
            return response.data;
        } catch (e) {
            return handlerError(e, this.setAlert);
        }
    }

    async getService(payload: GetServiceRequest): Promise<ErrorResponse | GetServiceResponse> {
        try {
            const response = await this.client.post("/openid/get-service", payload, {
                headers: {
                    "Authorization": `Bearer ${getItem("refresh_token")}`,
                },
            });
            return response.data;
        } catch (e) {
            if (axios.isAxiosError(e)) {
                if (e.response && e.response.status === 401) {
                    return {
                        status: false,
                        message: "401"
                    }
                }
            }
            return handlerError(e, this.setAlert);
        }
    }
}
