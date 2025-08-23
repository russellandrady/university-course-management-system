package edu.university.admin.service;

import edu.university.admin.dto.StudentResponse;
import edu.university.admin.model.Student;
import edu.university.admin.repository.StudentRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService {
    private final StudentRepository repo;
    private final PasswordEncoder passwordEncoder;


    public StudentService(StudentRepository repo, PasswordEncoder passwordEncoder) {
        this.repo = repo;
        this.passwordEncoder = passwordEncoder;
    }


    public List<StudentResponse> getAllStudents() {
        return repo.findAll()
                .stream()
                .map(s -> new StudentResponse(
                        s.getId(),
                        s.getName(),
                        s.getStudentId(),
                        s.getRegisteredYear()
                ))
                .toList();
    }

    public Student getById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));
    }

    public StudentResponse addStudent(Student student) {
        student.setPassword(passwordEncoder.encode(student.getPassword()));
        Student saved = repo.save(student);
        return new StudentResponse(saved.getId(), saved.getName(), saved.getStudentId(), saved.getRegisteredYear());
    }

    public StudentResponse update(Long id, Student updated) {
        Student student = getById(id);
        student.setName(updated.getName());
        student.setRegisteredYear(updated.getRegisteredYear());
        if (updated.getPassword() != null && !updated.getPassword().isEmpty()) {
            student.setPassword(passwordEncoder.encode(updated.getPassword()));
        }
        student.setStudentId(updated.getStudentId());
        Student saved = repo.save(student);

        return new StudentResponse(
                saved.getId(),
                saved.getName(),
                saved.getStudentId(),
                saved.getRegisteredYear()
        );
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}
