import { RequestType } from '@/types/RequestType';
import axios, { AxiosResponse, AxiosInstance, AxiosError } from 'axios';

declare module 'axios' {
    export interface InternalAxiosRequestConfig {
        _retry?: boolean;
    }
}
export class ApiManager {
    private http: AxiosInstance;
    private refreshTokenInProgress: boolean = false;
    private baseURL: string = import.meta.env.VITE_REACT_APP_API_BASE_URL; // Use .env variable

    constructor() {
        this.http = axios.create({
            baseURL: this.baseURL,
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true,
        });

        // Add interceptors
        this.setupInterceptors();
    }

    private getRefreshUrl(requestType: RequestType): string {
        return `${this.baseURL}/auth/${requestType}/refresh`;
    }

    private async refreshAccessToken(requestType: RequestType = RequestType.USER): Promise<void> {
    try {
        const refreshUrl = this.getRefreshUrl(requestType);
        await this.apiPOST(refreshUrl, {});
        console.log("Token refreshed successfully");
    } catch (error) {
        console.error("Failed to refresh token:", error);
        throw error;
    }
    }

    // Axios interceptors
        private setupInterceptors() {
            this.http.interceptors.response.use(
                (response) => response,
                async (error: AxiosError) => {
                    const originalRequest = error.config;
        
                    // Ensure originalRequest exists
                    if (!originalRequest) {
                        return Promise.reject(error);
                    }
        
                    const requestType: RequestType =
                        originalRequest.url?.includes("/auth/admin") ? RequestType.ADMIN : RequestType.USER;
        
                    // Handle 401 Unauthorized errors
                    if (error.response?.status === 401 && !originalRequest._retry) {
                        originalRequest._retry = true;
        
                        // Refresh tokens if not already in progress
                        if (!this.refreshTokenInProgress) {
                            this.refreshTokenInProgress = true;
                            try {
                                await this.refreshAccessToken(requestType);
                                this.refreshTokenInProgress = false;
        
                                // Retry the original request
                                return this.http(originalRequest);
                            } catch (refreshError) {
                                this.refreshTokenInProgress = false;
                                console.error("Failed to refresh token:", refreshError);
                                return Promise.reject(refreshError);
                            }
                        }
                    }
                    // Reject other errors
                    return Promise.reject(error);
                }
            );
        }

    public async apiPOST<T>(
    url: string,
    data?: any,
    params?: any,
    requestType: RequestType = RequestType.USER // Default to user
    ): Promise<AxiosResponse<T>> {
        try {
            // For public requests, skip attaching the token
            // if (requestType === RequestType.PUBLIC) {
            //     return await axios.post(
            //         `${this.baseURL}${url}`,
            //         data,
            //         { params }
            //     );
            // }
    
            // Attach the token and make the request
            const response = await this.http.post(url, data, { params });
            return response;
        } catch (error) {
            throw error;
        }
    }
        public async apiGET<T>(
        url: string,
        params?: any,
        requestType: RequestType = RequestType.USER // Default to user
    ): Promise<AxiosResponse<T>> {
        try {
    
            // Attach the token and make the request
            const response = await this.http.get(url, { params });
            return response;
        } catch (error) {
            if (error instanceof AxiosError) {
                const errorMessage = error.response?.data?.message || error.message;
                console.error(`GET request failed: ${errorMessage}`);
            } else {
                console.error("An unexpected error occurred during GET request");
            }
            throw error; // Re-throw the error to handle it in the calling function
        }
    }
}

// Create a singleton instance
export default new ApiManager();