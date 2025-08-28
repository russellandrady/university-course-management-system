import { StudentResponse } from "../student/StudentResponse";
import { StudentUserCourseOffering } from "../student/StudentUserCourseOffering";
import { CourseOfferingResponse } from "./course/CourseOfferingResponse";
import { CourseResponse } from "./course/CourseResponse";

export interface AuthCredentials {
  username: string;
  password: string;
}

interface PageInfo {
  totalPages: number;
  totalElements: number;
  page?: number;
}

export interface StudentsPage extends PageInfo {
  students: StudentResponse[];
}

export interface CoursesPage extends PageInfo {
  courses: CourseResponse[];
}

export interface CourseOfferingsPage extends PageInfo {
  courseOfferings: CourseOfferingResponse[];
}

export interface StudentUserPage {
  studentId: number;
  name: string;
  courseOfferings: StudentUserCourseOffering[];
}

export interface AuthResponseOfAdmin {
  token: string;
}

export interface logOutResponse{
  message: string;
}