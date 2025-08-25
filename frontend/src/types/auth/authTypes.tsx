import { StudentResponse } from "../student/StudentResponse";
import { CourseResponse } from "./course/CourseResponse";

export interface AuthCredentials {
  username: string;
  password: string;
}

export interface StudentsPage {
  students: StudentResponse[];
  totalPages: number;
  totalElements: number;
  page?: number;
}

export interface CoursesPage {
  courses: CourseResponse[];
  totalPages: number;
  totalElements: number;
  page?: number;
}

export interface AuthResponseOfAdmin {
  token: string;
}

export interface logOutResponse{
  message: string;
}