import { RequestType } from '@/types/RequestType';
import axios, { AxiosResponse, AxiosInstance, AxiosError } from 'axios';
import { useTokenStore } from '@/store/tokenStore';
import { useUserStore } from '@/store/userStore';

export class ApiManager {
    private http: AxiosInstance;
    private baseURL: string = import.meta.env.VITE_REACT_APP_API_BASE_URL; // Use .env variable

    constructor() {
        this.http = axios.create({
            baseURL: this.baseURL,
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: false,
        });

        // Add interceptors
        this.setupInterceptors();
    }

    // Axios interceptors
    private setupInterceptors() {
        this.http.interceptors.request.use(
            (config) => {
                const token = useTokenStore.getState().token; // read token anywhere
                if (token) {
                    config.headers = config.headers || {};
                    config.headers["Authorization"] = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        this.http.interceptors.response.use(
        (response) => response,
        (error: AxiosError) => {
            if (error.response?.status === 403) {
                const userType = useUserStore.getState().userType;
                useTokenStore.getState().clearToken();
                useUserStore.getState().clearUser();
                if (userType === "admin") {
                    window.location.href = "/admin/sign-in";
                } else {
                    window.location.href = "/student/sign-in";
                }
            }
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
            const response = await this.http.get(url, { params });
            return response;
        } catch (error) {
            if (error instanceof AxiosError) {
                const errorMessage = error.response?.data?.message || error.message;
                console.error(`GET request failed: ${errorMessage}`);
            } else {
                console.error("An unexpected error occurred during GET request");
            }
            throw error;
        }
    }
}

// Create a singleton instance
export default new ApiManager();