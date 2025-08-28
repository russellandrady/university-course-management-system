import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { UserType } from "@/types/UserType";
import type { CourseOfferingsPage, CoursesPage, StudentsPage, StudentUserPage } from "@/types/auth/authTypes";

type UserState = {
  username: string | null; // Store the username
  setUsername: (username: string) => void; // Function to set the username
  clearUser: () => void; // Function to clear the user state
  modeDark: boolean; // Optional: Add a model property if needed
  toggleMode: () => void;
  userType: UserType | null; // Add userType
  setUserType: (userType: UserType) => void; // Setter for userType
  studentPage: StudentsPage | null;
  setStudentPage: (data: StudentsPage) => void;
  coursePage: CoursesPage | null;
  setCoursesPage: (data: CoursesPage) => void;
  courseOfferingsPage: CourseOfferingsPage | null;
  setCourseOfferingsPage: (data: CourseOfferingsPage) => void;
  studentUserPage: StudentUserPage | null;
  setStudentUserPage: (data: StudentUserPage) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      username: null, // Initial state
      modeDark: false, // Optional: Initial mode state
      userType: null, // Initial userType
      studentPage: null,
      coursePage: null,
      courseOfferingsPage: null,
      studentUserPage: null,
      setUsername: (username: string) => set({ username: username }), // Update username
      setUserType: (userType: UserType) => set({ userType }), // Setter
      setStudentPage: (data: StudentsPage) => set({ studentPage: data }),
      setCoursesPage: (data: CoursesPage) => set({ coursePage: data }),
      toggleMode: () => set(() => ({ modeDark: !get().modeDark })), // Toggle mode state
      setCourseOfferingsPage: (data: CourseOfferingsPage) => set({ courseOfferingsPage: data }),
      setStudentUserPage: (data: StudentUserPage) => set({ studentUserPage: data }),
      clearUser: () => set({ username: null, userType: null, studentPage: null, coursePage: null, courseOfferingsPage: null, studentUserPage: null }), // Clear user state
    }),
    {
      name: "user-storage", // Key for local storage
      storage: createJSONStorage(() => localStorage),
    }
  )
);