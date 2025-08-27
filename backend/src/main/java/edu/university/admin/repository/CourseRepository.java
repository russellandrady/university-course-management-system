package edu.university.admin.repository;

import edu.university.admin.model.Course;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    Optional<Course> findByCourseId(String courseId);


    // Search by name or courseId
    Page<Course> findByNameContainingIgnoreCaseOrCourseIdContainingIgnoreCase(String name, String courseId, Pageable pageable);

}
