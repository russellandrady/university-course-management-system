import apiManager from "../apiManager.js";
import { ApiResponse } from "@/types/ApiResponse.js";
import { AuthCredentials, AuthResponseOfAdmin, logOutResponse } from "@/types/auth/authTypes.js";
import { useUserStore } from "@/store/userStore.js";
import { use } from "react";
import { useTokenStore } from "@/store/tokenStore.js";

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
        useTokenStore.getState().setToken(response.data.data.token);
        return {
          token: response.data.data.token
        };
    },
    userLogOut: async (): Promise<logOutResponse> => {
        const response = await apiManager.apiPOST<ApiResponse>(
          "/auth/user/logout",{}
        );
        useUserStore.getState().clearUser(); // Clear the username in the store
        return {message: response.data.message}; // Assuming the API returns a success message or similar
    },

    fetchStudents: async ({ page = 0, size = 10, search = "" }) => {
      const params = new URLSearchParams({
        page: String(page),
        size: String(size),
        search,
      });
      const response = await apiManager.apiGET<ApiResponse>(`/admin/students?${params.toString()}`);
      useUserStore.getState().setStudentPage({
        students: response.data.data.content,
        totalPages: response.data.data.totalPages,
        totalElements: response.data.data.totalElements,
        page: response.data.data.pageable.pageNumber
      });
      return response.data.data.content;
    },
    fetchCourses: async ({ page = 0, size = 10, search = "" }) => {
      const params = new URLSearchParams({
        page: String(page),
        size: String(size),
        search,
      });
      const response = await apiManager.apiGET<ApiResponse>(`/admin/courses?${params.toString()}`);
      useUserStore.getState().setCoursesPage({
        courses: response.data.data.content,
        totalPages: response.data.data.totalPages,
        totalElements: response.data.data.totalElements,
        page: response.data.data.pageable.pageNumber
      });
      return response.data.data.content;
    },
    addCourse: async (courseData: any) => {
      const response = await apiManager.apiPOST<ApiResponse>(
        `/admin/courses`,
        courseData
      );
      
      // Get current state
      const currentCoursePage = useUserStore.getState().coursePage;
      
      if (currentCoursePage) {
        // Add new course to existing courses
        const updatedCourses = [
          response.data.data,
          ...currentCoursePage.courses
        ];
    
        // Update store with new course added
        useUserStore.getState().setCoursesPage({
          ...currentCoursePage,
          courses: updatedCourses,
          totalElements: currentCoursePage.totalElements + 1
        });
      }
    
      return response.data.data;
    },
    updateCourse: async (courseData: any) => {
      const response = await apiManager.apiPOST<ApiResponse>(
        `/admin/courses/${courseData.id}`,
        courseData
      );
      return response.data.data;
    },
    addStudent: async (studentData: any) => {
      const response = await apiManager.apiPOST<ApiResponse>(
        `/admin/students`,
        studentData
      );
      
      // Get current state
      const currentStudentPage = useUserStore.getState().studentPage;
      
      if (currentStudentPage) {
        // Add new student to existing students
        const updatedStudents = [
          response.data.data,
          ...currentStudentPage.students
        ];
    
        // Update store with new student added
        useUserStore.getState().setStudentPage({
          ...currentStudentPage,
          students: updatedStudents,
          totalElements: currentStudentPage.totalElements + 1
        });
      }
    
      return response.data.data;
    },

    updateStudent: async (studentData: any) => {
      const response = await apiManager.apiPOST<ApiResponse>(
        `/admin/students/${studentData.id}`,
        studentData
      );
      return response.data.data;
    }

};