package edu.university.student.service;

import edu.university.admin.model.Student;
import edu.university.admin.repository.StudentRepository;
import edu.university.security.util.JwtUtil;
import edu.university.student.dto.CourseOfferingResponse;
import edu.university.student.dto.StudentDetailsResponse;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service("studentPortalService")
public class StudentService {

    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public StudentService(StudentRepository studentRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.studentRepository = studentRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public String login(String username, String password) {
        Student student = studentRepository.findByStudentId(username)
                .orElseThrow(() -> new RuntimeException("Invalid username or password"));

        if (!passwordEncoder.matches(password, student.getPassword())) {
            throw new RuntimeException("Invalid username or password");
        }

        // Generate JWT with role STUDENT and ID
        return jwtUtil.generateToken(username, "STUDENT", student.getId());
    }

    public StudentDetailsResponse viewAllDetails(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        List<CourseOfferingResponse> offerings = student.getCourseOfferings()
                .stream()
                .map(offering -> new CourseOfferingResponse(
                        offering.getId(),
                        offering.getCourse().getCourseId(),
                        offering.getCourse().getName(),
                        offering.getOfferedYear(),
                        offering.getResult() != null ? offering.getResult().toString() : "Not graded"
                ))
                .collect(Collectors.toList());

        return new StudentDetailsResponse(
                student.getId(),
                student.getName(),
                offerings
        );
    }
}