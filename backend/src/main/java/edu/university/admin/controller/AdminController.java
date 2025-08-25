package edu.university.admin.controller;

import edu.university.admin.dto.LoginResponse;
import edu.university.admin.dto.StudentResponse;
import edu.university.admin.model.Course;
import edu.university.admin.model.CourseOffering;
import edu.university.admin.model.Student;
import edu.university.admin.service.*;
import edu.university.utils.ApiResponse;
import edu.university.utils.ServiceExecutor;
import org.springframework.data.domain.Page;
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
    private final StudentService studentservice;

    public AdminController(AdminService adminService,
                           CourseService courseService,
                           CourseOfferingService courseOfferingService,
                           StudentService studentService) {
        this.adminService = adminService;
        this.courseService = courseService;
        this.courseOfferingService = courseOfferingService;
        this.studentservice = studentService;
    }

    // ---------------- Login ----------------
    static class LoginRequest {
        private String username;
        private String password;

        public String getUsername() { return username; }
        public String getPassword() { return password; }
    }


    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@RequestBody LoginRequest request) {
        return
                ServiceExecutor.executeService(() -> 
                    adminService.login(request.getUsername(), request.getPassword())
                );
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/students")
    public ResponseEntity<ApiResponse<Page<StudentResponse>>> getStudents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "") String search
    ) {
        return
                ServiceExecutor.executeService(() ->
                        studentservice.getAllStudents(search, page, size)

        );
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping("/students")
    public ResponseEntity<ApiResponse<StudentResponse>> addStudent(@RequestBody Student student) {
        return
                ServiceExecutor.executeService(() -> studentservice.addStudent(student))
        ;
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/courses")
    public ResponseEntity<ApiResponse<Page<Course>>> getCourses(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "") String search
    ) {
        return ServiceExecutor.executeService(() ->
                courseService.getAllCourses(search, page, size)
        );
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping("/courses")
    public ResponseEntity<ApiResponse<Course>> addCourse(@RequestBody Course course) {
        return
                ServiceExecutor.executeService(() -> courseService.addCourse(course))
        ;
    }

    // ---------------- Course Offerings ----------------
    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/course-offerings")
    public ResponseEntity<ApiResponse<List<CourseOffering>>> getCourseOfferings() {
        return
                ServiceExecutor.executeService(courseOfferingService::getAllCourseOfferings)
        ;
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping("/course-offerings")
    public ResponseEntity<ApiResponse<CourseOffering>> addCourseOffering(@RequestBody CourseOfferingRequest request) {
        return
                ServiceExecutor.executeService(() -> courseOfferingService.addCourseOffering(request))
        ;
    }

}
