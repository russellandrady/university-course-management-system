package edu.university.admin.service;

import edu.university.admin.model.Student;
import edu.university.admin.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService {
    private final StudentRepository repo;

    public StudentService(StudentRepository repo) {
        this.repo = repo;
    }

    public List<Student> getAll() {
        return repo.findAll();
    }

    public Student getById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));
    }

    public Student add(Student student) {
        return repo.save(student);
    }

    public Student update(Long id, Student updated) {
        Student student = getById(id);
        student.setName(updated.getName());
        student.setRegisteredYear(updated.getRegisteredYear());
        student.setPassword(updated.getPassword());
        student.setStudentId(updated.getStudentId());
        return repo.save(student);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}
