package edu.university.admin.dto;

import java.util.List;

public class LoginResponse {
    private final String token;
    private final List<StudentResponse> students;

    public LoginResponse(String token, List<StudentResponse> students) {
        this.token = token;
        this.students = students;
    }

    public String getToken() {
        return token;
    }

    public List<StudentResponse> getStudents() {
        return students;
    }
}