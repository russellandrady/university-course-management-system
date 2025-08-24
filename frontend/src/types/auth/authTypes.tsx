import { StudentResponse } from "../student/StudentResponse";

export interface AuthCredentials {
  username: string;
  password: string;
}

export interface AuthResponseOfAdmin {
  token: string;
  students: StudentResponse[];
}

export interface logOutResponse{
  message: string;
}