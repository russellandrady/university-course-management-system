package edu.university.student.controller;

import edu.university.security.util.JwtUtil;
import edu.university.student.service.StudentService;
import edu.university.utils.ApiResponse;
import edu.university.utils.ServiceExecutor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/students")
public class StudentController {

    private final StudentService studentService;
    private final JwtUtil jwtUtil;

    public StudentController(StudentService studentService, JwtUtil jwtUtil) {
        this.studentService = studentService;
        this.jwtUtil = jwtUtil;
    }

    // ---------------- Login ----------------
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
        return
                ServiceExecutor.executeService(() -> {
                    String token = studentService.login(request.getUsername(), request.getPassword());
                    return new LoginResponse(token);
                })
        ;
    }

    @PreAuthorize("hasAuthority('STUDENT')")
    @GetMapping("/details")
    public ResponseEntity<ApiResponse<List<String>>> viewAllDetails(@RequestHeader("Authorization") String token) {
        return
                ServiceExecutor.executeService(() -> {
                    // Extract token from "Bearer <token>"
                    String jwtToken = token.substring(7);
                    Long studentId = jwtUtil.getIdFromToken(jwtToken);
                    return studentService.viewAllDetails(studentId);
                })
        ;
    }
}