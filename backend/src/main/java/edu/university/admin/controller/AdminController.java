package edu.university.admin.controller;

import edu.university.admin.model.Course;
import edu.university.admin.model.CourseOffering;
import edu.university.admin.model.Student;
import edu.university.admin.service.AdminService;
import edu.university.admin.service.CourseOfferingRequest;
import edu.university.admin.service.CourseService;
import edu.university.admin.service.CourseOfferingService;
import edu.university.utils.ApiResponse;
import edu.university.utils.ServiceExecutor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final AdminService adminService;
    private final CourseService courseService;
    private final CourseOfferingService courseOfferingService;

    public AdminController(AdminService adminService,
                           CourseService courseService,
                           CourseOfferingService courseOfferingService) {
        this.adminService = adminService;
        this.courseService = courseService;
        this.courseOfferingService = courseOfferingService;
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
        return ResponseEntity.ok(
                ServiceExecutor.executeService(() -> {
                    String token = adminService.login(request.getUsername(), request.getPassword());
                    return new LoginResponse(token);
                })
        );
    }

    // ---------------- Students ----------------
    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/students")
    public ResponseEntity<ApiResponse<List<Student>>> getStudents() {
        return ResponseEntity.ok(
                ServiceExecutor.executeService(adminService::getAllStudents)
        );
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping("/students")
    public ResponseEntity<ApiResponse<Student>> addStudent(@RequestBody Student student) {
        return ResponseEntity.ok(
                ServiceExecutor.executeService(() -> adminService.addStudent(student))
        );
    }

    // ---------------- Courses ----------------
    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/courses")
    public ResponseEntity<ApiResponse<List<Course>>> getCourses() {
        return ResponseEntity.ok(
                ServiceExecutor.executeService(courseService::getAllCourses)
        );
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping("/courses")
    public ResponseEntity<ApiResponse<Course>> addCourse(@RequestBody Course course) {
        return ResponseEntity.ok(
                ServiceExecutor.executeService(() -> courseService.addCourse(course))
        );
    }

    // ---------------- Course Offerings ----------------
    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/course-offerings")
    public ResponseEntity<ApiResponse<List<CourseOffering>>> getCourseOfferings() {
        return ResponseEntity.ok(
                ServiceExecutor.executeService(courseOfferingService::getAllCourseOfferings)
        );
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping("/course-offerings")
    public ResponseEntity<ApiResponse<CourseOffering>> addCourseOffering(@RequestBody CourseOfferingRequest request) {
        return ResponseEntity.ok(
                ServiceExecutor.executeService(() -> courseOfferingService.addCourseOffering(request))
        );
    }

}
