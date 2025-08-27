import apiManager from "../apiManager.js";
import { ApiResponse } from "@/types/ApiResponse.js";
import { AuthCredentials, AuthResponseOfAdmin, logOutResponse } from "@/types/auth/authTypes.js";
import { useUserStore } from "@/store/userStore.js";
import { use } from "react";
import { useTokenStore } from "@/store/tokenStore.js";
import { CourseOfferingResponse } from "@/types/auth/course/CourseOfferingResponse.js";

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
      `/admin/courses/update`,
      courseData
    );
    // Update the course in the store if it exists
    const updatedCourse = response.data.data;
    const currentCoursePage = useUserStore.getState().coursePage;
    if (currentCoursePage) {
      const updatedCourses = currentCoursePage.courses.map((course: any) =>
        course.id === updatedCourse.id ? updatedCourse : course
      );
      useUserStore.getState().setCoursesPage({
        ...currentCoursePage,
        courses: updatedCourses
      });
    }
    return updatedCourse;
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
      `/admin/students/update`,
      studentData
    );
    // Update the student in the store if it exists
    const updatedStudent = response.data.data;
    const currentStudentPage = useUserStore.getState().studentPage;
    if (currentStudentPage) {
      const updatedStudents = currentStudentPage.students.map((student: any) =>
        student.id === updatedStudent.id ? updatedStudent : student
      );
      useUserStore.getState().setStudentPage({
        ...currentStudentPage,
        students: updatedStudents
      });
    }
    return updatedStudent;
  },
  fetchCourseOfferings: async ({ page = 0, size = 10, search = "" }) => {
  const params = new URLSearchParams({
    page: String(page),
    size: String(size),
    search,
  });
  const response = await apiManager.apiGET<ApiResponse>(
    `/admin/course-offerings?${params.toString()}`
  );
  useUserStore.getState().setCourseOfferingsPage({
  courseOfferings: response.data.data.content.map((item: any): CourseOfferingResponse => ({
    id: String(item.id),
    studentId: item.student.studentId,
    courseName: item.course.name,
    courseId: item.course.courseId,
    offeredYear: item.offeredYear,
    result: (item.result),
  })),
  totalPages: response.data.data.totalPages,
  totalElements: response.data.data.totalElements,
  page: response.data.data.pageable.pageNumber,
});
  return response.data.data.content;
  },

  updateCourseOffering: async (offeringData: any) => {
  const response = await apiManager.apiPOST<ApiResponse>(
    `/admin/course-offerings/update`,
    offeringData
  );

  // Transform backend response to match CourseOfferingResponse
  const updatedOffering: CourseOfferingResponse = {
    id: String(response.data.data.id),
    studentId: response.data.data.student.studentId,
    courseName: response.data.data.course.name,
    courseId: response.data.data.course.courseId,
    offeredYear: response.data.data.offeredYear,
    result: response.data.data.result,
  };
  console.log("Updated Course Offering:", updatedOffering);

  // Update store
  const currentOfferingsPage = useUserStore.getState().courseOfferingsPage;
  if (currentOfferingsPage) {
    const updatedOfferings = currentOfferingsPage.courseOfferings.map((offering: any) =>
      offering.id === updatedOffering.id ? updatedOffering : offering
    );
    useUserStore.getState().setCourseOfferingsPage({
      ...currentOfferingsPage,
      courseOfferings: updatedOfferings
    });
  }

  return updatedOffering;
},

  addCourseOffering: async (offeringData: any) => {
  const response = await apiManager.apiPOST<ApiResponse>(
    `/admin/course-offerings`,
    offeringData
  );

  // Transform backend response to match CourseOfferingResponse
  const newOffering: CourseOfferingResponse = {
    id: response.data.data.id,
    studentId: response.data.data.student.studentId,
    courseName: response.data.data.course.name,
    courseId: response.data.data.course.courseId,
    offeredYear: response.data.data.offeredYear,
    result: response.data.data.result,
  };

  // Get current state
  const currentOfferingsPage = useUserStore.getState().courseOfferingsPage;

  if (currentOfferingsPage) {
    const updatedOfferings = [
      newOffering,
      ...currentOfferingsPage.courseOfferings,
    ];

    useUserStore.getState().setCourseOfferingsPage({
      ...currentOfferingsPage,
      courseOfferings: updatedOfferings,
      totalElements: currentOfferingsPage.totalElements + 1,
    });
  }

  return newOffering;
},


};