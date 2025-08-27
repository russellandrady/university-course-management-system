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
    @PostMapping("/students/update")
    public ResponseEntity<ApiResponse<StudentResponse>> updateStudent(@RequestBody Student student) {
        return ServiceExecutor.executeService(() -> studentservice.updateStudent(student));
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping("/students/delete")
    public ResponseEntity<ApiResponse<Void>> deleteStudent(@RequestParam Long id) {
        return ServiceExecutor.executeService(() -> {
            studentservice.delete(id);
            return null;
        });
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

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping("/courses/update")
    public ResponseEntity<ApiResponse<Course>> updateCourse(@RequestBody Course course) {
        return ServiceExecutor.executeService(() -> courseService.updateCourse(course));
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping("/courses/delete")
    public ResponseEntity<ApiResponse<Void>> deleteCourse(@RequestParam Long id) {
        return ServiceExecutor.executeService(() -> {
            courseService.delete(id);
            return null;
        });
    }

    // ---------------- Course Offerings ----------------
    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/course-offerings")
    public ResponseEntity<ApiResponse<Page<CourseOffering>>> getCourseOfferings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "") String search
    ) {
        return ServiceExecutor.executeService(() -> courseOfferingService.getCourseOfferings(page, size, search));
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping("/course-offerings")
    public ResponseEntity<ApiResponse<CourseOffering>> addCourseOffering(@RequestBody CourseOfferingRequest request) {
        return
                ServiceExecutor.executeService(() -> courseOfferingService.addCourseOffering(request))
        ;
    }
    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping("/course-offerings/update")
    public ResponseEntity<ApiResponse<CourseOffering>> updateCourseOffering(
            @RequestBody CourseOfferingUpdateRequest request) {
        return ServiceExecutor.executeService(() ->
                courseOfferingService.updateCourseOffering(request)
        );
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping("/course-offerings/delete")
    public ResponseEntity<ApiResponse<Void>> deleteCourseOffering(@RequestParam Long id) {
        return ServiceExecutor.executeService(() -> {
            courseOfferingService.delete(id);
            return null;
        });
    }

}
