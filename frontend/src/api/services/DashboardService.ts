import apiManager from "../apiManager.js";
import { ApiResponse } from "@/types/ApiResponse.js";
import { AuthCredentials, AuthResponseOfAdmin, logOutResponse } from "@/types/auth/authTypes.js";
import { useUserStore } from "@/store/userStore.js";

export const DashboardManager = {
      userAuth: async (credentials: AuthCredentials): Promise<AuthResponseOfAdmin> => {
        const data = { ...credentials }; // Payload for the API request
    
        // Call the API endpoint for user authentication (signin or signup)
        const response = await apiManager.apiPOST<ApiResponse>(
          `/admin/login`, // Dynamically set the endpoint
          data,
          null,
        );
        useUserStore.getState().setUsername(credentials.username);
        useUserStore.getState().setUserType("admin");
        useUserStore.getState().setAuthResponseAdmin({
          token: response.data.data.token,
          students: response.data.data.students
        });
        return {
          token: response.data.data.token,
          students: response.data.data.students
        };
    },
    userLogOut: async (): Promise<logOutResponse> => {
        const response = await apiManager.apiPOST<ApiResponse>(
          "/auth/user/logout",{}
        );
        useUserStore.getState().clearUser(); // Clear the username in the store
        return {message: response.data.message}; // Assuming the API returns a success message or similar
      }

};