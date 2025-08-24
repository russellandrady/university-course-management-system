package edu.university.admin.service;

import edu.university.admin.dto.StudentResponse;
import edu.university.admin.model.Student;
import edu.university.admin.repository.StudentRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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


    public Page<StudentResponse> getAllStudents(String search, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);

        Page<Student> students;
        if (search != null && !search.isEmpty()) {
            students = repo.findByNameContainingIgnoreCaseOrStudentIdContainingIgnoreCase(search, search, pageable);
        } else {
            students = repo.findAll(pageable);
        }

        return students.map(s -> new StudentResponse(
                s.getId(),
                s.getName(),
                s.getStudentId(),
                s.getRegisteredYear()
        ));
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
