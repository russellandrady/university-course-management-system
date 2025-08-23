package edu.university.admin.repository;

import edu.university.admin.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    // You can add custom queries if needed
    Course findByCourseId(String courseId);
}
