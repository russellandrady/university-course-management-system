package edu.university.admin.controller;

import edu.university.admin.model.Student;
import edu.university.admin.service.AdminService;
import edu.university.utils.ApiResponse;
import edu.university.utils.ServiceExecutor;
import lombok.Data;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final AdminService service;

    public AdminController(AdminService service) {
        this.service = service;
    }
    static class LoginRequest {
        private String username;
        private String password;

        public String getUsername() { return username; }
        public String getPassword() { return password; }
    }

    static class LoginResponse {
        private final String token;

        public LoginResponse(String token) {
            this.token = token;
        }

        public String getToken() {
            return token;
        }
    }
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(
            ServiceExecutor.executeService(() -> {
                String token = service.login(request.getUsername(), request.getPassword());
                return new LoginResponse(token);
            })
        );
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/students")
    public ResponseEntity<ApiResponse<List<Student>>> getStudents() {
        return ResponseEntity.ok(
            ServiceExecutor.executeService(service::getAllStudents)
        );
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping("/students")
    public ResponseEntity<ApiResponse<Student>> addStudent(@RequestBody Student student) {
        return ResponseEntity.ok(
            ServiceExecutor.executeService(() -> service.addStudent(student))
        );
    }
}
