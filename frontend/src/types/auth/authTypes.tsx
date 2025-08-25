import { StudentResponse } from "../student/StudentResponse";

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

export interface AuthResponseOfAdmin {
  token: string;
}

export interface logOutResponse{
  message: string;
}