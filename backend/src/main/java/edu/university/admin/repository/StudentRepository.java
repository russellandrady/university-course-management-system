package edu.university.admin.repository;

import edu.university.admin.model.Student;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    // Search by name or studentId (with pagination)
    Page<Student> findByNameContainingIgnoreCaseOrStudentIdContainingIgnoreCase(
            String name, String studentId, Pageable pageable
    );

    // Find single student by exact studentId
    Optional<Student> findByStudentId(String studentId);
}
