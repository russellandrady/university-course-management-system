package edu.university.admin.repository;

import edu.university.admin.model.CourseOffering;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseOfferingRepository extends JpaRepository<CourseOffering, Long> {

    @Query("""
        SELECT co FROM CourseOffering co
        WHERE (:search IS NULL OR :search = '' 
               OR LOWER(co.course.courseId) LIKE LOWER(CONCAT('%', :search, '%'))
               OR LOWER(co.course.name) LIKE LOWER(CONCAT('%', :search, '%'))
               OR LOWER(co.student.studentId) LIKE LOWER(CONCAT('%', :search, '%'))
               OR CAST(co.offeredYear AS string) LIKE CONCAT('%', :search, '%')
               OR CAST(co.result AS string) LIKE CONCAT('%', :search, '%'))
    """)
    Page<CourseOffering> searchCourseOfferings(@Param("search") String search, Pageable pageable);
}
