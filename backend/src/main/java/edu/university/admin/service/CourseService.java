package edu.university.admin.service;

import edu.university.admin.model.Course;
import edu.university.admin.repository.CourseRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourseService {
    private final CourseRepository repo;

    public CourseService(CourseRepository repo) {
        this.repo = repo;
    }

    public Page<Course> getAllCourses(String search, int page, int size) {
        return repo.findByNameContainingIgnoreCaseOrCourseIdContainingIgnoreCase(search, search, PageRequest.of(page, size));
    }

    public Course getById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));
    }

    public Course addCourse(Course course) {
        return repo.save(course);
    }

    public Course update(Long id, Course updated) {
        Course course = getById(id);
        course.setCourseId(updated.getCourseId());
        course.setName(updated.getName());
        course.setCredits(updated.getCredits());
        course.setMandatory(updated.isMandatory());
        return repo.save(course);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}
