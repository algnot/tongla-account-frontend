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
    phone: string;
    address: string;
    birthdate: string;
    gender: string;
}

export interface UpdateUserInfo {
    username: string;
    firstname: string;
    lastname: string;
    gender: string;
    birthdate: string;
    phone: string;
    address: string;
    code: string;
}

export interface Device {
    session_id: string;
    user_agent: string;
    device_id: string;
    issuer: string;
    issuer_at: number;
    current: boolean;
}

export interface GetAllDeviceResponse {
    devices: Device[];
}

export interface GetServiceRequest {
    client_id: string;
    domain: string;
    redirect_uri: string;
    response_type: string;
    scope: string;
    state: string;
}

export interface GetServiceResponse {
    redirect: string;
    name: string;
    issuer: string;
    scope: string;
}

export interface Notification {
    content: string;
    created: string;
    reason: string;
    success: string;
    title: string;
}

export interface GetAllNotificationResponse {
    notifications: Notification[];
}

export interface AddServiceRequest {
    name: string;
    redirect_uri: string;
    issuer: string;
}

export interface Service {
    name: string;
    client_id: string;
    client_secret: string;
    redirect_uri: string;
    issuer: string;
    scopes: string;
    grant_types: string;
    response_type: string;
    openid_configuration_uri: string;
}

export interface GetAllServiceResponse {
    services: Service[];
}
